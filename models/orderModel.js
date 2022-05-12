import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    clientOrderId: {type: String, required: true},
    orderItems: [
      {
        slug: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: String,
          required: true,
        },
      },
    ],
    paymentMethod: { type: String, required: true },
    paymentResult: {
      statusChanges: Boolean,
      status: String,
      update_time: String,
    },
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: String, ref: 'User', required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
