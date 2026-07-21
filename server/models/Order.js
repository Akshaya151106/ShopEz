import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  items: [{
    productId: { type: String },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number }
  }],
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, default: 'Processing' },
  date: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
