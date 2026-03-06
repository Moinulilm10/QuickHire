import { User } from "@/context/AuthContext";

// ─── State ───────────────────────────────────────────────
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoaded: boolean;
}

export const authInitialState: AuthState = {
  user: null,
  token: null,
  isLoaded: false,
};

// ─── Actions ─────────────────────────────────────────────
export type AuthAction =
  | { type: "SET_AUTH"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADED" };

// ─── Reducer ─────────────────────────────────────────────
export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoaded: true,
      };
    case "LOGOUT":
      return { ...state, user: null, token: null };
    case "SET_LOADED":
      return { ...state, isLoaded: true };
    default:
      return state;
  }
}
