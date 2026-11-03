"use client";

import React from "react";
import { getPath } from "@/utils/helper";

interface ApiFeature {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  colSpan: string;
  imageHeight: string;
}

interface TreasuryStep {
  stepNumber: number;
  title: string;
  description: string;
}

const features: ApiFeature[] = [
  {
    id: 1,
    title: "Position and as-of semantics",
    description:
      "Define position payloads around an explicit scope, source, time basis, balance context, and status rather than a single unexplained number. Contract notes should distinguish derived views from authoritative records and explain the relationship to the agreed ledger boundary.",
    imagePath: "/products/Apisection1.png",
    colSpan: "md:col-span-7", // Wider box (Top Left)
    imageHeight: "h-[300px] sm:h-[360px]",
  },
  {
    id: 2,
    title: "Settlement state transitions",
    description:
      "Describe anticipated settlement states, timing differences, reversals, failures, and manual-review conditions as named transitions.",
    imagePath: "/products/Apisection2.png",
    colSpan: "md:col-span-5", // Thinner box (Top Right)
    imageHeight: "h-[300px] sm:h-[360px]",
  },
  {
    id: 3,
    title: "Reviewable workflow commands",
    description:
      "Describe anticipated settlement states, timing differences, reversals, failures, and manual-review conditions as named transitions. A treasury contract should retain internal and external references so teams can investigate what changed and why.",
    imagePath: "/products/Apisection3.png",
    colSpan: "md:col-span-5", // Thinner box (Bottom Left)
    imageHeight: "h-[300px] sm:h-[360px]",
  },
  {
    id: 4,
    title: "Reviewable workflow commands",
    description:
      "Plan events and error responses that carry stable identifiers, schema versions, correlation context, and safe retry guidance. Webhook behaviour should be documented with delivery, replay, and verification expectations before use.",
    imagePath: "/products/Apisection4.png",
    colSpan: "md:col-span-7", // Wider box (Bottom Right)
    imageHeight: "h-[300px] sm:h-[360px]",
  },
];

const treasurySteps: TreasuryStep[] = [
  {
    stepNumber: 1,
    title: "Define the treasury question",
    description:
      "Identify the positions, settlement obligations, funding decisions, reports, and exceptions your programme needs to understand. Capture the relevant products, entities, calendars, data sources, and review points.",
  },
  {
    stepNumber: 2,
    title: "Map records and responsibilities",
    description:
      "Relate proposed treasury views to ledger, payment, reconciliation, and selected external-record inputs. Document who owns each data source, decision, approval, and exception path.",
  },
  {
    stepNumber: 3,
    title: "Review the intended contracts",
    description:
      "Work through the proposed position, settlement, forecast, and workflow contracts with product, finance, operations, security, and integration stakeholders. Test ordinary and exception scenarios conceptually.",
  },
  {
    stepNumber: 4,
    title: "Agree a validated delivery path",
    description:
      "Use the discovery output to agree module boundaries, connector dependencies, programme controls, acceptance evidence, and launch governance. Confirm what must be configured, what requires integration, and which decisions remain with the institution or specialist partners.",
  },
];

function GettingStartedSection() {
  return (
    <div className="max-w-full mx-auto">
      {/* Header Block */}
      <div className="max-w-6xl mb-12 md:mb-16">
        <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
          START EXPLORING OUR SANDBOX
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold tracking-tight text-slate-900 leading-[1.2]">
          Four practical steps to frame your treasury programme
        </h2>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {treasurySteps.map((step) => (
          <div key={step.stepNumber} className="flex flex-col">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center mb-5">
              {step.stepNumber}
            </span>
            <h3 className="text-slate-900 text-base md:text-lg font-bold tracking-tight mb-2">
              {step.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed font-normal">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center gap-4 mt-10 md:mt-12">
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Book Demo Now
        </button>
        <button
          type="button"
          className="bg-white hover:bg-slate-50 text-slate-900 text-sm font-semibold px-5 py-2.5 rounded-lg border border-slate-300 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default function NewApiSection() {
  return (
    <section className="bg-white py-16 md:py-24 px-6 md:px-12 lg:px-20 font-sans">
      <div className="max-w-full mx-auto space-y-24">
        {/* Getting Started Steps Section */}
        <GettingStartedSection />

        {/* API Features Section */}
        <div>
          {/* Header Block */}
          <div className="max-w-6xl mb-12 md:mb-16">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
              BUILT FOR DEVELOPERS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold tracking-tight text-slate-900 leading-[1.2] mb-4">
              Treasury contracts that make state and context explicit
            </h2>
            <p className="text-slate-600 text-base md:text-lg font-normal leading-relaxed">
              Treasury integrations should be understandable before they are operational. The intended developer experience centres on documented, provider-neutral contracts for position context, settlement obligations, forecast inputs, funding-workflow states, and reporting requests.
            </p>
          </div>

          {/* Asymmetric Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-stretch">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`flex flex-col bg-[#f5f7fa] p-5 md:p-6 rounded-[28px] transition-all ${feature.colSpan}`}
              >
                {/* Image Preview Container */}
                <div
                  className={`w-full ${feature.imageHeight} bg-white rounded-2xl overflow-hidden shadow-sm flex items-top justify-center mb-6 border border-slate-100`}
                >
                  <img
                    src={getPath(feature.imagePath)}
                    alt={feature.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Card Text Content */}
                <div className="px-1 pb-2 space-y-2.5 flex-1 flex flex-col justify-start">
                  <h3 className="text-slate-900 text-xl md:text-2xl font-bold tracking-tight leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}