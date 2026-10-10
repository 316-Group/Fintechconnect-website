"use client";

import React, { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
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
              CORE MODULES
            </span>
            <h2 className="text-3xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Connect alerts, investigation context, evidence, and reporting preparation.
            </h2>
          </div>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-md font-normal">
            Bring structure to AML operations with configurable workflows that connect monitoring activity, investigation records, reviewer decisions, and controlled escalation.
          </p>
        </div>

        {/* MODULES GRID CONTAINER */}
        <div className="space-y-6">
          {/* TOP ROW: MODULE 01 & MODULE 02 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* MODULE 01 */}
            <div
              className={`lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "0ms" : "0ms" }}
            >
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">
                  MONITORING CONTEXT
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Bring Related Activity Into View
                </h3>
                <p className="text-xs sm:text-base text-slate-500 leading-relaxed font-normal mb-6">
                  Connect customer, account, transaction, and historical case information around monitoring signals.
                </p>
              </div>

              {/* MODULE 01 IMAGE */}
              <img
                src={getPath('/products/amlmodule1.png')}
                alt="Bring Related Activity Into View"
                className="w-full h-full object-contain"
              />
            </div>

            {/* MODULE 02 */}
            <div
              className={`lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
            >
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">
                  ALERT TRIAGE
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Structure Alert Assessment
                </h3>
                <p className="text-xs sm:text-base text-slate-500 leading-relaxed font-normal mb-6">
                  Organise alerts by priority, supporting context, reviewer assignment, and next steps.
                </p>
              </div>

              {/* MODULE 02 IMAGE */}
              <img
                src={getPath('/products/amlmodule2.png')}
                alt="Structure Alert Assessment"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* MIDDLE ROW: MODULE 03, MODULE 04 & MODULE 05 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* MODULE 03 */}
            <div
              className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                  SCREENING WORKFLOW
                </span>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  Screening With Context
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  Bring investigation notes, linked records, supporting documents, and reviewer decisions into one case.
                </p>
              </div>
            </div>

            {/* MODULE 04 */}
            <div
              className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "450ms" : "0ms" }}
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                  RISK CLASSIFICATION
                </span>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  Route Accountable Decisions
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  Define approval responsibilities, escalation conditions, and review handoffs for sensitive cases.
                </p>
              </div>
            </div>

            {/* MODULE 05 */}
            <div
              className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                  AML CASEWORK
                </span>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  Alert-to-Case Workflows
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  Organise case records and supporting evidence for programme-approved reporting processes.
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: MODULE 06 */}
          <div
            className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col lg:flex-row gap-8 items-stretch transition-all duration-700 ease-out transform-gpu ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12 pointer-events-none"
            }`}
            style={{ transitionDelay: isVisible ? "750ms" : "0ms" }}
          >
            {/* MODULE 06 LEFT TEXT CONTENT */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">
                  ONBOARDING REVIEW
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Review Change Over Time
                </h3>
                <p className="text-xs sm:text-base text-slate-500 leading-relaxed font-normal">
                  Track new alerts, changing circumstances, prior decisions, and outstanding review tasks.
                </p>
              </div>
            </div>

            {/* MODULE 06 IMAGE */}
            <div className="w-full lg:w-1/2 min-h-[180px] rounded-2xl border-0 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-center">
              <img
                src={getPath('/products/amlmodule3.png')}
                alt="Review Change Over Time"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}