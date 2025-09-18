const RequestBuying = require("../models/requestBuying");
const APIERROR = require("../utils/apiError") ;
const { getAllCommentByRequestID } = require("../utils/commentFunction");
const { getPagination } = require("../utils/generalFunction");
const reqBuyingFunctions=require("../utils/requestBuyingFunction");
const { getSuppliersWhoHaveRequestCar } = require("../utils/supplierFun");
const { getTransactionsByTypeAndRequestID } = require("../utils/transactionsFunction");



 const createRequestBuying=async(req, res, next)=>{
    try {
        const request = new RequestBuying(req.body);
        await request.save();
        res.status(201).json({ status: "success",message: "تم انشاء الطلب بنجاح  ",data:request });
      } catch (error) {
        next(new APIERROR(400, error.message));
      }

}

const getAllRequestBuyingByPhone=async(req, res, next)=>{
    try {
      const {limit,page,skip}=getPagination(req.query);
     const result= await RequestBuying.aggregate([
      {
        $match: { phoneNumber: req.params.phoneNumber  }
      },
      { $sort: { createdAt: -1 } }, // الأحدث الأول
      {
        $facet: {
          requests: [
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      }
     ])

     res.status(200).json({ status: "success", message: "تم جلب جميع الطلبات بنجاح", 
      data: {
        requests: result[0].requests||[],
      },
      pagination: {
        currentPage: page,
        totalPages: result[0].totalCount.length > 0 ? Math.ceil(result[0].totalCount[0].count / limit) : 0,
        totalItems: result[0].totalCount.length > 0? result[0].totalCount[0].count : 0,
      }
       });

    }catch(error){
        next(new APIERROR(500, error.message));
    }
 
}

const getNumsOfTypeAndStatus=async(req, res, next)=>{
    try {
       
      const requestsNums= await RequestBuying.aggregate([
        {
          $facet:{
            status:[
              {
                $group:{
                  _id:"$status",
                  count:{$sum:1}
                }
              }
            ],
            type:[
              {
                $group:{
                  _id:"$type",
                  count:{$sum:1}
                }
              }
            ]
          }
        }

      ])      
        res.status(200).json({ status: "success", message: "تم جلب عدد الطلبات بنجاح", data: requestsNums });
      } catch (error) {
       next(new APIERROR(500, error.message));
      }
}

 const getAllRequestBuyingByType=async(req, res, next)=>{
    try {
      const {limit,page,skip}=getPagination(req.query);
      const filterObj= reqBuyingFunctions.getfilterObj(req.query,req.params.type) ;

      const ops=[RequestBuying.find({ ...filterObj}).skip(skip).limit(limit).sort({createdAt:-1}),
      RequestBuying.countDocuments({...filterObj}),
      ]

      if (Object.keys(filterObj).length === 1 && filterObj.type){
        ops.push(
          RequestBuying.aggregate([
            { $match: { type: req.params.type } },
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ])
        )
      }
        const [requests,total,statusData] = await Promise.all(ops)

        res.status(200).json({ status: "success", message: "تم جلب جميع الطلبات بنجاح", 
          data: {
            requests,
            statusData: statusData || [],
          },
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
          }
           });
      } catch (error) {
        next(new APIERROR(400, error.message));
      }
}

const getRequestBuyingByID= async (req, res, next)=>{

  try{

    const {id}=req.params
    const request = await reqBuyingFunctions.getRequestBuyingByID(id);

    const [suppliersData,commentsData,expensesData,incomesData]= await Promise.all([
      getSuppliersWhoHaveRequestCar(request.car),
      getAllCommentByRequestID(id,10,0),
      getTransactionsByTypeAndRequestID("expense",id),
      getTransactionsByTypeAndRequestID("income",id),
    ])
    res.status(200).json({ status: "success", message: "تم جلب الطلب بنجاح", 
      data: {
        request,
        commentsData,
        suppliersData,
        expensesData,
        incomesData
      } });


  }catch (error) {
    next(new APIERROR(error.statusCode||400, error.message));
  }
}

const AssignRequestToEmployee=async(req, res, next)=>{

  try{
    if(req.body.employeeId==undefined){
      return next(new APIERROR(400, "يجب ارسال الموظف"));
    }
    const request = await RequestBuying.findByIdAndUpdate(req.params.id, { employeeId: req.body.employeeId , status:"processing"}, { new: true, runValidators: true });
    if (!request) {
      return next(new APIERROR(404, "الطلب غير موجود"));
    }

    res.status(200).json({ status: "success", message: "تم تخصيص الطلب بنجاح", data: request });
  }catch (error) {
    next(new APIERROR(400, error.message));
  }
}

const updateRequestBuying=async(req, res, next)=>{

  try{
    const request = await reqBuyingFunctions.getRequestBuyingByID(req.params.id);
   
    
    reqBuyingFunctions.checkValidityForUpdate(req.role,req.id,request.employeeId);

    reqBuyingFunctions.updateReqBuyingFields(request,req.body)
    

    await request.save()
  
    res.status(200).json({ status: "success", message: "تم تخصيص الطلب بنجاح", data: request });
  }catch (error) {
    next(new APIERROR(400, error.message));
  }
}

module.exports={
    createRequestBuying,
    getAllRequestBuyingByType,
    getRequestBuyingByID,
    AssignRequestToEmployee,
    updateRequestBuying,
    getNumsOfTypeAndStatus,
    getAllRequestBuyingByPhone
}
