const mongoose = require("mongoose");
const Counter = require("./counter");

const makeLocalizedImage = {
  
  type: String,
  validate: {
    validator: (val) => /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(val),
    message: "رابط الصورة غير صالح",
  },
};
const makeLocalizedCarObj={
  type: String,
  validate: {
    validator: (val) => /^[A-Za-z0-9 !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/.test(val),
    message: "النص يجب أن يكون بالإنجليزية فقط مع السماح بالرموز والمسافات العادية",
  },
}
  



const requestBuyingSchema = new mongoose.Schema(
  {
    requestNum:{
      type:Number,
      unique: true,

    },
    type: {
      type: String,
      enum: ["corporate-finance", "personal-finance", "cash"],
      required: [true, "نوع الطلب مطلوب"],
    },
    status:{
      type:String,
      enum:['pending','processing','approval','rejected'],
      default:'pending'
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    FinancingEntity:{
      type:String,
      // enum:['bank','cash','other'],
    },
    totalIncomes:{
      type:Number,
      default:0,
      min:[0," اجمالى الايرادات لا يمكن أن يكون سالب"]
    },
    totalExpenses:{
      type:Number,
      default:0,
      min:[0," اجمالى المصروفات لا يمكن أن يكون سالب"]
    },
    sellingPrice:{
      type:Number,
      min: [1000, "السعر يجب أن يكون أكبر من 1000"],
    },
    buyingPrice:{
      type:Number,
      min: [1000, "السعر يجب أن يكون أكبر من 1000"],
    },

    // 🔹 بيانات عامة مشتركة
    fullName: {
      type: String,
      trim: true,
      minlength: [3, "الاسم يجب أن يكون 3 أحرف على الأقل"],
      maxlength: [100, "الاسم طويل جدًا"],
    },

    phoneNumber: {
      type: [String],
      required: [true, "يجب إدخال رقم تليفون واحد على الأقل"],
      validate: [
        {
          validator: function (arr) {
            return arr.length > 0;
          },
          message: "يجب إدخال رقم تليفون",
        },
        {
          validator: function (arr) {
            return arr.every((num) =>
              /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/.test(num)
            );
          },
          message: "رقم الهاتف غير صالح",
        },
      ],
    },

    city: {
      type: String,
      required: [true, "يجب إدخال المدينة"],
      trim: true,
    },
    car: {
      brand:makeLocalizedCarObj,
      model: makeLocalizedCarObj,
      // category: makeLocalizedCarObj,
    },
    // 🔹 ملفات مرفقة

    idCard: makeLocalizedImage,
    drivingLicense: makeLocalizedImage,
    salaryStatement: makeLocalizedImage,

    // 🔹 بيانات الشركات
    companyData: {
      companyName: { type: String, trim: true },
      commercialRegister: {
        type: String,
        minlength: [5, "السجل التجاري قصير جدًا"],
        validate: {
          validator: function (register) {
            return /^[0-9]{5,}$/.test(register);
          },
          message: "السجل التجاري يجب أن يحتوي على 5 أرقام على الاقل",
        },
      },
      email: {
        type: String,
        trim: true,
        validate: {
          validator: function (email) {
            return /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com)$/.test(email);
          },
          message: "البريد الإلكتروني غير صالح",
        },
      },
      activity: { type: String },
      companyType: { type: String },
      branchesNumber: {
        type: Number,
        min: [0, "عدد الفروع لا يمكن أن يكون سالب"],
      },
      carsNumber: {
        type: Number,
        min: [0, "عدد السارات لا يمكن أن يكون سالب"],
      },
      establishmentDate: {
        type: Date,
        validate: {
          validator: function (date) {
            
            return date <= new Date();
          },
          message: "يجب أن يكون تاريخ التأسيس أقل من أو يساوي تاريخ اليوم",
        },
      },
      mainBank: { type: String },
      hasLeasing: { type: Boolean },
      leasingBank: { type: String },
      notes: { type: String },

    },

    // 🔹 بيانات الأفراد (تمويل شخصي)
    personalData: {
      salary: {
        type: Number,
        min: [1000, "الراتب يجب أن يكون أكبر من 1000"],
      },
      salaryMethod: {
        type: String,
        // enum: ["bank", "cash", "other"],
      },
      Nationality: {
        type: String,
        enum: ["سعودى", "غير سعودى"],
      },
      employer: { type: String, trim: true, },
      financialObligations: { type: Boolean },
      VisacreditLimit: { type: Number, min: [100, "حد إئتماني فيزا يجب أن يكون أكبر من 100"], },
      personalLoan: { type: Number, min: [100, "قرض شخصي يجب أن يكون أكبر من 100"], },
      carLoan: { type: Number, min: [100, "قرض سيارة يجب أن يكون أكبر من 100"], },
      mortgageLoan: { type: String, enum: ["notFound", "supported", "notsupported"] },
      InstallmentValue: { type: Number, min: [100, "قيمة القسط يجب أن يكون أكبر من 100"], },
      SupportValue: { type: Number, min: [100, "قيمة الدعم يجب أن يكون أكبر من 100"], },
      violations: {
        type: Number,
        min: [0, "المخالفات لا يمكن أن تكون سالبة"],
      },
      
    },


    



  },
  { timestamps: true }
);

requestBuyingSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "requestBuying" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    this.requestNum = counter.value;
  }
  next();
});


module.exports= mongoose.model("RequestBuying", requestBuyingSchema);
