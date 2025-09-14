const express = require("express");
const router = express.Router();
const { getUserLoginLogs } = require("../controllers/loginLog");
const { auth, restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");


router.get("/:userId", auth, restrictTo(userRole.ADMIN, userRole.SUPERVISOR), getUserLoginLogs);

module.exports = router;
