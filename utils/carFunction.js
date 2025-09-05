const Car = require("../models/car");
const Supplier = require("../models/supplier");
const APIERROR = require("./apiError");


const addCarToSupplier = async (carID, suppliersID, session) => {
   
      const suppliers = await Supplier.updateMany(
        { _id: { $in: suppliersID } },
        { $addToSet: { cars: carID } },
        { session }
      );
      
      if (suppliers.matchedCount != suppliersID.length) {
        throw new APIERROR(404, "المورد غير موجود");
      }
      return suppliers;
    
  };
  
  const deleteCarFromSupplier = async (carID, suppliersID, session) => {
    const suppliers = await Supplier.updateMany(
      { _id: { $in: suppliersID } },
      { $pull: { cars: carID } },
      { session }
    );
    if (suppliers.matchedCount === 0) {
      throw new APIERROR(404, "المورد غير موجود");
    }
    return suppliers;
  };
  
// ✅ استخراج الموردين اللي هيتضافوا أو يتمسحوا بكفاءة أعلى
const getUpdatedSuppliers = (currentSuppliers, updatedSupplierIds) => {
    const currentSet = new Set(currentSuppliers.map(id => id.toString()));
    const updatedSet = new Set(updatedSupplierIds.map(id => id.toString()));
  
    const addSuppliers = [...updatedSet]
      .filter(id => !currentSet.has(id))
  
    const deleteSuppliers = [...currentSet]
      .filter(id => !updatedSet.has(id))
  
    return { addSuppliers, deleteSuppliers };
  };
   
  // 3️⃣ تحديث باقي الحقول
  const updateCarFields = (car, updatedCar) => {
    
    
    for (const key in updatedCar) {
      if (updatedCar.hasOwnProperty(key) ) {
        car[key] = updatedCar[key];
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

    return filterObj;
}

const getCarByID = async (id, session) => {
  const car = await Car.findById(id).session(session);
  if (!car) {
    throw new APIERROR(404, "السيارة غير موجودة");
  }
  return car;
};

module.exports={addCarToSupplier,getfilterObj,getCarByID,deleteCarFromSupplier,getUpdatedSuppliers,updateCarFields}