const express = require("express");
const supplierControlls= require("../controllers/supplier")
// const { auth,restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");
const router=express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       required:
 *         - name
 *         - phoneNumber
 *         - funding
 *       properties:
 *         name:
 *           type: string
 *           minLength: 5
 *         phoneNumber:
 *           type: string
 *           pattern: ^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$
 *         funding:
 *           type: array
 *           items:
 *             type: string
 *         cars:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of car IDs associated with this supplier
 */

/**
 * @swagger
 * /supplier:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: List of all suppliers
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Supplier'
 */
router.get("/",supplierControlls.getAllSupplier)
/**
 * @swagger
 * /supplier/add:
 *   post:
 *     summary: Add a new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       201:
 *         description: Supplier created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/add",supplierControlls.addSupplier)
/**
 * @swagger
 * /supplier/{id}:
 *   get:
 *     summary: Get supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier details
 *       404:
 *         description: Supplier not found
 */
router.get("/:id",supplierControlls.getSupplierByID)
/**
 * @swagger
 * /supplier/update/{id}:
 *   patch:
 *     summary: Update supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supplier'
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       404:
 *         description: Supplier not found
 */
router.patch("/update/:id",supplierControlls.updateSupplier)
/**
 * @swagger
 * /supplier/delete/{id}:
 *   delete:
 *     summary: Delete supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier deleted successfully
 *       404:
 *         description: Supplier not found
 */
router.delete("/delete/:id",supplierControlls.deleteSupplier)

module.exports=router

