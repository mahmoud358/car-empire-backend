const userModel = require("../models/user");
const APIERROR = require("../utils/apiError")
const mongoose = require("mongoose");
const { validateLoginInput, checkUserAndPassword, generateToken } = require("../utils/userFunctions");
const { createLoginLog } = require("../utils/loginLogFunctions");
const  userRole  = require("../utils/user-roles");

const roleHierarchy = {
  [userRole.ADMIN]: 3,
  [userRole.SUPERVISOR]: 2,
  [userRole.USER]: 1,
};
const getAllUsers = async (req, res , next) => {
    try {
        let users = await userModel.find();

        if (users.length === 0) {
            return next(new APIERROR(404, "لا يوجد مستخدمين"));
        }

        return res.status(200).json({
            success: true,
            message: "تم الحصول على كل المستخدمين بنجاح",
            users: users
        });
      
    } catch (error) {
        next(new APIERROR(400, error.message));
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
        success: true,
        message: "تم الحصول على المستخدم بنجاح",
        user: user
      });
    } catch (error) {
      next(new APIERROR(500, "حدث خطأ غير متوقع"));
    }
  };
  

  const createUser = async (req, res , next) => {
    try {
      const currentUserRole = req.role 
      const newUserRole = req.body.role;
      
      if (roleHierarchy[newUserRole] >= roleHierarchy[currentUserRole]) {
        return next(
          new APIERROR(403, "ليس لديك الصلاحية للقيام بهذا الإجراء ")
        );
      }
  
      let user = await userModel.create(req.body);
  
      return res.status(201).json({
        success: true,
        message: "تم إنشاء المستخدم بنجاح",
        user: user
      });
    } catch (error) {
      next(new APIERROR(400, error.message));
    }
  };

const login = async (req, res, next) => {
    try {
  
      const { phoneNumber, password } = validateLoginInput(req.body);
      const user = await checkUserAndPassword(phoneNumber, password);
      if (!user) {
        return next(new APIERROR(400, "هذا الحساب معطل حاليا يرجى التواصل معنا"));
      }
      const token = generateToken(user);
      await createLoginLog(user._id, req.body);
      return res.status(200).json({
        status: "success",
        message: "تم تسجيل الدخول بنجاح",
        token,
      });
  
    } catch (error) {
      next(error);
    }
  };
  

const updateUserById = async (req, res , next) => {
    try {
        let user = await userModel.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } 
        );

        if (!user) {
            return next(new APIERROR(404, "المستخدم غير موجود"));
        }

        return res.status(200).json({
            success: true,
            message: "تم تحديث المستخدم بنجاح",
            user: user
        });
    } catch (error) {
        next(new APIERROR(400, error.message));
    }
};


const deleteUserById = async (req, res , next) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);

        if (!user) {
            return next(new APIERROR(404, "المستخدم غير موجود"));
        }

        return res.status(200).json({
            success: true,
            message: "تم حذف المستخدم بنجاح",
            user: user
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