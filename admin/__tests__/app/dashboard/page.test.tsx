import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "../../../src/app/dashboard/page";
import { dashboardService } from "../../../src/services/dashboard.service";

// Mock services
jest.mock("../../../src/services/dashboard.service", () => ({
  dashboardService: {
    getStats: jest.fn(),
  },
}));

// Mock components
jest.mock("@/components/dashboard/DashboardDataContent", () => ({
  DashboardDataContent: ({ dataPromise }: any) => {
    return <div data-testid="dashboard-content">Dashboard Content</div>;
  },
  DashboardLoadingSkeleton: () => (
    <div data-testid="loading-skeleton">Loading...</div>
  ),
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders page title and fetches data", async () => {
    const mockPromise = Promise.resolve({
      success: true,
      stats: {},
      charts: {},
    });
    (dashboardService.getStats as jest.Mock).mockReturnValue(mockPromise);

    render(<DashboardPage />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(dashboardService.getStats).toHaveBeenCalled();

    // Check for "Dashboard Content" to confirm it loaded
    await waitFor(
      () => {
        expect(screen.getByTestId("dashboard-content")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});
