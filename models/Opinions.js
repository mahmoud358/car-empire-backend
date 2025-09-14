const mongoose = require("mongoose");

const opinionSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "الاسم مطلوب"],
      trim: true,
      minlength: [3, "الاسم لازم يكون أكبر من 3 حروف"],
      maxlength: [50, "الاسم لازم يكون أقل من 50 حرف"],
    },
    text: {
      type: String,
      required: [true, "النص مطلوب"],
      trim: true,
      minlength: [5, "النص لازم يكون أكبر من 5 حروف"],
      maxlength: [500, "النص لازم يكون أقل من 500 حرف"],
    },
    rating: {
      type: Number,
      required: [true, "التقييم مطلوب"],
      min: [1, "أقل تقييم هو 1"],
      max: [5, "أعلى تقييم هو 5"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Opinion", opinionSchema);
