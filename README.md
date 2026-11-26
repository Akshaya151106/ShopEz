ShopEZ – Development of a Dynamic Online Retail Platform

ShopEZ is a full-stack e-commerce web application developed to provide a simple and responsive online shopping experience. It allows users to explore products, manage their shopping cart, register and log in, and place orders through an interactive interface.

The application uses React.js for the frontend, Node.js and Express.js for backend development, and MongoDB with Mongoose for database management.

Features

Customer Features

- Browse and explore available products.
- Search for products.
- View product details, prices and availability.
- Add and manage products in the shopping cart.
- Register and log in.
- Place orders and view order information.
- Submit product ratings and reviews.

Admin Features

- Manage product information.
- Add, update and delete products.
- Manage orders and update order statuses.
- Access the application dashboard.

Technology Stack

Layer| Technologies
Frontend| React.js, JavaScript, HTML5, CSS3
Frontend tooling| Vite
Backend| Node.js, Express.js
Database| MongoDB
ODM| Mongoose
API Communication| REST APIs, JSON
Development Tools| VS Code, Git, GitHub, npm

System Architecture

ShopEZ follows a client-server architecture.

1. Presentation Layer – React.js: Handles the user interface, product browsing, shopping cart and user interactions.
2. Application Layer – Node.js and Express.js: Handles HTTP requests, business logic, authentication routes, product operations, reviews and orders.
3. Database Layer – MongoDB: Stores application data using Mongoose models.

Application Flow

        USER
          |
          v
   REACT FRONTEND
          |
          | HTTP Requests
          | JSON Responses
          v
   EXPRESS REST API
          |
          v
      NODE.JS
          |
          v
   MONGOOSE MODELS
          |
          v
       MONGODB

Backend API Modules

Module| Operations
Products| Create, Read, Update, Delete
Authentication| Register and Login
Reviews| Retrieve and Submit Reviews
Orders| Create Orders, Retrieve Orders, Update Status

Installation and Setup

Prerequisites

- Node.js and npm
- MongoDB database
- Git

1. Clone the repository

git clone https://github.com/Akshaya151106/ShopEz.git
cd ShopEz

2. Install dependencies

npm install

3. Configure environment variables

Create a ".env" file and configure the MongoDB connection settings required by the backend.

Never commit database credentials or other sensitive configuration values to GitHub.

4. Run the application

npm run dev

The development script starts the Express backend and Vite frontend concurrently.

5. Create a production build

npm run build

My Role and Learning Outcomes

This project helped me gain practical experience in:

- Developing reusable components using React.
- Building backend applications using Node.js and Express.js.
- Designing and working with MongoDB models using Mongoose.
- Creating and integrating REST APIs.
- Performing CRUD operations.
- Understanding client-server communication.
- Managing application data and debugging full-stack issues.
- Using Git and GitHub for version control.

Future Enhancements

- Improved authentication with password hashing and authorization.
- Online payment gateway integration.
- Enhanced order tracking.
- Additional security and performance improvements.

Author

Akshaya Kanchala

B.Tech – Computer Science and Engineering

GitHub: https://github.com/Akshaya151106

Project Repository: https://github.com/Akshaya151106/ShopEz
