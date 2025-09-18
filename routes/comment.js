const express = require("express");
const { addComment, getCommentsByRequestID, updateComment } = require("../controllers/comment");
const { auth,restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Comment ID
 *         text:
 *           type: string
 *           description: Comment content
 *         userId:
 *           type: string
 *           description: Author user ID
 *         requestId:
 *           type: string
 *           description: Related request ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateCommentRequest:
 *       type: object
 *       required:
 *         - text
 *         - requestId
 *       properties:
 *         text:
 *           type: string
 *           minLength: 2
 *           maxLength: 500
 *           description: Comment content
 *         requestId:
 *           type: string
 *           description: RequestBuying ID that this comment belongs to
 *     CommentsListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *         pagination:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: integer
 *             totalPages:
 *               type: integer
 *             totalItems:
 *               type: integer
 */

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Add a new comment
 *     description: Employees can only comment on requests assigned to them. Admins and Supervisors can comment on any request.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *           example:
 *             text: "تم التواصل مع العميل وسيتم التحديث لاحقًا"
 *             requestId: "64a1b2c3d4e5f6789abcdef0"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Employee not assigned to this request
 *       500:
 *         description: Internal server error
 */
router.post("/", auth,restrictTo(userRole.EMPLOYEE,userRole.ADMIN ,userRole.SUPERVISOR), addComment);

/**
 * @swagger
 * /comment/{requestId}:
 *   get:
 *     summary: Get comments by request ID
 *     description: Retrieve paginated comments for a specific RequestBuying
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: RequestBuying ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentsListResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.get("/:requestId", auth,restrictTo(userRole.EMPLOYEE,userRole.ADMIN ,userRole.SUPERVISOR), getCommentsByRequestID);
router.put("/:commentId", auth,restrictTo(userRole.EMPLOYEE,userRole.ADMIN ,userRole.SUPERVISOR), updateComment);

module.exports = router;
