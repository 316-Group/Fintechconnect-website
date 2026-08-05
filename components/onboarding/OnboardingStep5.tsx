"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPath } from "@/utils/helper";

interface OnboardingStep5Props {
  onNext?: (selectedOption: string) => void;
  onBack?: () => void;
}

type BuildOptionId = "low_code" | "api_first";

interface BuildOption {
  id: BuildOptionId;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function OnboardingStep5({ onNext, onBack }: OnboardingStep5Props) {
  const router = useRouter();

  // Enforce single-choice state (defaulting to 'low_code' per design)
  const [selectedOption, setSelectedOption] = useState<BuildOptionId>("low_code");

  const buildOptions: BuildOption[] = [
    {
      id: "low_code",
      title: "Low-code / Pre-built UI",
      description:
        "Perfect for non-developers or teams looking to go live in hours using our hosted components.",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
    },
    {
      id: "api_first",
      title: "API-first / Full Control",
      description:
        "Built for engineering teams requiring deep customization and direct integration via REST APIs.",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  const handleNext = () => {
    if (onNext) {
      onNext(selectedOption);
    } else {
      router.push("/onboarding?step=6");
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/onboarding?step=4");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto font-sans">
      {/* Modal Outer Container */}
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden p-3 md:p-5 grid grid-cols-1 md:grid-cols-2 min-h-[680px] gap-6">
        
        {/* Left Column: Technical Setup Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-between bg-white z-10 h-full overflow-hidden">
          <div>
            {/* Step Header & Progress Bar */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold tracking-wider">
                <span className="text-[#0052cc] uppercase">Step 5 of 6</span>
                <span className="text-slate-400 font-semibold">90% Complete</span>
              </div>
              <div className="w-full bg-blue-50 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#0052cc] h-full rounded-full transition-all duration-300"
                  style={{ width: "90%" }}
                />
              </div>
            </div>

            {/* Header Content */}
            <div className="mt-8 mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                Technical Setup
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg">
                Help us tailor your developer experience. How do you plan to build with Fintech Connect?
              </p>
            </div>

            {/* Question Label & Card Selection Grid */}
            <div className="mt-6 space-y-3">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Question
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                How do you plan to build?
              </h2>

              {/* Single Select Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {buildOptions.map((option) => {
                  const isSelected = selectedOption === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedOption(option.id)}
                      className={`text-left p-5 rounded-2xl transition-all border flex flex-col justify-between cursor-pointer min-h-[180px] ${
                        isSelected
                          ? "border-2 border-[#0052cc] bg-white shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {/* Icon Box */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-[#eef4ff] text-[#0052cc]"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {option.icon}
                      </div>

                      {/* Card Titles & Subtext */}
                      <div className="mt-4">
                        <h3 className="text-xs font-bold text-slate-900 mb-1.5 leading-snug">
                          {option.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Navigation Action */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>   

            <button
              type="button"
              onClick={handleNext}
              className="py-2.5 px-6 rounded-xl bg-[#0052cc] hover:bg-blue-700 text-xs font-semibold text-white tracking-wide shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Continue</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
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
          <div className="mt-4 max-w-sm mb-15">
            <h2 className="text-base font-bold text-slate-900 tracking-tight mb-2">
              The Complete Operating System for Financial Institutions
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fintech Connect provides a complete operating system for Banks, FinTechs, Mobile Money Agents, Insurtech and other financial institutions to build digital offerings, ship products faster and run thier business all from one place.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}