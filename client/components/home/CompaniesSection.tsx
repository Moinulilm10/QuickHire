"use client";

import Image from "next/image";

export default function CompaniesSection() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-text-muted text-sm sm:text-base mb-6 sm:mb-8">
          Companies we helped grow
        </p>
        <div className="overflow-x-auto">
          <Image
            src="/assets/Featured Company.svg"
            alt="Featured companies — Vodafone, Intel, Tesla, AMD, Talkit"
            width={1194}
            height={40}
            className="w-full max-w-[900px] h-auto"
          />
        </div>
      </div>
    </section>
  );
}
