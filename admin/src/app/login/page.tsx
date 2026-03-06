"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { authService } from "@/services/auth.service";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(email, password);

      if (data.success && data.token) {
        localStorage.setItem("adminToken", data.token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} />}
            />

            {error && (
              <p className="text-danger text-sm font-medium animate-fade-in">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" loading={loading}>
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
