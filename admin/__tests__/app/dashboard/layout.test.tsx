import { fireEvent, render, screen } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "../../../src/app/dashboard/layout";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe("DashboardLayout", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue("/dashboard");

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  it("renders navigation items", () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Jobs")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("Companies")).toBeInTheDocument();
    expect(screen.getByText("Applicants")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("highlights active navigation item", () => {
    (usePathname as jest.Mock).mockReturnValue("/dashboard/jobs");
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>,
    );

    const jobsLink = screen.getByText("Jobs").closest("a");
    expect(jobsLink).toHaveClass("bg-sidebar-active");
  });

  it("handles logout correctly", () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>,
    );

    fireEvent.click(screen.getByText(/Logout/i));

    expect(window.localStorage.removeItem).toHaveBeenCalledWith("adminToken");
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("toggles sidebar on mobile", () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>,
    );

    const sidebar = screen.getByRole("complementary");
    expect(sidebar).toHaveClass("-translate-x-full");

    // Open sidebar
    fireEvent.click(screen.getByLabelText("Open sidebar"));
    expect(sidebar).toHaveClass("translate-x-0");

    // Close sidebar
    fireEvent.click(screen.getByLabelText("Close sidebar"));
    expect(sidebar).toHaveClass("-translate-x-full");
  });
});
