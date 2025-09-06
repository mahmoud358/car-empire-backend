const express = require("express");
const router = express.Router();
const { auth, restrictTo } = require("../middlewares/auth");
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJobById,
  deleteJobById,
} = require("../controllers/job");

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - title
 *         - details
 *         - responsibilities
 *         - requirements
 *       properties:
 *         title:
 *           type: string
 *           minLength: 15
 *           maxLength: 200
 *         details:
 *           type: string
 *         responsibilities:
 *           type: array
 *           items:
 *             type: string
 *           minItems: 1
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *           minItems: 1
 */

/**
 * @swagger
 * /job:
 *   post:
 *     summary: Create a new job posting
 *     security:
 *       - bearerAuth: []
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/",auth, restrictTo("admin"), createJob);
/**
 * @swagger
 * /job:
 *   get:
 *     summary: Get all job postings
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of all job postings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 */
router.get("/", getAllJobs);
/**
 * @swagger
 * /job/{id}:
 *   get:
 *     summary: Get job posting by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job posting details
 *       404:
 *         description: Job not found
 */
router.get("/:id", getJobById);
/**
 * @swagger
 * /job/{id}:
 *   put:
 *     summary: Update job posting by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       404:
 *         description: Job not found
 */
router.put("/:id",auth, restrictTo("admin"), updateJobById);
/**
 * @swagger
 * /job/{id}:
 *   delete:
 *     summary: Delete job posting by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 */
router.delete("/:id",auth, restrictTo("admin"), deleteJobById);
module.exports = router;
