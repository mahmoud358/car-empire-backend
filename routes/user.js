const express = require("express");
const router = express.Router();
const { auth, restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  login
} = require("../controllers/user");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - userName
 *         - phoneNumber
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           description: User's full name
 *         userName:
 *           type: string
 *           description: User's username
 *         email:
 *           type: string
 *           description: User's email address
 *         phoneNumber:
 *           type: string
 *           description: User's phone number
 *           match: /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/
 *         image:
 *           type: string
 *           description: URL to user's profile image
 *         password:
 *           type: string
 *           description: User's password
 *         role:
 *           type: string
 *           enum: [admin, supervisor, employee]
 *           description: User's role
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post("/", auth, restrictTo(userRole.ADMIN, userRole.SUPERVISOR), createUser);
/**
* @swagger
* /user:
*   get:
*     summary: Get all users
*     tags: [Users]
*     responses:
*       200:
*         description: List of all users
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/User'
*       404:
*         description: No users found
*/
router.get("/", getAllUsers);
/**
* @swagger
* /user/{id}:
*   get:
*     summary: Get user by ID
*     tags: [Users]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: string
*         description: User ID
*     responses:
*       200:
*         description: User details
*       404:
*         description: User not found
*/
router.get("/:id", getUserById);
/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update user by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.put("/:id", updateUserById);
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", auth, restrictTo(userRole.ADMIN, userRole.SUPERVISOR), deleteUserById);
/**
* @swagger
* /user/login:
*   post:
*     summary: User login
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - phoneNumber
*               - password
*             properties:
*               phoneNumber:
*                 type: string
*               password:
*                 type: string
*     responses:
*       200:
*         description: Login successful
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 token:
*                   type: string
*       400:
*         description: Invalid credentials
*/
router.post("/login", login);
module.exports = router;