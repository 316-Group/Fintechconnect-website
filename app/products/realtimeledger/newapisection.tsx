"use client";

import React from "react";
import { getPath } from "@/utils/helper";

interface ApiFeature {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  imageHeight: string; // Specific viewport height for matching card sizes
}

interface SandboxStep {
  stepNumber: number;
  title: string;
  description: string;
}

const features: ApiFeature[] = [
  {
    id: 1,
    title: "Posting Contracts",
    description:
      "Define a clear input and output contract for a proposed posting, including the programme context, account references, amount representation, intended state and idempotency reference.",
    imagePath: "/products/Apisection1.png",
    imageHeight: "h-[320px] sm:h-[380px]", // Taller card size (Top Left)
  },
  {
    id: 2,
    title: "Explicit State Transitions",
    description:
      "Map how holds, postings, reversals, and corrections move between states, including permitted transitions and any required approvals or reasons.",
    imagePath: "/products/Apisection2.png",
    imageHeight: "h-[260px] sm:h-[310px]", // Shorter card size (Top Right)
  },
  {
    id: 3,
    title: "Events and Webhooks",
    description:
      "Describe events as versioned facts that consumers can process safely. A ledger-event guide should show the identifiers, timestamps, programme context and causation references that enable correlation across a workflow.",
    imagePath: "/products/Apisection3.png",
    imageHeight: "h-[320px] sm:h-[370px]", // Taller card size (Bottom Left)
  },
  {
    id: 4,
    title: "Test and Diagnose",
    description:
      "Provide development guidance for representative financial journeys, including normal postings, duplicate requests, delayed callbacks, reversals and reconciliation exceptions.",
    imagePath: "/products/Apisection4.png",
    imageHeight: "h-[260px] sm:h-[310px]", // Shorter card size (Bottom Right)
  },
];

const sandboxSteps: SandboxStep[] = [
  {
    stepNumber: 1,
    title: "Define the financial event",
    description:
      "Start with a representative event and identify the parties, accounts, references, expected states, and financial impact. Record who owns each decision and avoid assuming an approved integration or accounting treatment.",
  },
  {
    stepNumber: 2,
    title: "Map postings and responsibilities",
    description:
      "Translate the event into debit and credit postings, account relationships, timing rules, and dependencies. Define accounting policies, operational responsibilities, external-provider coordination and exceptions.",
  },
  {
    stepNumber: 3,
    title: "Validate the integration contract",
    description:
      "Review the expected commands, queries, events, identifiers, errors, and retry or idempotency behavior. Define how status changes and data are communicated, what is retained, and how missing information is handled.",
  },
  {
    stepNumber: 4,
    title: "Prepare controlled verification",
    description:
      "Define scenarios for release testing, including expected postings, balance calculations, reversals, exceptions, reconciliation checks, and permitted adjustments. Establish evidence capture, acceptance ownership, availability, and verification requirements.",
  },
];

function GettingStartedSection() {
  return (
    <div className="max-w-full mx-auto">
      {/* Header Block */}
      <div className="max-w-6xl mb-12 md:mb-16 space-y-3">
        <p className="text-blue-600 font-bold text-sm tracking-wider uppercase">
          START EXPLORING OUR SANDBOX
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
          Plan a ledger integration in four deliberate steps.
        </h2>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {sandboxSteps.map((step) => (
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
    <section className="bg-white py-16 md:py-24 px-6 md:px-12 lg:px-20 font-sans space-y-24">
      {/* Getting Started Steps Section */}
      <GettingStartedSection />

      {/* API Features Section */}
      <div className="max-w-full mx-auto">
        {/* Header Block */}
        <div className="max-w-6xl mb-12 md:mb-16 space-y-3">
          <p className="text-blue-600 font-bold text-sm tracking-wider uppercase">
            BUILT FOR DEVELOPERS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Make financial state part of the contract, not an afterthought.
          </h2>
          <p className="text-slate-600 text-base md:text-lg font-normal leading-relaxed pt-2">
            Ledger integrations need an unambiguous contract. The intended
            Real-Time Ledger developer surface focuses on the objects and
            transitions a team needs to reason about: journal entries,
            postings, holds, balances, reversals, references and reconciliation
            context.
          </p>
        </div>

        {/* Asymmetric Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-stretch">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`flex flex-col bg-[#f5f7fa] p-5 md:p-6 rounded-[28px] transition-all ${feature.id % 2 === 1 ? "md:col-span-7" : "md:col-span-5"}`}
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
    </section>
  );
}