const express = require("express");
const router = express.Router();
const { auth, restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");
const {
  createBlog,
  getAllBlogs,
  updateBlogById,
  deleteBlogById,
  getBlogById,
} = require("../controllers/blog");

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           minLength: 15
 *           maxLength: 500
 *         subtitle:
 *           type: string
 *           maxLength: 1000
 *         image:
 *           type: string
 *           format: uri
 *         content:
 *           type: string
 *           minLength: 400
 */

/**
 * @swagger
 * /blog:
 *   post:
 *     summary: Create a new blog post
 *     security:
 *       - bearerAuth: []
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/",auth, restrictTo(userRole.ADMIN), createBlog);
/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of all blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */
router.get("/", getAllBlogs);
/**
 * @swagger
 * /blog/{id}:
 *   get:
 *     summary: Get blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post details
 *       404:
 *         description: Blog post not found
 */
router.get("/:id", getBlogById);
/**
 * @swagger
 * /blog/{id}:
 *   put:
 *     summary: Update blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *       404:
 *         description: Blog post not found
 */
router.put("/:id",auth, restrictTo(userRole.ADMIN), updateBlogById);
/**
 * @swagger
 * /blog/{id}:
 *   delete:
 *     summary: Delete blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *       404:
 *         description: Blog post not found
 */
router.delete("/:id",auth, restrictTo(userRole.ADMIN), deleteBlogById);
module.exports = router;
