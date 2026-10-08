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
              LIFECYCLE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Card lifecycle primitives engineered for deterministic control.
            </h2>
          </div>
          <p className="text-slate-500 text-sm sm:text-lg leading-relaxed max-w-md font-normal">
            Every stage operates as an autonomous, contract-driven state
            transition backed by immutable ledger events.
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
                      01 CORE MODULE
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    schema: v1 cards
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Module 01: Issuance &amp; Tokenization
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal mb-6">
                  Virtual instant provisioning, physical card manufacturing dispatch payloads, and device wallet token bindings executed via single deterministic mutations.
                </p>
              </div>

              {/* MODULE 01 IMAGE */}
              <img
                src={getPath('/products/cards/module1.png')}
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
                    02 RISK PERIMETER
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Module 02: Spend Controls &amp; Velocity Rules
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal mb-6">
                  MCC code restrictions, merchant allowlists, country geofencing boundaries, and rolling time-window spend caps checked synchronously during authorization.
                </p>
              </div>

              {/* MODULE 02 IMAGE */}
              <img
                src={getPath('/products/cards/module2.png')}
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
                      03 AUTHORIZATION ENGINE
                    </span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2">
                  Module 03: Authorization &amp; Dual-Custody Holds
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal">
                  Cryptographic validation of spend headroom with automated hold segregation on user balance vaults. Guaranteed zero double-spend concurrency.
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
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      04 CLEARING CORE
                    </span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2">
                  Module 04: Clearing Correlation &amp; Capture
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal">
                  Deterministic linking of clearing files back to exact original authorization holds. Programmatic over-capture and under-capture balance reconciliation.
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
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      05 SECURITY ISOLATION
                    </span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2">
                  Module 05: Data Minimization &amp; Token Vault
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal">
                  PCI-scope reduction through cryptographic tokens, programmatic PAN masking, and transient ephemeral keys that never touch your application layer.
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
                    06 ARBITRATION &amp; REVERSAL
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Module 06: Dispute &amp; Chargeback Lifecycles
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal">
                  Structured evidence collection, formal scheme-independent arbitration packaging, automated representment filing, and atomic double-entry ledger reversals.
                </p>
              </div>
            </div>

            {/* MODULE 06 IMAGE */}
            <div className="w-full min-h-[180px] rounded-2xl border-0 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-center">
              <img
                src={getPath('/products/cards/module3.png')}
                alt="Module 06 Visual Asset"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}