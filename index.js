const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.js');

dotenv.config();


mongoose.connect(process.env.DATABASE_URL, {
  // Connection timeout settings
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  
  // Connection pool settings
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5, // Maintain a minimum of 5 socket connections
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  
  // Buffer settings for serverless
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // Disable mongoose buffering
  
  // Retry settings
  retryWrites: true,
  retryReads: true
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    console.error(err);
  });



const app = express();


app.use(cors());
app.use(express.json());

// Swagger UI setup
// app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// ✅ Serve Swagger JSON directly
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);


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

const transactionRouter=require("./routes/transactions");
app.use("/transaction", transactionRouter);

// ✅ 404 Handler (Catch-all)
app.use((req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: "Page not found"
  });
});

// ✅ Global Error Handler
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

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
