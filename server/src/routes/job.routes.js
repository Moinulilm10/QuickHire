const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");

const { optionalAuth } = require("../middlewares/auth.middleware");

router.get("/", jobController.getAllJobs);
router.get("/latest", jobController.getLatestJobs);
router.get("/featured", jobController.getFeaturedJobs);
router.get("/:id", optionalAuth, jobController.getJobById);
router.post("/", jobController.createJob);
router.put("/:id", jobController.updateJob);
router.delete("/:id", jobController.deleteJob);

module.exports = router;
