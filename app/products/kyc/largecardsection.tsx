"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { getPath } from "@/utils/helper";

interface ChecklistItem {
  id: number;
  label: string;
}

const leftChecklist: ChecklistItem[] = [
  { id: 1, label: "Explicit State Transitions" },
  { id: 2, label: "Events With Decision Context" },
];

const rightChecklist: ChecklistItem[] = [
  { id: 3, label: "Test the Difficult Paths" },
  { id: 4, label: "Trace Every Handoff" },
];

export default function LargeCardSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900">
      <div className="max-w-full mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            BUILT FOR DEVELOPERS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Design compliance workflows around clear, governable contracts.
          </h2>
        </div>

        {/* LARGE IMAGE CONTAINER MOCKUP */}
        <div className="w-full bg-[#f4f6fc] border border-slate-200/80 rounded-2xl overflow-hidden p-4 sm:p-6 lg:p-8 min-h-[380px] sm:min-h-[480px] flex items-center justify-center relative shadow-xs">
          <img
            src={getPath("/products/kyclargecard.png")}
            alt="Developer Compliance Workflows Interface Preview"
            className="w-full h-auto object-contain max-h-[500px] rounded-xl"
            onError={(e) => {
              // Fallback placeholder styling until you import your image asset
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* SUB-DESCRIPTION & CHECKLIST GRID */}
        <div className="space-y-6 pt-2">
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-4xl">
            Define how information enters a workflow, how review states change, and how decisions and evidence remain traceable across approved integrations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            {/* Left Checklist Column */}
            <div className="space-y-3">
              {leftChecklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Checklist Column */}
            <div className="space-y-3">
              {rightChecklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}