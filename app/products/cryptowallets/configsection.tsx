"use client";

import React, { useState } from "react";
import { Sliders, Check } from "lucide-react";

interface TransferItem {
  reference: string;
  amount: string;
  destination: string;
  destType: 'ALLOWLISTED' | 'EXTERNAL';
  status: 'Proceeds to screening checkpoint' | 'Needs 2 approvers' | 'Halted: Address not allowlisted';
  statusType: 'success' | 'warning' | 'danger';
}

const transferQueue: TransferItem[] = [
  {
    reference: 'REF-001001',
    amount: '2,500.00000000 Asset A',
    destination: '0x4a..110b',
    destType: 'ALLOWLISTED',
    status: 'Proceeds to screening checkpoint',
    statusType: 'success',
  },
  {
    reference: 'REF-001002',
    amount: '14,200.00000000 Asset A',
    destination: '0x9b..44ce',
    destType: 'ALLOWLISTED',
    status: 'Needs 2 approvers',
    statusType: 'warning',
  },
  {
    reference: 'REF-001003',
    amount: '850.00000000 Asset A',
    destination: '0xlc..99ef',
    destType: 'EXTERNAL',
    status: 'Halted: Address not allowlisted',
    statusType: 'danger',
  },
  {
    reference: 'REF-001004',
    amount: '32,000.00000000 Asset A',
    destination: '0x6e..221a',
    destType: 'ALLOWLISTED',
    status: 'Needs 2 approvers',
    statusType: 'warning',
  },
  {
    reference: 'REF-001005',
    amount: '8,400.00000000 Asset A',
    destination: '0x3d..88fc',
    destType: 'ALLOWLISTED',
    status: 'Proceeds to screening checkpoint',
    statusType: 'success',
  },
];

export default function ConfigSection() {
  const [approvalThreshold, setApprovalThreshold] = useState<number>(10000);
  const [approversRequired, setApproversRequired] = useState<number>(2);
  const [allowlistOnly, setAllowlistOnly] = useState<boolean>(true);

  return (
    <section className="w-full bg-[#f4f6fc] py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900 overflow-hidden">
      <div className="max-w-full mx-auto space-y-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block">
            POLICY CONFIGURATION
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Set the rules before anything moves.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal pt-1">
            Configure operational boundaries and approval matrices that govern wallet movements before execution.
          </p>
        </div>

        {/* TOP CONTROLS CARD */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Approval Threshold Control */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">Approval Threshold</span>
              <span className="text-sm font-extrabold text-blue-600 font-mono">
                ${approvalThreshold.toLocaleString()}
              </span>
            </div>
            
            <div className="space-y-1.5 pt-1">
              <input 
                type="range" 
                min="1000" 
                max="50000" 
                step="1000"
                value={approvalThreshold}
                onChange={(e) => setApprovalThreshold(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-1">
                <span>$1,000</span>
                <span>$25,000</span>
                <span>$50,000</span>
              </div>
            </div>
          </div>

          {/* Approvers Required Control */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Approvers Required</span>
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setApproversRequired(num)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    approversRequired === num 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Quorum rule for transfers above threshold
            </p>
          </div>

          {/* Destination Control */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Destination Control</span>
            <div 
              onClick={() => setAllowlistOnly(!allowlistOnly)}
              className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100 cursor-pointer select-none"
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0 ${allowlistOnly ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'}`}>
                {allowlistOnly && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight">
                Require Allowlisted Addresses Only
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              External addresses automatically halted
            </p>
          </div>

        </div>

        {/* BOTTOM SIMULATED TRANSFER QUEUE TABLE CARD */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Table Card Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Sliders className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 tracking-wide uppercase">
                Simulated Transfer Queue (Live Evaluation)
              </h3>
            </div>
            <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              REAL TIME EVALUATION
            </span>
          </div>

          {/* Table Data */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-extrabold tracking-wider text-slate-400 bg-slate-50/30 uppercase">
                  <th className="py-3.5 px-6">Reference</th>
                  <th className="py-3.5 px-6">Asset Amount</th>
                  <th className="py-3.5 px-6">Destination</th>
                  <th className="py-3.5 px-6">Policy Evaluation Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {transferQueue.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{item.reference}</td>
                    <td className="py-4 px-6 font-mono text-slate-600">{item.amount}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-800">{item.destination}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          item.destType === 'ALLOWLISTED' 
                            ? 'bg-slate-100 text-slate-500 border border-slate-200/60' 
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {item.destType}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.statusType === 'success' 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                          : item.statusType === 'warning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* BOTTOM CTA BUTTON */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer text-center"
          >
            Continue Building
          </button>
        </div>

      </div>
    </section>
  );
}