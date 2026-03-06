const prisma = require("../config/prisma");

class AuthModel {
  static async createUser({ email, password, name, authProvider = undefined }) {
    return prisma.user.create({
      data: {
        email,
        password,
        name,
        authProvider,
        picture: null,
      },
    });
  }

  static async findUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async findUserById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        uuid: true,
        email: true,
        name: true,
        role: true,
        picture: true,
        createdAt: true,
      },
    });
  }

  static async getAllUsers({ skip, take }) {
    return prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        uuid: true,
        email: true,
        name: true,
        role: true,
        picture: true,
        createdAt: true,
        authProvider: true,
      },
      orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    });
  }

  static async countUsers() {
    return prisma.user.count();
  }

  static async deleteUserDependencies(userId) {
    return prisma.jobApplication.deleteMany({
      where: { userId },
    });
  }

  static async deleteUserById(id) {
    return prisma.user.delete({
      where: { id },
    });
  }

  static async updateUser(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}

module.exports = AuthModel;
