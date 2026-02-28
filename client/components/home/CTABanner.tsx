"use client";

import Image from "next/image";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="relative bg-brand-primary overflow-visible min-h-[220px] sm:min-h-[240px] lg:min-h-[260px]">
          {/* Diagonal shape — darker purple triangle behind the image */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden">
            <div
              className="absolute inset-0 bg-[#3A35C4] origin-bottom-right"
              style={{
                clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)",
              }}
            />
          </div>

          <div className="relative z-10 flex items-center min-h-[220px] sm:min-h-[240px] lg:min-h-[260px]">
            {/* Left Content */}
            <div className="px-8 sm:px-10 lg:px-14 py-10 sm:py-12 w-full lg:w-[42%] shrink-0">
              <h2 className="text-white text-[28px] sm:text-[34px] lg:text-[40px] font-bold leading-[1.12] mb-4 tracking-tight">
                Start posting <br />
                jobs today
              </h2>
              <p className="text-white/70 text-sm sm:text-base mb-6">
                Start posting jobs for only $10.
              </p>
              <Link
                href="/signup"
                className="inline-block bg-white text-brand-primary font-bold text-sm sm:text-base px-7 py-3 hover:bg-white/90 transition-all duration-[var(--transition-base)] transform hover:scale-[1.03] active:scale-[0.97]"
              >
                Sign Up For Free
              </Link>
            </div>

            {/* Right — Dashboard Image (overflows top) */}
            <div className="hidden lg:block absolute right-6 xl:right-10 bottom-0 w-[54%] xl:w-[52%]">
              <div className="relative w-full translate-y-0">
                <Image
                  src="/assets/Dashboard_Pic.jpg"
                  alt="QuickHire Dashboard"
                  width={720}
                  height={460}
                  className="relative w-full h-auto rounded-t-md shadow-[0_-8px_40px_rgba(0,0,0,0.2)] object-cover object-left-top  left-11"
                  priority
                />
              </div>
            </div>

            {/* Tablet — smaller preview */}
            <div className="hidden sm:block lg:hidden absolute right-4 bottom-0 w-[42%] max-w-[300px]">
              <Image
                src="/assets/Dashboard_Pic.jpg"
                alt="QuickHire Dashboard"
                width={400}
                height={260}
                className="w-full h-auto rounded-t-md shadow-[0_-4px_24px_rgba(0,0,0,0.15)] object-cover object-left-top -translate-y-[10%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
