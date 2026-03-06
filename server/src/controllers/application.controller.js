const prisma = require("../config/prisma");

// Create application
const createApplication = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { jobId, companyId, coverLetter } = req.body;

    if (!jobId || !companyId) {
      return res.status(400).json({
        success: false,
        message: "jobId and companyId are required",
      });
    }

    // Check if user already applied
    const existing = await prisma.jobApplication.findUnique({
      where: {
        userId_jobId: {
          userId: parseInt(userId),
          jobId: parseInt(jobId),
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    let resumePath = null;
    if (req.file) {
      resumePath = `/uploads/resumes/${req.file.filename}`;
    }

    const application = await prisma.jobApplication.create({
      data: {
        userId: parseInt(userId),
        jobId: parseInt(jobId),
        companyId: parseInt(companyId),
        coverLetter: coverLetter || null,
        resume: resumePath,
      },
      include: {
        job: true,
        company: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user applications
const getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const applications = await prisma.jobApplication.findMany({
      where: { userId: parseInt(userId) },
      include: {
        job: true,
        company: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all applications
const getAllApplications = async (req, res, next) => {
  try {
    const applications = await prisma.jobApplication.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        job: { select: { id: true, title: true } },
        company: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update status
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await prisma.jobApplication.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true } },
        company: { select: { id: true, name: true } },
      },
    });

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete application
const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.jobApplication.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
};
