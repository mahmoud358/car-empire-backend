const express = require("express");
const { addOpinion, getOpinions, deleteOpinion } = require("../controllers/Opinions");
const { auth, restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");
const router = express.Router();
router.post("/", auth, restrictTo(userRole.ADMIN, userRole.SUPERVISOR, userRole.EMPLOYEE), addOpinion);
router.get("/getopinions", auth, restrictTo(userRole.ADMIN, userRole.SUPERVISOR, userRole.EMPLOYEE), getOpinions);
router.delete("/:id", auth, restrictTo(userRole.ADMIN), deleteOpinion);

module.exports = router;