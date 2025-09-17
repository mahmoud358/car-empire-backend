const Comment = require("../models/comment");
const APIERROR = require("../utils/apiError");
const RequestBuying = require("../models/requestBuying");


const addComment = async (req, res, next) => {
    try {
      const { text , requestId } = req.body;
      const userId = req.id;    
      const userRole = req.role;
      if(userRole ==="employee"){
        const request = await RequestBuying.findById(requestId);
        
  if (!request) {
    return next(new APIERROR(404, "الطلب غير موجود"));
  }

  
  if (!request.employeeId) {
    return next(new APIERROR(403, "هذا الطلب غير مخصص لأي موظف"));
  }

 
      }
       
      const comment = await Comment.create({ text, userId, requestId });
  
      res.status(201).json({
        status: "success",
        message: "تم إضافة الكومنت بنجاح",
        data: comment,
      });
    } catch (error) {
      next(new APIERROR(500, "حصل خطأ أثناء إضافة الكومنت"));
    }
  };

module.exports = { addComment };
