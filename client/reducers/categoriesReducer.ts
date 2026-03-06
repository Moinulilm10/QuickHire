import { CategoryData } from "@/components/ui/CategoryCard";

// ─── State ───────────────────────────────────────────────
export interface CategoriesState {
  categories: CategoryData[];
  loading: boolean;
  page: number;
  totalPages: number;
}

export const categoriesInitialState: CategoriesState = {
  categories: [],
  loading: true,
  page: 1,
  totalPages: 1,
};

// ─── Actions ─────────────────────────────────────────────
export type CategoriesAction =
  | { type: "FETCH_START" }
  | {
      type: "FETCH_SUCCESS";
      payload: { categories: CategoryData[]; totalPages: number };
    }
  | { type: "FETCH_ERROR" }
  | { type: "SET_PAGE"; payload: number };

// ─── Reducer ─────────────────────────────────────────────
export function categoriesReducer(
  state: CategoriesState,
  action: CategoriesAction,
): CategoriesState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        categories: action.payload.categories,
        totalPages: action.payload.totalPages,
        loading: false,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    default:
      return state;
  }
}
