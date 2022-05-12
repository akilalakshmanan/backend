import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import fs from 'fs';
import Stripe from 'stripe';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/sample', async (req, res) => {
  // logger.info(`request came`);
  console.log('request came');
  res.send({ id: 0 });
});

const username = "akila_l";
const password = "ZUUQsnjqABxzkWFv";
const cluster = "caffconfclstr0.gbbqp";
const dbname = "myFirstDatabase";
mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`
  // {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   serverApi: ServerApiVersion.v1
  // }
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected successfully to mongoDB');
});

const stripe = new Stripe(process.env.STRIPE_PUBLIC_KEY);

// const stripe = require('stripe')();
// const productStripe = await stripe.products.create({
//   name: 'sample name ' + Date.now(),
// });
// console.log(productStripe);

fs.writeFile(
  '/var/tmp/newfile_626cea949170b37403c57087.txt',
  'Learn Node FS module',
  function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
  }
);
app.get('/newFile/:id', async (req, res) => {
  // try{
  //   console.log(req.params,req.query);
  //   if(req.params.id === undefined){
  //     res.send({message : "not found"})
  //     return
  //   }
  //   const filePath = `/var/tmp/newfile_${req.params.id}.txt`;
  //   // console.log(filePath);
  //   if(fs.existsSync(filePath)){
  //     res.send({message : "found"})
  //     console.log("file found");
  //     try{
  //       fs.unlinkSync(filePath);
  //     } catch(err){
  //       console.log('File deletion failed!');
  //     }
  //     console.log('File deleted!');
  //     // if no error, file has been deleted successfully
  //   }else{
  //     console.log("file not found!!!!!!!!!!!!!!!!!!!!")
  //   }
  // } catch(err){
  // console.log("error occured ::",err);
  res.send({ message: 'not found' });
  // }
});

//const endpointSecret = "whsec_8f6e156de7f2318095d13e20e34245ff68f636ca1ca1fc7d14dafd1a1c36aa45";
// Match the raw body to content type application/json
// If you are using Express v4 - v4.16 you need to use body-parser, not express, to retrieve the request body
app.post(
  '/webhook',
  express.json({ type: 'application/json' }),
  (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;
    console.log('came to webhooks');
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    } finally {
      console.log('finally part');
    }
    console.log('came after consctructEvent');

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const paymentIntent = event.data.object;
        console.log('checkout.session.completed', paymentIntent);
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'charge.succeeded':
        const paymentMethod = event.data.object;
        console.log('charge.succeeded', paymentMethod);
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
  }
);

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

export default app;
