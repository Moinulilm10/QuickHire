import { Job } from "@/data/jobsData";

// ─── State ───────────────────────────────────────────────
export interface JobsState {
  jobs: Job[];
  loading: boolean;
  searchTerm: string;
  locationTerm: string;
  isVisible: boolean;
  currentPage: number;
}

export const jobsInitialState: JobsState = {
  jobs: [],
  loading: true,
  searchTerm: "",
  locationTerm: "",
  isVisible: false,
  currentPage: 1,
};

// ─── Actions ─────────────────────────────────────────────
export type JobsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Job[] }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_LOCATION"; payload: string }
  | { type: "SET_VISIBLE" }
  | { type: "SET_PAGE"; payload: number }
  | { type: "RESET_PAGE" };

// ─── Reducer ─────────────────────────────────────────────
export function jobsReducer(state: JobsState, action: JobsAction): JobsState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, jobs: action.payload, loading: false };
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case "SET_LOCATION":
      return { ...state, locationTerm: action.payload, currentPage: 1 };
    case "SET_VISIBLE":
      return { ...state, isVisible: true };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "RESET_PAGE":
      return { ...state, currentPage: 1 };
    default:
      return state;
  }
}
