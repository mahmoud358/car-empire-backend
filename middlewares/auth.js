jwt = require("jsonwebtoken");

const util = require("util");
const APIERROR = require("../utils/apiError")

exports.auth = async function (req, res, next) {
  let { authorization } = req.headers;

  if (!authorization) {
    next( new APIERROR(401, "قم بتسجيل الدخول اولا"));
  }

  try {
    let decoded = await util.promisify(jwt.verify)(
      authorization,
      process.env.SECRET
    );
    req.id = decoded.id;
    req.role = decoded.role;
    req.userName=decoded.username
    req.phoneNumber=decoded.phoneNumber
    next();
  } catch (err) {
    next( new APIERROR(401, "قم بتسجيل الدخول اولا"));
  }
};

exports.restrictTo = function (...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.role)) {
      next( new APIERROR(403, "ليس لديك الصلاحية للقيام بهذا الإجراء "));
    }
    next();
  };
};