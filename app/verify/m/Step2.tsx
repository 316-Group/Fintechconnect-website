"use client";

import React from "react";
import { Plane, CreditCard, Shield, Lock } from "lucide-react";

interface Step2Props {
  selectedDocType: string;
  setSelectedDocType: (type: string) => void;
  onNext: () => void;
  onCancel: () => void;
}

export default function Step2SelectId({
  selectedDocType,
  setSelectedDocType,
  onNext,
  onCancel,
}: Step2Props) {
  const docOptions = [
    {
      id: "passport",
      title: "Passport",
      subtitle: "Photo page required. Must show all 4 corners clearly.",
      icon: Plane,
    },
    {
      id: "drivers_license",
      title: "Driver's License",
      subtitle: "Front and back required. Must be physically issued.",
      icon: CreditCard,
    },
    {
      id: "national_id",
      title: "National ID Card",
      subtitle: "Front and back required. Plastic card formats preferred.",
      icon: Shield,
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white text-slate-800">
      <div className="space-y-5 pt-2">
        <div className="text-center">
          <h2 className="text-sm font-bold text-[#0A63F8]">Fintech Connect</h2>
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 border-b border-slate-100 pb-2">
          <span>IDENTITY VERIFICATION</span>
          <span>STEP 2 OF 4</span>
        </div>

        <div>
          <h1 className="text-lg font-bold text-slate-900">Select ID Type</h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Choose the document you wish to upload. Ensure it is valid and clearly legible.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {docOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedDocType === option.id;

            return (
              <div
                key={option.id}
                onClick={() => setSelectedDocType(option.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? "border-[#0A63F8] bg-blue-50/30 shadow-2xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? "bg-[#0A63F8] text-white"
                      : "bg-blue-50 text-[#0A63F8]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{option.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    {option.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#EFF4FE] border border-blue-100/80 rounded-xl p-3.5 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-[#0A63F8] shrink-0 mt-0.5" />
          <p className="text-[10.5px] text-slate-600 leading-relaxed">
            Your documents are securely encrypted and processed according to institutional-grade security standards.
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-6 pb-2 text-center">
        <button
          type="button"
          onClick={onNext}
          className="w-full bg-[#0A63F8] hover:bg-blue-700 text-white text-xs font-semibold py-3.5 rounded-xl transition-colors shadow-md cursor-pointer"
        >
          Continue to Upload
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer block w-full py-1"
        >
          Cancel Verification
        </button>
      </div>
    </div>
  );
}