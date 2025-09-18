const express = require("express");
const router = express.Router();
const { getUserLoginLogs } = require("../controllers/loginLog");
const { auth, restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginLog:
 *       type: object
 *       required:
 *         - userId
 *         - country
 *         - city
 *         - latitude
 *         - longitude
 *         - ip
 *         - loginTime
 *       properties:
 *         _id:
 *           type: string
 *           description: Log ID
 *         userId:
 *           type: string
 *           description: User ID related to this login
 *         country:
 *           type: string
 *           description: Country name
 *         city:
 *           type: string
 *           description: City name
 *         latitude:
 *           type: string
 *           description: Latitude in decimal degrees
 *         longitude:
 *           type: string
 *           description: Longitude in decimal degrees
 *         ip:
 *           type: string
 *           description: IPv4 address
 *         browser:
 *           type: string
 *           description: Browser user agent or name
 *         loginTime:
 *           type: string
 *           format: date-time
 *           description: Login time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     LoginLogsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         logs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LoginLog'
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
 * /login-log/{userId}:
 *   get:
 *     summary: Get login logs for a user
 *     description: Retrieve paginated login logs for a specific user (Admin and Supervisor only)
 *     tags: [Login Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
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
 *         description: Login logs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginLogsResponse'
 *       400:
 *         description: Invalid userId
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.get("/:userId", auth, restrictTo(userRole.ADMIN, userRole.SUPERVISOR), getUserLoginLogs);

module.exports = router;
