import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CategoriesPage from "../../../../src/app/dashboard/categories/page";
import { categoryService } from "../../../../src/services/category.service";
import { alertService } from "../../../../src/utils/alertService";

// Mock services
jest.mock("../../../../src/services/category.service", () => ({
  categoryService: {
    getCategories: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
  },
}));

jest.mock("../../../../src/utils/alertService", () => ({
  alertService: {
    confirm: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock child component
jest.mock("@/components/categories/CategoriesDataContent", () => ({
  CategoriesDataContent: ({ dispatch, onDelete }: any) => (
    <div data-testid="categories-content">
      <button onClick={() => dispatch({ type: "OPEN_MODAL" })}>
        Add Category
      </button>
      <button onClick={() => onDelete({ id: 1, name: "Web" })}>
        Delete Web
      </button>
    </div>
  ),
  CategoriesLoadingSkeleton: () => <div>Loading...</div>,
}));

describe("CategoriesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (categoryService.getCategories as jest.Mock).mockReturnValue(
      Promise.resolve({ success: true, data: [] }),
    );
  });

  it("renders and fetches categories", async () => {
    render(<CategoriesPage />);
    expect(categoryService.getCategories).toHaveBeenCalledWith(1);
    await waitFor(() =>
      expect(screen.getByTestId("categories-content")).toBeInTheDocument(),
    );
  });

  it("opens modal and creates a category", async () => {
    (categoryService.createCategory as jest.Mock).mockResolvedValue({
      success: true,
    });

    render(<CategoriesPage />);

    await waitFor(() => screen.getByText("Add Category"));
    fireEvent.click(screen.getByText("Add Category"));

    expect(screen.getByText("Add New Category")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Category Name/i), {
      target: { value: "New Cat" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(categoryService.createCategory).toHaveBeenCalledWith("New Cat");
      expect(alertService.success).toHaveBeenCalled();
      expect(screen.queryByText("Add New Category")).not.toBeInTheDocument();
    });
  });
});
