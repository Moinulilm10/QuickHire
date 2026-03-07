import { apiService } from "./api.service";

export const applicationService = {
  async createApplication(formData: FormData, token: string) {
    // For FormData, we let fetch set the Content-Type
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api";
    const res = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      if (res.status === 413) {
        throw new Error("File size is too large (max 5MB).");
      }
      const data = await res.json();
      throw new Error(data.message || "Failed to submit application");
    }

    return await res.json();
  },

  async getMyApplications(token: string) {
    const data = await apiService.get("/applications/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  async getAllApplications(token: string) {
    const data = await apiService.get("/applications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  async updateApplicationStatus(id: number, status: string, token: string) {
    const data = await apiService.post(
      `/applications/${id}/status`,
      { status },
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      } as any,
    );
    return data;
  },

  async deleteApplication(id: number, token: string) {
    const data = await apiService.delete(`/applications/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
