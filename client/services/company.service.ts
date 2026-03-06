const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

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
    const res = await fetch(`${apiUrl}/companies?${query.toString()}`);
    const data = await res.json();
    if (data.success) {
      return data;
    }
    throw new Error(data.message || "Failed to fetch companies");
  },

  /**
   * Fetch a complete, unomitted company entity directly via UUID or ID for Details Page mapping.
   */
  async getCompanyDetails(identifier: string) {
    const res = await fetch(`${apiUrl}/companies/${identifier}`);
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Failed to fetch company details");
  },
};
