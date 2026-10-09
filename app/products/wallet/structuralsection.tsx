"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Wallet,
  Users,
  ArrowLeftRight,
  CreditCard,
  Sliders,
  FileText,
} from "lucide-react";
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
              STRUCTURAL MODULES
            </span>
            <h2 className="text-3xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Architectural components engineered for high-velocity orchestration.
            </h2>
          </div>
          <p className="text-slate-500 text-sm sm:text-lg leading-relaxed max-w-md font-normal">
            Every component operates as an autonomous, contract-driven building
            block. Choose only the modules your operational setup requires.
          </p>
        </div>

        {/* MODULES GRID CONTAINER */}
        <div className="space-y-6">
          {/* TOP ROW: MODULE 01 & MODULE 02 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* MODULE 01 */}
            <div
              className={`lg:col-span-7 bg-white rounded-xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "0ms" : "0ms" }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      MODULE 01
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    schema: v2 balances
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Balances &amp; Funding Routines
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal mb-6">
                  Deterministic balance partitioning maintaining separate
                  available, pending hold, and regulatory reserve sub-ledgers.
                  Configured with automated sweep rules and multi-source top-up
                  journeys.
                </p>
              </div>

              {/* MODULE 01 IMAGE PLACEHOLDER */}
              
                <img
                  src={getPath("/products/wallet/module1.png")}
                  alt="Module 01 Visual Asset"
                  className="w-full h-full object-contain"
                />
              
            </div>

            {/* MODULE 02 */}
            <div
              className={`lg:col-span-5 bg-white rounded-xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    MODULE 02
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Participant Lifecycle Mapping
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal mb-6">
                  Establish individual or entity wallet ownership hierarchies.
                  Maintain lifecycle hooks across pending onboarding,
                  operational active, and other stages.
                </p>
              </div>

              {/* MODULE 02 IMAGE PLACEHOLDER */}
              <img
                  src={getPath("/products/wallet/module2.png")}
                  alt="Module 02 Visual Asset"
                  className="w-full h-full object-contain"
                />
            </div>
          </div>

          {/* MIDDLE ROW: MODULE 03, MODULE 04 & MODULE 05 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* MODULE 03 */}
            <div
              className={`bg-white rounded-xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <ArrowLeftRight className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      MODULE 03
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    Idempotent Keys
                  </span>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2">
                  Transfer Journeys &amp; Routing
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal">
                  Execute internal peer-to-peer transfers, programmatic fee
                  splits, and scheduled external disbursements with cryptographic
                  idempotency to eliminate duplicate settlement calls.
                </p>
              </div>
            </div>

            {/* MODULE 04 */}
            <div
              className={`bg-white rounded-xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "450ms" : "0ms" }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">04</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2">
                  Card &amp; Account Links
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal">
                  Bridge virtual accounts, commercial deposit lines, and card
                  token objects directly to wallet balance partitions.
                </p>
              </div>
            </div>

            {/* MODULE 05 */}
            <div
              className={`bg-white rounded-xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Sliders className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">05</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2">
                  Limits &amp; Permissions
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal">
                  Enforce velocity rules, rolling aggregate caps, approval
                  hierarchies, and dual-custody parameters at the ingresse
                  boundary.
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: MODULE 06 */}
          <div
            className={`bg-white rounded-xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-8 items-stretch transition-all duration-700 ease-out transform-gpu ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12 pointer-events-none"
            }`}
            style={{ transitionDelay: isVisible ? "750ms" : "0ms" }}
          >
            {/* MODULE 06 LEFT TEXT CONTENT */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    MODULE 06
                  </span>
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100">
                    Foundational Core
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Operations &amp; Deterministic Reconciliation
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal">
                  Immutable, append-only double-entry journals for every balance
                  change. Provides scheduled settlement generation, raw audit
                  log export, and structured exception reconciliation
                  workflows.
                </p>
              </div>
            </div>

            {/* MODULE 06 IMAGE PLACEHOLDER */}
            <div className="w-full min-h-[180px] rounded-2xl border-0 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-center">
              <img
                  src={getPath("/products/wallet/module3.png")}
                  alt="Module 03 Visual Asset"
                  className="w-full h-full object-contain"
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}