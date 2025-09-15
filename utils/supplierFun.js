const Car = require("../models/car");
const APIERROR = require("./apiError");

const deleteSupplierFromCar = async (supplierId,session) => {
  
   

    const car = await Car.updateMany(
        {suppliers: { $in: [supplierId] }},
        { $pull: { suppliers: supplierId } },
        { new: true },
        { session }
    );
   console.log(car);
   
 
}

module.exports = {deleteSupplierFromCar};