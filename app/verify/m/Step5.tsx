"use client";

import React from "react";
import { Check } from "lucide-react";

interface Step5Props {
  livePhoto: string | null;
  idPhoto: string | null;
  onDone: () => void;
}

export default function Step5Success({ livePhoto, idPhoto, onDone }: Step5Props) {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white text-slate-800">
      <div className="space-y-6 pt-2">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-sm font-bold text-[#0A63F8]">Fintech Connect</h2>
        </div>

        {/* Success Badge & Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-full bg-[#0A63F8] text-white flex items-center justify-center mx-auto shadow-md">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Identity Verified
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed px-4">
            Your biometric data has been successfully matched with your identity documents. Your verification is now complete.
          </p>
        </div>

        {/* 100% Matching Result Card */}
        <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-5 space-y-3">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase text-center block">
            MATCHING RESULT
          </span>

          <div className="flex items-center justify-between pt-1">
            {/* Live Selfie Capture Frame */}
            <div className="text-center space-y-1.5">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md mx-auto bg-slate-200">
                {livePhoto ? (
                  <img src={livePhoto} alt="Live capture" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-300" />
                )}
              </div>
              <span className="text-[10px] font-semibold text-slate-600 block">
                Live Capture
              </span>
            </div>

            {/* 100% Match Badge */}
            <div className="px-3 py-1 bg-blue-50 text-[#0A63F8] border border-blue-200/80 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-2xs">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>100% Match</span>
            </div>

            {/* Document Photo Frame */}
            <div className="text-center space-y-1.5">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md mx-auto bg-slate-200">
                {idPhoto ? (
                  <img src={idPhoto} alt="ID Document" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-300" />
                )}
              </div>
              <span className="text-[10px] font-semibold text-slate-600 block">
                ID Document
              </span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center leading-normal px-6">
          Data encrypted and stored according to institutional compliance standards.
        </p>
      </div>

      {/* Done Action */}
      <div className="pt-6 pb-2">
        <button
          type="button"
          onClick={onDone}
          className="w-full bg-[#0A63F8] hover:bg-blue-700 text-white text-xs font-semibold py-3.5 rounded-xl transition-colors shadow-md cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}