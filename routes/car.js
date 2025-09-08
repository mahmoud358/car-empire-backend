const express = require("express");
const carControlls= require("../controllers/car")
// const { auth,restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");
const router=express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - name
 *         - status
 *         - specifications
 *         - cashPrice
 *         - installmentPrice
 *         - image
 *         - suppliers
 *       properties:
 *         name:
 *           type: object
 *           properties:
 *             ar:
 *               type: string
 *             en:
 *               type: string
 *         status:
 *           type: object
 *           properties:
 *             ar:
 *               type: string
 *               enum: [جديدة, استعمال]
 *             en:
 *               type: string
 *               enum: [new, use]
 *         specifications:
 *           type: object
 *           properties:
 *             brand:
 *               type: object
 *               properties:
 *                 ar:
 *                   type: string
 *                 en:
 *                   type: string
 *             model:
 *               type: object
 *               properties:
 *                 ar:
 *                   type: string
 *                 en:
 *                   type: string
 *             category:
 *               type: object
 *               properties:
 *                 ar:
 *                   type: string
 *                 en:
 *                   type: string
 *             body:
 *               type: object
 *               properties:
 *                 ar:
 *                   type: string
 *                 en:
 *                   type: string
 *             transmission:
 *               type: object
 *               properties:     
 *                 ar:
 *                   type: string
 *                 en:
 *                   type: string
 *             fuelType:
 *               type: object
 *               properties:  
 *                 ar:
 *                   type: string
 *                 en:
 *                   type: string
 *             mileage:
 *               type: object
 *               properties:
 *                 ar:
 *                   type: string
 *                 en:
 *                   type: string
 *             drivetrain:
 *               type: object
 *               properties:
 *                 ar:
 *                   type: string
 *                 en:
 *                   type: string
 *             engine:
 *               type: object
 *               properties:
 *                 ar:
 *                   type: string
 *                 en:
 *                   type: string
 *             origin:
 *               type: object
 *               properties:
 *                 ar:
 *                   type: string
 *                 en:
 *                   type: string
 *             exteriorColor:
 *               type: object
 *               properties:
 *                 ar:
 *                   type: string
 *                 en:
 *                   type: string
 *             interiorColor:
 *               type: object
 *               properties:
 *                 ar:
 *                   type: string
 *                 en:
 *                   type: string
 *             turbo:
 *               type: object
 *               properties:
 *                 ar:
 *                   type: string
 *                 en:
 *                   type: string
 *             year:
 *               type: number
 *         cashPrice:
 *           type: number
 *         installmentPrice:
 *           type: number
 *         image:
 *           type: string
 *         suppliers:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /car:
 *   get:
 *     summary: Get all cars
 *     tags: [Cars]
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
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of cars
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
 *                     $ref: '#/components/schemas/Car'
 */
router.get("/",carControlls.getAllCar)
/**
 * @swagger
 * /car/add:
 *   post:
 *     summary: Add a new car
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Car created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/add",carControlls.addCar)
/**
 * @swagger
 * /car/{id}:
 *   get:
 *     summary: Get car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car details
 *       404:
 *         description: Car not found
 */
router.get("/:id",carControlls.getCarByID)
/**
 * @swagger
 * /car/update/{id}:
 *   patch:
 *     summary: Update car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: Car updated successfully
 *       404:
 *         description: Car not found
 */
router.patch("/update/:id",carControlls.updateCar)
/**
 * @swagger
 * /car/delete/{id}:
 *   delete:
 *     summary: Delete car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found
 */
router.delete("/delete/:id",carControlls.deleteCar)

module.exports=router