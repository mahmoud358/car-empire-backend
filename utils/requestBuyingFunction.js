const RequestBuying = require("../models/requestBuying");
const Supplier = require("../models/supplier");
const APIERROR = require("./apiError");

const getRequestBuyingByID= async (id,session)=>{
    try{
        const request = await RequestBuying.findById(id,{},{session});
        if (!request) {
            throw new APIERROR(404, "الطلب غير موجود");
        }
        return request
    }catch (error){
        throw new APIERROR(400, error.message);
    }
}

const checkValidityForUpdate=(userRole,userID,employeeId)=>{
    
    if(userRole==="employee"&&userID!==employeeId?.toString()){
        throw new APIERROR(403, "ليس لديك صلاحية لاتخاذ هذا الاجراء");

    }

}
 const checkReqBuyingFields=(updatedreqBuying,requestType)=>{

    if (updatedreqBuying.companyData && requestType !== "corporate-finance") {
        throw new APIERROR(400,"لا يمكن إدخال بيانات الشركات إلا إذا كان نوع الطلب تمويل شركات");
      }
      if (updatedreqBuying.personalData && requestType !== "personal-finance") {
        throw new APIERROR(400,"لا يمكن إدخال بيانات الأفراد إلا إذا كان نوع الطلب تمويل شخصى");
      }

}

const updateReqBuyingFields = (reqBuying, updatedreqBuying) => {
    
    
    checkReqBuyingFields(updatedreqBuying,reqBuying.type);
    
    for (const key in updatedreqBuying) {
      if (updatedreqBuying.hasOwnProperty(key)&& key!="employeeId" && key!="type" ) {
        if(key==="companyData"||key==="personalData"||key==="car"){
            for (const key2 in updatedreqBuying[key]) {

                if (updatedreqBuying[key].hasOwnProperty(key2)) {
                  reqBuying[key][key2] = updatedreqBuying[key][key2];
                }
              }
            }else{
                reqBuying[key] = updatedreqBuying[key];
        
              }
      }
    }
    return reqBuying;
  };

  const getfilterObj= (query,type)=>{

    const filterObj={};
    if(type){
        filterObj.type=type;
    }
    if(query.employeeId){
        filterObj.employeeId=query.employeeId;
    }
    if(query.status){
        filterObj.status=query.status;
    }
    if(query.requestNum){
        filterObj.requestNum=query.requestNum;
    }
    if(query.fullName){
        filterObj.fullName=query.fullName;
    }
    if(query.FinancingEntity){
        filterObj.FinancingEntity=query.FinancingEntity;
    }

    if(query.minCreatedAt&&query.maxCreatedAt){
        filterObj.createdAt={$gte:query.minCreatedAt,$lte:query.maxCreatedAt};
    }else if(query.minCreatedAt){
        filterObj.createdAt={$gte:query.minCreatedAt};
    }else if(query.maxCreatedAt){
        filterObj.createdAt={$lte:query.maxCreatedAt};
    }

    if(query.phoneNumber){
      filterObj.phoneNumber=query.phoneNumber;
    }
    
    return filterObj;
}

// const getSuppliersWhoHaveRequestCar = async (car) => {
  
//   const [suppliers,total]= await promis
//   Supplier.find({
//         "cars.brand": car.brand,
//         "cars.model": car.model,
//         // "cars.category": car.category,
//   }).select("name funding").limit(10);

  
//   return suppliers;
// };

const addTransactionToRequest= async (requestID,transType,transAmount,session)=>{

    let updateObj = {};

  if (transType === "income") {
    updateObj = { $inc: { totalIncomes: transAmount } };
  } else if (transType === "expense") {
    updateObj = { $inc: { totalExpenses: transAmount } };
  }


  const request = await RequestBuying.findByIdAndUpdate(
    requestID,
    updateObj,
    { session, new: true } // new:true => يرجع الدوكيومنت بعد التحديث
  );
  

}
  
  
  

module.exports={
    getRequestBuyingByID,
    checkValidityForUpdate,
    updateReqBuyingFields,
    getfilterObj,
    // getSuppliersWhoHaveRequestCar,
    addTransactionToRequest
}