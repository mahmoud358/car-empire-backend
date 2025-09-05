const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "العنوان مطلوب"],
      trim: true,
      minlength: [15, "العنوان قصير جدًا"],
      maxlength: [500, "العنوان طويل جدًا"],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [1000, "العنوان الفرعي طويل جدًا"],
    },
    image: {
        type: String,
        validate: {
          validator: (val) => /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(val),
          message: "رابط الصورة غير صالح"
        }
      },
    content: {
      type: String,
      required: [true, "المحتوى مطلوب"],
      minlength: [400, "المحتوى قصير جدًا"],
    },
    
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
