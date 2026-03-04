const prisma = require("../config/prisma");

class JobModel {
  async getAllJobs(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        skip,
        take: limit,
        include: { company: true, categories: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.job.count(),
    ]);
    return { jobs, total };
  }

  async getJobById(id) {
    return await prisma.job.findUnique({
      where: { id },
      include: { company: true, categories: true },
    });
  }

  async createJob(jobData) {
    const { company, categories, ...sanitiziedData } = jobData;

    // If companyId is not provided but company name is, find or create the company
    if (!sanitiziedData.companyId && company) {
      let companyRecord = await prisma.company.findFirst({
        where: { name: { equals: company, mode: "insensitive" } },
      });

      if (!companyRecord) {
        companyRecord = await prisma.company.create({
          data: {
            name: company,
            location: sanitiziedData.location || "Unknown",
          },
        });
      }
      sanitiziedData.companyId = companyRecord.id;
    }

    if (sanitiziedData.companyId) {
      sanitiziedData.companyId = parseInt(sanitiziedData.companyId);
    }

    // Handle many-to-many categories
    if (categories && Array.isArray(categories)) {
      sanitiziedData.categories = {
        connectOrCreate: categories.map((name) => ({
          where: { name },
          create: { name },
        })),
      };
    }

    return await prisma.job.create({
      data: sanitiziedData,
      include: { categories: true },
    });
  }

  async updateJob(id, jobData) {
    const { company, categories, ...sanitiziedData } = jobData;
    if (sanitiziedData.companyId) {
      sanitiziedData.companyId = parseInt(sanitiziedData.companyId);
    }

    // Handle many-to-many categories
    if (categories && Array.isArray(categories)) {
      sanitiziedData.categories = {
        set: [], // Clear existing relations
        connectOrCreate: categories.map((name) => ({
          where: { name },
          create: { name },
        })),
      };
    }

    return await prisma.job.update({
      where: { id },
      data: sanitiziedData,
      include: { categories: true },
    });
  }

  async deleteJob(id) {
    return await prisma.job.delete({
      where: { id },
    });
  }
}

module.exports = new JobModel();
