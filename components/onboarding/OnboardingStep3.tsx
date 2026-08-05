"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface OnboardingStep3Props {
  onNext?: (selectedGoals: string[]) => void;
  onBack?: () => void;
}

interface GoalOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function OnboardingStep3({ onNext, onBack }: OnboardingStep3Props) {
  const router = useRouter();

  // Pre-select 'launch_cards' to match the screenshot design
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["launch_cards"]);

  const goalOptions: GoalOption[] = [
    {
      id: "launch_cards",
      title: "Launch Global Cards",
      description: "Issue physical and virtual cards in 40+ currencies.",
      icon: (
        <svg className="w-4 h-4 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "automate_compliance",
      title: "Automate Compliance",
      description: "Real-time KYC/AML screening and regulatory reporting.",
      icon: (
        <svg className="w-4 h-4 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: "crypto_assets",
      title: "Manage Crypto Assets",
      description: "Seamless custody and trading for digital assets.",
      icon: (
        <svg className="w-4 h-4 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "realtime_ledgering",
      title: "Real-time Ledgering",
      description: "High-throughput core banking and double-entry ledgers.",
      icon: (
        <svg className="w-4 h-4 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
    },
    {
      id: "cross_border_payouts",
      title: "Cross-border Payouts",
      description: "Scale remittance and global payouts via local rails.",
      icon: (
        <svg className="w-4 h-4 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11a2 2 0 012-2h1.055" />
        </svg>
      ),
    },
    {
      id: "digital_wallets",
      title: "Digital Wallets",
      description: "Launch branded multi-currency wallets with instant P2P.",
      icon: (
        <svg className="w-4 h-4 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      ),
    },
    {
      id: "embedded_lending",
      title: "Embedded Lending",
      description: "Integrate BNPL, credit lines, and merchant financing.",
      icon: (
        <svg className="w-4 h-4 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      id: "insurtech_solutions",
      title: "InsurTech Solutions",
      description: "Embed policies, claims, and automated underwriting.",
      icon: (
        <svg className="w-4 h-4 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: "treasury_management",
      title: "Treasury Management",
      description: "Automate liquidity management, yield, and sweeps.",
      icon: (
        <svg className="w-4 h-4 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: "embedded_lending_2",
      title: "Embedded Lending",
      description: "Integrate BNPL, credit lines, and merchant financing.",
      icon: (
        <svg className="w-4 h-4 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      id: "insurtech_solutions_2",
      title: "InsurTech Solutions",
      description: "Embed policies, claims, and automated underwriting.",
      icon: (
        <svg className="w-4 h-4 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: "treasury_management_2",
      title: "Treasury Management",
      description: "Automate liquidity management, yield, and sweeps.",
      icon: (
        <svg className="w-4 h-4 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
  ];

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (onNext) {
      onNext(selectedGoals);
    } else {
      router.push("/onboarding?step=4");
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/onboarding?step=2");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto font-sans">
      {/* Expanded Modal Card Container */}
      <div className="relative w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden p-3 md:p-5 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] min-h-[680px] gap-6">
        
        {/* Left Column: Form & Scrollable Card Grid */}
        <div className="p-6 sm:p-8 flex flex-col justify-between bg-white z-10 h-full overflow-hidden">
          <div>
            {/* Step Header & Progress Bar */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold tracking-wider">
                <span className="text-[#0052cc] uppercase">Step 3 of 5</span>
                <span className="text-slate-400 font-semibold">50% Complete</span>
              </div>
              <div className="w-full bg-blue-50 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#0052cc] h-full rounded-full transition-all duration-300"
                  style={{ width: "50%" }}
                />
              </div>
            </div>

            {/* Header Content */}
            <div className="mt-8 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                What are your primary goals?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg">
                Help us tailor your Fintech Connect experience. Select multiple options that align with your business strategy.
              </p>
            </div>

            {/* Scrollable Container with Custom Slim Blue Scrollbar */}
            <div className="max-h-[380px] overflow-y-auto pr-3.5 mr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#0052cc] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {goalOptions.map((option) => {
                  const isSelected = selectedGoals.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleGoal(option.id)}
                      className={`text-left p-4 rounded-xl transition-all border flex flex-col justify-between cursor-pointer min-h-[125px] ${
                        isSelected
                          ? "border-[#0052cc] bg-[#eef4ff] ring-1 ring-[#0052cc]"
                          : "border-slate-100 bg-white hover:border-slate-200"
                      }`}
                    >
                      {/* Top Row: Soft Blue Icon Box & Radio Selection Circle */}
                      <div className="flex items-center justify-between w-full mb-3">
                        <div className="w-7 h-7 rounded-lg bg-[#e8f0fe] flex items-center justify-center">
                          {option.icon}
                        </div>

                        {/* Multi-select Indicator */}
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full border-2 border-[#0052cc] flex items-center justify-center bg-white">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#0052cc]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-200 bg-white" />
                        )}
                      </div>

                      {/* Card Content */}
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 mb-1 leading-tight">
                          {option.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 leading-normal">
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
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
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
              <span>Next : Business & Industry</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: Inset Graphic & Marketing Showcase */}
        <div className="bg-[#f5f8ff] rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center">
          
          {/* Dashboard Graphic Container */}
          <div className="w-full flex-1 flex items-center justify-center pt-8 pb-0">
            <div className="relative w-full max-w-md aspect-[4/3] flex items-center justify-center">
              <Image 
                src="/survey.png" 
                alt="Platform Overview" 
                width={500}
                height={100}
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