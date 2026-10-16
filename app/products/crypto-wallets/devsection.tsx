"use client";

import React, { useState } from "react";

export default function DevSection() {
  const [activeTab, setActiveTab] = useState<"request" | "response">("request");

  const requestSnippet = `{
  "customer_ref": "CUST-9920f",
  "programme_ref": "PRG-8820",
  "asset": "ASSET_A",
  "network": "NETWORK_I",
  "policy": {
    "approval_threshold": "10000.00000000",
    "approvers_required": 2,
    "allowlist_only": true
  }
}`;

  const responseSnippet = `{
  "status": "active",
  "wallet_id": "wal_983210a48b",
  "programme_ref": "PRG-8820",
  "created_at": "2026-10-15T13:42:00Z",
  "balances": {
    "available": "0.00000000",
    "pending": "0.00000000",
    "held": "0.00000000"
  },
  "policy_status": "enforced"
}`;

  return (
    <section className="w-full bg-[#0040DF33] py-20 md:py-28 px-4 sm:px-6 lg:px-20 font-sans text-slate-100 overflow-hidden">
      <div className="max-w-full mx-auto space-y-16">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block">
            BUILT FOR DEVELOPERS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.25rem] font-extrabold text-black tracking-tight leading-[1.15]">
            A wallet contract your team can read.
          </h2>
          <p className="text-blue-600 text-sm sm:text-base leading-relaxed font-normal pt-1">
            REST endpoints, idempotency keys, explicit states and exact amounts.
          </p>
        </div>

        {/* MAIN SPLIT GRID CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: INTERACTIVE CODE EDITOR BOX */}
          <div className="lg:col-span-7 bg-[#0040DF33] rounded-2xl border border-slate-800/90 shadow-2xl overflow-hidden flex flex-col">
            
            {/* EDITOR TABS HEADER */}
            <div className="bg-[#0040DF33] px-6 py-3.5 border-b border-slate-800/80 flex items-center gap-6">
              <button
                type="button"
                onClick={() => setActiveTab("request")}
                className={`text-xs font-bold pb-1 transition-colors cursor-pointer relative ${
                  activeTab === "request" ? "text-blue-500" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Request
                {activeTab === "request" && (
                  <div className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("response")}
                className={`text-xs font-bold pb-1 transition-colors cursor-pointer relative ${
                  activeTab === "response" ? "text-black" : "text-black hover:text-slate-200"
                }`}
              >
                Response
                {activeTab === "response" && (
                  <div className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            </div>

            {/* CODE DISPLAY AREA */}
            <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-300 space-y-4">
              <div>
                <span className="text-blue-400 font-bold">POST</span>{" "}
                <span className="text-slate-300">{"{base_url}"}/wallets</span>
              </div>
              <div className="text-black">
                Idempotency-Key: <span className="text-black">{"{unique-key}"}</span>
              </div>
              <div className="text-black pb-2 border-b border-slate-800/80">
                Content-Type: <span className="text-black">application/json</span>
              </div>

              <pre className="text-black font-mono text-xs sm:text-sm whitespace-pre-wrap pt-2 py-10">
                {activeTab === "request" ? (
                  <>
                    <span>{"{\n"}</span>
                    <span className="text-emerald-400">  &quot;customer_ref&quot;</span>: &quot;CUST-9920f&quot;,<br />
                    <span className="text-emerald-400">  &quot;programme_ref&quot;</span>: &quot;PRG-8820&quot;,<br />
                    <span className="text-emerald-400">  &quot;asset&quot;</span>: &quot;ASSET_A&quot;,<br />
                    <span className="text-emerald-400">  &quot;network&quot;</span>: &quot;NETWORK_I&quot;,<br />
                    <span className="text-emerald-400">  &quot;policy&quot;</span>: &#123;<br />
                    <span className="text-emerald-400">    &quot;approval_threshold&quot;</span>: &quot;10000.00000000&quot;,<br />
                    <span className="text-emerald-400">    &quot;approvers_required&quot;</span>: <span className="text-amber-400">2</span>,<br />
                    <span className="text-emerald-400">    &quot;allowlist_only&quot;</span>: <span className="text-rose-400">true</span><br />
                    <span>  &#125;<br />{"}"}</span>
                  </>
                ) : (
                  <span className="text-emerald-300">{responseSnippet}</span>
                )}
              </pre>
            </div>

          </div>

          {/* RIGHT COLUMN: 3 STACKED FEATURE CARDS */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* CARD 01 */}
            <div className="bg-[#0040DF33] rounded-2xl p-6 sm:p-7 border border-slate-800/90 shadow-lg transition-all hover:border-slate-700">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-2">
                01 / IDEMPOTENCY
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-black mb-2">
                Idempotent writes
              </h3>
              <p className="text-xs sm:text-sm text-black leading-relaxed font-normal">
                Every state-mutating request accepts an Idempotency-Key header, ensuring network retries cannot create duplicate wallet records or balance allocations.
              </p>
            </div>

            {/* CARD 02 */}
            <div className="bg-[#0040DF33] rounded-2xl p-6 sm:p-7 border border-slate-800/90 shadow-lg transition-all hover:border-slate-700">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-2">
                02 / DETERMINISM
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-black mb-2">
                Explicit state on every object
              </h3>
              <p className="text-xs sm:text-sm text-black leading-relaxed font-normal">
                Wallets and balance allocations carry unambiguous enumerated states, with zero silent transitions or inferred settlements.
              </p>
            </div>

            {/* CARD 03 */}
            <div className="bg-[#0040DF33] rounded-2xl p-6 sm:p-7 border border-slate-800/90 shadow-lg transition-all hover:border-slate-700">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-2">
                03 / ARITHMETIC PRECISION
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-black mb-2">
                Amounts with asset and precision
              </h3>
              <p className="text-xs sm:text-sm text-black leading-relaxed font-normal">
                All numeric quantities express scale and integer-string amounts to prevent IEEE 754 floating-point rounding discrepancies.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}