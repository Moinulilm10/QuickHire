import { apiClient } from "./apiClient";

export const categoryService = {
  async getCategories(page = 1, limit = 10) {
    return apiClient(`/categories?page=${page}&limit=${limit}`, {
      auth: false,
    });
  },

  async createCategory(name: string) {
    return apiClient("/categories", { method: "POST", body: { name } });
  },

  async updateCategory(id: number, name: string) {
    return apiClient(`/categories/${id}`, { method: "PUT", body: { name } });
  },

  async deleteCategory(id: number) {
    return apiClient(`/categories/${id}`, { method: "DELETE" });
  },
};
