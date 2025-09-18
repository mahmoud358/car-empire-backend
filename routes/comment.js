const express = require("express");
const { addComment } = require("../controllers/comment");
const { auth,restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");

const router = express.Router();


router.post("/", auth,restrictTo(userRole.EMPLOYEE,userRole.ADMIN ,userRole.SUPERVISOR), addComment);

module.exports = router;
