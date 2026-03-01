const prisma = require("../config/prisma");

class JobModel {
  async getAllJobs() {
    return await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getJobById(id) {
    return await prisma.job.findUnique({
      where: { id },
    });
  }

  async createJob(jobData) {
    return await prisma.job.create({
      data: jobData,
    });
  }

  async updateJob(id, jobData) {
    return await prisma.job.update({
      where: { id },
      data: jobData,
    });
  }

  async deleteJob(id) {
    return await prisma.job.delete({
      where: { id },
    });
  }
}

module.exports = new JobModel();
