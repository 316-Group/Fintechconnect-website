"use client";

import React, { useState } from "react";
import { getPath } from "@/utils/helper";

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
    <section 
      className="w-full bg-cover bg-center bg-no-repeat py-20 md:py-28 px-4 sm:px-6 lg:px-20 font-sans text-slate-900 overflow-hidden relative"
      style={{ backgroundImage: `url(${getPath('/products/cryptowallets/devsectionbackground.jpg')})` }}
    >
      {/* Optimized high-performance color overlay (No backdrop-blur to prevent lag) */}
      <div className="absolute inset-0 bg-[#f4f6fc]/90 z-0" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold tracking-widest text-slate-500 uppercase block">
            BUILT FOR DEVELOPERS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            A wallet contract your team can read.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal pt-1">
            REST endpoints, idempotency keys, explicit states and exact amounts.
          </p>
        </div>

        {/* MAIN SPLIT GRID CONTAINER (MATCHING HEIGHTS VIA items-stretch) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: INTERACTIVE CODE EDITOR BOX */}
          <div className="lg:col-span-7 bg-[#0040DF1F]/90 rounded-2xl border border-slate-200/80 shadow-md overflow-hidden flex flex-col justify-between">
            
            {/* EDITOR TABS HEADER WITH PILL BUTTONS */}
            <div className="bg-[#0040DF1F]/90 px-6 py-4 flex items-center">
              <div className="bg-[#0040DF1F]/90 p-1 rounded-xl flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("request")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "request" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Request
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("response")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "response" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Response
                </button>
              </div>

              </div>
            

            {/* CODE DISPLAY AREA */}
            <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-800 space-y-4 flex-1">
              <div>
                <span className="text-blue-600 font-bold">POST</span>{" "}
                <span className="text-slate-800">{"{base_url}"}/wallets</span>
              </div>
              <div className="text-slate-700">
                Idempotency-Key: <span className="text-slate-900 font-semibold">{"{unique-key}"}</span>
              </div>
              <div className="text-slate-700 pb-2 border-b border-slate-200/60">
                Content-Type: <span className="text-slate-900 font-semibold">application/json</span>
              </div>

              <pre className="text-slate-800 font-mono text-xs sm:text-sm whitespace-pre-wrap pt-2">
                {activeTab === "request" ? (
                  <>
                    <span>{"{\n"}</span>
                    <span className="text-emerald-600">  &quot;customer_ref&quot;</span>: &quot;CUST-9920f&quot;,<br />
                    <span className="text-emerald-600">  &quot;programme_ref&quot;</span>: &quot;PRG-8820&quot;,<br />
                    <span className="text-emerald-600">  &quot;asset&quot;</span>: &quot;ASSET_A&quot;,<br />
                    <span className="text-emerald-600">  &quot;network&quot;</span>: &quot;NETWORK_I&quot;,<br />
                    <span className="text-emerald-600">  &quot;policy&quot;</span>: &#123;<br />
                    <span className="text-emerald-600">    &quot;approval_threshold&quot;</span>: &quot;10000.00000000&quot;,<br />
                    <span className="text-emerald-600">    &quot;approvers_required&quot;</span>: <span className="text-amber-600">2</span>,<br />
                    <span className="text-emerald-600">    &quot;allowlist_only&quot;</span>: <span className="text-rose-600">true</span><br />
                    <span>  &#125;<br />{"}"}</span>
                  </>
                ) : (
                  <span className="text-emerald-700">{responseSnippet}</span>
                )}
              </pre>
            </div>

          </div>

          {/* RIGHT COLUMN: 3 STACKED FEATURE CARDS (MATCHING HEIGHTS) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* CARD 01 */}
            <div className="bg-[#0040DF1F]/90 rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-md transition-all hover:bg-white flex-1 flex flex-col justify-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-2">
                01 / IDEMPOTENCY
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-2">
                Idempotent writes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Every state-mutating request accepts an Idempotency-Key header, ensuring network retries cannot create duplicate wallet records or balance allocations.
              </p>
            </div>

            {/* CARD 02 */}
            <div className="bg-[#0040DF1F]/90 rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-md transition-all hover:bg-white flex-1 flex flex-col justify-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-2">
                02 / DETERMINISM
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-2">
                Explicit state on every object
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Wallets and balance allocations carry unambiguous enumerated states, with zero silent transitions or inferred settlements.
              </p>
            </div>

            {/* CARD 03 */}
            <div className="bg-[#0040DF1F]/90 rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-md transition-all hover:bg-white flex-1 flex flex-col justify-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 block mb-2">
                03 / ARITHMETIC PRECISION
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-2">
                Amounts with asset and precision
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                All numeric quantities express scale and integer-string amounts to prevent IEEE 754 floating-point rounding discrepancies.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}