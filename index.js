const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require("dotenv");


dotenv.config();


mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected!'))
  .catch((err) => console.log(err));


const app = express();


app.use(cors());
app.use(express.json());

const supplierRouter=require("./routes/supplier")
app.use("/api/supplier",supplierRouter)


app.all("*", (req, res, next) => {
  res.status(404).json({ "status": "Failed", "message": "Page not found" });
});


app.use(function (error, req, res, next) {
  
  const statusCode = error.statusCode || 500;
  let message = error.message;
 

  // Clean up Mongoose validation error messages
  if (error.message.includes('ValidationError:')) {
    // Handle validation errors
    message = Object.values(error.errors)[0].message;
  // } else if (error.message.includes('CastError:') || error.message.includes('CastError')) {
  //   // Handle invalid ID errors
  //   message = "معرف غير صالح";
  // } else if (error.code === 11000) {
    // Handle duplicate key errors
    const field = Object.keys(error.keyPattern)[0];
    message = `هذا ${field} موجود بالفعل`;
  } else if (error.message.includes('validation failed:') || error.message.includes('Validation failed')) {
    // Handle other validation messages
    message = error.message.split(':').slice(-1)[0].trim();
  }
  
  if (error) {
    res.status(statusCode).json({ 
      status: "fail", 
      message: message 
    });
  } else {
    next();
  }
});


app.listen(8000, () => {
  console.log("port is start");
});