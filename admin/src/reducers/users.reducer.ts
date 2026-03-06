// ─── Users Reducer ───────────────────────────────────────────────────────────

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  authProvider: string;
  createdAt: string;
}

export interface UsersResponse {
  success: boolean;
  users: UserData[];
  pagination: { total: number; totalPages: number };
  message?: string;
}

export interface UsersState {
  currentPage: number;
}

export type UsersAction = { type: "SET_PAGE"; payload: number };

export const initialUsersState: UsersState = { currentPage: 1 };

export function usersReducer(
  state: UsersState,
  action: UsersAction,
): UsersState {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
}
