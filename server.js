import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import fs from 'fs';
import Stripe from 'stripe';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const frontEndDomain = 'http://localhost:3000';

const username = "akila_l";
const password = "ZUUQsnjqABxzkWFv";
const cluster = "caffconfclstr0.gbbqp";
const dbname = "myFirstDatabase";
mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, 
  // {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   serverApi: ServerApiVersion.v1
  // }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully to mongoDB");
});

const stripe = new Stripe(process.env.STRIPE_PUBLIC_KEY);

// const stripe = require('stripe')();
// const productStripe = await stripe.products.create({
//   name: 'sample name ' + Date.now(),
// });
// console.log(productStripe);


fs.writeFile('/var/tmp/newfile_626cea949170b37403c57087.txt', 'Learn Node FS module', function (err) {
  if (err) throw err;
  console.log('File is created successfully.');
});
app.get(
  '/newFile/:id',
  async (req,res) => {
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
      res.send({message : "not found"})
    // }
  }
)

app.post('/create-checkout-session', async (req, res) => {
  const itemsList = []
  const itemsParams = req.body.priceIdAQuantity.split('|');
  itemsParams.forEach((item) =>{
    const [priceId, quantity] = item.split("::");
    itemsList.push({
      price: priceId,
      quantity: quantity
    })
  })
  console.log('itemsListitemsListitemsListitemsList',itemsList);
  // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
  const session = await stripe.checkout.sessions.create({
    payment_method_types: [
      'card'
    ],
    // line_items: [
    //   {
    //     price: 'price_1KvFAZSCNerHjE1mKQt6EHtK',
    //     quantity: 12,
    //   },
    //   {
    //     price: 'price_1KvBfESCNerHjE1mJMX2Wfrs',
    //     quantity: 2
    //   },
    //   {
    //     price: 'price_1KsitsSCNerHjE1merNhyrwr',
    //     quantity: 1
    //   },
    // ]
    line_items: itemsList,
    mode: 'payment',
    success_url: `${frontEndDomain}?success=true`,
    cancel_url: `${frontEndDomain}?canceled=true`,
  });

  res.redirect(303, session.url);
});

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
// app.use('/api/seed', seedRouter);

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
