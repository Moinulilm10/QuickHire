import {
  applicantsInitialState,
  applicantsReducer,
} from "../../src/reducers/applicantsReducer";

describe("applicantsReducer", () => {
  it("should return the current state for unknown actions", () => {
    // @ts-ignore
    const state = applicantsReducer(applicantsInitialState, {
      type: "UNKNOWN",
    });
    expect(state).toBe(applicantsInitialState);
  });

  it("should handle SET_SEARCH", () => {
    const action = { type: "SET_SEARCH" as const, payload: "test search" };
    const state = applicantsReducer(applicantsInitialState, action);
    expect(state.searchTerm).toBe("test search");
  });

  it("should handle SET_DEBOUNCED_SEARCH", () => {
    const action = {
      type: "SET_DEBOUNCED_SEARCH" as const,
      payload: "debounced test",
    };
    const state = applicantsReducer(applicantsInitialState, action);
    expect(state.debouncedSearch).toBe("debounced test");
  });

  it("should handle SET_STATUS_FILTER", () => {
    const action = { type: "SET_STATUS_FILTER" as const, payload: "ACCEPTED" };
    const state = applicantsReducer(applicantsInitialState, action);
    expect(state.statusFilter).toBe("ACCEPTED");
  });

  it("should handle SET_LOADING_ID", () => {
    const action = { type: "SET_LOADING_ID" as const, payload: 123 };
    const state = applicantsReducer(applicantsInitialState, action);
    expect(state.loadingId).toBe(123);
  });

  it("should handle OPEN_PREVIEW", () => {
    const action = {
      type: "OPEN_PREVIEW" as const,
      payload: { url: "/test.pdf", title: "Test Title" },
    };
    const state = applicantsReducer(applicantsInitialState, action);
    expect(state.previewUrl).toBe("/test.pdf");
    expect(state.previewTitle).toBe("Test Title");
  });

  it("should handle CLOSE_PREVIEW", () => {
    const initialState = {
      ...applicantsInitialState,
      previewUrl: "/test.pdf",
      previewTitle: "Test Title",
    };
    const action = { type: "CLOSE_PREVIEW" as const };
    const state = applicantsReducer(initialState, action);
    expect(state.previewUrl).toBeNull();
    // previewTitle remains as per current implementation (line 50 in reducer only sets previewUrl: null)
    expect(state.previewTitle).toBe("Test Title");
  });
});
