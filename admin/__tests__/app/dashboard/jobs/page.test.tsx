import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import JobsPage from "../../../../src/app/dashboard/jobs/page";
import { jobService } from "../../../../src/services/job.service";

// Mock services
jest.mock("../../../../src/services/job.service", () => ({
  jobService: {
    getJobs: jest.fn(),
    createJob: jest.fn(),
    deleteJob: jest.fn(),
    updateJob: jest.fn(),
  },
}));

jest.mock("../../../../src/utils/alertService", () => ({
  alertService: {
    confirm: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock child components
jest.mock("@/components/jobs/JobsListContent", () => ({
  JobsListContent: () => <div data-testid="jobs-content">Jobs List</div>,
  JobsLoadingSkeleton: () => (
    <div data-testid="loading-skeleton">Loading...</div>
  ),
}));

jest.mock("@/components/jobs/AddJobForm", () => ({
  __esModule: true,
  default: ({ onCancel }: any) => (
    <div data-testid="job-form">
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

describe("JobsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (jobService.getJobs as jest.Mock).mockReturnValue(
      Promise.resolve({ success: true, jobs: [] }),
    );
  });

  it("renders and fetches jobs", async () => {
    render(<JobsPage />);
    expect(jobService.getJobs).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByTestId("jobs-content")).toBeInTheDocument(),
    );
  });

  it("toggles add job form", async () => {
    render(<JobsPage />);
    // Use the button from JobsPage itself
    const addButton = screen.getByText("Add New Job");
    fireEvent.click(addButton);

    expect(screen.getByTestId("job-form")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByTestId("job-form")).not.toBeInTheDocument();
  });
});
