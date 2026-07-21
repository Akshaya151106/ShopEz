import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Review from './models/Review.js';
import Order from './models/Order.js';

dotenv.config();

export async function connectDb() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes('<db_password>')) {
    console.log('--------------------------------------------------');
    console.log('⚠️  MongoDB URI contains "<db_password>".');
    console.log('👉 Please edit "D:\\shop\\.env" and replace "<db_password>" with your actual MongoDB Atlas password.');
    console.log('--------------------------------------------------');
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Successfully connected to MongoDB Atlas Cloud Database!');
    await seedDatabase();
    return true;
  } catch (err) {
    console.error('❌ Error connecting to MongoDB Atlas:', err.message);
    return false;
  }
}

async function seedDatabase() {
  try {
    // 1. Seed Users if empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial MongoDB users...');
      await User.insertMany([
        { username: 'alex', password: 'password123', fullName: 'Alex Rivera', email: 'alex@example.com' },
        { username: 'jane', password: 'password123', fullName: 'Jane Doe', email: 'jane.doe@example.com' }
      ]);
    }

    // 2. Seed Products if empty
    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      console.log('🌱 Seeding initial MongoDB products...');
      await Product.insertMany([
        {
          name: "NeoBeats Wireless Headphones",
          category: "Electronics",
          price: 249.99,
          discount: 15,
          tag: "BESTSELLER",
          image: "/headphones.jpg",
          description: "Experience sound in its purest form. The NeoBeats Wireless Headphones offer industry-leading Active Noise Cancellation (ANC), ambient sound transparency mode, and a rich, custom-tuned acoustic signature with deep bass and crystal clear highs.",
          specs: [
            "Active Noise Cancellation (ANC)",
            "40-hour Battery Life with Fast Charge",
            "Bluetooth 5.2 & Multipoint Connection",
            "Hi-Res Audio Certified",
            "Built-in Beamforming Microphones"
          ],
          rating: 4.8,
          ratingCount: 124,
          stock: 15
        },
        {
          name: "ErgoGlide Office Chair",
          category: "Furniture",
          price: 399.99,
          discount: 10,
          tag: "POPULAR",
          image: "/chair.jpg",
          description: "The ErgoGlide Ergonomic Office Chair is engineered to support your body through long hours of work or gaming. Featuring a premium self-adjusting 3D lumbar support system, fully adjustable 4D armrests, and breathable high-density mesh backing.",
          specs: [
            "Dynamic 3D Lumbar Support",
            "Adjustable 4D Armrests",
            "Breathable Elastomeric Mesh Back",
            "Heavy-duty Aluminum Base",
            "135-degree Recline & Tilt Lock"
          ],
          rating: 4.6,
          ratingCount: 88,
          stock: 8
        },
        {
          name: "Chronos Smart Watch",
          category: "Electronics",
          price: 199.99,
          discount: 20,
          tag: "HOT DEAL",
          image: "/watch.jpg",
          description: "Stay connected, active, and healthy with the Chronos Smart Watch. Featuring a stunning circular AMOLED screen with an always-on display, comprehensive health monitoring, 100+ workout modes, and built-in GPS.",
          specs: [
            "1.43\" Always-On AMOLED Display",
            "Advanced Heart Rate & SpO2 Sensors",
            "Dual-Band Multi-System GPS",
            "5ATM Water Resistance",
            "Up to 14 Days Battery Life"
          ],
          rating: 4.7,
          ratingCount: 210,
          stock: 25
        },
        {
          name: "Lumina Minimalist Desk Lamp",
          category: "Home Decor",
          price: 79.99,
          discount: 5,
          tag: "NEW RELEASE",
          image: "/lamp.jpg",
          description: "Illuminate your creative workspace with the Lumina Minimalist Desk Lamp. Designed with clean Scandinavian aesthetics, it features touch-sensitive stepless brightness dimming and 5 adjustable color temperature modes.",
          specs: [
            "Touch-sensitive Dimming Slider",
            "5 Color Temperature Modes (2700K - 6500K)",
            "Flicker-Free Eye Care LED Panel",
            "Flexible Dual-Axis Rotatable Arm",
            "Integrated USB Charging Port"
          ],
          rating: 4.5,
          ratingCount: 45,
          stock: 12
        },
        {
          name: "AeroBuds Pro Wireless Earbuds",
          category: "Electronics",
          price: 149.99,
          discount: 30,
          tag: "TRENDING",
          image: "/earbuds.jpg",
          description: "True freedom of sound. AeroBuds Pro deliver high-fidelity audio in a compact, pocket-sized form. Features state-of-the-art hybrid noise cancelling, sweat and water resistance for intense workouts, and touch gestures.",
          specs: [
            "Hybrid Active Noise Cancellation",
            "IPX5 Sweat & Water Resistant",
            "Ultra-compact Wireless Charging Case",
            "32 Hours Total Playback Time",
            "Dual Microphone Clear Call Tech"
          ],
          rating: 4.9,
          ratingCount: 56,
          stock: 20
        },
        {
          name: "ZenFlow Smart Humidifier",
          category: "Home Decor",
          price: 59.99,
          discount: 0,
          tag: "POPULAR",
          image: "/humidifier.jpg",
          description: "Create your personal oasis. The ZenFlow Smart Humidifier and diffuser blends natural wood grains with a premium frosted glass design. Features smart controls, warm ambient colored lights, and silent ultrasonic mist distribution.",
          specs: [
            "Ultrasonic Cool Mist Technology",
            "Frosted Glass & Wood Grain Exterior",
            "RGB Ambient Nightlight Function",
            "Whisper Quiet Operation (under 20dB)",
            "Essential Oil Aromatherapy Ready"
          ],
          rating: 4.4,
          ratingCount: 38,
          stock: 18
        },
        {
          name: "NeoBeats Pro Gaming Headset",
          category: "Electronics",
          price: 299.99,
          discount: 25,
          tag: "HOT DEAL",
          image: "/headphones.jpg",
          description: "The gaming edition of our flagship NeoBeats headphones. Engineered with ultra-low latency wireless transmitters, high-fidelity spatial positional audio, and a detachable broadcast-grade boom mic.",
          specs: [
            "Ultra Low-Latency 2.4GHz Wireless",
            "7.1 Spatial Positional Sound",
            "Detachable Studio-Quality Boom Microphone",
            "Pro Gaming Audio Equalizer Presets",
            "Cooling Gel-infused Ear Cushions"
          ],
          rating: 4.7,
          ratingCount: 65,
          stock: 14
        },
        {
          name: "ErgoGlide Lite Mesh Office Chair",
          category: "Furniture",
          price: 279.99,
          discount: 5,
          tag: "NEW RELEASE",
          image: "/chair.jpg",
          description: "Enjoy ergonomic posture support at an entry-level budget. The ErgoGlide Lite features high-elasticity mesh backing, customizable tension controls, and flip-up armrests to easily fit under your office desk when not in use.",
          specs: [
            "Adjustable Posture Tension Knob",
            "Space-saving Flip-up Armrests",
            "Breathable Mesh Support Frame",
            "Smooth Dual-Wheel Casters",
            "Padded Memory Foam Cushion"
          ],
          rating: 4.3,
          ratingCount: 22,
          stock: 10
        },
        {
          name: "Lumina Executive Floor Lamp",
          category: "Home Decor",
          price: 129.99,
          discount: 15,
          tag: "EXCLUSIVE",
          image: "/lamp.jpg",
          description: "Elevate your library or formal living space. The Lumina Executive Floor Lamp features an elegant tall brushed brass stand and a hand-crafted geometric glass hood, casting a stunning diffused glow.",
          specs: [
            "Premium Brushed Brass Column",
            "Hand-crafted Diffused Glass Hood",
            "Step-activated Foot Switch",
            "Wide Angle Light Distribution",
            "Smart Home Smart-Bulb Compatible"
          ],
          rating: 4.6,
          ratingCount: 19,
          stock: 6
        },
        {
          name: "AeroBuds Lite Sport Earbuds",
          category: "Electronics",
          price: 89.99,
          discount: 0,
          tag: "BESTSELLER",
          image: "/earbuds.jpg",
          description: "Your perfect companion for running and training. AeroBuds Lite offer secure earhook fittings, clear stereo sound, and IPX7 sweatproof durability.",
          specs: [
            "IPX7 Fully Waterproof & Sweatproof",
            "Secure Over-ear Sport Hooks",
            "8 Hours Playback (24 Hours Case)",
            "Physical Single-Button Media Controls",
            "Rich Stereo Dynamic Bass Driver"
          ],
          rating: 4.5,
          ratingCount: 78,
          stock: 32
        }
      ]);
    }

    // 3. Seed Reviews if empty
    const revCount = await Review.countDocuments();
    if (revCount === 0) {
      console.log('🌱 Seeding initial MongoDB reviews...');
      const prods = await Product.find();
      const headPhoneProd = prods.find(p => p.name.includes('NeoBeats Wireless Headphones')) || prods[0];
      const chairProd = prods.find(p => p.name.includes('ErgoGlide Office Chair')) || prods[1];
      const watchProd = prods.find(p => p.name.includes('Chronos Smart Watch')) || prods[2];

      if (headPhoneProd && chairProd && watchProd) {
        await Review.insertMany([
          { productId: headPhoneProd._id.toString(), author: "Alex Rivera", rating: 5, comment: "The noise cancellation is absolutely phenomenal! Audio quality is deep and detailed.", date: "2026-07-01" },
          { productId: headPhoneProd._id.toString(), author: "Sarah Jenkins", rating: 4, comment: "Super comfortable to wear for hours. Battery life easily lasts me a whole week.", date: "2026-07-08" },
          { productId: chairProd._id.toString(), author: "David Chen", rating: 5, comment: "My chronic back pain has virtually disappeared since using the ErgoGlide.", date: "2026-06-25" },
          { productId: watchProd._id.toString(), author: "Emily Taylor", rating: 5, comment: "Absolutely gorgeous screen! The holographic watch face options are futuristic and clean.", date: "2026-07-10" }
        ]);
      }
    }

    // 4. Seed Orders if empty
    const ordCount = await Order.countDocuments();
    if (ordCount === 0) {
      console.log('🌱 Seeding initial MongoDB orders...');
      await Order.insertMany([
        {
          id: "ORD-9281A",
          customerName: "Jane Doe",
          email: "jane.doe@example.com",
          address: "123 Cyber Way, Neo City, NY 10001",
          items: [
            { productId: "1", name: "NeoBeats Wireless Headphones", price: 212.49, quantity: 1 },
            { productId: "4", name: "Lumina Minimalist Desk Lamp", price: 75.99, quantity: 2 }
          ],
          subtotal: 364.47,
          discountAmount: 0.00,
          total: 364.47,
          status: "Delivered",
          date: "2026-07-10T14:32:00.000Z"
        },
        {
          id: "ORD-1234B",
          customerName: "Alex Rivera",
          email: "alex@example.com",
          address: "456 Matrix Road, Seattle, WA 98101",
          items: [
            { productId: "3", name: "Chronos Smart Watch", price: 159.99, quantity: 1 }
          ],
          subtotal: 159.99,
          discountAmount: 32.00,
          total: 127.99,
          status: "Processing",
          date: "2026-07-13T09:15:00.000Z"
        }
      ]);
    }
  } catch (err) {
    console.error('Error seeding MongoDB database:', err.message);
  }
}
