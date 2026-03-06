import { applicationService } from "../services/application.service";

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

describe("applicationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(() => "mock-token");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("createApplication", () => {
    it("successfully creates a new job application", async () => {
      const mockApplication = {
        id: 1,
        jobId: 10,
        companyId: 20,
        status: "PENDING",
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockApplication,
        }),
      });

      const formData = new FormData();
      formData.append("jobId", "10");
      formData.append("companyId", "20");

      const result = await applicationService.createApplication(formData);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/applications"),
        expect.objectContaining({
          method: "POST",
          headers: {
            Authorization: "Bearer mock-token",
          },
          body: formData,
        }),
      );
      expect(result).toEqual({ success: true, data: mockApplication });
    });

    it("throws an error if the request fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          message: "You have already applied",
        }),
      });

      const formData = new FormData();
      formData.append("jobId", "10");

      await expect(
        applicationService.createApplication(formData),
      ).rejects.toThrow("You have already applied");
    });
  });

  describe("getMyApplications", () => {
    it("successfully fetches current user applications", async () => {
      const mockApps = [{ id: 1, jobId: 10, status: "PENDING" }];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: mockApps,
        }),
      });

      const result = await applicationService.getMyApplications();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/applications/my"),
        expect.objectContaining({
          headers: {
            Authorization: "Bearer mock-token",
          },
        }),
      );
      expect(result).toEqual({ data: mockApps });
    });

    it("throws an error when failed to fetch my applications", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          message: "Unauthorized",
        }),
      });

      await expect(applicationService.getMyApplications()).rejects.toThrow(
        "Unauthorized",
      );
    });
  });
});
