const express = require("express");
const transactionControlls= require("../controllers/transactions")
const { auth,restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");
const router=express.Router()

router.get("/:type/:requestID",auth,restrictTo(userRole.ADMIN,userRole.SUPERVISOR),transactionControlls.getAllTransactions)

router.post("/add",auth,restrictTo(userRole.ADMIN,userRole.SUPERVISOR,userRole.EMPLOYEE),transactionControlls.createTransaction)


module.exports=router