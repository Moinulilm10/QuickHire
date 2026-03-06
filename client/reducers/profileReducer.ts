import { User } from "@/context/AuthContext";

// ─── State ───────────────────────────────────────────────
export interface ProfileState {
  profileData: User | null;
  loading: boolean;
  activeTab: "overview" | "applied" | "settings";
}

export const profileInitialState: ProfileState = {
  profileData: null,
  loading: true,
  activeTab: "overview",
};

// ─── Actions ─────────────────────────────────────────────
export type ProfileAction =
  | { type: "FETCH_SUCCESS"; payload: User }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_TAB"; payload: "overview" | "applied" | "settings" };

// ─── Reducer ─────────────────────────────────────────────
export function profileReducer(
  state: ProfileState,
  action: ProfileAction,
): ProfileState {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, profileData: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_TAB":
      return { ...state, activeTab: action.payload };
    default:
      return state;
  }
}
