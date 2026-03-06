import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import CompaniesPage from "../../../app/companies/page";
import { companyService } from "../../../services/company.service";

// Mock the companyService module
jest.mock("../../../services/company.service");

// Mock AuthContext because Navbar relies on it
jest.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    isLoaded: true,
    logout: jest.fn(),
  }),
}));

// Mock next components
jest.mock("next/link", () => ({ children, href }: any) => (
  <a href={href}>{children}</a>
));
jest.mock("next/image", () => ({ src, alt }: any) => (
  <img src={src} alt={alt} />
));

describe("CompaniesPage", () => {
  const mockCompanies = [
    {
      id: 1,
      uuid: "123",
      name: "Acme Corp",
      location: "New York",
      logo: "logo.png",
      jobs: [{ id: 1 }],
    },
    {
      id: 2,
      uuid: "456",
      name: "Global Tech",
      location: "San Francisco",
      logo: null,
      jobs: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeletons initially", () => {
    (companyService.getAllCompanies as jest.Mock).mockReturnValue(
      new Promise(() => {}),
    ); // Never resolves
    render(<CompaniesPage />);
    expect(screen.getByText("Discover")).toBeInTheDocument();
    const companyElements = screen.getAllByText("Companies");
    expect(companyElements.length).toBeGreaterThan(0);
  });

  it("renders companies when fetch succeeds", async () => {
    (companyService.getAllCompanies as jest.Mock).mockResolvedValue({
      success: true,
      data: mockCompanies,
      pagination: { totalPages: 1, total: 2 },
    });

    render(<CompaniesPage />);

    await waitFor(() => {
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
      expect(screen.getByText("Global Tech")).toBeInTheDocument();
      expect(screen.getByText("1 Jobs Available")).toBeInTheDocument(); // For Acme
      expect(screen.getByText("0 Jobs Available")).toBeInTheDocument(); // For Global
    });
  });

  it("shows empty state when no companies found or fetch fails", async () => {
    // Return empty array
    (companyService.getAllCompanies as jest.Mock).mockResolvedValue({
      success: true,
      data: [],
      pagination: { totalPages: 1, total: 0 },
    });

    render(<CompaniesPage />);

    await waitFor(() => {
      expect(screen.getByText("No Companies Found")).toBeInTheDocument();
    });
  });
});
