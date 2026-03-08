import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CompaniesPage from "../../../../src/app/dashboard/companies/page";
import { companyService } from "../../../../src/services/company.service";

// Mock services
jest.mock("../../../../src/services/company.service", () => ({
  companyService: {
    getCompanies: jest.fn(),
    createCompany: jest.fn(),
    updateCompany: jest.fn(),
    deleteCompany: jest.fn(),
  },
}));

// Mock alert service
jest.mock("../../../../src/utils/alertService", () => ({
  alertService: {
    confirm: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock child components using the same alias pattern as the component
jest.mock("@/components/companies/CompaniesDataContent", () => ({
  CompaniesDataContent: () => <div data-testid="companies-content">Data</div>,
  CompaniesLoadingSkeleton: () => <div>Loading...</div>,
}));

jest.mock("@/components/companies/CompanyForm", () => ({
  __esModule: true,
  default: () => <div data-testid="company-form">Form</div>,
}));

describe("CompaniesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (companyService.getCompanies as jest.Mock).mockReturnValue(
      Promise.resolve({ success: true, data: [] }),
    );
  });

  it("renders and fetches companies", async () => {
    render(<CompaniesPage />);
    expect(companyService.getCompanies).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByTestId("companies-content")).toBeInTheDocument(),
    );
  });

  it("opens modal on add button click", async () => {
    render(<CompaniesPage />);
    const addButton = screen.getByText("Add Company");
    fireEvent.click(addButton);
    expect(screen.getByTestId("company-form")).toBeInTheDocument();
  });
});
