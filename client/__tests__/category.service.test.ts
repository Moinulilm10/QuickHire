import { categoryService } from "../services/category.service";

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

describe("categoryService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("getTopCategories", () => {
    it("successfully fetches and returns categories", async () => {
      const mockCategories = [
        { id: 1, name: "Design", icon: "Paintbrush", jobCount: 15 },
        { id: 2, name: "Development", icon: "Code", jobCount: 20 },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockCategories,
        }),
      });

      const result = await categoryService.getTopCategories(8);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/categories?limit=8&sort=jobs"),
      );
      expect(result).toEqual(mockCategories);
    });

    it("throws an error if the response indicates failure", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          success: false,
          message: "Database connection failed",
        }),
      });

      await expect(categoryService.getTopCategories(8)).rejects.toThrow(
        "Database connection failed",
      );
    });

    it("throws a default error if no message is provided on failure", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          success: false,
        }),
      });

      await expect(categoryService.getTopCategories(8)).rejects.toThrow(
        "Failed to fetch categories",
      );
    });

    it("throws an error if the network request fails", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));

      await expect(categoryService.getTopCategories(8)).rejects.toThrow(
        "Network Error",
      );
    });
  });
});
