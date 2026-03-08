import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import LoginPage from "../../../src/app/login/page";
import { authService } from "../../../src/services/auth.service";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock authService
jest.mock("../../../src/services/auth.service", () => ({
  authService: {
    login: jest.fn(),
  },
}));

describe("LoginPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        setItem: jest.fn(),
        removeItem: jest.fn(),
        getItem: jest.fn(),
      },
      writable: true,
    });
  });

  it("renders login form correctly", () => {
    render(<LoginPage />);
    expect(
      screen.getByRole("heading", { name: /Sign In/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Email or Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it("shows error if fields are empty", async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(
      await screen.findByText("Please fill in all fields"),
    ).toBeInTheDocument();
  });

  it("calls authService.login and redirects on success", async () => {
    (authService.login as jest.Mock).mockResolvedValue({
      success: true,
      token: "mock-token",
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email or Username/i), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith(
        "admin@test.com",
        "password123",
      );
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "adminToken",
        "mock-token",
      );
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error message on failed login", async () => {
    (authService.login as jest.Mock).mockResolvedValue({
      success: false,
      message: "Invalid credentials",
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email or Username/i), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });
});
