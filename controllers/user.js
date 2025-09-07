const userModel = require("../models/user");
const APIERROR = require("../utils/apiError")
const mongoose = require("mongoose");
const userFunctions = require("../utils/userFunctions");
const { createLoginLog } = require("../utils/loginLogFunctions");
const { getPagination } = require("../utils/generalFunction");



const getAllUsers = async (req, res , next) => {
    try {
      const{limit, page, skip}=getPagination(req.query);
      userFunctions.checkValidityRole(req.params.role, req.role);
        const [users,total] = await Promise.all([
          userModel.find({role:req.params.role}).skip(skip).limit(limit).select("-password"),
          userModel.countDocuments({role:req.params.role})
        ])
        

        if (users.length === 0) {
            return next(new APIERROR(404, "لا يوجد مستخدمين"));
        }

        return res.status(200).json({
           status:"success",
            message: "تم الحصول على كل المستخدمين بنجاح",
            data: users,
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(total / limit),
              totalItems: total,
            }
        });
      
    } catch (error) {
        next(new APIERROR(error.statusCode||400, error.message));
    }
};


const getUserById = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return next(new APIERROR(400, "معرّف المستخدم غير صالح"));
      }
  
      let user = await userModel.findById(id);
  
      if (!user) {
        return next(new APIERROR(404, "المستخدم غير موجود"));
      }
  
      return res.status(200).json({
        status:"success",
        message: "تم الحصول على المستخدم بنجاح",
        data: user
      });
    } catch (error) {
      next(new APIERROR(500, "حدث خطأ غير متوقع"));
    }
  };
  

  const createUser = async (req, res , next) => {
    try {  
      userFunctions.checkValidityRole(req.body.role, req.role);
  
      let user = await userModel.create(req.body);
  
      return res.status(201).json({
        status:"success",
        message: "تم إنشاء المستخدم بنجاح",
        data: user
      });
    } catch (error) {
      next(new APIERROR(error.statusCode||400, error.message));
    }
  };

const login = async (req, res, next) => {
    try {
  
      const { phoneNumber, password } = userFunctions.validateLoginInput(req.body);
      const user = await userFunctions.checkUserAndPassword(phoneNumber, password);
      if (!user) {
        return next(new APIERROR(400, "هذا الحساب معطل حاليا يرجى التواصل معنا"));
      }
      const token = userFunctions.generateToken(user);
      await createLoginLog(user._id, req.body);
      return res.status(200).json({
        status: "success",
        message: "تم تسجيل الدخول بنجاح",
        token,
      });
  
    } catch (error) {
      next(new APIERROR(400, error.message));
    }
  };
  

const updateUserById = async (req, res , next) => {
    try {
       const updateUser = userFunctions.checkEqualtyIDAndRoleForUpdate(req.id, req.params.id, req.role, req.body);
    
        let user = await userModel.findByIdAndUpdate(
            req.params.id, 
            updateUser, 
            { new: true, runValidators: true } 
        );

        if (!user) {
            return next(new APIERROR(404, "المستخدم غير موجود"));
        }

        return res.status(200).json({
            status:"success",
            message: "تم تحديث المستخدم بنجاح",
            data: user
        });
    } catch (error) {
        next(new APIERROR(error.statusCode||400, error.message));
    }
};


const deleteUserById = async (req, res , next) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);

        if (!user) {
            return next(new APIERROR(404, "المستخدم غير موجود"));
        }

        return res.status(200).json({
            status:"success",
            message: "تم حذف المستخدم بنجاح",
            data: user
        });
    } catch (error) {
        next(new APIERROR(400, error.message));
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
    login
};