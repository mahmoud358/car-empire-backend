const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: { 
      type: String,
      required: [ true,"الاسم مطلوب"],
      minLength:[5,'الاسم يجب ان يكون اكبر من خمسة حروف']
   
    },
//   address: String,
  phoneNumber: {
    type: String,
    required: [ true,"رقم الجوال مطلوب"],
    match: [/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/, "رقم الجوال غير صالح"],
    unique: [true, "رقم الجوال مستخدم من قبل"],
  },
  funding: [{
    type: String,
    required: [ true,"جهات التمويل مطلوبة"]
  }],
  cars: [{
    carID: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Car",
      required: true
    },
    brand: { type: String, index: true },   // searchable
    model: { type: String, index: true },   // searchable
    category: { type: String, index: true } // searchable
  }]
});

module.exports = mongoose.model("Supplier", supplierSchema);
