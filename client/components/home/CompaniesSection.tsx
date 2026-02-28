"use client";

import Image from "next/image";

export default function CompaniesSection() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-text-muted text-sm sm:text-base mb-6 sm:mb-8 animate-fade-in">
          Companies we helped grow
        </p>
        <div className="animate-fade-in-up delay-200 overflow-x-auto">
          <Image
            src="/assets/Featured Company.svg"
            alt="Featured companies — Vodafone, Intel, Tesla, AMD, Talkit"
            width={1194}
            height={40}
            className="w-full max-w-[900px] h-auto opacity-30 hover:opacity-50 transition-opacity duration-500"
          />
        </div>
      </div>
    </section>
  );
}
