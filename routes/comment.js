const express = require("express");
const { addComment, getCommentsByRequestID } = require("../controllers/comment");
const { auth,restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");

const router = express.Router();


router.post("/", auth,restrictTo(userRole.EMPLOYEE,userRole.ADMIN ,userRole.SUPERVISOR), addComment);
router.get("/:requestId", auth,restrictTo(userRole.EMPLOYEE,userRole.ADMIN ,userRole.SUPERVISOR), getCommentsByRequestID);

module.exports = router;
