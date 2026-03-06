import { apiClient } from "./apiClient";

export const authService = {
  async login(email: string, password: string) {
    return apiClient("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
  },
};
