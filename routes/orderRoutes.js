import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();
const orderRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_PUBLIC_KEY);
const frontEndDomain = 'http://172.17.0.3:3000';

//To get the orders stored in db
orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);

// To update the order placed in db after payment is done
orderRouter.post(
  '/updateOrder',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orderStatus = JSON.parse(req.body.clientOrderId);
    const clientOrderId = orderStatus.clientOrderId;
    const order = await Order.find({ clientOrderId: clientOrderId });
    console.log('orderorderorderorder', order);
    res.send({ message: 'order updated' });
  })
);

// To store the order details in db
orderRouter.post(
  '/create-checkout-session',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const itemsList = [];
    const sessionData = JSON.parse(req.body.priceIdAQuantity);
    const userId = sessionData.userId;
    const clientOrderId = sessionData.clientOrderId;
    const cartList = sessionData.cartItems;
    const orderdItems = [];
    let itemsPrice = 0;
    let taxPrice = 0;
    cartList.forEach((item) => {
      orderdItems.push({
        slug: item.slug,
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id,
      });
      itemsPrice += item.price;
      taxPrice += 0;
      itemsList.push({
        price: item.priceIdStripe,
        quantity: item.quantity,
      });
    });
    const order = new Order({
      clientOrderId: clientOrderId,
      orderItems: orderdItems,
      paymentMethod: 'card',
      paymentResult: {
        status: '',
        statusChanges: false,
        update_time: '',
      },
      itemsPrice: itemsPrice,
      taxPrice: taxPrice,
      totalPrice: itemsPrice + taxPrice,
      user: userId,
      isPaid: false,
      paidAt: new Date().toISOString(),
    });
    const newOrder = await order.save();

    // Stripe method to complete the payment gateway
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: itemsList,
      mode: 'payment',
      success_url: `${frontEndDomain}?success=true`,
      cancel_url: `${frontEndDomain}?canceled=true`,
    });

    // Server sends the redirect url to the client inorder to display checkout page
    res.redirect(303, session.url);
  })
);

// To get appropriate order, product and user details from db and sends to the client
// This feature is only for Admin Dashboard
orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

// To get the orders placed by a particular user - order history
orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

export default orderRouter;
