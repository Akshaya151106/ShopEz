import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tag: { type: String },
  image: { type: String, required: true },
  description: { type: String, required: true },
  specs: [{ type: String }],
  rating: { type: Number, default: 5.0 },
  ratingCount: { type: Number, default: 0 },
  stock: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
