const express = require("express");
const router = express.Router();
const { auth, restrictTo } = require("../middlewares/auth");
const  userRole  = require("../utils/user-roles");
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
    login
  } = require("../controllers/user");
  router.post("/", auth, restrictTo(userRole.ADMIN , userRole.SUPERVISOR), createUser);
  router.get("/",  getAllUsers);
  router.get("/:id", getUserById);
  router.put("/:id", updateUserById);
  router.delete("/:id",auth, restrictTo(userRole.ADMIN , userRole.SUPERVISOR), deleteUserById);
  router.post("/login", login);
  module.exports = router;