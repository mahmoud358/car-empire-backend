const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.js');

dotenv.config();


mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

const app = express();


app.use(cors());
app.use(express.json());

// Swagger UI setup
app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
