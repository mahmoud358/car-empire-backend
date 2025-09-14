const { default: mongoose } = require("mongoose");
const Car = require("../models/car");
const APIERROR = require("../utils/apiError");
const carFunctions = require("../utils/carFunction");
const withTransaction = require("../utils/withTransaction");
const { getPagination } = require("../utils/generalFunction");

const addCar = async (req, res,next)=>{
  
    try{
   const newCar=   await withTransaction(async (session) => {
        const newCar= new Car(req.body)
      
     await Promise.all([
        newCar.save({ session }),
        carFunctions.addCarToSupplier(newCar,req.body.suppliers,session)
       ]) 
       return newCar;
      });
 
        res.status(201).json({status:"success",message:"تم اضافة السيارة بنجاح",data:newCar})

    }catch (error){
     
      next(new APIERROR(error.statusCode||400, error.message));
    }
}

const getAllCar=  async (req, res,next)=>{
    try{
      const{limit, page, skip}=getPagination(req.query);
    const filterObj= carFunctions.getfilterObj(req.query);
    console.log(filterObj);
    
      const [cars,total]= await Promise.all([
        Car.find(filterObj).skip(skip).limit(limit),
        Car.countDocuments(filterObj)
      ])
      
      res.status(200).json({status:"success",message:"تم عرض جميع الموردين",data:cars,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
          }
      })  

    }catch (error){
        next(new APIERROR(400,error.message))
    }
}

const getCarByID = async (req, res,next)=>{
  try{
    
    const car= await carFunctions.getCarByID(req.params.id);
    
    res.status(200).json({status:"success",message:"تم عرض السيارة بنجاح",data:car})

  }catch (error){
    next(new APIERROR(error.statusCode||400,error.message))
}

}






const updateCar = async (req, res, next) => {
  try {
    const car = await withTransaction(async (session) => {
      const updatedCar = req.body;

      // car قبل التعديل
      const carDoc = await carFunctions.getCarByID(req.params.id, session);
      const carBeforePlain = carDoc.toObject();

      // الموردين الجداد واللي يتمسحوا
      const { addSuppliers, deleteSuppliers, remainSuppliers } =
        carFunctions.getUpdatedSuppliers(carDoc.suppliers, updatedCar.suppliers);

      // نحدث باقي الحقول
      carFunctions.updateCarFields(carDoc, updatedCar);

      // مقارنة قبل وبعد التعديل
      const isDifferent = carFunctions.compareCarAfterAndBeforEdite(
        carBeforePlain,
        carDoc,
        addSuppliers,
        remainSuppliers
      );

      const ops = [carDoc.save({ session })];

      // ✅ 1. إضافة الموردين الجداد بالبيانات الجديدة
      if (addSuppliers.length > 0) {
        ops.push(carFunctions.addCarToSupplier(carDoc, addSuppliers, session));
      }

      // ✅ 2. حذف الموردين
      if (deleteSuppliers.length > 0) {
        ops.push(
          carFunctions.deleteCarFromSupplier(carDoc, deleteSuppliers, session)
        );
      }

      // ✅ 3. تحديث الموردين الباقيين لو فيه اختلاف
      if (isDifferent) {
        ops.push(
          carFunctions.updateCarInSuppliers(carDoc, remainSuppliers, session)
        );
      }

      await Promise.all(ops);
      return carDoc;
    });

    res.status(200).json({
      status: "success",
      message: "تم تحديث السيارة بنجاح",
      data: car,
    });
  } catch (error) {
    next(new APIERROR(error.statusCode || 400, error.message));
  }
};

const deleteCar = async (req, res, next) => {
  try {
    await withTransaction(async (session) => {
      const car = await carFunctions.getCarByID(req.params.id, session);

      await Promise.all([
        Car.deleteOne({ _id: car._id }, { session }),
        carFunctions.deleteCarFromSupplier(car, car.suppliers, session),
      ]);
    });

    res.status(200).json({
      status: "success",
      message: "تم حذف السيارة بنجاح",
    });
  } catch (error) {
    next(error);
  }
};

module.exports={addCar,getAllCar,getCarByID,updateCar,deleteCar}
