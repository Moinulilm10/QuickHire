import { apiClient } from "./apiClient";

export interface JobPayload {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  logo: string | null;
  experience: string;
  salary: string;
  categories: string[];
}

export const jobService = {
  async getJobs(page = 1, limit = 8, search = "") {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search ? { search } : {}),
    });
    return apiClient(`/jobs?${query.toString()}`);
  },

  async createJob(data: JobPayload) {
    return apiClient("/jobs", { method: "POST", body: data });
  },

  async updateJob(id: number, data: JobPayload) {
    return apiClient(`/jobs/${id}`, { method: "PUT", body: data });
  },

  async deleteJob(id: number) {
    return apiClient(`/jobs/${id}`, { method: "DELETE" });
  },
};
