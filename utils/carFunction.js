const Car = require("../models/car");
const Supplier = require("../models/supplier");
const APIERROR = require("./apiError");


const addCarToSupplier = async (car, suppliersID, session) => {


   const carObjthatAddTosupplier={
    carID: car._id,
          brand:  car.specifications.brand?.en ,
          model:  car.specifications.model?.en ,
          category:  car.specifications.category?.en ,
   }

      const suppliers = await Supplier.updateMany(
        { _id: { $in: suppliersID } },
        { $addToSet: { cars: carObjthatAddTosupplier } },
        { session }
      );
      
      if (suppliers.matchedCount != suppliersID.length) {
        throw new APIERROR(404, "المورد غير موجود");
      }
      return suppliers;
    
  };
  
  const deleteCarFromSupplier = async (car, suppliersID, session) => {

    const suppliers = await Supplier.updateMany(
      { _id: { $in: suppliersID } },
      { $pull: { cars: { carID: car._id } } }, // ✅ حذف بالـ carID فقط
      { session }
    );
    
    if (suppliers.matchedCount === 0) {
      throw new APIERROR(404, "المورد غير موجود");
    }
    return suppliers;
  };

  const compareCarAfterAndBeforEdite = (carBefore, carAfter,addSuppliers,remainSuppliers) => {

    const oldSpec = carBefore.specifications;
    const newSpec = carAfter.specifications;
  
    // نشوف لو فيه اختلاف
    const changed =
      oldSpec.brand?.en !== newSpec.brand?.en ||
      oldSpec.model?.en !== newSpec.model?.en ||
      oldSpec.category?.en !== newSpec.category?.en;
  
    // لو مفيش اختلاف أو فيه موردين جداد → منعملش Update
    if (!changed || (addSuppliers.length > 0 && remainSuppliers.length===0)) {
      return false;
    }else{
      return true;
    }
    
  }
  // ✅ تحديث بيانات العربية داخل الموردين بس لو فيه تغيير ومفيش إضافة جديدة

const updateCarInSuppliers = async (updateCar, suppliersID, session) => {
  console.log("session in updateCarInSuppliers:", session?.constructor?.name);

  // نفلتر بالموردين اللي لسه موجودين
  const result = await Supplier.updateMany(
    { _id: { $in: suppliersID }, "cars.carID": updateCar._id },
    {
      $set: {
        "cars.$.brand": updateCar.specifications.brand?.en,
        "cars.$.model": updateCar.specifications.model?.en,
        "cars.$.category": updateCar.specifications.category?.en,
      },
    },
    { session }
  );

  return result; // ✅ Promise واحدة
};

  
// ✅ استخراج الموردين اللي هيتضافوا أو يتمسحوا بكفاءة أعلى
const getUpdatedSuppliers = (currentSuppliers, updatedSupplierIds) => {
    const currentSet = new Set(currentSuppliers.map(id => id.toString()));
    const updatedSet = new Set(updatedSupplierIds.map(id => id.toString()));
  
    const addSuppliers = [...updatedSet]
      .filter(id => !currentSet.has(id))
  
    const deleteSuppliers = [...currentSet]
      .filter(id => !updatedSet.has(id))

      const remainSuppliers = [...currentSet]
     .filter(id => updatedSet.has(id));

    return { addSuppliers, deleteSuppliers,remainSuppliers };
  };
   
  // 3️⃣ تحديث باقي الحقول
  const updateCarFields = (car, updatedCar) => {
    
    
    for (const key in updatedCar) {
      if (updatedCar.hasOwnProperty(key) ) {
        if(key==="specifications"){
          for (const key2 in updatedCar[key]) {

            if (updatedCar[key].hasOwnProperty(key2)) {
              car[key][key2] = updatedCar[key][key2];
            }
          }
        }else{
          car[key] = updatedCar[key];
        }
        
      }
    }
    return car;
  };
  
  
  

const getfilterObj= (query)=>{

    const filterObj={};
    if(query.minPrice&&query.maxPrice){
        filterObj.cashPrice={$gte:query.minPrice,$lte:query.maxPrice};
    }else if(query.minPrice){
        filterObj.cashPrice={$gte:query.minPrice};
    }else if(query.maxPrice){
        filterObj.cashPrice={$lte:query.maxPrice};
    }

    if(query.minYear&&query.maxYear){
        filterObj["specifications.year"]={$gte:query.minYear,$lte:query.maxYear};
    }else if(query.minYear){
        filterObj["specifications.year"]={$gte:query.minYear};
    }else if(query.maxYear){
        filterObj["specifications.year"]={$lte:query.maxYear};
    }

    // if(query.suppliers){
    //     filterObj.suppliers={$in:query.suppliers};
    // }

    if(query.brand){
        filterObj["specifications.brand.en"]=query.brand;
    }
    if(query.model){
        filterObj["specifications.model.en"]=query.model;
    }
    if(query.showInHome){
      filterObj.showInHome=query.showInHome;
    }

    return filterObj;
}

const getCarByID = async (id, session) => {

  const car = await Car.findById(id).session(session);
  if (!car) {
    throw new APIERROR(404, "السيارة غير موجودة");
  }
  return car;
};

module.exports={addCarToSupplier,getfilterObj,getCarByID,deleteCarFromSupplier,getUpdatedSuppliers,updateCarFields,updateCarInSuppliers,compareCarAfterAndBeforEdite}