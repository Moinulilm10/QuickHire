"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { navbarInitialState, navbarReducer } from "@/reducers/navbarReducer";
import { getImageUrl } from "@/utils/urlUtils";
import { ChevronDown, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useReducer, useRef } from "react";

const navLinks = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "Browse Companies", href: "/companies" },
];

export default function Navbar() {
  const [state, dispatch] = useReducer(navbarReducer, navbarInitialState);
  const { user, logout, isLoaded } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () =>
      dispatch({ type: "SET_SCROLLED", payload: window.scrollY > 20 });
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dispatch({ type: "CLOSE_DROPDOWN" });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        state.scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/assets/Logo.svg"
              alt="QuickHire"
              width={152}
              height={36}
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-text-body font-medium text-base hover:text-text-dark transition-colors duration-[var(--transition-fast)] group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {isLoaded ? (
              user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => dispatch({ type: "TOGGLE_DROPDOWN" })}
                    className="flex items-center gap-2 py-2 px-3 rounded-full hover:bg-surface-muted transition-colors duration-200 cursor-pointer text-text-dark font-medium border border-surface-border"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold overflow-hidden border border-brand-primary/20">
                      {user.picture ? (
                        <img
                          src={getImageUrl(user.picture)!}
                          alt={user.name!}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    <span>{user.name}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${state.dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-surface-border overflow-hidden transition-all duration-200 transform origin-top-right ${
                      state.dropdownOpen
                        ? "scale-100 opacity-100 visible"
                        : "scale-95 opacity-0 invisible"
                    }`}
                  >
                    <div className="p-2 flex flex-col gap-1">
                      <Link
                        href="/profile"
                        onClick={() => dispatch({ type: "CLOSE_DROPDOWN" })}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-text-dark hover:bg-brand-primary-light hover:text-brand-primary rounded-lg transition-colors cursor-pointer"
                      >
                        <User size={16} />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          dispatch({ type: "CLOSE_DROPDOWN" });
                          logout();
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer w-full text-left"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-brand-primary font-bold text-base hover:text-brand-primary-hover transition-colors duration-[var(--transition-fast)] cursor-pointer"
                  >
                    Login
                  </Link>
                  <Button href="/signup" variant="primary" size="sm">
                    Sign Up
                  </Button>
                </>
              )
            ) : (
              <div className="w-24 h-10 bg-surface-muted animate-pulse rounded-full" />
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden relative w-9 h-9 flex items-center justify-center cursor-pointer group"
            onClick={() => dispatch({ type: "TOGGLE_MOBILE" })}
            aria-label="Toggle menu"
            aria-expanded={state.mobileOpen}
          >
            {/* Hamburger SVG icon */}
            <Image
              src="/assets/hamburger_menu.svg"
              alt="Menu"
              width={36}
              height={36}
              className={`absolute inset-0 transition-all duration-300 ease-in-out group-hover:scale-105 ${
                state.mobileOpen
                  ? "opacity-0 rotate-90 scale-75"
                  : "opacity-100 rotate-0 scale-100"
              }`}
            />
            {/* Close (X) icon */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                state.mobileOpen
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-75"
              }`}
            >
              <rect
                x="0.5"
                y="0.5"
                width="35"
                height="35"
                rx="17.5"
                fill="white"
              />
              <rect
                x="0.5"
                y="0.5"
                width="35"
                height="35"
                rx="17.5"
                stroke="#D6DDEB"
              />
              <path
                d="M13 13L23 23M23 13L13 23"
                stroke="#25324B"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${
            state.mobileOpen
              ? "max-h-[500px] opacity-100 pb-6"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-body font-medium text-base hover:text-brand-primary transition-colors duration-[var(--transition-fast)] py-2 px-2 rounded-lg hover:bg-brand-primary-light"
                onClick={() => dispatch({ type: "CLOSE_ALL" })}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-surface-border">
              {isLoaded && user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg overflow-hidden border border-brand-primary/20">
                      {user.picture ? (
                        <img
                          src={getImageUrl(user.picture)!}
                          alt={user.name!}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-text-dark">{user.name}</p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => dispatch({ type: "CLOSE_ALL" })}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-dark hover:bg-brand-primary-light hover:text-brand-primary rounded-lg transition-colors cursor-pointer"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      dispatch({ type: "CLOSE_ALL" });
                      logout();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer w-full text-left"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Button
                    href="/login"
                    variant="outline"
                    size="md"
                    className="w-full"
                  >
                    Login
                  </Button>
                  <Button
                    href="/signup"
                    variant="primary"
                    size="md"
                    className="w-full"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
