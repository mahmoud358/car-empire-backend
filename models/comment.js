const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "النص مطلوب"],
      minlength: [2, "النص لازم يكون أكبر من 2 حروف"],
      maxlength: [500, "النص لازم يكون أقل من 500 حرف"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "مطلوب معرف المستخدم"],
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequestBuying",
      required: [true, "مطلوب معرف الطلب"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
