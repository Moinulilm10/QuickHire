import { apiClient } from "./apiClient";

export interface CompanyPayload {
  name: string;
  location: string;
  logo: string;
}

export const companyService = {
  async getCompanies(page = 1, limit = 10, search = "") {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search ? { search } : {}),
    });
    return apiClient(`/companies?${query.toString()}`, { auth: false });
  },

  async createCompany(data: CompanyPayload) {
    return apiClient("/companies", { method: "POST", body: data, auth: false });
  },

  async updateCompany(id: number, data: CompanyPayload) {
    return apiClient(`/companies/${id}`, {
      method: "PUT",
      body: data,
      auth: false,
    });
  },

  async deleteCompany(id: number) {
    return apiClient(`/companies/${id}`, { method: "DELETE", auth: false });
  },
};
