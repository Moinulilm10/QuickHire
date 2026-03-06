/**
 * @jest-environment jsdom
 */

global.fetch = jest.fn();

import { categoryService } from "@/services/category.service";

describe("categoryService", () => {
  const mockApiUrl = "http://localhost:5001/api";

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = mockApiUrl;
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("adminToken", "admin-jwt");
  });

  describe("getCategories", () => {
    it("should GET /categories with page and limit", async () => {
      const mockResponse = {
        success: true,
        data: [{ id: 1, name: "Tech" }],
        pagination: { total: 1, totalPages: 1 },
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => mockResponse,
      });

      const result = await categoryService.getCategories(2, 5);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/categories?page=2&limit=5`,
        expect.anything(),
      );
      expect(result.data).toHaveLength(1);
    });

    it("should default to page 1, limit 10", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true, data: [] }),
      });

      await categoryService.getCategories();

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/categories?page=1&limit=10`,
        expect.anything(),
      );
    });
  });

  describe("createCategory", () => {
    it("should POST to /categories with name", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true }),
      });

      await categoryService.createCategory("Design");

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/categories`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "Design" }),
          headers: expect.objectContaining({
            Authorization: "Bearer admin-jwt",
          }),
        }),
      );
    });
  });

  describe("updateCategory", () => {
    it("should PUT to /categories/:id with name", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true }),
      });

      await categoryService.updateCategory(10, "Updated Name");

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/categories/10`,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ name: "Updated Name" }),
        }),
      );
    });
  });

  describe("deleteCategory", () => {
    it("should DELETE /categories/:id with auth", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true }),
      });

      const result = await categoryService.deleteCategory(4);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/categories/4`,
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            Authorization: "Bearer admin-jwt",
          }),
        }),
      );
      expect(result.success).toBe(true);
    });
  });
});
