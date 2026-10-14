"use client";

import React, { useEffect, useRef, useState } from "react";
import { getPath } from "@/utils/helper";

export default function StructuralSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-[#f4f6fc] py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900 overflow-hidden">
      <div ref={sectionRef} className="max-w-full mx-auto space-y-12">
        {/* SECTION HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
              INSIDE THE APP
            </span>
            <h2 className="text-3xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Everything customers need, in five clear areas.
            </h2>
          </div>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-md font-normal">
            Explore the primary functional zones designed for everyday banking.
          </p>
        </div>

        {/* MODULES GRID CONTAINER */}
        <div className="space-y-6">
          {/* TOP ROW: MODULE 01 & MODULE 02 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* MODULE 01 */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <div
                className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between flex-1 transition-all duration-700 ease-out transform-gpu ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-12 pointer-events-none"
                }`}
                style={{ transitionDelay: isVisible ? "0ms" : "0ms" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      CORE WORKSPACE
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      01 / 05
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                    1. Home &amp; Ledger Balance
                  </h3>
                  <p className="text-xs sm:text-base text-slate-500 leading-relaxed font-normal mb-6">
                    Available balance ($24,650.00) and pending balance ($850.00) as separate clear ledger lines.
                  </p>
                </div>

                <div>
                  <img
                    src={getPath('/products/mobileappmodule1.png')}
                    alt="Home & Ledger Balance"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 px-1">
                <span className="text-blue-600 font-bold">What you can configure:</span> Metric hierarchy, secondary balance cards, and quick action shortcuts[cite: 14, 15].
              </p>
            </div>

            {/* MODULE 02 */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div
                className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between flex-1 transition-all duration-700 ease-out transform-gpu ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-12 pointer-events-none"
                }`}
                style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      TRANSFERS &amp; PAYMENTS
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      02 / 05
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                    2. Move Money
                  </h3>
                  <p className="text-xs sm:text-base text-slate-500 leading-relaxed font-normal mb-6">
                    Transfer flow, account selection, reference field, and scheduled payments.
                  </p>
                </div>

                <div>
                  <img
                    src={getPath('/products/mobileappmodule2.png')}
                    alt="Move Money"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 px-1">
                <span className="text-blue-600 font-bold">What you can configure:</span> Transfer destination types, allowed references, and settlement speed disclosures[cite: 14, 15].
              </p>
            </div>
          </div>

          {/* BOTTOM ROW: MODULE 03, MODULE 04 & MODULE 05 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* MODULE 03 */}
            <div className="flex flex-col gap-3">
              <div
                className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between flex-1 transition-all duration-700 ease-out transform-gpu ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-12 pointer-events-none"
                }`}
                style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      CARD CONTROLS
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      03 / 05
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    3. Virtual &amp; Physical Cards
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-6">
                    Virtual debit card widget with card freeze toggle, spending limits, and PIN placeholder.
                  </p>
                </div>

                <div>
                  <img
                    src={getPath('/products/mobileappmodule3.png')}
                    alt="Virtual & Physical Cards"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 px-1">
                <span className="text-blue-600 font-bold">What you can configure:</span> Card background artwork, freeze confirmation step-ups, and daily limit tiers[cite: 14, 15].
              </p>
            </div>

            {/* MODULE 04 */}
            <div className="flex flex-col gap-3">
              <div
                className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between flex-1 transition-all duration-700 ease-out transform-gpu ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-12 pointer-events-none"
                }`}
                style={{ transitionDelay: isVisible ? "450ms" : "0ms" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      AUDIT LEDGER
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      04 / 05
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    4. Activity &amp; Ledger Feed
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-6">
                    Searchable transaction ledger with clear categorization and settlement tracking.
                  </p>
                </div>

                <div>
                  <img
                    src={getPath('/products/mobileappmodule4.png')}
                    alt="Activity & Ledger Feed"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 px-1">
                <span className="text-blue-600 font-bold">What you can configure:</span> Category taxonomies export formats, and reference search indexing[cite: 14, 15].
              </p>
            </div>

            {/* MODULE 05 */}
            <div className="flex flex-col gap-3">
              <div
                className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between flex-1 transition-all duration-700 ease-out transform-gpu ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-12 pointer-events-none"
                }`}
                style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      GOVERNANCE &amp; POLICY
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      05 / 05
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    5. Profile &amp; Security
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-6">
                    Account holder details, notification channels, and policy-driven sign-in preferences.
                  </p>
                </div>

                <div>
                  <img
                    src={getPath('/products/mobileappmodule5.png')}
                    alt="Profile & Security"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 px-1">
                <span className="text-blue-600 font-bold">What you can configure:</span> Verification workflows, device registration rules, and support routing paths[cite: 14, 15].
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}