'use client';

import React, { useState } from 'react';
import {
  LayoutGrid,
  ShieldCheck,
  Building2,
  CreditCard,
  Settings,
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  Check,
  Search,
  Filter,
  ArrowRightLeft,
  FileText,
  Lock,
  RefreshCw,
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
    tabLabel: 'Stage 01: Ingress',
    stageCode: 'STAGE 01: ENTITY & LEDGER PROVISIONING',
    title: 'Terminal Ingress & Payload Parsing',
    description:
      'The terminal or web checkout initiates an authorization request. Our ingest gateway strips channel proprietary fields and produces a standard ISO 8583-equivalent JSON canonical contract.',
    checklist: [
      'Cryptographic validation of message integrity and counterparty tokens',
      'Real-time reservation of ledger funds into dedicated pending state',
      'Mapped reason-code emission for explicit decline paths',
    ],
  },
  {
    id: '02',
    tabLabel: 'Stage 02: Risk & Spend Checks',
    stageCode: 'STAGE 02: RISK & SPEND EVALUATION',
    title: 'Synchronous Velocity & MCC Policy Checks',
    description:
      'Every inbound authorization request undergoes sub-millisecond evaluation against merchant category codes (MCC), transaction velocity limits, geofencing boundaries, and dynamic spend rules before funds lock.',
    checklist: [
      'Sub-millisecond policy rule engine execution',
      'MCC allowlist and geographic perimeter screening',
      'Dynamic multi-factor step-up approval triggers',
    ],
  },
  {
    id: '03',
    tabLabel: 'Stage 03: Hold & Approval',
    stageCode: 'STAGE 03: DUAL-CUSTODY HOLD & APPROVAL',
    title: 'Dual-Custody Hold & Ledger Ring-Fencing',
    description:
      'Approved requests immediately ring-fence user balance partitions into isolated hold states, triggering multi-signature approval chains while guaranteeing zero double-spend concurrency.',
    checklist: [
      'Atomic balance reservation on sub-ledgers',
      'Multi-signature approval chain workflow execution',
      'Guaranteed zero double-spend concurrency lock',
    ],
  },
  {
    id: '04',
    tabLabel: 'Stage 04: Clearing Correlation',
    stageCode: 'STAGE 04: CLEARING CORRELATION & CAPTURE',
    title: 'Deterministic File & Capture Matching',
    description:
      'Incoming scheme clearing files are deterministically linked to original hold tokens. Over-captures, under-captures, and currency exchange variances are reconciled automatically.',
    checklist: [
      'Exact authorization-to-clearing token correlation',
      'Automatic capture variance and spread adjustment',
      'ISO 20022 message payload normalization',
    ],
  },
  {
    id: '05',
    tabLabel: 'Stage 05: Settlement & Release',
    stageCode: 'STAGE 05: SETTLEMENT & IMMUTABLE RELEASE',
    title: 'Immutable Journal Commit & Final Release',
    description:
      'Final double-entry ledger entries are committed to the append-only journal, releasing temporary holds and emitting cryptographically signed events to integrated treasury systems.',
    checklist: [
      'Append-only double-entry ledger journal commit',
      'Signed webhook notification event dispatch',
      'Automated bank statement reconciliation export',
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
        <div className="text-center max-w-7xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            AUTHORIZATION LIFECYCLE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
            How a card transaction traverses the control boundary.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            Inspect the complete execution journey from point-of-sale intent to immutable ledger settlement.
          </p>

          {/* TAB SEGMENTED CONTROLLER */}
          <div className="max-w-[180rem] inline-flex flex-wrap items-center justify-center bg-[#f0f4fa] p-1.5 rounded-xl border border-slate-200/60 gap-1">
            {tabStages.map((stage) => {
              const isActive = activeTabId === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveTabId(stage.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-xs'
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
        <div className="bg-[#f8fafe]/90 border border-slate-200/80 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xs">
          
          {/* INTERACTIVE DASHBOARD MOCKUP UI */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            
            {/* LEFT SIDEBAR: NAVIGATION */}
            <div className="lg:col-span-3 border-r border-slate-100 p-4 sm:p-5 bg-slate-50/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-4 px-2">
                  NAVIGATION
                </span>
                <nav className="space-y-1">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100/60 cursor-pointer">
                    <LayoutGrid className="w-4 h-4 text-slate-500" />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#0042cc] text-white shadow-xs cursor-pointer">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Compliance</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100/60 cursor-pointer">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>Treasury</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100/60 cursor-pointer">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <span>Card Issuance</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100/60 cursor-pointer">
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Settings</span>
                  </div>
                </nav>
              </div>
            </div>

            {/* MIDDLE COLUMN: PENDING APPROVALS LIST */}
            <div className="lg:col-span-4 border-r border-slate-100 p-4 sm:p-5 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900">
                    {activeTabId === '01' && 'Pending Approvals'}
                    {activeTabId === '02' && 'Risk Policy Matrix'}
                    {activeTabId === '03' && 'Active Hold Queue'}
                    {activeTabId === '04' && 'Clearing Correlation'}
                    {activeTabId === '05' && 'Settled Ledger Log'}
                  </h3>
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                    12
                  </span>
                </div>
              </div>

              {/* CARD ITEM 1: URGENT */}
              <div className="border border-red-100 bg-red-50/30 rounded-xl p-3.5 space-y-2 cursor-pointer hover:border-red-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-red-600">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>! Urgent</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">2m ago</span>
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-900 leading-none">
                    $2,500,000.00 USD
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    To: Global Logistics SA
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex -space-x-1">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[9px] flex items-center justify-center border-2 border-white">
                      JL
                    </span>
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center border-2 border-white">
                      AL
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">2 of 3 signed</span>
                </div>
              </div>

              {/* CARD ITEM 2: HIGH VALUE (ACTIVE) */}
              <div className="border-2 border-blue-500 bg-blue-50/20 rounded-xl p-3.5 space-y-2 cursor-pointer shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-600">
                    <Star className="w-3.5 h-3.5 fill-blue-600" />
                    <span>High Value</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">15m ago</span>
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-900 leading-none">
                    $10,000,000.00 USD
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    To: Capital Partners LTD
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex -space-x-1">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-[9px] flex items-center justify-center border-2 border-white">
                      MK
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">1 of 3 signed</span>
                </div>
              </div>
            </div>

            {/* RIGHT DETAILS PANEL */}
            <div className="lg:col-span-5 p-4 sm:p-6 bg-white flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Panel Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 mb-1">
                      <Star className="w-3.5 h-3.5 fill-blue-600" />
                      <span>High Value</span>
                    </span>
                    <h4 className="text-2xl font-extrabold text-slate-900 leading-none">
                      $10,000,000.00 USD
                    </h4>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                      To: Capital Partners LTD
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">15m ago</span>
                </div>

                {/* Status Pill */}
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 text-xs text-blue-700 font-bold">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Awaiting Approval</span>
                  <span className="text-blue-500 font-medium">• 2 approvals remaining</span>
                </div>

                {/* Detailed Key-Value Metadata List */}
                <div className="bg-slate-50/60 rounded-xl p-3.5 space-y-2 text-xs border border-slate-100">
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-400 font-medium">From</span>
                    <span className="font-bold text-slate-900">NYC Main Treasury (USD)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-400 font-medium">To</span>
                    <span className="font-bold text-slate-900">Capital Partners LTD</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-400 font-medium">Reference</span>
                    <span className="font-mono font-bold text-slate-900">TR-99421</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-400 font-medium">Value Date</span>
                    <span className="font-bold text-slate-900">Nov 29, 2024</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-400 font-medium">Purpose</span>
                    <span className="font-bold text-slate-900">Investment Allocation</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 font-medium">Notes</span>
                    <span className="font-medium text-slate-700 text-right max-w-[200px]">
                      Quarterly capital allocation as per approved strategy.
                    </span>
                  </div>
                </div>

                {/* Approval Progress Tracker */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Approval Progress</span>
                    <span className="text-blue-600 font-extrabold">1 of 3</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[9px] flex items-center justify-center">
                          MK
                        </span>
                        <div>
                          <p className="font-bold text-emerald-600 text-[11px] leading-tight">Approved</p>
                          <p className="text-[10px] text-slate-500 leading-tight">Michael K.</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">15m ago</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0" />
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-[9px] flex items-center justify-center">
                          JL
                        </span>
                        <div>
                          <p className="font-bold text-slate-700 text-[11px] leading-tight">Pending</p>
                          <p className="text-[10px] text-slate-500 leading-tight">Jessica L.</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">--</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0" />
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-[9px] flex items-center justify-center">
                          AL
                        </span>
                        <div>
                          <p className="font-bold text-slate-700 text-[11px] leading-tight">Pending</p>
                          <p className="text-[10px] text-slate-500 leading-tight">Alex L.</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">--</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM EXPLANATION & CHECKLIST SECTION */}
        <div className="pt-2">
          <span className="text-[13px] font-extrabold tracking-widest text-blue-600 uppercase block mb-2">
            {currentStage.stageCode}
          </span>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
            {currentStage.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-4xl font-normal mb-6">
            {currentStage.description}
          </p>

          <div className="space-y-2.5">
            {currentStage.checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-slate-700">
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