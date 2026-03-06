"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { authService } from "@/services/auth.service";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useReducer } from "react";

// ─── Reducer ─────────────────────────────────────────────────────────────────
interface LoginState {
  email: string;
  password: string;
  error: string;
  loading: boolean;
}

type LoginAction =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_ERROR"; payload: string }
  | { type: "SUBMIT_END" };

const initialLoginState: LoginState = {
  email: "",
  password: "",
  error: "",
  loading: false,
};

function loginReducer(state: LoginState, action: LoginAction): LoginState {
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

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(loginReducer, initialLoginState);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.email || !state.password) {
      dispatch({ type: "SET_ERROR", payload: "Please fill in all fields" });
      return;
    }

    dispatch({ type: "SUBMIT_START" });
    try {
      const data = await authService.login(state.email, state.password);

      if (data.success && data.token) {
        localStorage.setItem("adminToken", data.token);
        router.push("/dashboard");
      } else {
        dispatch({
          type: "SUBMIT_ERROR",
          payload: data.message || "Invalid credentials",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      dispatch({
        type: "SUBMIT_ERROR",
        payload: "Unable to connect to the server. Please try again.",
      });
    } finally {
      dispatch({ type: "SUBMIT_END" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Quick<span className="text-primary">Hire</span>
          </h1>
          <p className="text-text-muted text-sm mt-2">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface border border-surface-border rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email or Username"
              type="email"
              placeholder="admin@quickhire.com"
              value={state.email}
              onChange={(e) =>
                dispatch({ type: "SET_EMAIL", payload: e.target.value })
              }
              icon={<Mail size={18} />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={state.password}
              onChange={(e) =>
                dispatch({ type: "SET_PASSWORD", payload: e.target.value })
              }
              icon={<Lock size={18} />}
            />

            {state.error && (
              <p className="text-danger text-sm font-medium animate-fade-in">
                {state.error}
              </p>
            )}

            <Button type="submit" className="w-full" loading={state.loading}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-text-muted mt-6">
            Sign in with your registered account credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
