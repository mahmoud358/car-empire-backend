const Job = require("../models/job");
const APIERROR = require("../utils/apiError");

const createJob = async (req, res, next) => {
    try {
        const { title, details, responsibilities, requirements } = req.body;
        const job = await Job.create({ title, details, responsibilities, requirements });
        res.status(201).json({
            status: "success",
            message: "تم إنشاء الوظيفة بنجاح",
            job,
        });
    }
    catch (error) {
        next(new APIERROR(400, error.message));
    }
}

const getAllJobs = async (req, res, next) => {
    try {
        const  query  = {...req.query};
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;
        const jobs = await Job.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
  ;
        if (jobs.length === 0) {
            return next(new APIERROR(404, "لا يوجد وظائف"));
        }
        res.status(200).json({
            status: "success",
            message: "تم الحصول على كل الوظائف بنجاح",
            jobs,
        });
    }
    catch (error) {
        next(new APIERROR(400, error.message));
    }
}

const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return next(new APIERROR(404, "الوظيفة غير موجودة"));
        }
        res.status(200).json({
            status: "success",
            message: "تم الحصول على كل الوظيفة المطلوبة",
            job,
        });
      
    }
    catch (error) {
        next(new APIERROR(400, error.message));
    }
}

const updateJobById = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) {
            return next(new APIERROR(404, "الوظيفة غير موجودة"));
        }
        res.status(200).json({
            status: "success",
            message: "تم تحديث الوظيفة بنجاح",
            job,
        });
    }
    catch (error) {
        next(new APIERROR(400, error.message));
    }
}

const deleteJobById = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return next(new APIERROR(404, "الوظيفة غير موجودة"));
        }
        res.status(200).json({
            status: "success",
            message: "تم حذف الوظيفة بنجاح",
            job,
        });
    }
    catch (error) {
        next(new APIERROR(400, error.message));
    }
}

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJobById,
    deleteJobById,
}