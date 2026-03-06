/**
 * @jest-environment jsdom
 */

global.fetch = jest.fn();

import { companyService } from "@/services/company.service";

describe("companyService", () => {
  const mockApiUrl = "http://localhost:5001/api";

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = mockApiUrl;
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("getCompanies", () => {
    it("should GET /companies with limit param", async () => {
      const mockResponse = {
        success: true,
        data: [{ id: 1, name: "Acme", location: "NYC" }],
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => mockResponse,
      });

      const result = await companyService.getCompanies(50);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/companies?limit=50`,
        expect.objectContaining({ method: "GET" }),
      );
      expect(result.data).toHaveLength(1);
    });

    it("should default limit to 100", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true, data: [] }),
      });

      await companyService.getCompanies();

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/companies?limit=100`,
        expect.anything(),
      );
    });
  });

  describe("createCompany", () => {
    it("should POST to /companies with payload", async () => {
      const payload = { name: "NewCo", location: "LA", logo: "" };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true }),
      });

      await companyService.createCompany(payload);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/companies`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(payload),
        }),
      );
    });
  });

  describe("updateCompany", () => {
    it("should PUT to /companies/:id with payload", async () => {
      const payload = { name: "Updated", location: "SF", logo: "" };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true }),
      });

      await companyService.updateCompany(5, payload);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/companies/5`,
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(payload),
        }),
      );
    });
  });

  describe("deleteCompany", () => {
    it("should DELETE /companies/:id", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true }),
      });

      const result = await companyService.deleteCompany(3);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/companies/3`,
        expect.objectContaining({ method: "DELETE" }),
      );
      expect(result.success).toBe(true);
    });
  });
});
