const Blog = require("../models/blog");
const APIERROR = require("../utils/apiError");


async function createBlogFn(data) {
  const { title, subtitle, image, content } = data;
  return await Blog.create({ title, subtitle, image, content });
}


async function getAllBlogsFn(limit,skip) {
 
try {
  const blogs = await Blog.find()
   .sort({ createdAt: -1 })
   .skip(skip)
   .limit(limit)
   .lean();

  return blogs;
} catch (error) {
  
  throw new APIERROR(400,error.message);
}
  
}


async function getBlogByIdFn(id) {
    const blog = await Blog.findById(id);
    if (!blog) {
      throw new APIERROR(404, "المقال غير موجود");
    }
    return blog;
  }


async function updateBlogByIdFn(id, data) {
  const blog = await Blog.findByIdAndUpdate(id, data,{ new: true, runValidators: true });
  if (!blog) {
    throw new APIERROR(404, "المقال غير موجود");
  }
  return blog;
}


async function deleteBlogByIdFn(id) {
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) {
    throw new APIERROR(404, "المقال غير موجود");
  }
  return blog;
}

module.exports = {
  createBlogFn,
  getAllBlogsFn,
  getBlogByIdFn,
  updateBlogByIdFn,
  deleteBlogByIdFn,
};
