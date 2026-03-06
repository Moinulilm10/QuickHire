import { Job } from "@/data/jobsData";

// ─── State ───────────────────────────────────────────────
export interface LatestJobsState {
  jobs: Job[];
  loading: boolean;
  isVisible: boolean;
}

export const latestJobsInitialState: LatestJobsState = {
  jobs: [],
  loading: true,
  isVisible: false,
};

// ─── Actions ─────────────────────────────────────────────
export type LatestJobsAction =
  | { type: "FETCH_SUCCESS"; payload: Job[] }
  | { type: "FETCH_ERROR" }
  | { type: "SET_VISIBLE" };

// ─── Reducer ─────────────────────────────────────────────
export function latestJobsReducer(
  state: LatestJobsState,
  action: LatestJobsAction,
): LatestJobsState {
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
