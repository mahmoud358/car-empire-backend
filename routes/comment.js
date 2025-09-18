const express = require("express");
const { addComment, updateComment } = require("../controllers/comment");
const { auth,restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");

const router = express.Router();


router.post("/", auth,restrictTo(userRole.EMPLOYEE,userRole.ADMIN ,userRole.SUPERVISOR), addComment);
router.put("/:commentId", auth,restrictTo(userRole.EMPLOYEE,userRole.ADMIN ,userRole.SUPERVISOR), updateComment);

module.exports = router;
