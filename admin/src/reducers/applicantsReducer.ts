// ─── State ───────────────────────────────────────────────
export interface ApplicantsState {
  searchTerm: string;
  debouncedSearch: string;
  statusFilter: string;
  loadingId: number | null;
  previewUrl: string | null;
}

export const applicantsInitialState: ApplicantsState = {
  searchTerm: "",
  debouncedSearch: "",
  statusFilter: "ALL",
  loadingId: null,
  previewUrl: null,
};

// ─── Actions ─────────────────────────────────────────────
export type ApplicantsAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_DEBOUNCED_SEARCH"; payload: string }
  | { type: "SET_STATUS_FILTER"; payload: string }
  | { type: "SET_LOADING_ID"; payload: number | null }
  | { type: "OPEN_PREVIEW"; payload: string }
  | { type: "CLOSE_PREVIEW" };

// ─── Reducer ─────────────────────────────────────────────
export function applicantsReducer(
  state: ApplicantsState,
  action: ApplicantsAction,
): ApplicantsState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };
    case "SET_DEBOUNCED_SEARCH":
      return { ...state, debouncedSearch: action.payload };
    case "SET_STATUS_FILTER":
      return { ...state, statusFilter: action.payload };
    case "SET_LOADING_ID":
      return { ...state, loadingId: action.payload };
    case "OPEN_PREVIEW":
      return { ...state, previewUrl: action.payload };
    case "CLOSE_PREVIEW":
      return { ...state, previewUrl: null };
    default:
      return state;
  }
}
