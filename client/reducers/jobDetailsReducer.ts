// ─── State ───────────────────────────────────────────────
export interface JobDetailsState {
  job: any | null;
  loading: boolean;
  error: string | null;
  isApplyModalOpen: boolean;
}

export const jobDetailsInitialState: JobDetailsState = {
  job: null,
  loading: true,
  error: null,
  isApplyModalOpen: false,
};

// ─── Actions ─────────────────────────────────────────────
export type JobDetailsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: any }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "SET_MODAL_OPEN"; payload: boolean };

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
    case "SET_MODAL_OPEN":
      return { ...state, isApplyModalOpen: action.payload };
    default:
      return state;
  }
}
