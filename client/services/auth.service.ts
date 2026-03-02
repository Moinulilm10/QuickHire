import { apiService } from "./api.service";

export const authService = {
  login: async (credentials: any) => {
    return apiService.post("/auth/login", credentials);
  },

  signup: async (userData: any) => {
    return apiService.post("/auth/signup", userData);
  },

  getProfile: async () => {
    return apiService.get("/auth/profile", { requireAuth: true });
  },
};
