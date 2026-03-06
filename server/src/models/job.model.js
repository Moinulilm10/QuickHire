const prisma = require("../config/prisma");

class JobModel {
  async getAllJobs(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        skip,
        take: limit,
        include: {
          company: true,
          categories: true,
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.job.count(),
    ]);
    return { jobs, total };
  }

  async getJobById(identifier) {
    const isNumeric = /^\d+$/.test(identifier);

    return await prisma.job.findUnique({
      where: isNumeric ? { id: parseInt(identifier) } : { uuid: identifier },
      include: {
        company: true,
        categories: true,
        _count: { select: { applications: true } },
      },
    });
  }

  async getLatestJobs() {
    const hours72Ago = new Date(Date.now() - 72 * 60 * 60 * 1000);
    const hours96Ago = new Date(Date.now() - 96 * 60 * 60 * 1000);

    const selectFields = {
      id: true,
      uuid: true,
      title: true,
      type: true,
      location: true,
      salary: true,
      status: true,
      logoColor: true,
      experience: true,
      logo: true,
      categories: { select: { id: true, uuid: true, name: true } },
      company: { select: { id: true, uuid: true, name: true } },
      createdAt: true,
      _count: { select: { applications: true } },
    };

    // Try within 72 hours
    let jobs = await prisma.job.findMany({
      where: { createdAt: { gte: hours72Ago } },
      select: selectFields,
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    if (jobs.length < 8) {
      // If less than 8, expand to 96 hours
      jobs = await prisma.job.findMany({
        where: { createdAt: { gte: hours96Ago } },
        select: selectFields,
        orderBy: { createdAt: "desc" },
        take: 8,
      });
    }

    return jobs;
  }

  async getFeaturedJobs() {
    return await prisma.job.findMany({
      where: {
        OR: [{ type: "Remote" }, { type: "Hybrid" }],
        status: "active",
      },
      include: {
        company: true,
        categories: true,
        _count: { select: { applications: true } },
      },
      orderBy: [{ createdAt: "desc" }],
      take: 8,
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
      include: { categories: true, company: true },
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
      where: { id: parseInt(id) },
      data: sanitiziedData,
      include: { categories: true, company: true },
    });
  }

  async deleteJob(id) {
    return await prisma.job.delete({
      where: { id: parseInt(id) },
    });
  }
}

module.exports = new JobModel();
