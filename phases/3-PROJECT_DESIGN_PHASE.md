# Phase 3: Project Design Phase

## Overview
The Project Design Phase involves creating the architecture, database design, and system structure for ShopEZ.

## Database Design - ER Model

### Entities and Relationships

#### **USER**
Represents the individuals or entities who are registered in the platform.

**Attributes:**
- `userid` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password`
- `usertype` (Regular/Admin)
- `mobile`
- `address`

**Relationships:**
- One-to-Many with Cart
- One-to-Many with Order

---

#### **ADMIN**
Represents a collection with important details such as Banner images and Categories.

**Attributes:**
- `admin_id` (Primary Key)
- `banner` (Image data)
- `categories` (Collection reference)

**Relationships:**
- One-to-Many with Categories

---

#### **CATEGORIES**
Represents product categories managed by admin.

**Attributes:**
- `category_id` (Primary Key)
- `category_name`

**Relationships:**
- Many-to-One with Admin
- One-to-Many with Product

---

#### **PRODUCT**
Represents a collection of all the products available in the platform.

**Attributes:**
- `productid` (Primary Key)
- `title`
- `description`
- `price`
- `discount`
- `gender` (Men/Women/Unisex)
- `sizes` (Array)
- `carousel` (Image carousel)
- `mainimg` (Main image)
- `category` (Foreign Key)

**Relationships:**
- Many-to-One with Categories
- One-to-Many with Cart
- One-to-Many with Review

---

#### **CART**
This collection stores all the products that are added to the cart by users. Elements are differentiated by User ID.

**Attributes:**
- `cartid` (Primary Key)
- `userid` (Foreign Key)
- `productid` (Foreign Key)
- `quantity`
- `size`
- `price`
- `discount`

**Relationships:**
- Many-to-One with User
- Many-to-One with Product

---

#### **ORDER**
This collection stores all the orders made by users in the platform.

**Attributes:**
- `orderid` (Primary Key)
- `userid` (Foreign Key)
- `orderDate`
- `deliveryDate`
- `paymentMethod`
- `address`
- `pincode`
- `quantity`
- `size`
- `price`
- `discount`
- `title`
- `description`
- `mainimg`

**Relationships:**
- Many-to-One with User

---

#### **REVIEW**
Customer reviews and ratings for products.

**Attributes:**
- `review_id` (Primary Key)
- `productid` (Foreign Key)
- `userid` (Foreign Key)
- `title`
- `description`
- `rating`

**Relationships:**
- Many-to-One with Product
- Many-to-One with User

---

## System Architecture

### Frontend Architecture
- **Framework**: React 19.2.7
- **Build Tool**: Vite 8.1.1
- **Styling**: CSS
- **UI Components**: Lucide React Icons

### Backend Architecture
- **Runtime**: Node.js
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB Atlas (Cloud)
- **ORM**: Mongoose 9.8.0
- **Middleware**: CORS, Dotenv

### Database Technology Stack
- **Primary DB**: MongoDB Atlas (Cloud Database)
- **Local DB**: SQLite3 (Fallback/Testing)

## Technology Stack Summary

```
Frontend:
├── React 19.2.7
├── Vite 8.1.1
├── Lucide React 1.24.0
└── CSS

Backend:
├── Node.js
├── Express 4.21.2
├── Mongoose 9.8.0
├── CORS 2.8.5
└── Dotenv 17.4.2

Database:
├── MongoDB Atlas (Primary)
└── SQLite3 (Optional)
```

## API Endpoints Design

### User Endpoints
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status

## Security Design

- Password hashing with bcrypt
- JWT token authentication
- CORS configuration for API security
- Environment variables for sensitive data
- SSL/TLS for data transmission

## Scalability Considerations

- MongoDB Atlas for horizontal scaling
- Stateless backend for load balancing
- Caching strategy for product catalog
- CDN for static assets

## Deliverables
- Database Schema (ER Diagram)
- System Architecture Diagram
- API Design Document
- Technology Stack Specification
- Security Architecture

---
**Status:** ✅ Completed  
**Date:** February 13, 2026
