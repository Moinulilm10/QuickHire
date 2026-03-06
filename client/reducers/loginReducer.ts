// ─── State ───────────────────────────────────────────────
export interface LoginState {
  email: string;
  password: string;
  errors: { email?: string; password?: string };
  loading: boolean;
}

export const loginInitialState: LoginState = {
  email: "",
  password: "",
  errors: {},
  loading: false,
};

// ─── Actions ─────────────────────────────────────────────
export type LoginAction =
  | { type: "SET_FIELD"; field: "email" | "password"; value: string }
  | { type: "SET_ERRORS"; payload: { email?: string; password?: string } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET" };

// ─── Reducer ─────────────────────────────────────────────
export function loginReducer(
  state: LoginState,
  action: LoginAction,
): LoginState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERRORS":
      return { ...state, errors: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "RESET":
      return loginInitialState;
    default:
      return state;
  }
}
