import { initialJobsState, jobsReducer } from "../../src/reducers/jobs.reducer";

describe("jobsReducer", () => {
  it("should handle SET_SEARCH", () => {
    const action = { type: "SET_SEARCH" as const, payload: "developer" };
    const state = jobsReducer(initialJobsState, action);
    expect(state.search).toBe("developer");
  });

  it("should handle SET_PAGE", () => {
    const action = { type: "SET_PAGE" as const, payload: 2 };
    const state = jobsReducer(initialJobsState, action);
    expect(state.currentPage).toBe(2);
  });

  it("should handle SELECT_JOB", () => {
    const job = { id: 1, title: "Engineer" };
    const action = { type: "SELECT_JOB" as const, payload: job };
    const state = jobsReducer(initialJobsState, action);
    expect(state.selectedJob).toEqual(job);
  });

  it("should handle TOGGLE_ADD_FORM", () => {
    const action = { type: "TOGGLE_ADD_FORM" as const, payload: true };
    const state = jobsReducer(initialJobsState, action);
    expect(state.showAddForm).toBe(true);
  });

  it("should handle UPDATE_SELECTED_JOB", () => {
    const job = { id: 1, title: "Dev" };
    const action = { type: "UPDATE_SELECTED_JOB" as const, payload: job };
    const state = jobsReducer(initialJobsState, action);
    expect(state.selectedJob).toEqual(job);
  });
});
