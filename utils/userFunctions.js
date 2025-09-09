const userModel = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const APIERROR = require("../utils/apiError");
const userRole = require("./user-roles");

function validateLoginInput(body) {
  const { phoneNumber, password } = body;
  if (!phoneNumber || !password) {
    throw new APIERROR(400, "يرجى إدخال رقم الجوال وكلمة المرور");
  }
  return { phoneNumber, password };
}

async function checkUserAndPassword(phoneNumber, password) {
  const user = await userModel.findOne({ phoneNumber });
  if (!user) throw new APIERROR(400, "يوجد خطأ في رقم الجوال أو كلمة المرور");

  const passwordValid = await bcryptjs.compare(password, user.password);
  if (!passwordValid) throw new APIERROR(400, "يوجد خطأ في رقم الجوال أو كلمة المرور");

  return user;
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role,
      username: user.userName,
      image:user.image?user.image:""
    },
    process.env.SECRET,
    // { expiresIn: "1d" }
  );
}

const checkValidityRole = (actionUserRole, currentUserRole) => {

  // Admin logic
  if (currentUserRole === userRole.ADMIN) {
    // Admin يقدر يضيف Admin أو أقل
    return true;
  }

  // Supervisor logic
  if (currentUserRole === userRole.SUPERVISOR) {
    if (actionUserRole === userRole.EMPLOYEE) {
      return true;
    } else {
      
       throw new APIERROR(403, "ليس لديك الصلاحية لاتخاذ هذا الاجراء")
      
    }
  }

  // Employee logic
  if (currentUserRole === userRole.EMPLOYEE) {
    
    throw  new APIERROR(403, "الموظف لا يمتلك صلاحية لإضافة مستخدمين")
  }
};

const deleteFieldsFromUpdatedObj=(delFields,updatedObj)=>{

  delFields.forEach((field)=>{
    delete updatedObj[field]
  })
  return updatedObj
}

const checkEqualtyIDAndRoleForUpdate=(incomeID,updatedID,incomeRole,updateUser)=>{

  if(incomeRole===userRole.ADMIN){
    updateUser=  deleteFieldsFromUpdatedObj(["password"],updateUser)
    return updateUser
  }
  
    if(incomeID===updatedID){
      updateUser= deleteFieldsFromUpdatedObj(["password","role"],updateUser)
      return updateUser
    }

    throw new APIERROR(403, "ليس لديك الصلاحية لاتخاذ هذا الاجراء")

}

const validateUpdatePasswordInput=(currPassword,newPassword)=>{

  if(!currPassword || !newPassword){
    throw new APIERROR(400, "يرجى إدخال كلمة المرور الحالية و كلمة المرور الجديدة")
  }

}

const getUserById=async(id)=>{

  const user=await userModel.findById(id)
  if(!user){
    throw new APIERROR(404, "المستخدم غير موجود")
  }
  return user
}

const comparePassword= async(currPassword,userPassword)=>{

  const passwordValid = await bcryptjs.compare(currPassword, userPassword);
  if (!passwordValid) throw new APIERROR(400, "كلمة المرور الحالية أو كلمة المرور الجديدة غير صحيحة");
  
}


module.exports = { validateLoginInput, checkUserAndPassword, generateToken , checkValidityRole,checkEqualtyIDAndRoleForUpdate,validateUpdatePasswordInput,getUserById,comparePassword};
