/**
 * @jest-environment jsdom
 */

global.fetch = jest.fn();

import { authService } from "@/services/auth.service";

describe("authService", () => {
  const mockApiUrl = "http://localhost:5001/api";

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = mockApiUrl;
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("login", () => {
    it("should POST to /auth/login with email and password", async () => {
      const mockResponse = { success: true, token: "jwt-token-123" };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => mockResponse,
      });

      const result = await authService.login("admin@test.com", "password123");

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/auth/login`,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            email: "admin@test.com",
            password: "password123",
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should not include Authorization header (auth: false)", async () => {
      localStorage.setItem("adminToken", "existing-token");
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true }),
      });

      await authService.login("admin@test.com", "pass");

      const callHeaders = (global.fetch as jest.Mock).mock.calls[0][1].headers;
      expect(callHeaders.Authorization).toBeUndefined();
    });

    it("should return error response on failed login", async () => {
      const errorResponse = {
        success: false,
        message: "Invalid credentials",
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => errorResponse,
      });

      const result = await authService.login("wrong@email.com", "wrongpass");
      expect(result).toEqual(errorResponse);
    });
  });
});
