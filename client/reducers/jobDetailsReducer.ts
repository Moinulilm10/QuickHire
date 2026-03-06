// ─── State ───────────────────────────────────────────────
export interface JobDetailsState {
  job: any | null;
  loading: boolean;
  error: string | null;
}

export const jobDetailsInitialState: JobDetailsState = {
  job: null,
  loading: true,
  error: null,
};

// ─── Actions ─────────────────────────────────────────────
export type JobDetailsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: any }
  | { type: "FETCH_ERROR"; payload: string };

// ─── Reducer ─────────────────────────────────────────────
export function jobDetailsReducer(
  state: JobDetailsState,
  action: JobDetailsAction,
): JobDetailsState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, job: action.payload, loading: false };
    case "FETCH_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}
