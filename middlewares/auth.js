jwt = require("jsonwebtoken");

const util = require("util");

exports.auth = async function (req, res, next) {
  let { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ massage: "please login first " });
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
    return res.status(401).json({ massage: "you are not authonticated" });
  }
};

exports.restrictTo = function (...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.role)) {
      return res
        .status(403)
        .json({ massege: "ليس لديك الصلاحية للقيام بهذا الإجراء" });
    }
    next();
  };
};