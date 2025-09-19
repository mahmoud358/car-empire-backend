const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.js');

dotenv.config();

// Initialize Express app first
const app = express();

// MongoDB connection with proper serverless configuration
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      // Connection timeout settings
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 1, // Reduced for serverless
      maxIdleTimeMS: 30000,
      
      // Buffer settings for serverless - ENABLE buffering
      bufferCommands: true, // Enable buffering for serverless
      bufferMaxEntries: 0,
      
      // Retry settings
      retryWrites: true,
      retryReads: true
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
    console.error(err);
    process.exit(1); // Exit if DB connection fails
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

app.use(cors());
app.use(express.json());

// Swagger UI setup
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

// Routes
const userRoutes = require("./routes/user");
app.use("/user", userRoutes);
const blogRoutes = require("./routes/blog");
app.use("/blog", blogRoutes);
const jobRoutes = require("./routes/job");
app.use("/job", jobRoutes);

const supplierRouter = require("./routes/supplier");
app.use("/supplier", supplierRouter);
const carRouter = require("./routes/car");
app.use("/car", carRouter);
const reqBuyingRouter = require("./routes/requestBuying");
app.use("/request-buying", reqBuyingRouter);

const loginLogRoutes = require("./routes/loginLog");
app.use("/login-log", loginLogRoutes);
const opinionRoutes = require("./routes/Opinions");
app.use("/opinion", opinionRoutes);
const commentRoutes = require("./routes/comment");
app.use("/comment", commentRoutes);

const transactionRouter = require("./routes/transactions");
app.use("/transaction", transactionRouter);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: "Page not found"
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong";

  // Mongoose Validation Error
  if (error.name === "ValidationError") {
    message = Object.values(error.errors)[0].message;
  }

  // Duplicate Key Error (MongoDB 11000)
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    message = `هذا ${field} موجود بالفعل`;
  }

  res.status(statusCode).json({
    status: "fail",
    message
  });
});

// Start server only after DB connection
const startServer = async () => {
  await connectDB();
  
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();