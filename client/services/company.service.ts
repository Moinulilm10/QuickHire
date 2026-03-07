import { apiService } from "./api.service";

export const companyService = {
  /**
   * Fetch all companies with pagination.
   */
  async getAllCompanies(page = 1, limit = 10, search = "") {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search ? { search } : {}),
    });
    const data = await apiService.get(`/companies?${query.toString()}`);
    if (data.success) {
      return data;
    }
    throw new Error(data.message || "Failed to fetch companies");
  },

  /**
   * Fetch a complete, unomitted company entity directly via UUID or ID for Details Page mapping.
   */
  async getCompanyDetails(identifier: string) {
    const data = await apiService.get(`/companies/${identifier}`);
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Failed to fetch company details");
  },
};
