import {
  initialLoginState,
  loginReducer,
} from "../../src/reducers/login.reducer";

describe("loginReducer", () => {
  it("should handle SET_EMAIL", () => {
    const action = { type: "SET_EMAIL" as const, payload: "admin@test.com" };
    const state = loginReducer(initialLoginState, action);
    expect(state.email).toBe("admin@test.com");
  });

  it("should handle SET_PASSWORD", () => {
    const action = { type: "SET_PASSWORD" as const, payload: "123456" };
    const state = loginReducer(initialLoginState, action);
    expect(state.password).toBe("123456");
  });

  it("should handle SET_ERROR", () => {
    const action = { type: "SET_ERROR" as const, payload: "Invalid" };
    const state = loginReducer(initialLoginState, action);
    expect(state.error).toBe("Invalid");
  });

  it("should handle SET_LOADING", () => {
    const action = { type: "SET_LOADING" as const, payload: true };
    const state = loginReducer(initialLoginState, action);
    expect(state.loading).toBe(true);
  });

  it("should handle SUBMIT_START", () => {
    const prevState = { ...initialLoginState, error: "previous error" };
    const action = { type: "SUBMIT_START" as const };
    const state = loginReducer(prevState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBe("");
  });

  it("should handle SUBMIT_ERROR", () => {
    const prevState = { ...initialLoginState, loading: true };
    const action = { type: "SUBMIT_ERROR" as const, payload: "Failed" };
    const state = loginReducer(prevState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Failed");
  });

  it("should handle SUBMIT_END", () => {
    const prevState = { ...initialLoginState, loading: true };
    const action = { type: "SUBMIT_END" as const };
    const state = loginReducer(prevState, action);
    expect(state.loading).toBe(false);
  });
});
