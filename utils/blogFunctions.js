const Blog = require("../models/blog");
const APIERROR = require("../utils/apiError");


async function createBlogFn(data) {
  const { title, subtitle, image, content } = data;
  return await Blog.create({ title, subtitle, image, content });
}


async function getAllBlogsFn(query) {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  if (blogs.length === 0) {
    throw new APIERROR(404, "لا يوجد مقالات");
  }

  return blogs;
}


async function getBlogByIdFn(id) {
    const blog = await Blog.findById(id);
    if (!blog) {
      throw new APIERROR(404, "المقال غير موجود");
    }
    return blog;
  }


async function updateBlogByIdFn(id, data) {
  const blog = await Blog.findByIdAndUpdate(id, data, { new: true });
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
