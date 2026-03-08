import { render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { DashboardDataContent } from "../../../src/components/dashboard/DashboardDataContent";

// Mock recharts
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children }: any) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  AreaChart: ({ children }: any) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Bar: () => <div />,
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}));

const mockData = {
  success: true,
  stats: {
    totalJobs: 100,
    activeJobs: 80,
    totalApplicants: 500,
    totalCompanies: 40,
  },
  charts: {
    jobsByCategory: [{ name: "Web", count: 30 }],
    jobsOverTime: [{ month: "Jan", jobs: 10, users: 20 }],
    topCompaniesByApplicants: [{ name: "Google", count: 50 }],
  },
};

const createResolvedPromise = (data: any) => {
  const p = Promise.resolve(data);
  (p as any).status = "fulfilled";
  (p as any).value = data;
  return p;
};

describe("DashboardDataContent", () => {
  it("renders empty state for charts if no data", async () => {
    const emptyData = {
      ...mockData,
      charts: {
        jobsByCategory: [],
        jobsOverTime: [],
        topCompaniesByApplicants: [],
      },
    };
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardDataContent dataPromise={createResolvedPromise(emptyData)} />
      </Suspense>,
    );

    await waitFor(
      () => {
        expect(
          screen.getByText("No category data available"),
        ).toBeInTheDocument();
        expect(screen.getAllByText("No trend data available")).toHaveLength(2);
      },
      { timeout: 2000 },
    );
  });

  it("renders statistics cards with data", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardDataContent dataPromise={createResolvedPromise(mockData)} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("Total Jobs")).toBeInTheDocument();
      expect(screen.getByText("80")).toBeInTheDocument();
      expect(screen.getByText("Active Jobs")).toBeInTheDocument();
    });
  });

  it("renders charts", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardDataContent dataPromise={createResolvedPromise(mockData)} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("bar-chart")).toHaveLength(2);
      expect(screen.getAllByTestId("area-chart")).toHaveLength(2);
    });
  });
});
