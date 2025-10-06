import cors from "cors";
import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/mongoose.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cookieParser from "cookie-parser";
import cartRouter from "./routes/cartRoutes.js";
import adminRouter from "./routes/adminRoute.js";
import contactRouter from "./routes/contactRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

const server = express();
const PORT = process.env.PORT || 3000;
server.use(cookieParser());
server.use(express.json());
const allowedOrigins = [
  'https://hridhayam.in',
  'http://localhost:5173'
];

server.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) {
        callback(null, true);
      } else if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Instead of blocking, allow all origins for development
        // To restrict in production, use: callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["set-cookie"],
  })
);

server.use("/user", userRouter);
server.use("/product", productRouter);
server.use("/cart", cartRouter);
server.use("/admin", adminRouter);
server.use("/contact", contactRouter);
server.use("/order", orderRouter);

// const storage  = multer.diskStorage({
connectDB();
connectCloudinary();
console.log("Connected to MongoDB and Cloudinary");
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
