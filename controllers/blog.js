const blog = require("../models/blog");
const APIERROR = require("../utils/apiError");
const {
  createBlogFn,
  getAllBlogsFn,
  updateBlogByIdFn,
  deleteBlogByIdFn,
  getBlogByIdFn,
} = require("../utils/blogFunctions");


const createBlog = async (req, res, next) => {
  try {
    const blog = await createBlogFn(req.body);
    res.status(201).json({
      status: "success",
      message: "تم إنشاء المقال بنجاح",
      blog,
    });
  } catch (error) {
    next(new APIERROR(400, error.message));
  }
};


const getAllBlogs = async (req, res, next) => {
  try {
    const{limit, page, skip}=getPagination(req.query)
    const[blogs,total]=await Promise.all([
      getAllBlogsFn(limit,skip),
      blog.countDocuments()
    ])
    res.status(200).json({
      status: "success",
      message: "تم الحصول على كل المقالات بنجاح",
      data:blogs,
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



const getBlogById = async (req, res, next) => {
  try {
    const blog = await getBlogByIdFn(req.params.id);
    res.status(200).json({
      status: "success",
      message: "تم الحصول على المقال بنجاح",
      blog,
    });
  } catch (error) {
    next(new APIERROR(400, error.message));
  }
};

const updateBlogById = async (req, res, next) => {
  try {
    const blog = await updateBlogByIdFn(req.params.id, req.body,{ new: true, runValidators: true });
    res.status(200).json({
      status: "success",
      message: "تم تحديث المقال بنجاح",
      blog,
    });
  } catch (error) {
    next(new APIERROR(400, error.message));
  }
};


const deleteBlogById = async (req, res, next) => {
  try {
    const blog = await deleteBlogByIdFn(req.params.id);
    res.status(200).json({
      status: "success",
      message: "تم حذف المقال بنجاح",
      blog,
    });
  } catch (error) {
    next(new APIERROR(400, error.message));
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlogById,
  deleteBlogById,
};
