import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ApplicantsPage from "../../../../src/app/dashboard/applicants/page";
import { applicationService } from "../../../../src/services/application.service";
import { alertService } from "../../../../src/utils/alertService";

// Mock services
jest.mock("../../../../src/services/application.service", () => ({
  applicationService: {
    getAllApplications: jest.fn(),
    deleteApplication: jest.fn(),
  },
}));

jest.mock("../../../../src/utils/alertService", () => ({
  alertService: {
    confirm: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    toast: jest.fn(),
  },
}));

// Mock PDF Preview modal
jest.mock("@/components/ui/PdfPreviewModal", () => () => (
  <div data-testid="pdf-modal">PDF Modal</div>
));

describe("ApplicantsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (applicationService.getAllApplications as jest.Mock).mockReturnValue(
      Promise.resolve({ success: true, data: [] }),
    );
  });

  it("renders and fetches applicants", async () => {
    render(<ApplicantsPage />);
    expect(applicationService.getAllApplications).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByText("Job Applicants")).toBeInTheDocument(),
    );
  });

  it("handles applicant deletion", async () => {
    (alertService.confirm as jest.Mock).mockResolvedValue({
      isConfirmed: true,
    });
    (applicationService.deleteApplication as jest.Mock).mockResolvedValue({
      success: true,
    });

    (applicationService.getAllApplications as jest.Mock).mockReturnValue(
      Promise.resolve({
        success: true,
        data: [
          {
            id: 1,
            user: { name: "John Doe", email: "john@test.com" },
            job: { title: "Dev" },
            company: { name: "Apple" },
            status: "PENDING",
            createdAt: "2024-01-01",
          },
        ],
      }),
    );

    render(<ApplicantsPage />);

    await waitFor(() => screen.getByTitle("Delete Application"));
    fireEvent.click(screen.getByTitle("Delete Application"));

    await waitFor(() => {
      expect(applicationService.deleteApplication).toHaveBeenCalledWith(1);
      expect(alertService.success).toHaveBeenCalled();
    });
  });
});
