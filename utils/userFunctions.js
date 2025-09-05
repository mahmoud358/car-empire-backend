const userModel = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const APIERROR = require("../utils/apiError");

function validateLoginInput(body) {
  const { phoneNumber, password } = body;
  if (!phoneNumber || !password) {
    throw new APIERROR(400, "يرجى إدخال رقم الجوال وكلمة المرور");
  }
  return { phoneNumber, password };
}

async function checkUserAndPassword(phoneNumber, password) {
  const user = await userModel.findOne({ phoneNumber });
  if (!user) throw new APIERROR(400, "يوجد خطأ في رقم الجوال أو كلمة المرور");

  const passwordValid = await bcryptjs.compare(password, user.password);
  if (!passwordValid) throw new APIERROR(400, "يوجد خطأ في رقم الجوال أو كلمة المرور");

  return user;
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      username: user.userName,
    },
    process.env.SECRET,
    { expiresIn: "1d" }
  );
}

module.exports = { validateLoginInput, checkUserAndPassword, generateToken };
