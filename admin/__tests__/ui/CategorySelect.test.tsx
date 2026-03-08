import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import CategorySelect from "../../src/components/ui/CategorySelect";

// Mock alertService
jest.mock("../../src/utils/alertService", () => ({
  alertService: {
    error: jest.fn(),
  },
}));

describe("CategorySelect Component", () => {
  const defaultProps = {
    selectedCategories: [],
    onChange: jest.fn(),
    error: "",
  };

  const mockCategories = [
    { id: 1, name: "Web Development" },
    { id: 2, name: "UI/UX Design" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        success: true,
        data: mockCategories,
        pagination: { page: 1, totalPages: 1 },
      }),
    });
  });

  it("renders with empty selection label", () => {
    render(<CategorySelect {...defaultProps} />);
    expect(screen.getByText("Select Categories...")).toBeInTheDocument();
  });

  it("opens dropdown on click and fetches categories", async () => {
    render(<CategorySelect {...defaultProps} />);
    const selectArea = screen.getByText("Select Categories...");
    fireEvent.click(selectArea);

    expect(
      screen.getByPlaceholderText("Search categories..."),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(screen.getByText("Web Development")).toBeInTheDocument();
      expect(screen.getByText("UI/UX Design")).toBeInTheDocument();
    });
  });

  it("displays selected categories as tags", () => {
    render(
      <CategorySelect
        {...defaultProps}
        selectedCategories={["Engineering", "Marketing"]}
      />,
    );
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Marketing")).toBeInTheDocument();
  });

  it("can select a category from the dropdown", async () => {
    const handleChange = jest.fn();
    render(<CategorySelect {...defaultProps} onChange={handleChange} />);

    fireEvent.click(screen.getByText("Select Categories..."));

    await waitFor(() => screen.getByText("Web Development"));
    fireEvent.click(screen.getByText("Web Development"));

    expect(handleChange).toHaveBeenCalledWith(["Web Development"]);
  });

  it("can deselect a category by clicking its tag's X button", () => {
    const handleChange = jest.fn();
    render(
      <CategorySelect
        {...defaultProps}
        selectedCategories={["Design"]}
        onChange={handleChange}
      />,
    );

    const xButton = screen.getByRole("button");
    fireEvent.click(xButton);

    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it("shows error message when provided", () => {
    render(<CategorySelect {...defaultProps} error="Category is required" />);
    expect(screen.getByText("Category is required")).toBeInTheDocument();
  });

  it("filters categories based on search term (debounced)", async () => {
    jest.useFakeTimers();
    render(<CategorySelect {...defaultProps} />);

    fireEvent.click(screen.getByText("Select Categories..."));
    const searchInput = screen.getByPlaceholderText("Search categories...");

    fireEvent.change(searchInput, { target: { value: "web" } });

    // Should not call immediately
    expect(global.fetch).not.toHaveBeenCalledWith(
      expect.stringContaining("search=web"),
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("search=web"),
      );
    });

    jest.useRealTimers();
  });
});
