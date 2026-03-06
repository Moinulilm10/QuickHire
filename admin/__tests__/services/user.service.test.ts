/**
 * @jest-environment jsdom
 */

global.fetch = jest.fn();

import { userService } from "@/services/user.service";

describe("userService", () => {
  const mockApiUrl = "http://localhost:5001/api";

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = mockApiUrl;
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("adminToken", "admin-jwt");
  });

  describe("getUsers", () => {
    it("should GET /auth/users with page and limit", async () => {
      const mockResponse = {
        success: true,
        users: [
          {
            id: "u1",
            name: "John",
            email: "john@test.com",
            role: "user",
            authProvider: "local",
            createdAt: "2024-01-01",
          },
        ],
        pagination: { total: 1, totalPages: 1 },
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => mockResponse,
      });

      const result = await userService.getUsers(1, 10);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/auth/users?page=1&limit=10`,
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer admin-jwt",
          }),
        }),
      );
      expect(result.users).toHaveLength(1);
    });

    it("should default to page 1, limit 10", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true, users: [] }),
      });

      await userService.getUsers();

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/auth/users?page=1&limit=10`,
        expect.anything(),
      );
    });
  });

  describe("deleteUser", () => {
    it("should DELETE /auth/users/:id with auth header", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: true }),
      });

      const result = await userService.deleteUser("user-uuid-123");

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/auth/users/user-uuid-123`,
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            Authorization: "Bearer admin-jwt",
          }),
        }),
      );
      expect(result.success).toBe(true);
    });

    it("should handle failed deletion", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ success: false, message: "Not found" }),
      });

      const result = await userService.deleteUser("non-existent");
      expect(result.success).toBe(false);
      expect(result.message).toBe("Not found");
    });
  });
});
