// ─── State ───────────────────────────────────────────────
export interface Company {
  id: number;
  uuid: string;
  name: string;
  location: string;
  logo: string | null;
  jobs?: any[];
  _count?: { applications: number };
}

export interface CompaniesState {
  companies: Company[];
  loading: boolean;
  searchTerm: string;
  debouncedSearch: string;
  currentPage: number;
  totalPages: number;
  totalCompanies: number;
}

export const companiesInitialState: CompaniesState = {
  companies: [],
  loading: true,
  searchTerm: "",
  debouncedSearch: "",
  currentPage: 1,
  totalPages: 1,
  totalCompanies: 0,
};

// ─── Actions ─────────────────────────────────────────────
export type CompaniesAction =
  | { type: "FETCH_START" }
  | {
      type: "FETCH_SUCCESS";
      payload: {
        companies: Company[];
        totalPages: number;
        totalCompanies: number;
      };
    }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_DEBOUNCED_SEARCH"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "RESET_PAGE" };

// ─── Reducer ─────────────────────────────────────────────
export function companiesReducer(
  state: CompaniesState,
  action: CompaniesAction,
): CompaniesState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        companies: action.payload.companies,
        totalPages: action.payload.totalPages,
        totalCompanies: action.payload.totalCompanies,
        loading: false,
      };
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };
    case "SET_DEBOUNCED_SEARCH":
      return { ...state, debouncedSearch: action.payload, currentPage: 1 };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "RESET_PAGE":
      return { ...state, currentPage: 1 };
    default:
      return state;
  }
}
