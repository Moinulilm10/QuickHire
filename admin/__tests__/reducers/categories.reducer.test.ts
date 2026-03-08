import {
  categoriesReducer,
  initialCategoriesState,
} from "../../src/reducers/categories.reducer";

describe("categoriesReducer", () => {
  it("should handle SET_PAGE", () => {
    const action = { type: "SET_PAGE" as const, payload: 2 };
    const state = categoriesReducer(initialCategoriesState, action);
    expect(state.currentPage).toBe(2);
  });

  it("should handle OPEN_MODAL without payload (add mode)", () => {
    const action = { type: "OPEN_MODAL" as const };
    const state = categoriesReducer(initialCategoriesState, action);
    expect(state.showModal).toBe(true);
    expect(state.editingCategory).toBeNull();
    expect(state.categoryName).toBe("");
  });

  it("should handle OPEN_MODAL with payload (edit mode)", () => {
    const category = { id: 1, name: "Web Dev" };
    const action = { type: "OPEN_MODAL" as const, payload: category };
    const state = categoriesReducer(initialCategoriesState, action);
    expect(state.showModal).toBe(true);
    expect(state.editingCategory).toEqual(category);
    expect(state.categoryName).toBe("Web Dev");
  });

  it("should handle CLOSE_MODAL", () => {
    const activeState = {
      ...initialCategoriesState,
      showModal: true,
      editingCategory: { id: 1 },
      categoryName: "Test",
    };
    const action = { type: "CLOSE_MODAL" as const };
    const state = categoriesReducer(activeState, action);
    expect(state.showModal).toBe(false);
    expect(state.editingCategory).toBeNull();
    expect(state.categoryName).toBe("");
  });

  it("should handle SET_CATEGORY_NAME", () => {
    const action = {
      type: "SET_CATEGORY_NAME" as const,
      payload: "New Category",
    };
    const state = categoriesReducer(initialCategoriesState, action);
    expect(state.categoryName).toBe("New Category");
  });

  it("should handle SET_SUBMITTING", () => {
    const action = { type: "SET_SUBMITTING" as const, payload: true };
    const state = categoriesReducer(initialCategoriesState, action);
    expect(state.isSubmitting).toBe(true);
  });

  it("should handle SET_ERROR", () => {
    const action = { type: "SET_ERROR" as const, payload: "Error message" };
    const state = categoriesReducer(initialCategoriesState, action);
    expect(state.errorText).toBe("Error message");
  });
});
