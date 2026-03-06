const prisma = require("../config/prisma");

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalJobs, activeJobs, totalApplicants, totalCompanies] =
      await Promise.all([
        prisma.job.count(),
        prisma.job.count({ where: { status: "active" } }),
        prisma.jobApplication.count(),
        prisma.company.count(),
      ]);

    // 2. Jobs by Category
    const categoriesWithCount = await prisma.category.findMany({
      include: {
        _count: {
          select: { jobs: true },
        },
      },
      orderBy: {
        jobs: {
          _count: "desc",
        },
      },
      take: 8,
    });

    const jobsByCategory = categoriesWithCount.map((cat) => ({
      name: cat.name,
      count: cat._count.jobs,
    }));

    // 2.5 Top Companies by Applicants
    const topCompaniesWithApplicants = await prisma.company.findMany({
      include: {
        _count: {
          select: { applications: true },
        },
      },
      orderBy: {
        applications: {
          _count: "desc",
        },
      },
      take: 8,
    });

    const topCompaniesByApplicants = topCompaniesWithApplicants.map((comp) => ({
      name: comp.name,
      count: comp._count.applications,
    }));

    // 3. Jobs over time (histogram for last 6 months)
    const jobs = await prisma.job.findMany({
      select: { createdAt: true },
    });

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
        totalApplicants,
        totalCompanies,
      },
      charts: {
        jobsByCategory: jobsByCategory.slice(0, 8), // Top 8 categories
        jobsOverTime: lastSixMonths,
        topCompaniesByApplicants: topCompaniesByApplicants.slice(0, 8), // Top 8 companies
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
