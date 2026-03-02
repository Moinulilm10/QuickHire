"use client";

import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import { alertService } from "@/utils/alertService";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.signup({ name, email, password });

      if (data.success) {
        login(data.token, data.user);
        alertService.success(
          "Account Created!",
          data.message || "Welcome to QuickHire.",
        );
        router.push("/profile");
      }
    } catch (error: any) {
      alertService.error(
        "Signup Failed",
        error.message || "Could not create account at this time.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-white flex flex-col justify-center animate-fade-in">
      <div className="max-w-[480px] w-full mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-10 border border-surface-border rounded-xl shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-[28px] font-bold text-text-dark mb-2">
              Sign Up Form
            </h1>
            <p className="text-text-muted">
              Register to search over 5000+ jobs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">
                User Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-3 border border-surface-border rounded-lg bg-white text-text-dark placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                placeholder="Ex. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 border border-surface-border rounded-lg bg-white text-text-dark placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                placeholder="Ex. johndoe@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-dark mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-surface-border rounded-lg bg-white text-text-dark placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                placeholder="Required 6 characters min"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-lg text-white bg-brand-primary hover:bg-brand-primary-hover font-bold transition-colors disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} /> Signing up...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-dark">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-brand-primary font-bold hover:underline transition-all"
            >
              Login
            </Link>
          </p>

          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-surface-border"></div>
            <span className="mx-4 text-sm text-text-muted">
              Or Sign Up with
            </span>
            <div className="flex-grow border-t border-surface-border"></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-surface-border rounded-lg hover:bg-surface-muted transition-colors font-medium text-text-dark">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
