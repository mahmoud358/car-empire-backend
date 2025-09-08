const mongoose = require("mongoose");

// Helpers
// const arabicRegex = /^[\u0600-\u06FF0-9\s\-\(\)\/\.]+$/;
// const englishRegex = /^[A-Za-z0-9\s\-\(\)\/\.]+$/;

const makeLocalizedString = (isRequired = false,fieldName) => ({
  ar: {
    type: String,
    required: isRequired ? [true, `${fieldName} مطلوب`] : false,
    trim: true,
    minlength: [2, `${fieldName} يجب ان يكون اكبر من حرفين`],
    maxlength: [100, `${fieldName} يجب الا يزيد عن 50 حرف`],
    // validate: {
    //   validator: (val) => !val || arabicRegex.test(val),
    //   message: "النص بالعربية يحتوي على رموز غير مسموح بها"
    // }
  },
  en: {
    type: String,
    required: isRequired ? [true, `${fieldName} مطلوب`] : false,
    trim: true,
    minlength: [2, `${fieldName} يجب ان يكون اكبر من حرفين`],
    maxlength: [100, `${fieldName} يجب الا يزيد عن 50 حرف`],
    // validate: {
    //   validator: (val) => !val || englishRegex.test(val),
    //   message: "النص بالانجليزية يحتوي على رموز غير مسموح بها"
    // }
  }
});
const makeLocalizedStringAndEnum = (enumAr,enumEn,fieldName) => ({
  ar: {
    type: String,
    required: [true, `${fieldName} مطلوب`],
    enum: enumAr,
  },
  en: {
    type: String,
    required: [true, `${fieldName} مطلوب`],
    enum: enumEn,
  }
})

const carSchema = new mongoose.Schema({
  name: makeLocalizedString(true,"اسم السيارة"),

  status:makeLocalizedStringAndEnum(["جديدة","استعمال"],["new", "use"],"الحالة"),

  specifications: {
    brand: makeLocalizedString(true,"الماركة"),
    model: makeLocalizedString(true,"الموديل"),
    category: makeLocalizedString(false,"الفئة"),
    body: makeLocalizedString(true,"الجسم"),
    transmission: makeLocalizedString(true,"نوع ناقل الحركة"),
    fuelType: makeLocalizedStringAndEnum(["بنزين","ديزل","كهربائي","هجين","غاز طبيعي","هيدروجين"],["Gasoline", "Diesel", "Electric", "Hybrid","Natural Gas","Hydrogen"],"نوع الوقود"),
    mileage: makeLocalizedString(false,"المسافة المقطوعة"),
    drivetrain: makeLocalizedString(true,"نظام المحرك"),
    year: {
      type: Number,
      required: [true, "سنة الصنع مطلوبة"],
      min: [1950, "سنة الصنع غير منطقية"],
      max: [new Date().getFullYear()+1, "سنة الصنع لا يمكن أن تكون في المستقبل"]
    },
    engine: makeLocalizedString(false,"نوع المحرك"),
    origin: makeLocalizedString(false,"البلد"),
    exteriorColor: makeLocalizedString(false,"اللون الخارجي"),
    interiorColor: makeLocalizedString(false,"اللون الداخلي"),
    turbo: makeLocalizedString(false,"توربو"),
  },

  safety: [makeLocalizedString(false,"الامن")],
  comfort: [makeLocalizedString(false,"الراحة")],
  technologies: [makeLocalizedString(false,"التكنولوجيا")],
  exteriorFeatures: [makeLocalizedString(false,"المميزات الخارجية")],

  cashPrice: {
    type: Number,
    required: [true, "السعر الكاش مطلوب"],
    min: [1000, "السعر الكاش لا يقل عن 1000"]
  },
  installmentPrice: {
    type: Number,
    required: [true, "سعر التقسيط مطلوب"],
    // min: [1000, "سعر التقسيط لا يقل عن 1000"]
  },
  DiscountPercentage: {
    type: Number,
    // required: [true, "نسبة الخصم مطلوبة"],
    min: [0, "نسبة الخصم غير صالحة"],
    max: [100, "نسبة الخصم غير صالحة"]
  },

  showInHome: { type: Boolean, default: false },

  image: {
    type: String,
    required: [true, "الصورة الرئيسية مطلوبة"],
    validate: {
      validator: (val) => /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(val),
      message: "رابط الصورة الرئيسية غير صالح"
    }
  },

  gallery: {
    type: [String],
    validate: {
      validator: (arr) => arr.every((val) => /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(val)),
      message: "بعض روابط صور معرض غير صالحة"
    }
  },

  suppliers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: [true, "يجب تحديد مورد واحد على الأقل"]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema);
