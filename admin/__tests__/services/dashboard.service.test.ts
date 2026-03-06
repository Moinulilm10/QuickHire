/**
 * @jest-environment jsdom
 */

global.fetch = jest.fn();

import { dashboardService } from "@/services/dashboard.service";

describe("dashboardService", () => {
  const mockApiUrl = "http://localhost:5001/api";

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = mockApiUrl;
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("getStats", () => {
    it("should GET /admin/stats with auth header", async () => {
      localStorage.setItem("adminToken", "test-token");
      const mockResponse = {
        success: true,
        stats: { totalJobs: 10, activeJobs: 5, expiredJobs: 3, draftJobs: 2 },
        charts: { jobsByCategory: [], jobsOverTime: [] },
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => mockResponse,
      });

      const result = await dashboardService.getStats();

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/admin/stats`,
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle error response", async () => {
      const errorResponse = {
        success: false,
        message: "Unauthorized",
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => errorResponse,
      });

      const result = await dashboardService.getStats();
      expect(result.success).toBe(false);
    });
  });
});
