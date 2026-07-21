import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDb } from './db.js';

// Mongoose Models
import Product from './models/Product.js';
import Review from './models/Review.js';
import Order from './models/Order.js';
import User from './models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static assets and production dist bundle
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../dist')));

// Connect to MongoDB Atlas Database
connectDb();

// ==========================================
// 1. PRODUCTS API (MongoDB)
// ==========================================

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    // Normalize _id to id for frontend compatibility
    const normalized = products.map(p => {
      const obj = p.toObject();
      obj.id = obj._id;
      return obj;
    });
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new product
app.post('/api/products', async (req, res) => {
  try {
    const newProd = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      discount: req.body.discount || 0,
      tag: req.body.tag || null,
      image: req.body.image || '/headphones.jpg',
      description: req.body.description,
      specs: req.body.specs || [],
      stock: req.body.stock
    });
    await newProd.save();
    const obj = newProd.toObject();
    obj.id = obj._id;
    res.status(201).json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    const obj = updated.toObject();
    obj.id = obj._id;
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. REVIEWS API (MongoDB)
// ==========================================

// GET all reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    const normalized = reviews.map(r => {
      const obj = r.toObject();
      obj.id = obj._id;
      return obj;
    });
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new review & recalculate rating average in MongoDB
app.post('/api/reviews', async (req, res) => {
  try {
    const newReview = new Review({
      productId: req.body.productId,
      author: req.body.author,
      rating: req.body.rating,
      comment: req.body.comment,
      date: req.body.date || new Date().toISOString().split('T')[0]
    });
    await newReview.save();

    // Recalculate average rating for product
    const prodReviews = await Review.find({ productId: req.body.productId });
    const totalSum = prodReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalSum / prodReviews.length).toFixed(1));

    const updatedProd = await Product.findByIdAndUpdate(
      req.body.productId,
      { rating: avgRating, ratingCount: prodReviews.length },
      { new: true }
    );

    const revObj = newReview.toObject();
    revObj.id = revObj._id;

    let prodObj = null;
    if (updatedProd) {
      prodObj = updatedProd.toObject();
      prodObj.id = prodObj._id;
    }

    res.status(201).json({ review: revObj, updatedProduct: prodObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. ORDERS API (MongoDB)
// ==========================================

// GET all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new order & decrement stock in MongoDB
app.post('/api/orders', async (req, res) => {
  try {
    const orderId = req.body.orderId || ('ORD-' + Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase());
    const newOrder = new Order({
      id: orderId,
      customerName: req.body.customerName,
      email: req.body.email,
      address: req.body.address,
      items: req.body.items || [],
      subtotal: req.body.subtotal,
      discountAmount: req.body.discountAmount || 0,
      total: req.body.total,
      status: 'Processing',
      date: req.body.date || new Date().toISOString()
    });
    await newOrder.save();

    // Decrement stock in MongoDB for purchased items
    for (const item of (req.body.items || [])) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
      }
    }

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update order status
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const updated = await Order.findOneAndUpdate(
      { id: req.params.id },
      { status: req.body.status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. AUTHENTICATION API (MongoDB)
// ==========================================

// POST login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ 
      username: new RegExp('^' + username.trim() + '$', 'i'), 
      password 
    }).select('-password');

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, fullName, email } = req.body;

    const existingUser = await User.findOne({
      $or: [
        { username: new RegExp('^' + username.trim() + '$', 'i') },
        { email: new RegExp('^' + email.trim() + '$', 'i') }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const newUser = new User({ username, password, fullName, email });
    await newUser.save();

    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({ success: true, user: userObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fallback SPA Route
app.get(/^[^.]*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`ShopEZ Server & MongoDB Atlas API running on port ${PORT}`);
});
