// ─── State ───────────────────────────────────────────────
export interface SignupState {
  form: { fullName: string; email: string; password: string };
  errors: Record<string, string>;
  loading: boolean;
}

export const signupInitialState: SignupState = {
  form: { fullName: "", email: "", password: "" },
  errors: {},
  loading: false,
};

// ─── Actions ─────────────────────────────────────────────
export type SignupAction =
  | { type: "SET_FIELD"; field: string; value: string }
  | { type: "SET_ERRORS"; payload: Record<string, string> }
  | { type: "CLEAR_FIELD_ERROR"; field: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET" };

// ─── Reducer ─────────────────────────────────────────────
export function signupReducer(
  state: SignupState,
  action: SignupAction,
): SignupState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
      };
    case "SET_ERRORS":
      return { ...state, errors: action.payload };
    case "CLEAR_FIELD_ERROR": {
      const { [action.field]: _, ...rest } = state.errors;
      return { ...state, errors: rest };
    }
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "RESET":
      return signupInitialState;
    default:
      return state;
  }
}
