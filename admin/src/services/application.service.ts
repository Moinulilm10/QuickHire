const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const applicationService = {
  async getAllApplications() {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(`${API_URL}/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminToken");
        window.location.href = "/login";
      }
      const data = await res.json();
      throw new Error(data.message || "Failed to fetch applications");
    }

    return res.json();
  },

  async updateApplicationStatus(id: number, status: string) {
    const token = localStorage.getItem("adminToken");
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

    return res.json();
  },

  async deleteApplication(id: number) {
    const token = localStorage.getItem("adminToken");
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

    return res.json();
  },
};
