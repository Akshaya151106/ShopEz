import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  author: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
