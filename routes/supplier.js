const express = require("express");
const supplierControlls= require("../controllers/supplier")
// const { auth,restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");
const router=express.Router()

router.get("/",supplierControlls.getAllSupplier)
router.post("/add",supplierControlls.addSupplier)
router.get("/:id",supplierControlls.getSupplierByID)
router.patch("/update/:id",supplierControlls.updateSupplier)
router.delete("/delete/:id",supplierControlls.deleteSupplier)

module.exports=router

