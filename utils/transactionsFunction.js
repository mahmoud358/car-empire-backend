const { default: mongoose } = require("mongoose");
const Transaction = require("../models/transactions");
const APIERROR = require("./apiError");

// const findAllTransByTypeAndRequestID= async (type,requestID,skip=0,limit=10)=>{
//    console.log("skip",skip);
//    console.log("limit",limit);
   
//     try{

//         return await Transaction.find({type,requestID}).skip(skip).limit(limit).sort({createdAt:-1})

//     }catch (error){
//         throw new APIERROR(400, error.message);
//     } 
// }

// const getNumOfTransByTypeAndRequestID=async (type,requestID)=>{

//     try{

//         return await Transaction.countDocuments({type,requestID})

//     }catch (error){
//         throw new APIERROR(400, error.message);
//     }
    

// }

const getTransactionsByTypeAndRequestID = async (type, requestID, skip = 0, limit = 10) => {
    try {
      const pipeline = [
        {
          $match: { type, requestID: new mongoose.Types.ObjectId(requestID) }
        },
        { $sort: { createdAt: -1 } }, // الأحدث الأول
        {
          $facet: {
            transactions: [
              { $skip: skip },
              { $limit: limit },
              { $project: { amount: 1, date: 1, additionalInfo: 1, employeeID: 1 } }
            ],
            totalCount: [
              { $count: "count" }
            ]
          }
        }
      ];
  
      const result = await Transaction.aggregate(pipeline);
  
      return {
        transactions: result[0].transactions,
        totalItems: result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0,
        totalPages: result[0].totalCount.length > 0 ? Math.ceil(result[0].totalCount[0].count / limit) : 0,
      };
  
    } catch (error) {
      throw new APIERROR(400, error.message);
    }
  };
  


module.exports={
    // getNumOfTransByTypeAndRequestID,
    // findAllTransByTypeAndRequestID,
    getTransactionsByTypeAndRequestID

}