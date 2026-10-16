"use client";

import React, { useEffect, useRef, useState } from "react";
import { getPath } from "@/utils/helper";
import { RefreshCw, Share2, FileText, Sliders, Filter, ShieldCheck } from "lucide-react";

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
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Granular controls for digital wallet states.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal">
            Every component exposes deterministic status tags, policy checks, and event streams.
          </p>
        </div>

        {/* MODULES GRID CONTAINER */}
        <div className="space-y-6">
          {/* TOP ROW: MODULE 01 (WIDER) & MODULE 02 (SHORTER) */}
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
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                    LIFECYCLE_ENGINE
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Wallet creation and lifecycle
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-6">
                  Deterministic state machines govern wallet lifecycles with explicit phase transitions and policy validation prior to status advancement.
                </p>
              </div>

              {/* MODULE 01 IMAGE */}
              
                <img
                  src={getPath('/products/cryptowallets/module1.png')}
                  alt="Wallet creation and lifecycle"
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
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                    ADDRESS_MAPPER
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                    <Share2 className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Address &amp; network mapping
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-6">
                  Bind programme ledger accounts to specific network address representations.
                </p>
              </div>

              {/* MODULE 02 IMAGE */}
              
                <img
                  src={getPath('/products/cryptowallets/module2.png')}
                  alt="Address & network mapping"
                  className="w-full h-full object-contain"
                />
              
            </div>
          </div>

          {/* SECOND ROW: MODULE 03 (SHORTER) & MODULE 04 (WIDER) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* MODULE 03 */}
            <div
              className={`lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "300ms" : "0ms" }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                    BALANCE_ISOLATION
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  Balance states
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-6">
                  Available, pending, and held allocations tracked independently with strict decimal scaling.
                </p>
              </div>

              
                <img
                  src={getPath('/products/cryptowallets/module3.png')}
                  alt="Balance states"
                  className="w-full h-full object-contain"
                />
              
            </div>

            {/* MODULE 04 */}
            <div
              className={`lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "450ms" : "0ms" }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                    DISPATCH_GATEWAY
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                    <Sliders className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  Transfers and approvals
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-6">
                  Outbound transfer staging with integrated dual-signatory checklist and governance gating prior to signing orchestration.
                </p>
              </div>

              
                <img
                  src={getPath('/products/cryptowallets/module4.png')}
                  alt="Transfers and approvals"
                  className="w-full h-full object-contain"
                />
              
            </div>
          </div>

          {/* THIRD ROW: MODULE 05, MODULE 06 & MODULE 07 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
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
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                    RULES_ENGINE
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                    <Filter className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  Policy controls
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-6">
                  Spend velocity limits, allowlists, and approver quotas evaluated before dispatch.
                </p>
              </div>

              
                <img
                  src={getPath('/products/cryptowallets/module5.png')}
                  alt="Policy controls"
                  className="w-full h-full object-contain"
                />
              
            </div>

            {/* MODULE 06 */}
            <div
              className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "750ms" : "0ms" }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                    CHECKPOINT_NODE
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  Screening checkpoints
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-6">
                  In-flight counterparty evaluation and data capture checkpoints inserted into transfer streams.
                </p>
              </div>

              
                <img
                  src={getPath('/products/cryptowallets/module6.png')}
                  alt="Screening checkpoints"
                  className="w-full h-full object-contain"
                />
              
            </div>

            {/* MODULE 07 */}
            <div
              className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between transition-all duration-700 ease-out transform-gpu ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12 pointer-events-none"
              }`}
              style={{ transitionDelay: isVisible ? "900ms" : "0ms" }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                    AUDIT_LOG
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  Reconciliation &amp; audit trail
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-6">
                  Sequential ledger entries and state changes sealed with cryptographic verification hashes.
                </p>
              </div>

              
                <img
                  src={getPath('/products/cryptowallets/module7.png')}
                  alt="Reconciliation & audit trail"
                  className="w-full h-full object-contain"
                />
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}