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

  static async getAllCategoriesPaginated({ skip, take }) {
    return prisma.category.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { jobs: true },
        },
      },
    });
  }

  static async countCategories() {
    return prisma.category.count();
  }
}

module.exports = CategoryModel;
