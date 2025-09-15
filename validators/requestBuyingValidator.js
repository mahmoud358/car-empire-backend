const Joi = require("joi");

const imageRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i;
const carDettailsRegex=/^[A-Za-z0-9 !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/
const fullNameJoiValidation = Joi.string().trim().min(3).max(100).required().messages({
    "string.min": "الاسم يجب أن يكون 3 أحرف على الأقل",
    "string.max": "الاسم طويل جدًا",
    "any.required": "الاسم مطلوب",
  })
// 🔹 Schema عام للحقول المشتركة
const baseSchema = {
    type: Joi.string()
        .valid("corporate-finance", "personal-finance", "cash")
        .required()
        .messages({
            "any.required": "نوع الطلب مطلوب",
            "any.only": "نوع الطلب غير صالح",
        }),
        fullName: fullNameJoiValidation,
    phoneNumber: Joi.array()
        .items(
            Joi.string().pattern(
                /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/
            )
        )
        .min(1)
        .required()
        .messages({
            "array.min": "يجب إدخال رقم تليفون واحد على الأقل",
            "string.pattern.base": "رقم الهاتف غير صالح",
        }),
    city: Joi.string().required().messages({
        "any.required": "يجب إدخال المدينة",
    }),
};

// 🔹 طلب تمويل شركات
 const corporateFinanceSchema = Joi.object({
    ...baseSchema,
    companyData: Joi.object({
        companyName: Joi.string().min(3).max(150).required().messages({
            "any.required": "يجب إدخال اسم الشركة",
            "string.min": "اسم الشركة يجب أن يكون 3 أحرف على الأقل",
            "string.max": "اسم الشركة طويل جدًا",
        }),
        commercialRegister: Joi.string().min(5).pattern(/^[0-9]{5,}$/).required().messages({
            "string.min": "السجل التجاري قصير جدًا",
            "string.pattern.base": "السجل التجاري غير صالح",
            "any.required": "السجل التجاري مطلوب",
        }),
        email: Joi.string().pattern(/^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com)$/).messages({
            "string.pattern.base": "البريد الإلكتروني غير صالح",
        }),
        activity: Joi.string().required().messages({
            "any.required": "يجب إدخال نشاط الشركة",
        }),
        companyType: Joi.string().required().messages({
            "any.required": "يجب إدخال نوع الشركة",
        }),
        branchesNumber: Joi.number().min(0).messages({
            "number.min": "عدد الفروع لا يمكن أن يكون سالب",
        }),
        carsNumber: Joi.number().min(0).messages({
            "number.min": "عدد السيارات لا يمكن أن يكون سالب",
        }),
        establishmentDate: Joi.date().less("now").required().messages({
            "date.less": "تاريخ التأسيس يجب أن يكون أقل من أو يساوي اليوم",
            "any.required": "تاريخ التأسيس مطلوب",
        }),
        mainBank: Joi.string().required().messages({
            "any.required": "يجب إدخال البنك الرئيسي",
        }),
        hasLeasing: Joi.boolean().required().messages({
            "any.required": "يجب إدخال حالة التأجير",
        }),
        leasingBank: Joi.string(),
        notes: Joi.string().allow("", null),

    }).required().messages({
        "any.required": "يجب إدخال بيانات الطلب",
    }).custom((value, helpers) => {
      if (value.hasLeasing === true) {
        if (!value.leasingBank ) {
          return helpers.message(
            "يجب إدخال اسم البنك التأجير عند وجود التأجير"
          );
        }
      }
    
      return value;
    }),
});

// 🔹 طلب تمويل أفراد
 const personalFinanceSchema = Joi.object({
    ...baseSchema,
    car: Joi.object({
        brand: Joi.string().required().pattern(carDettailsRegex).messages({
            "any.required": "يجب إدخال ماركة السيارة",
            "string.pattern.base":"النص يجب أن يكون بالإنجليزية فقط مع السماح بالرموز والمسافات العادية"
        }),
        model: Joi.string().required().pattern(carDettailsRegex).messages({
            "any.required": "يجب إدخال نموذج السيارة",
            "string.pattern.base":"النص يجب أن يكون بالإنجليزية فقط مع السماح بالرموز والمسافات العادية"
        }),
        // category: Joi.string().required().pattern(carDettailsRegex).messages({
        //     "any.required": "يجب إدخال فئة السيارة",
        //     "string.pattern.base":"النص يجب أن يكون بالإنجليزية فقط مع السماح بالرموز والمسافات العادية"
        // }),
    }).required().messages({
        "any.required": "يجب إدخال بيانات السيارة",
    }),
    idCard: Joi.string().pattern(imageRegex).required().messages({
        "string.pattern.base": "رابط صورة الهوية غير صالح",
        "any.required": "رابط صورة الهوية مطلوب",
    }),
    drivingLicense: Joi.string()
        .pattern(imageRegex).required()
        .messages({
            "string.pattern.base": "رابط رخصة القيادة غير صالح",
            "any.required": "رابط رخصة القيادة مطلوب",
        }),
    salaryStatement: Joi.string()
        .pattern(imageRegex).required()
        .messages({
            "string.pattern.base": "رابط بيان الراتب غير صالح",
            "any.required": "رابط بيان الراتب مطلوب",
        }),
    personalData: Joi.object({
        salary: Joi.number().min(1000).required().messages({
            "number.min": "الراتب يجب أن يكون أكبر من 1000",
            "any.required": "الراتب مطلوب",
          }),
        salaryMethod: Joi.string().required().messages({
            "any.required": "طريقة الدفع مطلوبة",
        }),
        Nationality: Joi.string().valid("سعودى", "غير سعودى").required().messages({
            "any.required": "يجب إدخال الجنسية",
            "any.only": "يجب إدخال جنسية صالحة",
        }),
        employer: Joi.string().trim().required().messages({
            "any.required": "يجب إدخال اسم الوظيفة",
        }),
        financialObligations: Joi.boolean().required().messages({
            "any.required": "يجب إدخال حالة التزامات المالية",
        }),
        VisacreditLimit: Joi.number().min(100).messages({
            "number.min": "حد إئتماني فيزا يجب أن يكون أكبر من 100",
          }),
          personalLoan: Joi.number().min(100).messages({
            "number.min": "القرض الشخصي يجب أن يكون أكبر من 100",
          }),
          carLoan: Joi.number().min(100).messages({
            "number.min": "قرض السيارة يجب أن يكون أكبر من 100",
          }),
          mortgageLoan: Joi.string().valid("notFound", "supported", "notsupported"),
          InstallmentValue: Joi.number().min(100),
          SupportValue: Joi.number().min(100),
        violations: Joi.number().min(0).default(0),
      
       
    }).required().messages({
        "any.required": "يجب إدخال بيانات الطلب",
    }) .custom((value, helpers) => {
        if (value.financialObligations === true) {
          if (!value.VisacreditLimit && !value.personalLoan && !value.carLoan) {
            return helpers.message(
              "يجب إدخال أحد الحقول حد إئتماني فيزا او قرض شخصي او قرض سيارة عند وجود التزامات مالية"
            );
          }
        }
        if (value.mortgageLoan === "supported") {
          if (!value.InstallmentValue || !value.SupportValue ) {
            return helpers.message(
              "يجب إدخال الحقول قيمة القسط و قيمة الدعم عند وجود قرض عقارى مدعوم"
            );
          }
        }else if (value.mortgageLoan === "notsupported") {
          if (!value.InstallmentValue) {
            return helpers.message(
              "يجب إدخال قيمة القسط عند وجود قرض عقارى غير مدعوم"
            );
          }
        }
        return value;
      }),
});

// 🔹 طلب شراء كاش
 const cashSchema = Joi.object({
    ...baseSchema,
    
    
   car: Joi.object({
            brand: Joi.string().required().messages({
                "any.required": "يجب إدخال ماركة السيارة",
            }),
            model: Joi.string().required().messages({
                "any.required": "يجب إدخال نموذج السيارة",
            }),
            // category: Joi.string().required().messages({
            //     "any.required": "يجب إدخال فئة السيارة",
            // }),
        }).required().messages({
            "any.required": "يجب إدخال بيانات السيارة",
        }),
   
});

module.exports = {
    corporateFinanceSchema,
    personalFinanceSchema,
    cashSchema,
}
