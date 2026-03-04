const prisma = require("../config/prisma");

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Basic counts
    const [totalJobs, activeJobs, expiredJobs, draftJobs] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: "active" } }),
      prisma.job.count({ where: { status: "expired" } }),
      prisma.job.count({ where: { status: "draft" } }),
    ]);

    // 2. Jobs by Category
    // Since categories is String[], we fetch all jobs and aggregate in JS
    const jobs = await prisma.job.findMany({
      select: { categories: true, createdAt: true },
    });

    const categoryCounts = {};
    jobs.forEach((job) => {
      job.categories.forEach((cat) => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
    });

    const jobsByCategory = Object.keys(categoryCounts).map((name) => ({
      name,
      count: categoryCounts[name],
    }));

    // 3. Jobs over time (histogram for last 6 months)
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const lastSixMonths = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      lastSixMonths.push({
        month: monthNames[d.getMonth()],
        year: d.getFullYear(),
        jobs: 0,
      });
    }

    jobs.forEach((job) => {
      const jobDate = new Date(job.createdAt);
      lastSixMonths.forEach((m) => {
        if (
          jobDate.getMonth() === monthNames.indexOf(m.month) &&
          jobDate.getFullYear() === m.year
        ) {
          m.jobs++;
        }
      });
    });

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        expiredJobs,
        draftJobs,
      },
      charts: {
        jobsByCategory: jobsByCategory.slice(0, 8), // Top 8 categories
        jobsOverTime: lastSixMonths,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
