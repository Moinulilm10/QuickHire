"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "Browse Companies", href: "/companies" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-brand-primary font-bold text-base hover:text-brand-primary-hover transition-colors duration-[var(--transition-fast)]"
            >
              Login
            </Link>
            <Button href="/signup" variant="primary" size="sm">
              Sign Up
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden relative w-9 h-9 flex items-center justify-center cursor-pointer group"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {/* Hamburger SVG icon */}
            <Image
              src="/assets/hamburger_menu.svg"
              alt="Menu"
              width={36}
              height={36}
              className={`absolute inset-0 transition-all duration-300 ease-in-out group-hover:scale-105 ${
                mobileOpen
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
                mobileOpen
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
            mobileOpen ? "max-h-[400px] opacity-100 pb-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-body font-medium text-base hover:text-brand-primary transition-colors duration-[var(--transition-fast)] py-2 px-2 rounded-lg hover:bg-brand-primary-light"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-surface-border">
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
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
