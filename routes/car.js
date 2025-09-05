const express = require("express");
const carControlls= require("../controllers/car")
// const { auth,restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");
const router=express.Router()

router.get("/",carControlls.getAllCar)
router.post("/add",carControlls.addCar)
router.get("/:id",carControlls.getCarByID)
router.patch("/update/:id",carControlls.updateCar)
router.delete("/delete/:id",carControlls.deleteCar)

module.exports=router