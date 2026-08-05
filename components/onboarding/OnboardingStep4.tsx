"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface OnboardingStep4Props {
  onNext?: (selectedTypes: string[]) => void;
  onBack?: () => void;
}

export default function OnboardingStep4({ onNext, onBack }: OnboardingStep4Props) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  // Initialized with empty array so selected section remains hidden until user selects an option
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const industryOptions = [
    "Credit Union",
    "Crypto Card/Wallet",
    "Crypto Exchange",
    "Crypto & Web3",
    "Digital Wallet",
    "Fintech Startup",
    "Bank",
    "Insurance Company",
    "Money Transfer",
    "Neobank",
    "Payment Service Provider",
  ];

  // Close dropdown menu when clicking outside component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selectedTypes.includes(option)) {
      setSelectedTypes(selectedTypes.filter((item) => item !== option));
    } else {
      setSelectedTypes([...selectedTypes, option]);
    }
  };

  const removeOption = (option: string) => {
    setSelectedTypes(selectedTypes.filter((item) => item !== option));
  };

  const handleNext = () => {
    if (onNext) {
      onNext(selectedTypes);
    } else {
      router.push("/onboarding?step=5");
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/onboarding?step=3");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto font-sans">
      {/* Expanded Modal Container */}
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden p-3 md:p-5 grid grid-cols-1 md:grid-cols-2 min-h-[680px] gap-6">
        
        {/* Left Column: Form & Multi-Select Dropdown */}
        <div className="p-6 sm:p-8 flex flex-col justify-between bg-white z-10 h-full overflow-hidden">
          <div>
            {/* Step Header & Progress Bar */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold tracking-wider">
                <span className="text-[#0052cc] uppercase">Step 4 of 6</span>
                <span className="text-slate-400 font-semibold">66% Complete</span>
              </div>
              <div className="w-full bg-blue-50 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#0052cc] h-full rounded-full transition-all duration-300"
                  style={{ width: "66%" }}
                />
              </div>
            </div>

            {/* Header Text */}
            <div className="mt-8 mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                Nature of Business & Industry
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg">
                Help us tailor your Fintech Connect experience. Select multiple options that align with your business strategy.
              </p>
            </div>

            {/* Multi-Select Dropdown Input Container */}
            <div className="space-y-6 max-w-lg">
              <div className="space-y-2 relative" ref={dropdownRef}>
                <label className="block text-xs font-bold text-slate-900">
                  Select your business or industry type.
                </label>

                {/* Dropdown Input Box */}
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full p-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl flex justify-between items-center text-slate-500 text-xs sm:text-sm hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <span className="text-slate-400 font-medium">Please select all that apply</span>
                  <svg
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Options List */}
                {isOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 max-h-60 overflow-y-auto py-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#0052cc] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100">
                    {industryOptions.map((option) => {
                      const isSelected = selectedTypes.includes(option);
                      return (
                        <div
                          key={option}
                          onClick={() => toggleOption(option)}
                          className={`px-4 py-2.5 text-xs font-medium cursor-pointer flex items-center justify-between transition-colors ${
                            isSelected ? "bg-[#eef4ff] text-[#0052cc] font-semibold" : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span>{option}</span>
                          {isSelected && (
                            <svg className="w-4 h-4 text-[#0052cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected Pills Area - Only appears when at least 1 option is selected */}
              {selectedTypes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900">
                    Selected Business Type & Industry
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedTypes.map((type) => (
                      <span
                        key={type}
                        className="px-4 py-2 bg-[#0052cc] text-white text-[11px] font-medium rounded-full flex items-center gap-1.5 shadow-sm"
                      >
                        {type}
                        <button
                          type="button"
                          onClick={() => removeOption(type)}
                          className="hover:opacity-75 focus:outline-none ml-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
              className="py-2.5 px-6 rounded-xl bg-[#0052cc] hover:bg-blue-700 text-xs font-semibold text-white tracking-wide shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Next : Technical Setup</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column: Platform Overview Marketing Box */}
        <div className="bg-[#f5f8ff] rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center text-center">
          
          {/* Graphic Container */}
          <div className="w-full flex-1 flex items-center justify-center py-2">
            <div className="relative w-full max-w-md aspect-[4/3] flex items-center justify-center">
              <Image 
                src="/survey.png" 
                alt="Platform Overview" 
                width={500}
                height={375}
                priority
                className="w-full h-auto object-contain" 
              /> 
            </div>
          </div>

          {/* Text Content */}
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