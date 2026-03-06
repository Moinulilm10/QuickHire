import { apiClient } from "./apiClient";

export const userService = {
  async getUsers(page = 1, limit = 10) {
    return apiClient(`/auth/users?page=${page}&limit=${limit}`);
  },

  async deleteUser(id: string) {
    return apiClient(`/auth/users/${id}`, { method: "DELETE" });
  },
};
