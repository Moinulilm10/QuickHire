// ─── Categories Reducer ──────────────────────────────────────────────────────

export interface CategoriesResponse {
  success: boolean;
  data: any[];
  pagination: { total: number; totalPages: number };
  message?: string;
}

export interface CategoriesState {
  currentPage: number;
  showModal: boolean;
  editingCategory: any | null;
  categoryName: string;
  isSubmitting: boolean;
  errorText: string;
}

export type CategoriesAction =
  | { type: "SET_PAGE"; payload: number }
  | { type: "OPEN_MODAL"; payload?: any }
  | { type: "CLOSE_MODAL" }
  | { type: "SET_CATEGORY_NAME"; payload: string }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string };

export const initialCategoriesState: CategoriesState = {
  currentPage: 1,
  showModal: false,
  editingCategory: null,
  categoryName: "",
  isSubmitting: false,
  errorText: "",
};

export function categoriesReducer(
  state: CategoriesState,
  action: CategoriesAction,
): CategoriesState {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "OPEN_MODAL":
      return {
        ...state,
        showModal: true,
        editingCategory: action.payload || null,
        categoryName: action.payload?.name || "",
        errorText: "",
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        showModal: false,
        editingCategory: null,
        categoryName: "",
        errorText: "",
      };
    case "SET_CATEGORY_NAME":
      return { ...state, categoryName: action.payload };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_ERROR":
      return { ...state, errorText: action.payload };
    default:
      return state;
  }
}
