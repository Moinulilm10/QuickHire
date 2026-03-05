const prisma = require("../config/prisma");

class CategoryModel {
  static async createCategory(name) {
    return prisma.category.create({
      data: { name },
    });
  }

  static async updateCategory(id, name) {
    return prisma.category.update({
      where: { id: parseInt(id) },
      data: { name },
    });
  }

  static async deleteCategory(id) {
    return prisma.category.delete({
      where: { id: parseInt(id) },
    });
  }

  static async getCategoryById(id) {
    return prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        jobs: true,
        _count: {
          select: { jobs: true },
        },
      },
    });
  }

  static async getCategoryByName(name) {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  static async getAllCategoriesPaginated({ skip, take, search, sort }) {
    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const orderBy =
      sort === "jobs"
        ? [{ jobs: { _count: "desc" } }, { id: "desc" }]
        : [{ createdAt: "desc" }, { id: "desc" }];

    return prisma.category.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        _count: {
          select: { jobs: true },
        },
      },
    });
  }

  static async countCategories({ search } = {}) {
    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};
    return prisma.category.count({ where });
  }
}

module.exports = CategoryModel;
