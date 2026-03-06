const prisma = require("../config/prisma");

class CompanyModel {
  async getAllCompanies(page = 1, limit = 10, search = "") {
    const skip = (page - 1) * limit;

    const whereClause = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          jobs: {
            where: { status: "active" },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.company.count({ where: whereClause }),
    ]);

    return { companies, total };
  }

  async getCompanyById(identifier) {
    const isNumeric = /^\d+$/.test(identifier);

    return await prisma.company.findUnique({
      where: isNumeric ? { id: parseInt(identifier) } : { uuid: identifier },
      include: {
        jobs: {
          where: { status: "active" },
        },
      },
    });
  }

  async createCompany(companyData) {
    return await prisma.company.create({
      data: companyData,
    });
  }

  async updateCompany(id, companyData) {
    return await prisma.company.update({
      where: { id: parseInt(id) },
      data: companyData,
    });
  }

  async deleteCompany(id) {
    return await prisma.company.delete({
      where: { id: parseInt(id) },
    });
  }
}

module.exports = new CompanyModel();
