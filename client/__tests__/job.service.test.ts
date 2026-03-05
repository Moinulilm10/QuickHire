import { jobService } from "../services/job.service";

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

describe("jobService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("getLatestJobs", () => {
    it("successfully fetches and returns the latest jobs", async () => {
      const mockJobs = [
        { id: 1, uuid: "uuid-1", title: "Frontend Developer" },
        { id: 2, uuid: "uuid-2", title: "Backend Developer" },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockJobs,
        }),
      });

      const result = await jobService.getLatestJobs();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/jobs/latest"),
      );
      expect(result).toEqual(mockJobs);
    });

    it("throws a default error if no message is provided on failure", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          success: false,
        }),
      });

      await expect(jobService.getLatestJobs()).rejects.toThrow(
        "Failed to fetch latest jobs",
      );
    });
  });

  describe("getJobDetails", () => {
    it("successfully fetches and returns job details for a generic UUID", async () => {
      const mockJob = {
        id: 1,
        uuid: "uuid-test-1",
        title: "Frontend Developer",
        description: "Test",
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockJob,
        }),
      });

      const result = await jobService.getJobDetails("uuid-test-1");

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/jobs/uuid-test-1"),
      );
      expect(result).toEqual(mockJob);
    });

    it("throws an error if the network request fails", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));

      await expect(jobService.getJobDetails("uuid-test-1")).rejects.toThrow(
        "Network Error",
      );
    });
  });
});
