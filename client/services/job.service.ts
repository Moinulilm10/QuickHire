const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const jobService = {
  /**
   * Fetch the filtered payload of the latest jobs directly for homepage UI mapping.
   */
  async getLatestJobs() {
    const res = await fetch(`${apiUrl}/jobs/latest`);
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Failed to fetch latest jobs");
  },

  /**
   * Fetch featured jobs based on specific criteria (Remote/Hybrid + Recent).
   */
  async getFeaturedJobs() {
    const res = await fetch(`${apiUrl}/jobs/featured`);
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Failed to fetch featured jobs");
  },

  /**
   * Fetch a complete, unomitted job entity directly via UUID or ID for Details Page mapping.
   */
  /**
   * Fetch a complete, unomitted job entity directly via UUID or ID for Details Page mapping.
   */
  async getJobDetails(identifier: string, token?: string) {
    const headers: any = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${apiUrl}/jobs/${identifier}`, {
      headers,
    });
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
    throw new Error(data.message || "Failed to fetch job details");
  },
};
