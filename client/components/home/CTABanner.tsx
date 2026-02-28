"use client";

import Image from "next/image";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="relative bg-brand-primary overflow-hidden">
          {/* Diagonal darker purple shape */}
          <div
            className="hidden lg:block absolute right-0 top-0 bottom-0 w-[55%]"
            style={{
              clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)",
              background: "#3A35C4",
            }}
          />

          <div className="relative z-10 flex items-stretch">
            {/* Left Content */}
            <div className="px-8 sm:px-10 lg:px-14 py-10 sm:py-12 lg:py-14 w-full lg:w-[42%] shrink-0 flex flex-col justify-center">
              <h2 className="text-white text-[28px] sm:text-[34px] lg:text-[40px] font-bold leading-[1.12] mb-4 tracking-tight">
                Start posting <br />
                jobs today
              </h2>
              <p className="text-white/70 text-sm sm:text-base mb-6">
                Start posting jobs for only $10.
              </p>
              <div>
                <Link
                  href="/signup"
                  className="inline-block bg-white text-brand-primary font-bold text-sm sm:text-base px-7 py-3 hover:bg-white/90 transition-all duration-[var(--transition-base)] transform hover:scale-[1.03] active:scale-[0.97]"
                >
                  Sign Up For Free
                </Link>
              </div>
            </div>

            {/* Right — Dashboard Image, contained inside the banner */}
            <div className="hidden lg:flex flex-1 items-end justify-end pt-6 pr-6 xl:pr-10">
              <Image
                src="/assets/Dashboard_Pic.jpg"
                alt="QuickHire Dashboard"
                width={720}
                height={460}
                className="w-full max-w-[620px] xl:max-w-[680px] h-auto rounded-t-md shadow-[0_-8px_40px_rgba(0,0,0,0.18)] object-cover object-left-top"
                priority
              />
            </div>

            {/* Tablet — smaller dashboard preview */}
            <div className="hidden sm:flex lg:hidden flex-1 items-end justify-end pt-6 pr-4">
              <Image
                src="/assets/Dashboard_Pic.jpg"
                alt="QuickHire Dashboard"
                width={400}
                height={260}
                className="w-full max-w-[300px] h-auto rounded-t-md shadow-[0_-4px_24px_rgba(0,0,0,0.12)] object-cover object-left-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
