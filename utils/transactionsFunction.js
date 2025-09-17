const Transaction = require("../models/transactions");
const APIERROR = require("./apiError");
const getNumOfTransByTypeAndRequestID=async (type,requestID)=>{

    try{

        return await Transaction.countDocuments({type,requestID})

    }catch (error){
        throw new APIERROR(400, error.message);
    }
    

}


module.exports={getNumOfTransByTypeAndRequestID}