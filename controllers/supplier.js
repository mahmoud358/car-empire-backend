const Supplier = require("../models/supplier");
const APIERROR = require("../utils/apiError");
const supplierFun = require("../utils/supplierFun");


const withTransaction = require("../utils/withTransaction");






const addSupplier = async (req, res,next) => {
  const { name, phoneNumber, funding } = req.body;
  try {
    const supplier = await Supplier.create({
      name,
      phoneNumber,
      funding
    });
    res.status(201).json({ status: "success", message: " تم اضافة المورد بنجاح ", data: supplier }); 
  }catch (error) {
    next(new APIERROR(400,error.message))
  }
}

const getAllSupplier = async (req, res,next)=>{
    try{
      const suppliers= await Supplier.find();
    //   const suppliers= await Supplier.find().populate("cars");
      res.status(200).json({status:"success",message:"تم عرض جميع الموردين",data:suppliers})  

    }catch (error){
        next(new APIERROR(400,error.message))
    }
}

const getSupplierByID = async(req, res,next)=>{
  try{
    const supplier= await Supplier.findById(req.params.id);
    if(!supplier){
      return next(new APIERROR(404,"المورد غير موجود"))
    }
    res.status(200).json({status:"success",message:"تم عرض المورد",data:supplier}) 
  }catch (error){
    next(new APIERROR(400,error.message))
  }
 
}

const updateSupplier = async(req, res,next)=>{
  try{
    const supplier= await Supplier.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(!supplier){
      return next(new APIERROR(404,"المورد غير موجود"))
    } 
    res.status(200).json({status:"success",message:"تم تعديل المورد",data:supplier})
  }catch (error){
    next(new APIERROR(400,error.message))
  }
}

const deleteSupplier = async (req, res,next)=>{
  try{
     await withTransaction(async (session) => {
      const [supplier] = await Promise.all([
       Supplier.findByIdAndDelete(req.params.id,{session}),
       supplierFun.deleteSupplierFromCar(req.params.id,session)
      ])
      if(!supplier){
        return next(new APIERROR(404,"المورد غير موجود"))
      }
     })
   
    res.status(200).json({status:"success",message:"تم حذف المورد"})
  }catch (error){
    next(new APIERROR(400,error.message))
  }
}

module.exports={addSupplier,getAllSupplier,getSupplierByID,updateSupplier,deleteSupplier}