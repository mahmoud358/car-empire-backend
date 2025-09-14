const RequestBuying = require("../models/requestBuying");
const APIERROR = require("../utils/apiError") ;
const { getPagination } = require("../utils/generalFunction");
const reqBuyingFunctions=require("../utils/requestBuyingFunction")


 const createRequestBuying=async(req, res, next)=>{
    try {
        const request = new RequestBuying(req.body);
        await request.save();
        res.status(201).json({ status: "success",message: "تم انشاء الطلب بنجاح  ",data:request });
      } catch (error) {
        next(new APIERROR(400, error.message));
      }

}


 const getAllRequestBuyingByType=async(req, res, next)=>{
    try {
      const {limit,page,skip}=getPagination(req.query);
      const filterObj= reqBuyingFunctions.getfilterObj(req.query,req.params.type) ;

      const ops=[RequestBuying.find({ ...filterObj}).skip(skip).limit(limit),
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
    const request = await reqBuyingFunctions.getRequestBuyingByID(req.params.id);

    const suppliers= await reqBuyingFunctions.getSuppliersWhoHaveRequestCar(request.car)
    

    res.status(200).json({ status: "success", message: "تم جلب الطلب بنجاح", 
      data: {
        request,
        suppliers
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
   
    
    reqBuyingFunctions.checkValidityForUpdate(req.role,req.id,request);

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
    updateRequestBuying
}
