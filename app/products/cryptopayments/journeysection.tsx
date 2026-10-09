'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  Building2,
  FileText,
  Eye,
  Wallet,
  ArrowRightLeft,
  ShieldCheck,
  RefreshCw,
  Lock,
  Cpu,
  Network,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface ChecklistItem {
  label: string;
  detail: string;
  isWarning?: boolean;
}

interface TabStage {
  id: string;
  tabLabel: string;
  stageCode: string;
  title: string;
  description: string;
  checklist: ChecklistItem[];
}

const tabStages: TabStage[] = [
  {
    id: '01',
    tabLabel: '01: Submit',
    stageCode: 'STAGE 01: API INGRESS & INGESTION',
    title: 'API Ingress & Transaction Ingestion',
    description:
      'The client application constructs a payment instruction payload containing target network, asset type, recipient public address, and optional metadata. The gateway assigns an idempotent session ID and validates schema formatting.',
    checklist: [
      {
        label: 'Schema & parameter validation',
        detail: 'Guarantees syntactic correctness before queueing.',
      },
      {
        label: 'Idempotency lock assignment',
        detail: 'Prevents double-submission and duplicate transaction execution.',
      },
      {
        label: 'Session token allocation',
        detail: 'Binds execution intent to an isolated, verifiable context.',
      },
    ],
  },
  {
    id: '02',
    tabLabel: 'Stage 02: Validate',
    stageCode: 'STAGE 02: SYNTACTIC & BALANCE VALIDATION',
    title: 'Protocol & Sub-Ledger Validation',
    description:
      'Determines cryptographic address validity across target chain standards (EVM, UTXO, Solana) and checks internal treasury sub-ledger reserves to ensure sufficient gas and asset headroom prior to signing.',
    checklist: [
      {
        label: 'Address checksum verification',
        detail: 'Ensures valid target public key formatting across target chains.',
      },
      {
        label: 'Sub-ledger balance allocation',
        detail: 'Reserves necessary asset and gas fee float on isolated nodes.',
      },
      {
        label: 'Slippage & fee parameter bounds',
        detail: 'Enforces maximum acceptable gas and exchange spread limits.',
      },
    ],
  },
  {
    id: '03',
    tabLabel: 'Stage 03: Screen & Travel-Rule',
    stageCode: 'STAGE 03: RISK & TRAVEL-RULE CHECKPOINT',
    title: 'Screen & Travel-Rule Checkpoint',
    description:
      'Policy gateway evaluates sanctions feeds and travel-rule metadata attachments. Incomplete metadata or flagged counterparties trigger an immediate negative routing branch.',
    checklist: [
      {
        label: 'Originator & beneficiary verification',
        detail: 'Confirms required counterparty entity structure.',
      },
      {
        label: 'Sanctions list screening match',
        detail: 'Instant query against client-configured provider endpoints.',
      },
      {
        label: 'Programmatic hold queue routing',
        detail: 'Halts broadcast pipeline automatically if any policy triggers fire.',
        isWarning: true,
      },
    ],
  },
  {
    id: '04',
    tabLabel: 'Stage 04: Dispatch',
    stageCode: 'STAGE 04: CUSTODY & SIGNING DISPATCH',
    title: 'Custody & Multi-Signer Dispatch',
    description:
      'The transaction payload is routed to pre-configured signer infrastructure or MPC nodes. Signatures are collected according to multi-party key share thresholds without exposing private keys.',
    checklist: [
      {
        label: 'MPC threshold quorum assembly',
        detail: 'Collects required cryptographic key share approvals.',
      },
      {
        label: 'HSM key isolation',
        detail: 'Enforces hardware security module isolation during signing.',
      },
      {
        label: 'Raw payload serialization',
        detail: 'Formats signed transaction payload for target network broadcast.',
      },
    ],
  },
  {
    id: '05',
    tabLabel: 'Stage 05: Broadcast & Confirm',
    stageCode: 'STAGE 05: NETWORK BROADCAST & CONFIRMATION',
    title: 'Network Broadcast & Final Confirmation',
    description:
      'The signed transaction is broadcast across distributed validator nodes. Block inclusion is monitored until the configured finality quorum depth is achieved and immutable ledger state is updated.',
    checklist: [
      {
        label: 'Multi-node broadcast gateway',
        detail: 'Dispatches payload simultaneously across redundant RPC endpoints.',
      },
      {
        label: 'Quorum depth confirmation tracking',
        detail: 'Monitors block confirmations until deterministic state finality.',
      },
      {
        label: 'Immutable journal entry commit',
        detail: 'Writes final status and transaction hash to append-only audit logs.',
      },
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
        <div className="text-center max-w-4xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            AUTHORIZATION LIFECYCLE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
            Five-stage lifecycle from API ingress to network confirmation.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            Observe how transactions pass through rigorous policy and routing gates with unambiguous failure containment.
          </p>

          {/* TAB SEGMENTED CONTROLLER */}
          <div className="inline-flex flex-wrap items-center justify-center bg-[#f0f4fa] p-1.5 rounded-2xl border border-slate-200/60 gap-1">
            {tabStages.map((stage) => {
              const isActive = activeTabId === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveTabId(stage.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-200 cursor-pointer ${
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
        <div className="bg-[#f5f7fa] border border-slate-200/70 rounded-2xl p-6 sm:p-8 lg:p-10 min-h-[380px] shadow-xs flex items-center justify-center">
          
          {/* STAGE MOCKUP CONTENT PREVIEW */}
          <div className="w-full max-w-full bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  {activeTabId === '01' && <FileText className="w-5 h-5" />}
                  {activeTabId === '02' && <Wallet className="w-5 h-5" />}
                  {activeTabId === '03' && <ShieldCheck className="w-5 h-5" />}
                  {activeTabId === '04' && <Cpu className="w-5 h-5" />}
                  {activeTabId === '05' && <Network className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 block">
                    {currentStage.stageCode}
                  </span>
                  <h4 className="font-extrabold text-base sm:text-lg text-slate-900">
                    {currentStage.title}
                  </h4>
                </div>
              </div>

              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/80 self-start sm:self-center">
                Pipeline State: Active
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {currentStage.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#f8fafe] p-3.5 rounded-xl border border-blue-50/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                  Gate Status
                </span>
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Passed (0 errors)
                </p>
              </div>

              <div className="bg-[#f8fafe] p-3.5 rounded-xl border border-blue-50/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                  Execution Mode
                </span>
                <p className="text-xs font-bold text-slate-900">
                  Deterministic Pipeline
                </p>
              </div>

              <div className="bg-[#f8fafe] p-3.5 rounded-xl border border-blue-50/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                  Latency SLA
                </span>
                <p className="text-xs font-bold text-blue-600">
                  Sub-50ms Gateway
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM EXPLANATION & CHECKLIST SECTION */}
        <div className="pt-2 space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {currentStage.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-4xl font-normal">
            {currentStage.description}
          </p>

          <div className="space-y-3 pt-2">
            {currentStage.checklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                {item.isWarning ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                )}
                <p className="text-xs sm:text-sm text-slate-700 leading-normal">
                  <span className="font-bold text-slate-900">{item.label}: </span>
                  <span className="font-normal text-slate-600">{item.detail}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}