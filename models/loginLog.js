const mongoose = require("mongoose");

let loginLogSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "معرّف المستخدم مطلوب"],
      immutable: true, 
    },
    country: {
      type: String,
      required: [true, "الدولة مطلوبة"],
      trim: true,
      minlength: [2, "اسم الدولة قصير جدًا"],
      maxlength: [50, "اسم الدولة طويل جدًا"],
    },
    city: {
      type: String,
      required: [true, "المدينة مطلوبة"],
      trim: true,
      minlength: [2, "اسم المدينة قصير جدًا"],
      maxlength: [50, "اسم المدينة طويل جدًا"],
    },
    latitude: {
      type: String,
      required: [true, "خط العرض مطلوب"],
      match: [/^-?\d{1,3}\.\d+$/, "إحداثيات خط العرض غير صالحة"], 
    },
    longitude: {
      type: String,
      required: [true, "خط الطول مطلوب"],
      match: [/^-?\d{1,3}\.\d+$/, "إحداثيات خط الطول غير صالحة"], 
    },
    ip: {
      type: String,
      required: [true, "عنوان IP مطلوب"],
      match: [
        /^(?:\d{1,3}\.){3}\d{1,3}$/,
        "عنوان IP غير صالح (IPv4 فقط)"
      ], 
    },
    browser: {
      type: String,
      trim: true,
      maxlength: [100, "اسم المتصفح طويل جدًا"],
      default: "غير معروف",
    },
    loginTime: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("loginLog", loginLogSchema);
