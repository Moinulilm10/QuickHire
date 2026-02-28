"use client";

import Image from "next/image";
import React from "react";
import SearchBar from "./SearchBar";

const popularSearches = ["UI Designer", "UX Researcher", "Android", "Admin"];

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-[72px]">
      {/* Background Pattern — right side */}
      <div className="absolute top-0 right-0 w-[60%] h-full pointer-events-none hidden lg:block">
        <Image
          src="/assets/Pattern.svg"
          alt=""
          fill
          className="object-cover object-left opacity-80"
          priority
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-0">
          {/* Left Content */}
          <div className="flex flex-col gap-6 lg:gap-8 max-w-[540px]">
            <div>
              <h1 className="text-[40px] sm:text-[52px] lg:text-[64px] font-bold leading-[1.1] text-text-dark animate-fade-in-up tracking-tight">
                Discover <br />
                more than <br />
                <span className="text-brand-primary relative inline-block">
                  5000+ Jobs
                  <Image
                    src="/assets/Vector.png"
                    alt=""
                    width={260}
                    height={24}
                    className="absolute -bottom-2 left-0 w-[80%] animate-scribble"
                  />
                </span>
              </h1>
            </div>

            <p className="text-text-body text-base sm:text-lg leading-relaxed animate-fade-in-up delay-200">
              Great platform for the job seeker that searching for new career
              heights and passionate about startups.
            </p>

            {/* Search Bar */}
            <SearchBar />

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-2 animate-fade-in-up delay-600">
              <span className="text-text-muted text-sm">Popular :</span>
              {popularSearches.map((term, i) => (
                <React.Fragment key={term}>
                  <button className="text-text-body text-sm hover:text-brand-primary transition-colors duration-[var(--transition-fast)] cursor-pointer">
                    {term}
                  </button>
                  {i < popularSearches.length - 1 && (
                    <span className="text-text-light text-sm">,</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:flex justify-end items-end self-end">
            <div className="relative w-full max-w-[500px] xl:max-w-[560px] animate-slide-in-right">
              <Image
                src="/assets/person-banner.png"
                alt="Job seeker"
                width={560}
                height={650}
                className="object-contain relative z-10 w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
