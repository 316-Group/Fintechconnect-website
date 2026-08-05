"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPath } from "@/utils/helper";

interface OnboardingStep2Props {
  onNext?: (selectedOptions: string[]) => void;
  onBack?: () => void;
}

interface BusinessOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function OnboardingStep2({ onNext, onBack }: OnboardingStep2Props) {
  const router = useRouter();

  // Store a single selected string option instead of an array
  const [selectedOption, setSelectedOption] = useState<string>("startup");

  const businessOptions: BusinessOption[] = [
    {
      id: "startup",
      title: "High-growth Startup",
      description: "Rapidly scaling teams focused on speed and modern API integrations.",
      icon: (
        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      id: "enterprise",
      title: "Established Enterprise",
      description: "Large-scale operations requiring robust compliance and treasury tools.",
      icon: (
        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7m4 0v10" />
        </svg>
      ),
    },
    {
      id: "institution",
      title: "Financial Institution",
      description: "Banks and neobanks looking to modernize their underlying infrastructure.",
      icon: (
        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
    },
    {
      id: "ecommerce",
      title: "E-commerce Platform",
      description: "Global marketplaces needing multi-currency payouts and ledgers.",
      icon: (
        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      ),
    },
  ];

  const handleNext = () => {
    if (onNext) {
      onNext([selectedOption]);
    } else {
      router.push("/onboarding?step=3");
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/onboarding?step=1");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto font-sans">
      {/* Main Modal Card Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 min-h-[620px] gap-4">
        
        {/* Left Column: Form & Survey Selection */}
        <div className="p-6 sm:p-8 flex flex-col justify-between bg-white z-10">
          <div>
            {/* Step Header & Progress Bar */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold tracking-wider">
                <span className="text-[#0052cc] uppercase">Step 2 of 5</span>
                <span className="text-slate-400 font-semibold">30% Complete</span>
              </div>
              <div className="w-full bg-blue-50 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#0052cc] h-full rounded-full transition-all duration-300"
                  style={{ width: "30%" }}
                />
              </div>
            </div>

            {/* Main Header Text */}
            <div className="mt-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                Tell us a bit about your business.
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md">
                Help us tailor your Fintech Connect experience. Select the option that best aligns with your business strategy.
              </p>
            </div>

            {/* 2x2 Interactive Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
              {businessOptions.map((option) => {
                const isSelected = selectedOption === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOption(option.id)}
                    className={`text-left p-4 rounded-2xl transition-all border flex flex-col justify-between min-h-[140px] cursor-pointer ${
                      isSelected
                        ? "border-[#0052cc] bg-white ring-1 ring-[#0052cc] shadow-sm"
                        : "border-slate-100 bg-[#f8fafc] hover:border-slate-200"
                    }`}
                  >
                    {/* Icon Badge */}
                    <div className="w-9 h-9 rounded-xl bg-slate-200/50 flex items-center justify-center mb-3">
                      {option.icon}
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                        {option.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Action Buttons */}
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
              className="py-2.5 px-5 rounded-xl bg-[#0052cc] hover:bg-blue-700 text-xs font-semibold text-white tracking-wide shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Next : Primary Goals</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: Inset Graphic & Platform Info Panel */}
        <div className="bg-[#f5f8ff] rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center">
          
          {/* Dashboard Graphic Container */}
          <div className="w-full flex-1 flex items-center justify-center py-2">
            <div className="relative w-full max-w-md aspect-[4/3] flex items-center justify-center">
              <Image 
                src={getPath("/survey.png")} 
                alt="Platform Overview" 
                width={480}
                height={360}
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