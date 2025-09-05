const express = require("express");
const router = express.Router();
const { auth, restrictTo } = require("../middlewares/auth");
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJobById,
  deleteJobById,
} = require("../controllers/job");
router.post("/",auth, restrictTo("admin"), createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.put("/:id",auth, restrictTo("admin"), updateJobById);
router.delete("/:id",auth, restrictTo("admin"), deleteJobById);
module.exports = router;
