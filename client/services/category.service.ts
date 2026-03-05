import { CategoryData } from "@/components/ui/CategoryCard";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const categoryService = {
  async getTopCategories(limit: number = 8): Promise<CategoryData[]> {
    const res = await fetch(`${apiUrl}/categories?limit=${limit}&sort=jobs`);
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Failed to fetch categories");
  },
};
