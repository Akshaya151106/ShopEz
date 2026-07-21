# Phase 5: Project Development Phase

## This Is Where It Became Real
We went from design documents to actually writing code. Week 1-2 were rough (everyone's figuring out how everything works), but by week 3 it clicked.

## Backend (The Backbone)

### MongoDB Setup
We connected to MongoDB Atlas, got a cluster running, created indexes. One early mistake: we didn't optimize queries early enough. By week 3, we were running slow queries and had to backtrack and index properly. Lesson: think about query patterns from day one.

**File:** `server/db.js`

### User Authentication
- Signup: email, password (hashed with bcrypt), basic profile info
- Login: issue JWT token, keep user logged in
- Password reset: because everyone forgets
- Profiles: users can update their info

The hardest part? Making sure password hashing didn't make everything slow. We did it right, but there were definitely moments of "is this taking too long?"

**File:** `server/models/User.js`

### Products
- Add products to database
- Search, filter by category/price/gender
- Multiple images per product
- Reviews and ratings

Real scenario that happened: admin wanted to bulk upload 200 products at once. We didn't have a bulk import endpoint initially. Added it by week 3.

**File:** `server/models/Product.js`

### Shopping Cart
People add stuff to cart, we need to remember it. We store it in the database (not just cookies) so if they close the browser and come back in 3 weeks, their cart is still there. Smart move.

### Orders
When someone checks out:
- Take cart items, create order
- Store everything (product name, price, what they bought) so we have a permanent record
- Assign status (pending, processing, shipped, delivered)
- Update inventory

The trickiest part: what if someone checks out while we're updating inventory? Had to think about race conditions and lock states. We got it right, but it took thinking.

**File:** `server/models/Order.js`

### Reviews
Simple: customers rate and review products. Store it. Done.

**File:** `server/models/Review.js`

### Admin Backend
Dashboard that pulls together data:
- How many orders today?
- What products are selling?
- New user registrations
- System health

## Frontend (What People Actually See)

### Components We Built
```
src/components/
├── AuthModal.jsx — Login/signup modal
├── AuthView.jsx — Full auth page
├── CartDrawer.jsx — Shopping cart sidebar
├── CatalogView.jsx — Product listing/browsing
├── CheckoutFlow.jsx — Checkout process
├── ProductDetailsView.jsx — Single product page
└── SellerDashboard.jsx — Admin dashboard
```

Each component does one thing and does it well. No 2,000-line components here.

### Pages That Exist
- **Home**: Products and featured items
- **Product Details**: All the info about one product
- **Shopping Cart**: See what's in cart, modify it
- **Checkout**: Enter address, payment method
- **Order Confirmation**: "Yep, we got your order"
- **User Profile**: Account management
- **Admin Dashboard**: Everything an admin needs

### The API Connection
Frontend calls backend at `src/services/api.js`. Handles requests, responses, errors, loading states. When something fails, we don't just break - we show error messages. When loading, we show spinners.

**Styling**: Plain CSS. Could've used Tailwind or styled-components, but plain CSS is faster and lighter. Responsive design so it works on phones, tablets, desktops.

## The Big Features

### What Customers Can Do
✓ Sign up and log in  
✓ Browse products  
✓ Search for stuff  
✓ Filter by category, price, size  
✓ Add items to cart  
✓ Check out securely  
✓ Track orders  
✓ Leave reviews  
✓ Manage profile  

### What Admins Can Do
✓ Dashboard with stats  
✓ Add/edit/delete products  
✓ Manage users  
✓ See all orders  
✓ Update order status  
✓ Manage categories  
✓ Upload banners  
✓ View analytics  

## Running It

```bash
# Get dependencies installed
npm install

# Start everything (backend + frontend)
npm run dev

# Just backend
npm run server

# Just frontend
npm run client

# Build for production
npm run build

# Check for lint issues
npm run lint
```

## Code Quality (We Tried To Not Make A Mess)
- Components are modular (not one giant file)
- Followed DRY (Don't Repeat Yourself) - reuse code
- Proper error handling (don't silently fail)
- Input validation (never trust user input)
- Clear separation between UI logic and business logic

Documentation: code comments on the tricky bits, prop types on components, API docs, database schema notes.

## Test Data (So We Had Something To Actually Buy)
We created seed data:
- 5 test users (including admin account)
- 20+ products across different categories
- Sample reviews and ratings
- Sample orders showing different statuses

**Script:** `server/db.js` - Runs when server starts

## Speed & Security

**Making it fast:**
- Minify the frontend bundle
- Cache product data
- Optimize database queries (indexes!)
- Lazy-load images
- Compress responses

**Keeping it safe:**
- Passwords hashed (bcrypt)
- JWT authentication
- CORS (only our frontend can call our API)
- Env variables for secrets (not hardcoded)
- SQL injection protection (used Mongoose)
- XSS protection

## The Actual Challenges We Hit

**Challenge 1**: Backend API was ready before frontend. Frontend dev had to stub out responses to keep building. Solved with Postman mock server.

**Challenge 2**: JWT tokens expiring in the middle of checkout. Had to add token refresh logic.

**Challenge 3**: Images weren't loading properly on some browsers. CORS issue. Fixed it.

**Challenge 4**: Performance got weird with large product queries. Added pagination and indexing.

**Challenge 5**: Forgot to test what happens when someone's network dies mid-checkout. Added retry logic.

We shipped things, they broke, we fixed them, we learned. That's the job.

---
**Status:** ✅ Completed  
**Date:** February 13, 2026  
**What We Learned**: Over-engineer nothing initially. Ship, test, optimize. We caught most real issues by actually using the app.
✓ XSS protection
✓ CSRF protection

## Testing
- Unit tests — component rendering, utility functions, API response checks
- Integration tests — API endpoints, database operations, frontend-backend integration
- Manual tests — user flows, edge cases, browser compatibility

## Deliverables
- Backend: a full REST API, database models, authentication, and business logic
- Frontend: React components, pages, a responsive UI, and API integration
- Database: MongoDB schema, seed data, indexes
- Documentation: code docs, API docs, setup guide, deployment guide

## Git Repository
**Repository:** https://github.com/Akshaya151106/ShopEz.git
**Branch:** main
**Latest Commit:** "Update project with server setup and improvements"

## Current Status
✅ Backend: 100% Complete
✅ Frontend: 100% Complete
✅ Database: 100% Complete
✅ Integration: 100% Complete
✅ Testing: 95% Complete
⏳ Deployment: Pending

Overall: 98% Complete


---
**Status:** ✅ Completed
**Date:** February 13, 2026
**Developer:** Development Team

