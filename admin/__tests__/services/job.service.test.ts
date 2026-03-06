/**
 * @jest-environment jsdom
 */

global.fetch = jest.fn();

import { jobService } from "@/services/job.service";

describe("jobService", () => {
  const mockApiUrl = "http://localhost:5001/api";

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = mockApiUrl;
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("adminToken", "admin-jwt");
  });

  describe("getJobs", () => {
    it("should GET /jobs with page and limit params", async () => {
      const mockResponse = {
        success: true,
        jobs: [{ id: 1, title: "Dev" }],
        pagination: { total: 1, totalPages: 1 },
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => mockResponse,
      });

      const result = await jobService.getJobs(2, 8);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/jobs?page=2&limit=8`,
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer admin-jwt",
          }),
        }),
      );
      expect(result.jobs).toHaveLength(1);
    });

    it("should default to page 1, limit 8", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true, jobs: [] }),
      });

      await jobService.getJobs();

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/jobs?page=1&limit=8`,
        expect.anything(),
      );
    });
  });

  describe("createJob", () => {
    it("should POST to /jobs with payload", async () => {
      const payload = {
        title: "Dev",
        company: "Acme",
        location: "NYC",
        type: "Full Time",
        description: "Build stuff",
        logo: null,
        experience: "2 years",
        salary: "$100k",
        categories: ["Tech"],
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true, data: { id: 1, ...payload } }),
      });

      const result = await jobService.createJob(payload);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/jobs`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(payload),
        }),
      );
      expect(result.success).toBe(true);
    });
  });

  describe("updateJob", () => {
    it("should PUT to /jobs/:id with payload", async () => {
      const payload = {
        title: "Senior Dev",
        company: "Acme",
        location: "Remote",
        type: "Full Time",
        description: "Lead stuff",
        logo: null,
        experience: "5 years",
        salary: "$150k",
        categories: ["Tech", "Management"],
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true }),
      });

      await jobService.updateJob(42, payload);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/jobs/42`,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(payload),
        }),
      );
    });
  });

  describe("deleteJob", () => {
    it("should DELETE /jobs/:id", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true }),
      });

      const result = await jobService.deleteJob(7);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/jobs/7`,
        expect.objectContaining({ method: "DELETE" }),
      );
      expect(result.success).toBe(true);
    });
  });
});
