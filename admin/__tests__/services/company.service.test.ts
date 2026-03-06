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
    it("should GET /companies with page, limit, and search params", async () => {
      const mockResponse = {
        success: true,
        data: [{ id: 1, name: "Acme", location: "NYC" }],
        pagination: { total: 1, totalPages: 1 },
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => mockResponse,
      });

      const result = await companyService.getCompanies(2, 5, "acme");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`${mockApiUrl}/companies?`),
        expect.objectContaining({ method: "GET" }),
      );
      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
      expect(calledUrl).toContain("page=2");
      expect(calledUrl).toContain("limit=5");
      expect(calledUrl).toContain("search=acme");
      expect(result.data).toHaveLength(1);
    });

    it("should default to page 1, limit 10, no search", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true, data: [] }),
      });

      await companyService.getCompanies();

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
      expect(calledUrl).toContain("page=1");
      expect(calledUrl).toContain("limit=10");
      expect(calledUrl).not.toContain("search=");
    });

    it("should omit search param when empty string", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true, data: [] }),
      });

      await companyService.getCompanies(1, 10, "");

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
      expect(calledUrl).not.toContain("search");
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
