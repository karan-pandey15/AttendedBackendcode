 

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    username: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  items: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      images: [{ type: String }],
    },
  ],
  total: { type: Number, required: true }, // Adding total price field
});

export const Order = mongoose.model('Order', orderSchema);
