const loginLogSchema = require("../models/loginLog");
const APIERROR = require("../utils/apiError");
const mongoose = require("mongoose");
const { getPagination } = require("../utils/generalFunction"); 

const getUserLoginLogs = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit, page, skip } = getPagination(req.query); 

    
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return next(new APIERROR(400, "معرّف المستخدم غير صالح"));
    }

    
    const [logs, total] = await Promise.all([
      loginLogSchema
        .find({ userId })
        .sort({ loginTime: -1 })
        .skip(skip)
        .limit(limit),
      loginLogSchema.countDocuments({ userId }),
    ]);

    if (logs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "لا يوجد سجلات دخول لهذا المستخدم",
        logs: [],
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      });
    }

    return res.status(200).json({
      success: "success",
      message: "تم الحصول على سجلات الدخول بنجاح",
      logs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    next(new APIERROR(500, "حدث خطأ غير متوقع"));
  }
};

module.exports = {
    getUserLoginLogs
}