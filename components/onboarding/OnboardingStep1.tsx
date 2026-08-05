"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPath } from '@/utils/helper';

interface OnboardingStep1Props {
  onNext?: () => void;
  onSkip?: () => void;
}

export default function OnboardingStep1({ onNext, onSkip }: OnboardingStep1Props) {
  const router = useRouter();

  const handleStartSurvey = () => {
    if (onNext) {
      onNext();
    } else {
      router.push("/onboarding?step=2");
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto font-sans">
      {/* Main Modal Card Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 min-h-[620px] gap-4">
        
        {/* Left Column: Survey Form & Actions */}
        <div className="p-6 sm:p-8 flex flex-col justify-between bg-white z-10">
          <div>
            {/* Step Header & Progress Bar */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold tracking-wider">
                <span className="text-[#0052cc] uppercase">Step 1 of 6</span>
                <span className="text-slate-400 font-semibold">20% Complete</span>
              </div>
              <div className="w-full bg-blue-50 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#0052cc] h-full rounded-full transition-all duration-300"
                  style={{ width: "20%" }}
                />
              </div>
            </div>

            {/* Main Welcome Content */}
            <div className="mt-12 flex flex-col items-center text-center">
              {/* Party Popper Badge Icon */}
              <div className="w-16 h-16 rounded-full bg-[#e8f0fe] flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#d2e3fc] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0052cc] tracking-tight mb-4">
                Welcome to Fintech Connect!
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
                We'd love to learn a bit more about your business goals so we can tailor your workspace with the right tools and resources.
              </p>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={handleStartSurvey}
                className="mt-8 w-full max-w-xs py-3.5 px-6 rounded-xl bg-[#0052cc] hover:bg-blue-700 text-xs font-semibold text-white tracking-wide shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Survey</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              {/* Skip Option */}
              <button
                type="button"
                onClick={handleSkip}
                className="mt-4 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>

          {/* Security Footer */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>ISO 27001 Certified Security</span>
          </div>
        </div>

        {/* Right Column: Inset Graphic & Platform Info Panel */}
        <div className="bg-[#f5f8ff] rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center">
          
          {/* Dashboard Graphic Container */}
          <div className="w-full flex-1 flex pt-8 pb-0 bg-blue-200 rounded-2xl">
            <div className="relative w-full pb-0 max-w-md aspect-[4/3] flex">
              <Image 
                src={getPath("/survey.png")} 
                alt="Platform Overview" 
                width={480}
                height={360}
                priority
                className="w-full h-auto object-contain pb-0 pl-2" 
              /> 
            </div>
          </div>

          {/* Marketing Copy */}
          <div className="mt-4 max-w-sm mb-10">
            <h2 className="text-base font-bold text-slate-900 tracking-tight mb-2">
              The Complete Operating System for Financial Institutions
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fintech Connect provides a complete operating system for Banks, FinTechs, Mobile Money Agents, Insurtech and other financial institutions to build digital offerings, ship products faster and run their business all from one place.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}