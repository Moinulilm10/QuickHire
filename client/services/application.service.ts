const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const applicationService = {
  async createApplication(formData: FormData, token: string) {
    const res = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // fetch will automatically set Content-Type to multipart/form-data
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
    const res = await fetch(`${API_URL}/applications/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to fetch applications");
    }

    return await res.json();
  },

  async getAllApplications(token: string) {
    const res = await fetch(`${API_URL}/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to fetch applications");
    }

    return await res.json();
  },

  async updateApplicationStatus(id: number, status: string, token: string) {
    const res = await fetch(`${API_URL}/applications/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to update status");
    }

    return await res.json();
  },

  async deleteApplication(id: number, token: string) {
    const res = await fetch(`${API_URL}/applications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to delete application");
    }

    return await res.json();
  },
};
