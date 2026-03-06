// ─── Login Reducer ───────────────────────────────────────────────────────────

export interface LoginState {
  email: string;
  password: string;
  error: string;
  loading: boolean;
}

export type LoginAction =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_ERROR"; payload: string }
  | { type: "SUBMIT_END" };

export const initialLoginState: LoginState = {
  email: "",
  password: "",
  error: "",
  loading: false,
};

export function loginReducer(
  state: LoginState,
  action: LoginAction,
): LoginState {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SUBMIT_START":
      return { ...state, loading: true, error: "" };
    case "SUBMIT_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SUBMIT_END":
      return { ...state, loading: false };
    default:
      return state;
  }
}
