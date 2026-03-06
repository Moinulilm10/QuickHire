import { CategoryData } from "@/components/ui/CategoryCard";

// ─── State ───────────────────────────────────────────────
export interface ExploreCategoryState {
  categories: CategoryData[];
  loading: boolean;
  isVisible: boolean;
}

export const exploreCategoryInitialState: ExploreCategoryState = {
  categories: [],
  loading: true,
  isVisible: false,
};

// ─── Actions ─────────────────────────────────────────────
export type ExploreCategoryAction =
  | { type: "FETCH_SUCCESS"; payload: CategoryData[] }
  | { type: "FETCH_ERROR" }
  | { type: "SET_VISIBLE" };

// ─── Reducer ─────────────────────────────────────────────
export function exploreCategoryReducer(
  state: ExploreCategoryState,
  action: ExploreCategoryAction,
): ExploreCategoryState {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, categories: action.payload, loading: false };
    case "FETCH_ERROR":
      return { ...state, loading: false };
    case "SET_VISIBLE":
      return { ...state, isVisible: true };
    default:
      return state;
  }
}
