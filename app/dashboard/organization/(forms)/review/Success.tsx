"use client";

import React from "react";
import Link from "next/link";
import { Check, Clock, Download, ArrowRight } from "lucide-react";

interface ApplicationSuccessProps {
  applicationId: string;
  onboardingId?: string;
  onDownloadPdf?: () => void;
}

export default function ApplicationSuccess({
  onboardingId = "23402",
  onDownloadPdf,
}: ApplicationSuccessProps) {
  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 flex flex-col items-center justify-center font-sans">
      {/* Top Success Icon */}
      <div className="w-12 h-12 rounded-full bg-blue-100/70 flex items-center justify-center mb-6">
        <div className="w-8 h-8 rounded-full bg-[#0A63F8] flex items-center justify-center text-white shadow-sm">
          <Check className="w-5 h-5 stroke-[3]" />
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center tracking-tight leading-tight">
        Application Submitted <br /> Successfully
      </h1>

      <p className="text-xs text-slate-500 text-center max-w-md mt-3 leading-relaxed">
        Your application (Onboarding ID:{" "}
        <span className="inline-block px-1.5 py-0.5 bg-slate-200/80 text-slate-700 rounded font-mono text-[11px] font-semibold border border-slate-300/50">
          {onboardingId}
        </span>{" "}
        ) has been received, and is now in review by our compliance team.
      </p>

      {/* Main Outer Card */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mt-8 space-y-6">
        {/* Next Steps Container */}
        <div className="border border-slate-200/80 rounded-xl p-6 bg-white space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Clock className="w-5 h-5 text-[#0A63F8]" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Next Steps
            </h2>
          </div>

          {/* Timeline / Steps List */}
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0A63F8] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-800">
                  Compliance Review
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Our team is reviewing your institutional details. This standard process typically takes 24-48 business hours.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0A63F8] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-800">
                  Additional Information
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  If further documentation is required, we will notify your authorized signatories via email.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#0A63F8] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-800">
                  Account Activation
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upon approval, you will receive full access to the portal to configure your organizational settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 w-full">
        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-6 py-2.5 bg-[#0A63F8] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          Go To Dashboard <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={onDownloadPdf}
          className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          Download PDF Summary
        </button>
      </div>
    </div>
  );
}