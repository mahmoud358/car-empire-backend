const Comment = require("../models/comment");
const APIERROR = require("../utils/apiError");
const { getAllCommentByRequestID } = require("../utils/commentFunction");
const { getPagination } = require("../utils/generalFunction");

const { getRequestBuyingByID } = require("../utils/requestBuyingFunction");


const addComment = async (req, res, next) => {
  try {
    const { text, requestId } = req.body;
    const userId = req.id;
    const userRole = req.role;
    if (userRole === "employee") {
      const request = await getRequestBuyingByID(requestId);

      if (!request) {
        return next(new APIERROR(404, "الطلب غير موجود"));
      }


      if (userId !== request.employeeId.toString()) {
        return next(new APIERROR(403, "ليس لديك صلاحية لاضافة تعليق على هذا الطلب"));
      }


    }

    const comment = await Comment.create({ text, userId, requestId });

    res.status(201).json({
      status: "success",
      message: "تم إضافة التعليق بنجاح",
      data: comment,
    });
  } catch (error) {
    next(new APIERROR(500, "حصل خطأ أثناء إضافة الكومنت"));
  }
};

const getCommentsByRequestID=async (req, res, next)=>{
  try {
    const {limit,page,skip}=getPagination(req.query);
    const commentsdata = await getAllCommentByRequestID(req.params.requestId,limit,skip);
    res.status(200).json({
      status: "success",
      message: "تم جلب التعليقات بنجاح",
      data: commentsdata.comments,
      pagination: {
        currentPage: page,
        totalPages: commentsdata.totalPages,
        totalItems: commentsdata.totalItems,
      }
    });
  }catch (error) {
    next(new APIERROR(500, error.message));
  }

}

module.exports = { addComment ,getCommentsByRequestID};
