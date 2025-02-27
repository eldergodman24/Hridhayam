Table of Contents

Project Overview

Tech Stack

Installation and Setup

Environment Variables

Running the Application

Folder Structure

API Endpoints

Features

Deployment

License

Project Overview

This is a full-stack e-commerce website built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides user authentication, product listings, cart management, order processing, and admin functionalities.

Tech Stack

Frontend: React.js, Redux Toolkit, Tailwind CSS/Bootstrap

Backend: Node.js, Express.js

Database: MongoDB (Mongoose ORM)

Authentication: JSON Web Token (JWT)

Payment Gateway: Stripe/PayPal

Cloud Storage: Cloudinary/AWS S3 (optional)

Installation and Setup

Prerequisites

Ensure you have the following installed:

Node.js (v16 or later)

MongoDB (local or Atlas)

npm or yarn

Clone the Repository

git clone https://github.com/your-repo/ecommerce-mern.git
cd ecommerce-mern

Install Dependencies

Install server dependencies

cd backend
npm install

Install client dependencies

cd ../frontend
npm install

Environment Variables

Create a .env file in the backend/ directory and add the following:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_SECRET_KEY=your_RAZORPAY_SECRET_KEY
RAZORPAY_KEY_ID=your_RAZORPAY_KEY_id
EMAIL_ID=YOUR_EMAIL
EMAIL_PASSKEY=YOUR_EMAIL_PASSKEY
CLOUDINARY_URL=your_cloudinary_url

Running the Application

Start the Backend Server

cd backend
npm run dev

Start the Frontend Client

cd frontend
npm start

Folder Structure

/ecommerce-mern
│── /backend
│   ├── /config       # Database and environment configurations
│   ├── /controllers  # Business logic for API routes
│   ├── /models       # Mongoose models for database schema
│   ├── /routes       # API routes
│   ├── /middleware   # Middleware functions
│   ├── /utils        # Helper functions
│   ├── server.js     # Entry point for backend server
│
│── /frontend
│   ├── /src
│   │   ├── /components   # Reusable React components
│   │   ├── /pages        # Page-level React components
│   │   ├── /redux        # State management using Redux
│   │   ├── /utils        # Utility functions
│   │   ├── App.js        # Main App component
│   │   ├── index.js      # Entry point for frontend
│
│── package.json
│── README.md

API Endpoints

User Routes

POST /api/users/register - Register a new user

POST /api/users/login - Authenticate user and get token

GET /api/users/profile - Get user profile

Product Routes

GET /api/products - Get all products

GET /api/products/:id - Get product by ID

Order Routes

POST /api/orders - Create new order

GET /api/orders/:id - Get order by ID

Cart Routes

POST /api/cart - Add item to cart

GET /api/cart - Get cart items

Features

✅ User Authentication (Register/Login)
✅ Product Listings & Filtering
✅ Shopping Cart Management
✅ Secure Payment Integration (Stripe/PayPal)
✅ Order Processing & Tracking
✅ Admin Dashboard (Manage Products & Orders)

Deployment

Deploy Frontend (Vercel/Netlify)

npm run build

Upload the /frontend/build folder to Vercel or Netlify.

Deploy Backend (Render/Heroku)

git push heroku main

Ensure you set up environment variables in your hosting platform.

License

This project is licensed under the MIT License.
Copyright (c) 2025 LAUFREL, HRIDHAYAM

Permission is hereby granted, free of charge, to any person obtaining a copy of this website and associated documentation files , to deal in the website without 
restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the websiteand to permit 
persons to whom the website is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Website.

THE Website IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR 
A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE Website.