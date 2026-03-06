import { User } from "@/context/AuthContext";

// ─── State ───────────────────────────────────────────────
export interface ProfileState {
  profileData: User | null;
  loading: boolean;
  activeTab: "overview" | "applied" | "settings";
  applications: any[];
  previewPdfUrl: string | null;
  previewTitle: string | null;
}

export const profileInitialState: ProfileState = {
  profileData: null,
  loading: true,
  activeTab: "overview",
  applications: [],
  previewPdfUrl: null,
  previewTitle: null,
};

// ─── Actions ─────────────────────────────────────────────
export type ProfileAction =
  | { type: "FETCH_SUCCESS"; payload: User }
  | { type: "FETCH_APPLICATIONS_SUCCESS"; payload: any[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_TAB"; payload: "overview" | "applied" | "settings" }
  | { type: "OPEN_PREVIEW"; payload: { url: string; title: string } }
  | { type: "CLOSE_PREVIEW" };

// ─── Reducer ─────────────────────────────────────────────
export function profileReducer(
  state: ProfileState,
  action: ProfileAction,
): ProfileState {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, profileData: action.payload, loading: false };
    case "FETCH_APPLICATIONS_SUCCESS":
      return { ...state, applications: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_TAB":
      return { ...state, activeTab: action.payload };
    case "OPEN_PREVIEW":
      return {
        ...state,
        previewPdfUrl: action.payload.url,
        previewTitle: action.payload.title,
      };
    case "CLOSE_PREVIEW":
      return { ...state, previewPdfUrl: null };
    default:
      return state;
  }
}
