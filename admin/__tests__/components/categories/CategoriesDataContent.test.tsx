import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { CategoriesDataContent } from "../../../src/components/categories/CategoriesDataContent";
import { initialCategoriesState } from "../../../src/reducers/categories.reducer";

const mockData = {
  success: true,
  data: [
    {
      id: 1,
      name: "Web Development",
      createdAt: "2024-01-01",
      _count: { jobs: 5 },
    },
    { id: 2, name: "Design", createdAt: "2024-01-02", _count: { jobs: 2 } },
  ],
  pagination: { total: 2, totalPages: 1 },
};

// Helper for React 19 use()
const createResolvedPromise = (data: any) => {
  const p = Promise.resolve(data);
  (p as any).status = "fulfilled";
  (p as any).value = data;
  return p;
};

describe("CategoriesDataContent", () => {
  const getProps = (promise = createResolvedPromise(mockData)) => ({
    dataPromise: promise,
    isPending: false,
    state: initialCategoriesState,
    dispatch: jest.fn(),
    onDelete: jest.fn(),
  });

  it("renders category list correctly", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesDataContent {...getProps()} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getByText("Web Development")).toBeInTheDocument();
      expect(screen.getByText("Design")).toBeInTheDocument();
    });
  });

  it("calls OPEN_MODAL on 'Add Category' click", async () => {
    const props = getProps();
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesDataContent {...props} />
      </Suspense>,
    );

    await waitFor(() => screen.getByText("Add Category"));
    fireEvent.click(screen.getByText("Add Category"));
    expect(props.dispatch).toHaveBeenCalledWith({ type: "OPEN_MODAL" });
  });

  it("calls OPEN_MODAL with payload on edit button click", async () => {
    const props = getProps();
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesDataContent {...props} />
      </Suspense>,
    );

    await waitFor(() => screen.getAllByTitle("Edit"));
    fireEvent.click(screen.getAllByTitle("Edit")[0]);
    expect(props.dispatch).toHaveBeenCalledWith({
      type: "OPEN_MODAL",
      payload: mockData.data[0],
    });
  });

  it("calls onDelete when delete button is clicked", async () => {
    const props = getProps();
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesDataContent {...props} />
      </Suspense>,
    );

    await waitFor(() => screen.getAllByTitle("Delete"));
    fireEvent.click(screen.getAllByTitle("Delete")[0]);
    expect(props.onDelete).toHaveBeenCalledWith(mockData.data[0]);
  });

  it("renders empty state when no categories", async () => {
    const emptyPromise = createResolvedPromise({
      success: true,
      data: [],
      pagination: { total: 0, totalPages: 1 },
    });
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesDataContent {...getProps(emptyPromise)} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getByText("No categories found.")).toBeInTheDocument();
    });
  });
});
