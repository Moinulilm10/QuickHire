"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Minimum 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle login logic
      console.log("Login:", { email, password });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] bg-brand-primary relative overflow-hidden items-center justify-center">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/assets/Pattern.svg"
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 px-12 xl:px-16 max-w-md">
          <Link href="/" className="inline-block mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="white" />
                </svg>
              </div>
              <span className="text-white text-2xl font-bold">QuickHire</span>
            </div>
          </Link>

          <h2 className="text-white text-3xl xl:text-4xl font-bold leading-tight mb-4 animate-fade-in-up">
            Welcome Back!
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-8 animate-fade-in-up delay-200">
            Login to manage your job applications, saved searches, and career
            preferences.
          </p>

          <div className="flex items-center gap-4 animate-fade-in-up delay-400">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-white/20 border-2 border-brand-primary flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="text-white/60 text-sm">
              Join 10,000+ job seekers
            </span>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 bg-surface-light">
        <div className="w-full max-w-[440px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/Logo.svg"
                alt="QuickHire"
                width={152}
                height={36}
              />
            </Link>
          </div>

          <div className="bg-white rounded-[var(--radius-lg)] p-8 sm:p-10 shadow-[var(--shadow-card)] animate-fade-in-up">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-dark mb-2">
                Login
              </h1>
              <p className="text-text-muted text-sm">
                Welcome back! Please enter your credentials.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="Email Address"
                placeholder="Enter your email"
                type="email"
                id="login-email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                required
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                  </svg>
                }
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                type="password"
                id="login-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                }
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-surface-border text-brand-primary focus:ring-brand-primary/30 cursor-pointer accent-[var(--brand-primary)]"
                  />
                  <span className="text-sm text-text-muted group-hover:text-text-body transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  href="#"
                  className="text-sm text-brand-primary font-semibold hover:text-brand-primary-hover transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                id="login-submit"
              >
                Login
              </Button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-surface-border" />
              <span className="text-text-muted text-xs uppercase tracking-wide">
                or
              </span>
              <div className="flex-1 h-px bg-surface-border" />
            </div>

            <button className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[var(--radius-sm)] border border-surface-border text-text-body font-medium hover:bg-surface-light transition-all duration-[var(--transition-fast)] cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
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
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-text-muted">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-brand-primary font-bold hover:text-brand-primary-hover transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
