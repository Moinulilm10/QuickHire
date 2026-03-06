// ─── State ───────────────────────────────────────────────
export interface NavbarState {
  mobileOpen: boolean;
  scrolled: boolean;
  dropdownOpen: boolean;
}

export const navbarInitialState: NavbarState = {
  mobileOpen: false,
  scrolled: false,
  dropdownOpen: false,
};

// ─── Actions ─────────────────────────────────────────────
export type NavbarAction =
  | { type: "TOGGLE_MOBILE" }
  | { type: "SET_SCROLLED"; payload: boolean }
  | { type: "TOGGLE_DROPDOWN" }
  | { type: "CLOSE_DROPDOWN" }
  | { type: "CLOSE_ALL" };

// ─── Reducer ─────────────────────────────────────────────
export function navbarReducer(
  state: NavbarState,
  action: NavbarAction,
): NavbarState {
  switch (action.type) {
    case "TOGGLE_MOBILE":
      return {
        ...state,
        mobileOpen: !state.mobileOpen,
        dropdownOpen: false,
      };
    case "SET_SCROLLED":
      return { ...state, scrolled: action.payload };
    case "TOGGLE_DROPDOWN":
      return { ...state, dropdownOpen: !state.dropdownOpen };
    case "CLOSE_DROPDOWN":
      return { ...state, dropdownOpen: false };
    case "CLOSE_ALL":
      return { ...state, mobileOpen: false, dropdownOpen: false };
    default:
      return state;
  }
}
