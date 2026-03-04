const prisma = require("../config/prisma");

class JobModel {
  async getAllJobs(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        skip,
        take: limit,
        include: { company: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.job.count(),
    ]);
    return { jobs, total };
  }

  async getJobById(id) {
    return await prisma.job.findUnique({
      where: { id },
    });
  }

  async createJob(jobData) {
    const { company, ...sanitiziedData } = jobData;

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
    return await prisma.job.create({
      data: sanitiziedData,
    });
  }

  async updateJob(id, jobData) {
    const { company, ...sanitiziedData } = jobData;
    if (sanitiziedData.companyId) {
      sanitiziedData.companyId = parseInt(sanitiziedData.companyId);
    }
    return await prisma.job.update({
      where: { id },
      data: sanitiziedData,
    });
  }

  async deleteJob(id) {
    return await prisma.job.delete({
      where: { id },
    });
  }
}

module.exports = new JobModel();
