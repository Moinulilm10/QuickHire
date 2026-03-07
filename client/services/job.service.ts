import { apiService } from "./api.service";

export const jobService = {
  /**
   * Fetch the filtered payload of the latest jobs directly for homepage UI mapping.
   */
  async getLatestJobs() {
    const data = await apiService.get("/jobs/latest");
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Failed to fetch latest jobs");
  },

  /**
   * Fetch featured jobs based on specific criteria (Remote/Hybrid + Recent).
   */
  async getFeaturedJobs() {
    const data = await apiService.get("/jobs/featured");
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Failed to fetch featured jobs");
  },

  /**
   * Fetch a complete, unomitted job entity directly via UUID or ID for Details Page mapping.
   */
  async getJobDetails(identifier: string, token?: string) {
    const options: any = {};
    if (token) {
      options.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const data = await apiService.get(`/jobs/${identifier}`, options);
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Failed to fetch job details");
  },
};
