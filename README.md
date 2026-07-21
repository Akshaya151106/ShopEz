# ShopEZ - Production Full-Stack E-Commerce & Seller Portal

ShopEZ is a full-stack e-commerce web application powered by a **React SPA frontend** and an **Express REST API backend** connected to a **real SQLite database** (`shopez.db`).

---

## Project Location
This entire project is installed and running at:
`D:\shop`

---

## Full-Stack Architecture

### 1. SQLite Database (`D:\shop\server\shopez.db`)
Stores persistent tables for real-time CRUD operations:
- **`users`**: User account credentials (usernames, passwords, emails). Pre-seeded with `alex` and `jane` (password: `password123`).
- **`products`**: Product catalog items, pricing, inventory stock, ratings, and specifications. Pre-seeded with 10 categories.
- **`reviews`**: Customer ratings and review comments. Submitting a review recalculates product average ratings in real-time.
- **`orders`**: Customer checkout transactions. Creating an order automatically decrements product inventory stock levels in SQLite.

### 2. Express REST API Backend (`D:\shop\server\index.js`)
Runs on **Port 5000** exposing API endpoints:
- `GET /api/products`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`
- `GET /api/reviews`, `POST /api/reviews`
- `GET /api/orders`, `POST /api/orders`, `PUT /api/orders/:id/status`
- `POST /api/auth/login`, `POST /api/auth/register`

### 3. React Frontend (`D:\shop\src`)
Modern glassmorphic UI featuring theme accents, interactive search, multi-step checkout, and seller analytics dashboards.

---

## How to Run & Publish

### Development Mode (Runs Backend + Frontend concurrently)
```bash
cd D:\shop
npm run dev
```
- **Backend REST API & Database Server**: `http://localhost:5000`
- **Frontend Vite Client**: `http://localhost:5174` (or `http://localhost:5173`)

### Production / Real Deployment Mode
Build the client and start the production Express server:
```bash
cd D:\shop
npm run build
npm start
```
The Express server on port `5000` serves the SQLite database REST API and the static React bundle from `dist/`.

---

## Pre-seeded Credentials
- **Username**: `alex` or `jane`
- **Password**: `password123`
