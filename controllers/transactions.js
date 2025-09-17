const Transaction = require("../models/transactions");
const APIERROR = require("../utils/apiError") ;
const reqBuyingFunctions=require("../utils/requestBuyingFunction");
const withTransaction = require("../utils/withTransaction");
const { getPagination } = require("../utils/generalFunction");
const transFun= require("../utils/transactionsFunction")

const createTransaction= async (req, res, next)=>{

    try{
        const transaction= await withTransaction(async (session)=>{
            const newTrans={...req.body};

            const request= await reqBuyingFunctions.getRequestBuyingByID(newTrans.requestID,session)

            reqBuyingFunctions.checkValidityForUpdate(req.role,req.id,request.employeeId)

            const [transactionDoc]= await Promise.all([
                Transaction.create([{
                    ...newTrans,
                    employeeID:req.id
                }],{session}),
                reqBuyingFunctions.addTransactionToRequest(request._id,newTrans.type,newTrans.amount,session)
            ])
           

            return transactionDoc;
        }
        )

        res.status(201).json({ status: "success",message: "تم انشاء المعاملة بنجاح  ",data:transaction });


    }catch (error){
        next(new APIERROR(error.statusCode||400,error.message)) 
    }

}

const getAllTransactions=async (req, res, next)=>{

    try{
        const {type,requestID}=req.params
        const {limit,page,skip}=getPagination(req.query);
        const {transactions,totalItems,totalPages}= await transFun.getTransactionsByTypeAndRequestID(type,requestID,skip,limit)
    
         

        res.status(201).json({ status: "success",message: "تم جلب المعاملات بنجاح  ",
            data:transactions,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
              }
        });


    }catch (error){
        next(new APIERROR(error.statusCode||400,error.message)) 
    }

}

module.exports={createTransaction,getAllTransactions}