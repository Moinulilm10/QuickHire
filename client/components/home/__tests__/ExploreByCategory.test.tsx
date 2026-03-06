import { categoryService } from "@/services/category.service";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import ExploreByCategory from "../ExploreByCategory";

// Mock the next/link component
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock the CategoryCard component
jest.mock("@/components/ui/CategoryCard", () => ({
  CategoryCard: ({ category }: { category: any }) => (
    <div data-testid="category-card">{category.name}</div>
  ),
}));

// Mock the categoryService
jest.mock("@/services/category.service");

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe("ExploreByCategory Component", () => {
  const mockCategories = [
    { id: 1, name: "Design", icon: "Paintbrush", jobCount: 15 },
    { id: 2, name: "Development", icon: "Code", jobCount: 20 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("renders the header and 'Show all Categories' link correctly", async () => {
    (categoryService.getTopCategories as jest.Mock).mockResolvedValue([]);

    render(<ExploreByCategory />);

    await waitFor(() => {
      expect(screen.getByText(/Explore by/i)).toBeInTheDocument();
      expect(screen.getByText(/category/i)).toBeInTheDocument();
      expect(screen.getByText("Show all Categories")).toBeInTheDocument();
      expect(
        screen.getByText("Show all Categories").closest("a"),
      ).toHaveAttribute("href", "/categories");
    });
  });

  it("displays loading skeletons while fetching data", async () => {
    // Delay the fetch resolution to ensure loading state is rendered
    (categoryService.getTopCategories as jest.Mock).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    const { container } = render(<ExploreByCategory />);

    // Check if skeletons are rendered (we expect 8 of them based on the component)
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(8);
  });

  it("successfully fetches and renders categories", async () => {
    (categoryService.getTopCategories as jest.Mock).mockResolvedValue(
      mockCategories,
    );

    render(<ExploreByCategory />);

    // Wait for the mock fetch to complete and the loading state to disappear
    await waitFor(() => {
      expect(screen.queryByTestId("loading-skeleton")).not.toBeInTheDocument();
    });

    // Verify fetched categories are rendered
    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();

    const categoryCards = screen.getAllByTestId("category-card");
    expect(categoryCards.length).toBe(2);
  });

  it("handles fetch errors gracefully", async () => {
    // Mock categoryService to reject with an error
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (categoryService.getTopCategories as jest.Mock).mockRejectedValue(
      new Error("API Failure"),
    );

    render(<ExploreByCategory />);

    // Wait for loading to finish
    await waitFor(() => {
      // The skeletons should be gone, and no categories should be shown
      expect(screen.queryAllByTestId("category-card")).toHaveLength(0);
    });

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to fetch categories:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
