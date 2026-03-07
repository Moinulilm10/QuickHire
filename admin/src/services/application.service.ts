import { apiClient } from "./apiClient";

export const applicationService = {
  async getAllApplications() {
    const data = await apiClient("/applications", {
      auth: true,
    });
    return data;
  },

  async updateApplicationStatus(id: number, status: string) {
    const data = await apiClient(`/applications/${id}/status`, {
      method: "PATCH",
      body: { status },
      auth: true,
    });
    return data;
  },

  async deleteApplication(id: number) {
    const data = await apiClient(`/applications/${id}`, {
      method: "DELETE",
      auth: true,
    });
    return data;
  },
};
