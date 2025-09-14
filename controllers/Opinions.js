const Opinion = require("../models/Opinions");
const APIERROR = require("../utils/apiError");
const { getPagination } = require("../utils/generalFunction");

const addOpinion = async (req, res, next) => {
  try {
    const { fullName, text, rating } = req.body;

    if (!fullName || !text || !rating) {
      return next(new APIERROR(400, "الاسم والنص والتقييم مطلوبين"));
    }

    const opinion = await Opinion.create({ fullName, text, rating });

    res.status(201).json({
      status: "success",
      message: "تم إضافة الرأي بنجاح",
      data: opinion,
    });
  } catch (error) {
    next(new APIERROR(500, "حصل خطأ أثناء إضافة الرأي"));
  }
};

const getOpinions = async (req, res, next) => {
    try {
      const { limit, skip, page } = getPagination(req.query);
      const opinions = await Opinion.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const totalOpinions = await Opinion.countDocuments();
  
      res.status(200).json({
        status: "success",
        results: opinions.length,
        page,
        totalPages: Math.ceil(totalOpinions / limit),
        totalOpinions,
        data: opinions,
      });
    } catch (error) {
      next(new APIERROR(500, "حصل خطأ أثناء جلب الآراء"));
    }
  };
const deleteOpinion = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const opinion = await Opinion.findByIdAndDelete(id);
  
      if (!opinion) {
        return next(new APIERROR(404, "الرأي غير موجود"));
      }
  
      res.status(200).json({
        status: "success",
        message: "تم حذف الرأي بنجاح",
      });
    } catch (error) {
      next(new APIERROR(500, "حصل خطأ أثناء حذف الرأي"));
    }
  };

module.exports = { addOpinion, getOpinions, deleteOpinion };
