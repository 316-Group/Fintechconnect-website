"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPath } from "@/utils/helper"; 

interface OnboardingStep6Props {
  onContinue?: () => void;
}

export default function OnboardingStep6({ onContinue }: OnboardingStep6Props) {
  const router = useRouter();

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto font-sans">
      {/* Modal Outer Container */}
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden p-3 md:p-5 grid grid-cols-1 md:grid-cols-2 min-h-[680px] gap-6">
        
        {/* Left Column: Completion & Final Action */}
        <div className="p-6 sm:p-8 flex flex-col justify-between bg-white z-10 h-full overflow-hidden">
          
          {/* Progress Header */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold tracking-wider">
              <span className="text-[#0052cc] uppercase">Step 6 of 6</span>
              <span className="text-slate-400 font-semibold">100% Complete</span>
            </div>
            <div className="w-full bg-blue-50 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0052cc] h-full rounded-full transition-all duration-500"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Center Completion Graphic & Text */}
          <div className="my-auto py-8 flex flex-col items-center text-center">
            {/* Scalloped Success Badge */}
            <div className="w-16 h-16 rounded-full bg-[#0052cc] flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-6">
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.7l-3.61.81.34 3.68L1 12l2.44 2.79-.34 3.7 3.61.82 1.89 3.2 3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
              </svg>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
              We've tailored your experience!
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mb-8">
              Based on your onboarding profile, we have pre-configured your
              workspace with the industry's most powerful tools.
            </p>

            {/* Continue Button */}
            <button
              type="button"
              onClick={handleContinue}
              className="py-3 px-7 rounded-xl bg-[#0052cc] hover:bg-blue-700 text-xs font-semibold text-white tracking-wide shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Dashboard</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>

          {/* Footer ISO Security Badge */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>ISO 27001 Certified Security</span>
          </div>
        </div>

        {/* Right Column: Platform Overview Marketing Box */}
        <div className="bg-[#f5f8ff] rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center">
          
          {/* Dashboard Preview Graphic */}
          <div className="w-full flex-1 flex items-center justify-center py-2">
            <div className="relative w-full max-w-md aspect-[4/3] flex items-center justify-center">
              <Image
                src={getPath("/survey.png")}
                alt="Platform Overview"
                width={500}
                height={375}
                priority
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Marketing Copy */}
          <div className="mt-4 max-w-sm">
            <h2 className="text-base font-bold text-slate-900 tracking-tight mb-2">
              The Complete Operating System for Financial Institutions
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fintech Connect provides a complete operating system for Banks,
              FinTechs, Mobile Money Agents, Insurtech and other financial
              institutions to build digital offerings, ship products faster and
              run thier business all from one place.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}