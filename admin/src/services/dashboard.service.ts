import { apiClient } from "./apiClient";

export const dashboardService = {
  async getStats() {
    return apiClient("/admin/stats");
  },
};
