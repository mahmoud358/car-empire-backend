const Car = require("../models/car");
const Supplier = require("../models/supplier");
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
// const getSuppliersWhoHaveRequestCar = async (car) => {
//   try{
//     const suppliers= await Supplier.find({
//           "cars.brand": car.brand,
//           "cars.model": car.model,
//           // "cars.category": car.category,
//     }).select("name funding").limit(10);


//     return suppliers;
// }catch (error){
//     throw new APIERROR(400, error.message);
// }
//   };

// const getNumOfSuppliersWhoHaveRequestCar = async (car) => {
//     try{
//     const numOfSuppliers= await Supplier.countDocuments({
//           "cars.brand": car.brand,
//           "cars.model": car.model,
//           // "cars.category": car.category,
//     });


//     return numOfSuppliers;
// }catch (error){
//     throw new APIERROR(400, error.message);
// }
//   };

const getSuppliersWhoHaveRequestCar = async (car, skip = 0, limit = 10) => {
    try {
      const pipeline = [
        {
          $match: {
            "cars.brand": car.brand,
            "cars.model": car.model,
            // "cars.category": car.category  // لو عايز تستخدمها
          }
        },
        {
          $facet: {
            suppliers: [
              { $skip: skip },
              { $limit: limit },
              { $project: { name: 1, funding: 1 } }
            ],
            totalCount: [
              { $count: "count" }
            ]
          }
        }
      ];
  
      const result = await Supplier.aggregate(pipeline);
  
      return {
        suppliers: result[0].suppliers,
        totalItems: result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0,
        totalPages: result[0].totalCount.length > 0 ? Math.ceil(result[0].totalCount[0].count / limit) : 0,
      };
  
    } catch (error) {
      throw new APIERROR(400, error.message);
    }
  };
  



module.exports = {deleteSupplierFromCar,
    getSuppliersWhoHaveRequestCar,
    // getNumOfSuppliersWhoHaveRequestCar
};