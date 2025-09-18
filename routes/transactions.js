const express = require("express");
const transactionControlls= require("../controllers/transactions")
const { auth,restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");
const router=express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Transaction ID
 *         type:
 *           type: string
 *           enum: [expense, income]
 *           description: Transaction type
 *         amount:
 *           type: number
 *           minimum: 1
 *           description: Transaction amount
 *         date:
 *           type: string
 *           format: date
 *           description: Transaction date (YYYY-MM-DD)
 *         additionalInfo:
 *           type: string
 *           description: Additional information about the transaction
 *         requestID:
 *           type: string
 *           description: Related RequestBuying ID
 *         employeeID:
 *           type: string
 *           description: Employee who created the transaction
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateTransactionRequest:
 *       type: object
 *       required: [type, amount, date, requestID]
 *       properties:
 *         type:
 *           type: string
 *           enum: [expense, income]
 *         amount:
 *           type: number
 *           minimum: 1
 *         date:
 *           type: string
 *           format: date
 *         additionalInfo:
 *           type: string
 *         requestID:
 *           type: string
 *     TransactionsListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Transaction'
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
 * /transaction/{type}/{requestID}:
 *   get:
 *     summary: Get transactions by type and request ID
 *     description: Retrieve paginated transactions filtered by type (expense/income) and RequestBuying ID. Accessible by Admin and Supervisor.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [expense, income]
 *         description: Transaction type
 *       - in: path
 *         name: requestID
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
 *         description: Transactions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionsListResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.get("/:type/:requestID",auth,restrictTo(userRole.ADMIN,userRole.SUPERVISOR),transactionControlls.getAllTransactions)

/**
 * @swagger
 * /transaction/add:
 *   post:
 *     summary: Create a new transaction
 *     description: Create a new transaction and update related RequestBuying totals. Accessible by Admin, Supervisor, and Employee (with assignment restrictions).
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTransactionRequest'
 *           example:
 *             type: "expense"
 *             amount: 2500
 *             date: "2025-09-18"
 *             additionalInfo: "رسوم نقل ملكية"
 *             requestID: "64a1b2c3d4e5f6789abcdef0"
 *     responses:
 *       201:
 *         description: Transaction created successfully
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
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Validation error or permission issue
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.post("/add",auth,restrictTo(userRole.ADMIN,userRole.SUPERVISOR,userRole.EMPLOYEE),transactionControlls.createTransaction)


module.exports=router