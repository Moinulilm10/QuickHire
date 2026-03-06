import { apiClient } from "./apiClient";

export interface CompanyPayload {
  name: string;
  location: string;
  logo: string;
}

export const companyService = {
  async getCompanies(limit = 100) {
    return apiClient(`/companies?limit=${limit}`, { auth: false });
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
