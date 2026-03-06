import { Job } from "@/data/jobsData";

// ─── State ───────────────────────────────────────────────
export interface FeaturedJobsState {
  jobs: Job[];
  loading: boolean;
  isVisible: boolean;
}

export const featuredJobsInitialState: FeaturedJobsState = {
  jobs: [],
  loading: true,
  isVisible: false,
};

// ─── Actions ─────────────────────────────────────────────
export type FeaturedJobsAction =
  | { type: "FETCH_SUCCESS"; payload: Job[] }
  | { type: "FETCH_ERROR" }
  | { type: "SET_VISIBLE" };

// ─── Reducer ─────────────────────────────────────────────
export function featuredJobsReducer(
  state: FeaturedJobsState,
  action: FeaturedJobsAction,
): FeaturedJobsState {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, jobs: action.payload, loading: false };
    case "FETCH_ERROR":
      return { ...state, loading: false };
    case "SET_VISIBLE":
      return { ...state, isVisible: true };
    default:
      return state;
  }
}
