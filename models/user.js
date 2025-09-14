const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
let users = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "الاسم مطلوب"],
      unique: false,
      minlength: [3, "الاسم يجب ان يكون اكبر من 3 حروف"],
      maxlength: [20, "الاسم يجب ان يكون اقل من 20 حرف"],
      trim: true,  
    },
    userName: {
      type: String,
      required: [true, "الاسم مطلوب"],
      unique: false,
      minlength: [3, "الاسم المستخدم يجب ان يكون اكبر من 3 حروف"],
      maxlength: [30, "الاسم المستخدم يجب ان يكون اقل من 30 حرف"],
      trim: true,
    },
    email: {
      type: String,
      match: [/^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com)$/, "الايميل غير صالح"],
      unique: [true,"الايميل مستخدم من قبل"],
      required: [true, "الايميل مطلوب"],
    },
    phoneNumber: {
      type: String,
      required: [true, "رقم الجوال مطلوب "],
      unique: [true,"رقم الجوال مستخدم من قبل"],
      match: [/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/, "رقم الجوال غير صالح"],
    },
    image: {
      type: String,
      validate: {
        validator: (val) => /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(val),
        message: "رابط الصورة غير صالح"
      }
    },
    password: {
      type: String,
      required: [true, "كلمة المرور مطلوبة"],
      validate:{
        validator:function(value){
            return value.length>=8;
        },
        message:"كلمة المرور يجب ان تكون اكبر من 8 "
    },
    },
    role: {
      type: String,
      required: [true, "الدور مطلوب"],
      enum: {
        values: ["admin", "supervisor", "employee"],
        message:"الدور يجب ان يكون من بين القيم المسموحة"
      },
    }, 
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
users.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hashSync(this.password, salt);
    this.password = hashedPassword;
  }
  next();
});

users.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 20 * 60 * 1000;

  console.log(resetToken, this.passwordResetToken);

  return resetToken;
};
const userModel = mongoose.model("User", users);
module.exports = userModel;