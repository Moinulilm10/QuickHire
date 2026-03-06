const jobModel = require("../models/job.model");
const prisma = require("../config/prisma");

exports.getAllJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { jobs, total } = await jobModel.getAllJobs(page, limit);

    res.status(200).json({
      success: true,
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await jobModel.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    let applied = false;
    if (req.user) {
      const existing = await prisma.jobApplication.findUnique({
        where: {
          userId_jobId: {
            userId: req.user.userId,
            jobId: job.id,
          },
        },
      });
      applied = !!existing;
    }

    res.status(200).json({
      success: true,
      data: { ...job, applied },
    });
  } catch (error) {
    next(error);
  }
};

exports.getLatestJobs = async (req, res, next) => {
  try {
    const jobs = await jobModel.getLatestJobs();
    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedJobs = async (req, res, next) => {
  try {
    const jobs = await jobModel.getFeaturedJobs();
    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    const job = await jobModel.createJob(req.body);
    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await jobModel.updateJob(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    await jobModel.deleteJob(req.params.id);
    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
