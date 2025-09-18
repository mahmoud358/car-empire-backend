const express = require("express");
const { addOpinion, getOpinions, deleteOpinion } = require("../controllers/Opinions");
const { auth, restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Opinion:
 *       type: object
 *       required:
 *         - fullName
 *         - text
 *         - rating
 *       properties:
 *         _id:
 *           type: string
 *           description: Opinion ID
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           description: Full name of the person giving the opinion
 *         text:
 *           type: string
 *           minLength: 5
 *           maxLength: 500
 *           description: Opinion text content
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5 stars
 *     CreateOpinionRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - text
 *         - rating
 *       properties:
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           description: Full name of the person giving the opinion
 *         text:
 *           type: string
 *           minLength: 5
 *           maxLength: 500
 *           description: Opinion text content
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5 stars
 *     ApiResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [success, fail]
 *           description: Response status
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: object
 *           description: Response data
 *     OpinionsListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [success]
 *           description: Response status
 *         results:
 *           type: number
 *           description: Number of opinions in current page
 *         page:
 *           type: number
 *           description: Current page number
 *         totalPages:
 *           type: number
 *           description: Total number of pages
 *         totalOpinions:
 *           type: number
 *           description: Total number of opinions
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Opinion'
 *           description: List of opinions
 */

/**
 * @swagger
 * /opinion:
 *   post:
 *     summary: Add a new opinion
 *     description: Create a new customer opinion with rating and feedback
 *     tags: [Opinions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOpinionRequest'
 *           example:
 *             fullName: "أحمد محمد العلي"
 *             text: "خدمة ممتازة وسرعة في التوصيل، أنصح بالتعامل معهم"
 *             rating: 5
 *     responses:
 *       201:
 *         description: Opinion created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Opinion'
 *             example:
 *               status: "success"
 *               message: "تم إضافة الرأي بنجاح"
 *               data:
 *                 _id: "64a1b2c3d4e5f6789abcdef0"
 *                 fullName: "أحمد محمد العلي"
 *                 text: "خدمة ممتازة وسرعة في التوصيل، أنصح بالتعامل معهم"
 *                 rating: 5
 *                 createdAt: "2023-07-01T10:00:00.000Z"
 *                 updatedAt: "2023-07-01T10:00:00.000Z"
 *       400:
 *         description: Bad request - Missing required fields or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               status: "fail"
 *               message: "الاسم والنص والتقييم مطلوبين"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.post("/", auth, restrictTo(userRole.ADMIN, userRole.SUPERVISOR, userRole.EMPLOYEE), addOpinion);

/**
 * @swagger
 * /opinion/getopinions:
 *   get:
 *     summary: Get all opinions
 *     description: Retrieve all customer opinions with pagination, sorted by creation date (newest first)
 *     tags: [Opinions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Number of opinions per page
 *     responses:
 *       200:
 *         description: Opinions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpinionsListResponse'
 *             example:
 *               status: "success"
 *               results: 10
 *               page: 1
 *               totalPages: 3
 *               totalOpinions: 25
 *               data:
 *                 - _id: "64a1b2c3d4e5f6789abcdef0"
 *                   fullName: "أحمد محمد العلي"
 *                   text: "خدمة ممتازة وسرعة في التوصيل، أنصح بالتعامل معهم"
 *                   rating: 5
 *                   createdAt: "2023-07-01T10:00:00.000Z"
 *                   updatedAt: "2023-07-01T10:00:00.000Z"
 *                 - _id: "64a1b2c3d4e5f6789abcdef1"
 *                   fullName: "سارة أحمد السعد"
 *                   text: "تجربة رائعة، السيارات بحالة ممتازة"
 *                   rating: 4
 *                   createdAt: "2023-06-30T15:30:00.000Z"
 *                   updatedAt: "2023-06-30T15:30:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.get("/getopinions", auth, restrictTo(userRole.ADMIN, userRole.SUPERVISOR, userRole.EMPLOYEE), getOpinions);

/**
 * @swagger
 * /opinion/{id}:
 *   delete:
 *     summary: Delete an opinion
 *     description: Delete a specific opinion by its ID (Admin only)
 *     tags: [Opinions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Opinion ID to delete
 *     responses:
 *       200:
 *         description: Opinion deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               status: "success"
 *               message: "تم حذف الرأي بنجاح"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions (Admin only)
 *       404:
 *         description: Opinion not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               status: "fail"
 *               message: "الرأي غير موجود"
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", auth, restrictTo(userRole.ADMIN), deleteOpinion);

module.exports = router;