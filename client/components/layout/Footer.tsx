"use client";

import { Dribbble, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const aboutLinks = [
  { label: "Companies", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
  { label: "Terms", href: "/terms" },
  { label: "Advice", href: "/advice" },
  { label: "Privacy Policy", href: "/privacy" },
];

const resourceLinks = [
  { label: "Help Docs", href: "/help" },
  { label: "Guide", href: "/guide" },
  { label: "Updates", href: "/updates" },
  { label: "Contact Us", href: "/contact" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Dribbble, href: "#", label: "Dribbble" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className="bg-[#202430] text-white/80">
      {/* Main Footer Content */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 lg:pt-16 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/assets/Logo.svg"
                alt="QuickHire"
                width={152}
                height={36}
              />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-[280px]">
              Great platform for the job seeker that passionate about startups.
              Find your dream job easier.
            </p>
          </div>

          {/* About Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5">About</h4>
            <ul className="flex flex-col gap-3">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 text-base hover:text-white transition-colors duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5">Resources</h4>
            <ul className="flex flex-col gap-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 text-base hover:text-white transition-colors duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-3">
              Get job notifications
            </h4>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 min-w-0 bg-transparent border border-white/20 rounded-[var(--radius-sm)] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary transition-colors duration-200"
              />
              <button
                type="submit"
                className="bg-brand-primary text-white font-bold text-sm px-5 py-2.5 rounded-[var(--radius-sm)] hover:bg-brand-primary-hover transition-all duration-[var(--transition-base)] transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer whitespace-nowrap shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            2021 @ QuickHire. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-200 group"
              >
                <social.icon
                  size={16}
                  strokeWidth={1.5}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
