// ─── State ───────────────────────────────────────────────
export interface CompanyDetailsState {
  company: any | null;
  loading: boolean;
  searchTerm: string;
  currentPage: number;
}

export const companyDetailsInitialState: CompanyDetailsState = {
  company: null,
  loading: true,
  searchTerm: "",
  currentPage: 1,
};

// ─── Actions ─────────────────────────────────────────────
export type CompanyDetailsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: any }
  | { type: "FETCH_ERROR" }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PAGE"; payload: number };

// ─── Reducer ─────────────────────────────────────────────
export function companyDetailsReducer(
  state: CompanyDetailsState,
  action: CompanyDetailsAction,
): CompanyDetailsState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, company: action.payload, loading: false };
    case "FETCH_ERROR":
      return { ...state, loading: false };
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
}
