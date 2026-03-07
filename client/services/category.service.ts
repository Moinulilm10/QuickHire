import { CategoryData } from "@/components/ui/CategoryCard";
import { apiService } from "./api.service";

export const categoryService = {
  async getTopCategories(limit: number = 8): Promise<CategoryData[]> {
    const data = await apiService.get(`/categories?limit=${limit}&sort=jobs`);
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Failed to fetch categories");
  },
};
