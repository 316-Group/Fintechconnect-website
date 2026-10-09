"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  Network,
  Activity,
  FileText,
} from "lucide-react";

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
              MODULAR ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A programmable orchestration substrate for crypto payments.
            </h2>
          </div>
          <p className="text-slate-500 text-sm sm:text-lg leading-relaxed max-w-md font-normal">
            Construct custom workflow logic between your customer interfaces, risk providers, and cold/warm signing nodes with declarative primitives.
          </p>
        </div>

        {/* MODULES GRID CONTAINER */}
        <div className="space-y-6">
          {/* TOP ROW: CARD 01 & CARD 02 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* NETWORK & ADDRESS VALIDATION */}
            <div
              className={`lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "0ms" : "0ms" }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Network &amp; Address Validation
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal mb-6">
                  Deterministic syntactic and cryptographic checksum evaluation across protocol standards. Ingress requests with malformed addresses or invalid parameter trees are isolated before queue commitment.
                </p>
              </div>

              {/* IMAGE 1 */}
              <img
                src="/products/wallet/module1.png"
                alt="Network and Address Validation Visual"
                className="w-full h-full object-contain"
              />
            </div>

            {/* SCREENING CHECKPOINTS */}
            <div
              className={`lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Screening Checkpoints
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal mb-6">
                  Enforce synchronous pre-dispatch risk queries against client-designated sanction lists, high-risk cluster feeds, and AML metadata hooks.
                </p>
              </div>

              {/* IMAGE 2 */}
              <img
                src="/products/wallet/module2.png"
                alt="Screening Checkpoints Visual"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* MIDDLE ROW: CARD 03, CARD 04 & CARD 05 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* TRAVEL-RULE DATA CAPTURE */}
            <div
              className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <FileCheck className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2">
                  Travel-Rule Data Capture
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal">
                  Binds originator and beneficiary metadata packets to transaction payloads according to programmable threshold parameters before custodial handoff.
                </p>
              </div>
            </div>

            {/* CUSTODY & NETWORK ROUTING */}
            <div
              className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "450ms" : "0ms" }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Network className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2">
                  Custody &amp; Network Routing
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal">
                  Direct validated transactions to pre-configured signer infrastructure, internal MPC vaults, or direct network broadcasting gateways without vendor lock-in.
                </p>
              </div>
            </div>

            {/* CONFIRMATION MONITORING */}
            <div
              className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "600ms" : "0ms" }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2">
                  Confirmation Monitoring
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal">
                  Track block progression and multi-node quorum depth deterministically. Receives real-time state alerts without maintaining dedicated node fleets.
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: CARD 06 */}
          <div
            className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col lg:flex-row gap-8 items-stretch transition-all duration-700 ease-out transform-gpu ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12 pointer-events-none"
            }`}
            style={{ transitionDelay: isVisible ? "750ms" : "0ms" }}
          >
            {/* AUDIT TRAIL LEFT CONTENT */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Audit Trail &amp; Structured Reporting
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal mb-6">
                  Every pipeline evaluation, state transition, counterparty packet attachment, and dispatch receipt is committed into an immutable, append-only operational journal for institutional audit reporting.
                </p>

                {/* STATUS BADGES AT BOTTOM */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    APPEND_ONLY
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    HASH_LINKED
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    EXPORTABLE_JSON
                  </span>
                </div>
              </div>
            </div>

            {/* AUDIT TRAIL IMAGE AREA */}
            <div className="w-full lg:w-1/2 min-h-[180px] rounded-2xl bg-slate-50 border-0 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <img
                src="/products/wallet/module3.png"
                alt="Audit Trail Visual Asset"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}