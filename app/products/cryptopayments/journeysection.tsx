'use client';

import React, { useState } from 'react';
import {
  Building2,
  FileText,
  Eye,
  CheckCircle2,
  ShieldCheck,
  ArrowRightLeft,
  Lock,
  RefreshCw,
  Wallet,
  Coins,
  Receipt,
  FileCode,
} from 'lucide-react';

interface TabStage {
  id: string;
  tabLabel: string;
  stageCode: string;
  title: string;
  description: string;
  checklist: string[];
}

const tabStages: TabStage[] = [
  {
    id: '01',
    tabLabel: '01 / Provisioning',
    stageCode: 'STAGE 01: ENTITY & LEDGER PROVISIONING',
    title: 'Hierarchical Account Inception',
    description:
      'The parent application issues an account creation instruction. The wallet engine allocates an isolated sub-ledger with distinct currency scopes, assigns custom metadata schemas, and binds permission policies before any transaction can enter the boundary.',
    checklist: [
      'Configured parent-child ledger hierarchy',
      'Cryptographic API key identity validation',
      'Pre-allocated ISO currency containers',
    ],
  },
  {
    id: '02',
    tabLabel: '02 / State Funding',
    stageCode: 'STAGE 02: STATE FUNDING & LIQUIDITY SWEEPS',
    title: 'Automated Reserve & Sweep Execution',
    description:
      'Inbound capital triggers real-time ledger partition hooks, allocating reserve locks and sweeping operational balances into isolated sub-ledgers according to partner treasury parameters.',
    checklist: [
      'Instant vIBAN reference reconciliation',
      'Sub-millisecond balance partition',
      'Automated reserve ratio enforcement',
    ],
  },
  {
    id: '03',
    tabLabel: '03 / Transfer & Execution',
    stageCode: 'STAGE 03: TRANSFER & ATOMIC EXECUTION',
    title: 'Cryptographic Atomic Settlement',
    description:
      'Transactions execute with strict idempotency protection. Multi-leg FX conversions and external disbursements resolve atomically across double-entry balance sheets to ensure zero double-debit conditions.',
    checklist: [
      'Signed idempotency payload verification',
      'Real-time sanctions & velocity screening',
      'Guaranteed zero double-debit execution',
    ],
  },
  {
    id: '04',
    tabLabel: '04 / Settlement Review',
    stageCode: 'STAGE 04: SETTLEMENT REVIEW & AUDIT LOGS',
    title: 'Deterministic Reconciliation & Governance',
    description:
      'Immutable append-only journals lock the final transaction state, delivering instantaneous audit readiness, structured exception handling, and automated compliance reporting.',
    checklist: [
      'Immutable append-only audit trail',
      'ISO 20022 compliant message archiving',
      'Automated exception reconciliation engine',
    ],
  },
];

export default function JourneySection() {
  const [activeTabId, setActiveTabId] = useState<string>('01');

  const currentStage =
    tabStages.find((stage) => stage.id === activeTabId) || tabStages[0];

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900">
      <div className="max-w-full mx-auto space-y-10">
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            WORKFLOW LIFECYCLE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-8">
            How a wallet journey operates across the platform.
          </h2>

          {/* TAB SEGMENTED CONTROLLER */}
          <div className="inline-flex flex-wrap items-center justify-center bg-[#f0f4fa] p-1.5 rounded-xl border border-slate-200/60 gap-1">
            {tabStages.map((stage) => {
              const isActive = activeTabId === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveTabId(stage.id)}
                  className={`px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {stage.tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN VISUAL MOCKUP CONTAINER */}
        <div className="bg-[#f8fafe]/80 border border-slate-200/80 rounded-xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
          
          {/* TAB 01: PROVISIONING CONTENT */}
          {activeTabId === '01' && (
            <div className="space-y-6">
              {/* TOP ROW GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Organization Profile Card */}
                <div className="lg:col-span-8 bg-white rounded-xl p-6 sm:p-7 border border-slate-100 shadow-xs">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-lg text-slate-900">
                        Organization Profile
                      </h3>
                    </div>
                    <button className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        LEGAL ENTITY NAME
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        Nexus Global Capital Ltd.
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        REGISTRATION ID
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        GB-49201-NXG
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        HEADQUARTERS
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        London, United Kingdom
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        TAX RESIDENCY
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        European Economic Area (EEA)
                      </p>
                    </div>
                  </div>
                </div>

                {/* KYB Status Card */}
                <div className="lg:col-span-4 bg-[#eef3fb]/80 rounded-xl p-6 sm:p-7 border border-slate-200/50 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-3">
                      KYB Status
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-xs font-bold mb-4">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>Verified</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    All mandatory institutional verification documents have been cleared by our compliance engine.
                  </p>
                </div>
              </div>

              {/* BOTTOM ROW: Uploaded Documentation */}
              <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-100 shadow-xs">
                <div className="flex items-center gap-2.5 mb-5">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-lg text-slate-900">
                    Uploaded Documentation
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#f5f8ff] border border-blue-100/80 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900">
                          Articles_of_Incorporation.pdf
                        </p>
                        <p className="text-[11px] text-slate-400">
                          4.2 MB • Uploaded May 24, 2024
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-[#f5f8ff] border border-blue-100/80 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900">
                          Board_Resolution_Authorized_Signatory.pdf
                        </p>
                        <p className="text-[11px] text-slate-400">
                          1.8 MB • Uploaded May 24, 2024
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 02: STATE FUNDING CONTENT */}
          {activeTabId === '02' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white rounded-xl p-6 sm:p-7 border border-slate-100 shadow-xs">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2.5">
                      <Wallet className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-lg text-slate-900">
                        Funding Source &amp; Rails
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      Active Rail
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        PRIMARY RAIL
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        SEPA Instant / FedNow vIBAN
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        SETTLEMENT CURRENCY
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        EUR / USD Multi-Currency
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        ALLOCATED VAULT
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        Primary Operating Float #0042
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        SWEEP FREQUENCY
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        Real-Time Sub-Second
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-[#eef3fb]/80 rounded-xl p-6 sm:p-7 border border-slate-200/50 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-3">
                      Deposit Status
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-xs font-bold mb-4">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>Settled ($5,000,000.00)</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    Inbound wire matched via vIBAN reference. Funds credited to available balance sub-ledger.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-100 shadow-xs">
                <div className="flex items-center gap-2.5 mb-5">
                  <Coins className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-lg text-slate-900">
                    Sub-Ledger Balance Partitioning
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#f5f8ff] p-4 rounded-xl border border-blue-100/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Available Balance
                    </span>
                    <p className="text-xl font-extrabold text-slate-900">
                      $4,250,000.00
                    </p>
                  </div>
                  <div className="bg-[#f5f8ff] p-4 rounded-xl border border-blue-100/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Pending Reserves
                    </span>
                    <p className="text-xl font-extrabold text-blue-600">
                      $750,000.00
                    </p>
                  </div>
                  <div className="bg-[#f5f8ff] p-4 rounded-xl border border-blue-100/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Liquidity Buffer
                    </span>
                    <p className="text-xl font-extrabold text-emerald-600">
                      100% Fully Backed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 03: TRANSFER & EXECUTION CONTENT */}
          {activeTabId === '03' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white rounded-xl p-6 sm:p-7 border border-slate-100 shadow-xs">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2.5">
                      <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-lg text-slate-900">
                        Execution Order Details
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      Idempotent Locked
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        TRANSACTION TYPE
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        Multi-Currency FX &amp; Payout
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        ORDER ID
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        ORD-88392-FX-2026
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        ORIGIN VAULT
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        EUR Operating Vault
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        TARGET RECIPIENT
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        Nexus Asia Trading Co.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-[#eef3fb]/80 rounded-xl p-6 sm:p-7 border border-slate-200/50 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-3">
                      Risk &amp; Sanctions Check
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-xs font-bold mb-4">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>Passed (Zero Anomalies)</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    Anti-fraud checks, sanctions screening, and idempotency key verification passed.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-xs">
                <div className="flex items-center gap-2.5 mb-5">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-lg text-slate-900">
                    Atomic FX Lock &amp; Payout Routing
                  </h3>
                </div>

                <div className="bg-[#f5f8ff] border border-blue-100/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0">
                      <Receipt className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        Locked Spread Rate: 1.0842 EUR/USD
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Executing $120,000.00 USD via local ACH rail
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600">
                    Sub-second Settlement
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 04: SETTLEMENT REVIEW CONTENT */}
          {activeTabId === '04' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white rounded-xl p-6 sm:p-7 border border-slate-100 shadow-xs">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2.5">
                      <Receipt className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-lg text-slate-900">
                        Settlement Audit Journal
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      Double-Entry Sealed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        JOURNAL ENTRY ID
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        JNL-2026-094182
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        SETTLED VOLUME
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        $1,240,000.00 USD
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        RECONCILIATION MATCH
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        100% Deterministic Match
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                        MERKLE PROOF
                      </span>
                      <p className="text-sm font-bold text-slate-900 font-mono">
                        0x88f2...39a1
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-[#eef3fb]/80 rounded-xl p-6 sm:p-7 border border-slate-200/50 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-3">
                      Compliance Archival
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-xs font-bold mb-4">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>ISO 20022 Archived</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    Immutable event logs written to double-entry ledger. Raw JSON export generated for inspection.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-100 shadow-xs">
                <div className="flex items-center gap-2.5 mb-5">
                  <FileCode className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-lg text-slate-900">
                    Generated Statements &amp; Audit Files
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#f5f8ff] border border-blue-100/80 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900">
                          Monthly_Ledger_Reconciliation_Q3.pdf
                        </p>
                        <p className="text-[11px] text-slate-400">
                          2.4 MB • Generated automatically
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM EXPLANATION & CHECKLIST SECTION */}
        <div className="pt-2">
          <span className="text-[15px] font-extrabold tracking-widest text-blue-600 uppercase block mb-2">
            {currentStage.stageCode}
          </span>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
            {currentStage.title}
          </h3>

          <p className="text-sm sm:text-lg text-slate-500 leading-relaxed max-w-4xl font-normal mb-6">
            {currentStage.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
            {currentStage.checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs sm:text-lg font-semibold text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}