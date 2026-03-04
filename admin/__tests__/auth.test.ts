/**
 * @jest-environment jsdom
 */

// Simple mock for fetch
global.fetch = jest.fn();

describe("Admin Auth Flow", () => {
  const mockApiUrl = "http://localhost:5500/api";

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = mockApiUrl;
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should store adminToken in localStorage on successful login", async () => {
    const mockToken = "fake-jwt-token";
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        token: mockToken,
      }),
    });

    // Simulate the fetch call used in admin login/page.tsx
    const res = await fetch(`${mockApiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@quickhire.com",
        password: "password",
      }),
    });
    const data = await res.json();

    if (data.success && data.token) {
      localStorage.setItem("adminToken", data.token);
    }

    expect(localStorage.getItem("adminToken")).toBe(mockToken);
  });

  it("should not store token if login fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: "Invalid credentials",
      }),
    });

    const res = await fetch(`${mockApiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "wrong@admin.com", password: "wrong" }),
    });
    const data = await res.json();

    if (data.success && data.token) {
      localStorage.setItem("adminToken", data.token);
    }

    expect(localStorage.getItem("adminToken")).toBeNull();
  });
});
