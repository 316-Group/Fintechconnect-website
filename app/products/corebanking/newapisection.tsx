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

const features: ApiFeature[] = [
  {
    id: 1,
    title: "Sandbox with test fund quotas",
    description:
      "Full-fidelity sandbox with seeded test balances, simulated settlement delays, and forced failure modes. Test the unhappy path before your customers find it.",
    imagePath: "/products/Apisection1.png",
    colSpan: "md:col-span-7", // Wider box (Top Left)
    imageHeight: "h-[300px] sm:h-[360px]",
  },
  {
    id: 2,
    title: "Typed webhooks and idempotency",
    description:
      "Every state change emits a signed, versioned webhook. Idempotency keys on all write endpoints guarantee retries never double-debit.",
    imagePath: "/products/Apisection2.png",
    colSpan: "md:col-span-5", // Thinner box (Top Right)
    imageHeight: "h-[300px] sm:h-[360px]",
  },
  {
    id: 3,
    title: "SDKs and reference implementations",
    description:
      "Node, Python, Go, Java and PHP SDKs, plus an open-source reference wallet app you can fork on day one.",
    imagePath: "/products/Apisection3.png",
    colSpan: "md:col-span-5", // Thinner box (Bottom Left)
    imageHeight: "h-[300px] sm:h-[360px]",
  },
  {
    id: 4,
    title: "Versioned, never-breaking API",
    description:
      "Versions are pinned per account. We ship additively and give 12 months' notice on any deprecation.",
    imagePath: "/products/Apisection4.png",
    colSpan: "md:col-span-7", // Wider box (Bottom Right)
    imageHeight: "h-[300px] sm:h-[360px]",
  },
];

interface GettingStartedStep {
  id: number;
  title: string;
  description: string;
}

const gettingStartedSteps: GettingStartedStep[] = [
  {
    id: 1,
    title: "Create an account",
    description:
      "Register for the developer portal and receive sandbox API keys with test fund quotas immediately.",
  },
  {
    id: 2,
    title: "Configure ledgers",
    description:
      "Define your chart of accounts, currency balances, deposit routes and fee structures using the console or SDKs.",
  },
  {
    id: 3,
    title: "Simulate flows",
    description:
      "Trigger incoming webhooks, test settlement cycles, run card authorisation bursts and verify auto-reconciliation.",
  },
  {
    id: 4,
    title: "Deploy live",
    description:
      "Switch to production keys with turnkey bank partner sponsorship and certified compliance guardrails in place.",
  },
];

function GettingStartedSection() {
  return (
    <section className="bg-white pt-16 md:pt-24 px-6 md:px-12 lg:px-20 font-sans">
      <div className="max-w-full mx-auto">
        {/* Header Block */}
        <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
          START EXPLORING OUR SANDBOX
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold tracking-tight text-slate-900 leading-[1.2] mb-10 md:mb-14">
          Here&apos;s how you get started
        </h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {gettingStartedSteps.map((step) => (
            <div key={step.id} className="flex flex-col">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center mb-5">
                {step.id}
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
    </section>
  );
}

export default function NewApiSection() {
  return (
    <>
      <GettingStartedSection />

      <section className="bg-white py-16 md:py-24 px-6 md:px-12 lg:px-20 font-sans">
        <div className="max-w-full mx-auto">
          {/* Header Block */}
          <div className="max-w-6xl mb-12 md:mb-16">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
              BUILT FOR DEVELOPERS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold tracking-tight text-slate-900 leading-[1.2] mb-4">
              Well-documented APIs built by developers for developers
            </h2>
            <p className="text-slate-600 text-base md:text-lg font-normal leading-relaxed">
              Fintech Connect exists because our team spent years fighting undocumented banking APIs.
              Ours are explicit, versioned and predictable — REST endpoints, idempotency keys, typed webhooks and SDKs in five languages.
              You get to a first successful call in minutes, not days.
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
      </section>
    </>
  );
}