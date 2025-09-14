const APIERROR = require("../utils/apiError");
const {
    corporateFinanceSchema,
    personalFinanceSchema,
    cashSchema,
  }  = require("../validators/requestBuyingValidator");
  
   const validateRequest = (req, res, next) => {
    let schema;
  
    switch (req.body.type) {
      case "corporate-finance":
        schema = corporateFinanceSchema;
        break;
      case "personal-finance":
        schema = personalFinanceSchema;
        break;
      case "cash":
        schema = cashSchema;
        break;
      default:
        return next(new APIERROR(400,"نوع الطلب غير صالح" ));
    }
  
    const { error } = schema.validate(req.body, { abortEarly: false });
  
    if (error) {

      return res.status(400).json({
        success: "fail",
        message: error.details.map((d) => d.message),
        
      });
    }
  
    next();
  };
  module.exports={
    validateRequest
  }
  