import { apiService } from "../services/api.service";
import { authService } from "../services/auth.service";

// Mock apiService
jest.mock("../services/api.service", () => ({
  apiService: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe("authService (Client)", () => {
  const mockUser = {
    email: "test@example.com",
    password: "password123",
    name: "Test User",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call apiService.post for signup", async () => {
    (apiService.post as jest.Mock).mockResolvedValue({
      success: true,
      token: "mock-token",
    });

    const result = await authService.signup(mockUser);

    expect(apiService.post).toHaveBeenCalledWith("/auth/signup", mockUser);
    expect(result.success).toBe(true);
  });

  it("should call apiService.post for login", async () => {
    (apiService.post as jest.Mock).mockResolvedValue({
      success: true,
      token: "mock-token",
    });

    const result = await authService.login({
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(apiService.post).toHaveBeenCalledWith("/auth/login", {
      email: mockUser.email,
      password: mockUser.password,
    });
    expect(result.success).toBe(true);
  });

  it("should call apiService.get with auth for profile", async () => {
    (apiService.get as jest.Mock).mockResolvedValue({
      success: true,
      user: mockUser,
    });

    const result = await authService.getProfile();

    expect(apiService.get).toHaveBeenCalledWith("/auth/profile", {
      requireAuth: true,
    });
    expect(result.success).toBe(true);
  });

  it("should handle login errors gracefully", async () => {
    (apiService.post as jest.Mock).mockRejectedValue(
      new Error("Invalid credentials"),
    );

    await expect(
      authService.login({ email: "wrong@test.com", password: "123" }),
    ).rejects.toThrow("Invalid credentials");
  });
});
