const userModel = require("../models/user");
const APIERROR = require("../utils/apiError")
const mongoose = require("mongoose");
const userFunctions = require("../utils/userFunctions");
const { createLoginLog } = require("../utils/loginLogFunctions");
const sendEmail = require("../utils/email");
const { getPagination } = require("../utils/generalFunction");
const crypto = require("crypto");
const bcryptjs = require("bcryptjs");


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

const updatePassword= async (req, res , next)=>{

  try{
    var { currentPassword, newPassword } = req.body;

    userFunctions.validateUpdatePasswordInput(currentPassword,newPassword);
    
    const user= await userFunctions.getUserById(req.id)
    
    await userFunctions.comparePassword(currentPassword,user.password)
   
    
    user.password = newPassword;
    await user.save();
    res.status(200).json({status:"success",message:"تم تحديث كلمة المرور بنجاح"});
    }catch(error){
      next(new APIERROR(error.statusCode||400,error.message));
    }

}


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
const forgotPassword= async(req,res, next)=>{
    
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new APIERROR(404, "User not found"));
  
    const resetToken = user.createResetPasswordToken();
    console.log("Before saving user:", user);
    await user.save();
    console.log("After saving user:", user);

    const resetUrl = `http://localhost:8000/user/resetPassword/${resetToken}`;   

  const message = `
  <p>We have received a password reset request. Please click the button below to reset your password. The link will be valid for only 15 minutes:</p>
  <a href="${resetUrl}" style="display:inline-block; padding:10px 15px; color:white; background-color:#007bff; border-radius:5px; text-decoration:none;">Reset Password</a>
  <p>If the button doesn't work, copy and paste the link below into your browser:</p>
  <p><a href="${resetUrl}">${resetUrl}</a></p>

`

    
    try{
      await sendEmail({
          email : user.email,
          subject : 'Password Reset Request',
          html:message
        })
        return res.status(200).json({ message: "Email sent successfully" });
    }catch(err){
      user.passwordResetToken = undefined,
      user.passwordResetExpires = undefined
     await  user.save();
      return next(new APIERROR(500, "There was an error sending the email. Try again later."));
    }
      }


      const resetPassword = async (req, res, next) => {

          try {
      
              const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
      
              const user = await userModel.findOne({
                  passwordResetToken: token,
                  passwordResetExpires: { $gt: Date.now() }
              });
      
      
              if (!user) {
                  return next(new APIERROR(400, "Invalid or expired token"));
              }
      
      
              const { password, confirmPassword } = req.body;
      
      
              if (password !== confirmPassword) {
                  return next(new APIERROR(400, "Passwords do not match"));
              }
      
      
             
      
      
              user.password = password;
              user.passwordResetToken = undefined;
              user.passwordResetExpires = undefined;
      
      
              await user.save();
      
      
              return res.status(200).json({ message: "Password updated successfully" });
          } catch (error) {
      
              console.error("Error resetting password:", error);
              next(new APIERROR(500, "An error occurred while resetting the password"));
          }
      };

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
    login,
    updatePassword,
    forgotPassword,
    resetPassword
};