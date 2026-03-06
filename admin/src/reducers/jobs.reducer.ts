// ─── Jobs Reducer ────────────────────────────────────────────────────────────

export interface JobsState {
  search: string;
  currentPage: number;
  selectedJob: any | null;
  showAddForm: boolean;
}

export type JobsAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SELECT_JOB"; payload: any | null }
  | { type: "TOGGLE_ADD_FORM"; payload: boolean }
  | { type: "UPDATE_SELECTED_JOB"; payload: any };

export const initialJobsState: JobsState = {
  search: "",
  currentPage: 1,
  selectedJob: null,
  showAddForm: false,
};

export function jobsReducer(state: JobsState, action: JobsAction): JobsState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SELECT_JOB":
      return { ...state, selectedJob: action.payload };
    case "TOGGLE_ADD_FORM":
      return { ...state, showAddForm: action.payload };
    case "UPDATE_SELECTED_JOB":
      return { ...state, selectedJob: action.payload };
    default:
      return state;
  }
}
