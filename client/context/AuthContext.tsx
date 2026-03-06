"use client";

import { authInitialState, authReducer } from "@/reducers/authReducer";
import { alertService } from "@/utils/alertService";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useReducer } from "react";

export interface User {
  id: number | string;
  email: string;
  name: string;
  role: string;
  picture?: string | null;
  authProvider?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, authInitialState);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // 1. Prioritize standard Local Storage explicitly for native traditional logins
    let storedToken = localStorage.getItem("token");
    let storedUser = null;
    try {
      const uRaw = localStorage.getItem("user");
      if (uRaw) storedUser = JSON.parse(uRaw);
    } catch (e) {
      console.error("Local user payload parsed error", e);
    }

    if (storedToken && storedUser) {
      dispatch({
        type: "SET_AUTH",
        payload: { user: storedUser, token: storedToken },
      });
      return; // traditional user is verified
    }

    // 2. Hydrate NextAuth Session (Google OAuth)
    if (status === "authenticated" && session) {
      const nextUser = (session as any).user;
      const nextToken = (session as any).accessToken;

      if (nextToken && nextUser) {
        dispatch({
          type: "SET_AUTH",
          payload: { user: nextUser, token: nextToken },
        });
      }
    } else if (status === "unauthenticated") {
      dispatch({ type: "LOGOUT" });
    }

    if (status !== "loading") {
      dispatch({ type: "SET_LOADED" });
    }
  }, [session, status]);

  const login = (newToken: string, newUser: User) => {
    dispatch({ type: "SET_AUTH", payload: { user: newUser, token: newToken } });
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Also forcefully logout from NextAuth if they happen to use it
    if (session) {
      await signOut({ redirect: false });
    }

    alertService.success(
      "Logged Out",
      "You have been logged out successfully.",
    );
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        login,
        logout,
        isLoaded: state.isLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Ensure the application wrapper injects SessionProvider to let useSession work properly.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
