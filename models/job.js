const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "الوظيفة لازم يكون ليها عنوان"],
      trim: true,
      minlength: [15 , "العنوان لازم يكون 15 حرف على الأقل"],
      maxlength: [200, "العنوان طويل جداً"],
    },
    details: {
      type: String,
      required: [true, "لازم تكتب تفاصيل عن الوظيفة"],
      trim: true,
    },
    responsibilities: {
      type: [String], 
      required: [true, "لازم تكتب المسؤوليات"],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "المسؤوليات لازم تحتوي على عنصر واحد على الأقل",
      },
    },
    requirements: {
      type: [String], 
      required: [true, "لازم تكتب المتطلبات"],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "المتطلبات لازم تحتوي على عنصر واحد على الأقل",
      },
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
