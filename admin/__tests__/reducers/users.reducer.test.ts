import {
  initialUsersState,
  usersReducer,
} from "../../src/reducers/users.reducer";

describe("usersReducer", () => {
  it("should handle SET_PAGE", () => {
    const action = { type: "SET_PAGE" as const, payload: 4 };
    const state = usersReducer(initialUsersState, action);
    expect(state.currentPage).toBe(4);
  });

  it("should return the state if action is unknown", () => {
    // @ts-ignore
    const state = usersReducer(initialUsersState, { type: "UNKNOWN" });
    expect(state).toBe(initialUsersState);
  });
});
