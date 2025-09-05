const express = require("express");
const router = express.Router();
const { auth, restrictTo } = require("../middlewares/auth");
const {
  createBlog,
  getAllBlogs,
  updateBlogById,
  deleteBlogById,
  getBlogById,
} = require("../controllers/blog");
router.post("/",auth, restrictTo("admin"), createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id",auth, restrictTo("admin"), updateBlogById);
router.delete("/:id",auth, restrictTo("admin"), deleteBlogById);
module.exports = router;
