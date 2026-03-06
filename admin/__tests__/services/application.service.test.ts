import { applicationService } from "../../src/services/application.service";

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

describe("Admin applicationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(() => "admin-mock-token");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("getAllApplications", () => {
    it("successfully fetches all applications", async () => {
      const mockApps = [
        { id: 1, status: "PENDING" },
        { id: 2, status: "ACCEPTED" },
      ];

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: mockApps,
        }),
      });

      const result = await applicationService.getAllApplications();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/applications"),
        expect.objectContaining({
          headers: {
            Authorization: "Bearer admin-mock-token",
          },
        }),
      );
      expect(result).toEqual({ data: mockApps });
    });

    it("throws an error when failed to fetch applications", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({
          message: "Failed to fetch applications",
        }),
      });

      await expect(applicationService.getAllApplications()).rejects.toThrow(
        "Failed to fetch applications",
      );
    });

    it("redirects on 401 unauthorized", async () => {
      // Mock window.location
      const mockLocation = { href: "" };
      Object.defineProperty(window, "location", {
        value: mockLocation,
        writable: true,
      });

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        json: jest.fn().mockResolvedValue({
          message: "Unauthorized",
        }),
      });

      await expect(applicationService.getAllApplications()).rejects.toThrow(
        "Unauthorized",
      );
      expect(mockLocation.href).toBe("/login");
    });
  });

  describe("updateApplicationStatus", () => {
    it("successfully updates application status", async () => {
      const mockApp = { id: 1, status: "ACCEPTED" };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: mockApp,
        }),
      });

      const result = await applicationService.updateApplicationStatus(
        1,
        "ACCEPTED",
      );

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/applications/1/status"),
        expect.objectContaining({
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer admin-mock-token",
          },
          body: JSON.stringify({ status: "ACCEPTED" }),
        }),
      );
      expect(result).toEqual({ success: true, data: mockApp });
    });
  });

  describe("deleteApplication", () => {
    it("successfully deletes the application", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          message: "Deleted",
        }),
      });

      const result = await applicationService.deleteApplication(1);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/applications/1"),
        expect.objectContaining({
          method: "DELETE",
          headers: {
            Authorization: "Bearer admin-mock-token",
          },
        }),
      );
      expect(result).toEqual({ success: true, message: "Deleted" });
    });
  });
});
