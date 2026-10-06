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
    title: "Sandbox with test fund quotas",
    description:
      "Full-fidelity sandbox with seeded test balances, simulated settlement delays, and forced failure modes. Test the unhappy path before your customers find it.",
    imagePath: "/products/Apisection1.png",
    imageHeight: "h-[320px] sm:h-[380px]", // Taller card size (Top Left)
  },
  {
    id: 2,
    title: "Typed webhooks and idempotency",
    description:
      "Every state change emits a signed, versioned webhook. Idempotency keys on all write endpoints guarantee retries never double-debit.",
    imagePath: "/products/Apisection2.png",
    imageHeight: "h-[260px] sm:h-[310px]", // Shorter card size (Top Right)
  },
  {
    id: 3,
    title: "SDKs and reference implementations",
    description:
      "Node, Python, Go, Java and PHP SDKs, plus an open-source reference wallet app you can fork on day one.",
    imagePath: "/products/Apisection3.png",
    imageHeight: "h-[320px] sm:h-[370px]", // Taller card size (Bottom Left)
  },
  {
    id: 4,
    title: "Versioned, never-breaking API",
    description:
      "Versions are pinned per account. We ship additively and give 12 months' notice on any deprecation.",
    imagePath: "/products/Apisection4.png",
    imageHeight: "h-[260px] sm:h-[310px]", // Shorter card size (Bottom Right)
  },
];

const sandboxSteps: SandboxStep[] = [
  {
    stepNumber: 1,
    title: "Create an account",
    description:
      "Fapshi was birthed from frustration with existing solutions in the market, so we know your pain. Our APIs are straight to the point and well documented so that you can get started in minutes, not days.",
  },
  {
    stepNumber: 2,
    title: "Get your API keys",
    description:
      "Generate your test API credentials directly from your developer dashboard to start authenticating your requests immediately without waiting for approval.",
  },
  {
    stepNumber: 3,
    title: "Test in sandbox",
    description:
      "Simulate payment flows, webhook responses, and error handling in a fully isolated test environment with zero financial risk.",
  },
  {
    stepNumber: 4,
    title: "Go live",
    description:
      "Complete your account verification, swap your test keys for live credentials, and start processing real-time production transactions seamlessly.",
  },
];

export default function NewApiSection() {
  return (
    <section className="bg-white py-16 md:py-24 px-6 md:px-12 lg:px-20 font-sans space-y-24">
      <div className="max-w-full mx-auto">
        {/* Header Block */}
        <div className="max-w-4xl mb-12 md:mb-16">
          <p className="text-slate-700 text-base md:text-xl font-normal leading-relaxed">
            Fintech Connect exists because our team spent years fighting
            undocumented banking APIs. Ours are explicit, versioned and
            predictable — REST endpoints, idempotency keys, typed webhooks and
            SDKs in five languages. You get to a first successful call in
            minutes, not days.
          </p>
        </div>

        {/* Feature Cards Grid (Custom Sized Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col bg-[#f4f5f8] p-5 md:p-6 rounded-[28px] transition-all"
            >
              {/* White Mockup Inner Container with Custom Height */}
              <div
                className={`w-full ${feature.imageHeight} bg-white rounded-2xl overflow-hidden shadow-sm flex items-top justify-center mb-6`}
              >
                <img
                  src={getPath(feature.imagePath)}
                  alt={feature.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Card Text Content */}
              <div className="px-1 pb-2 space-y-2">
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

      {/* Sandbox Onboarding Steps Section */}
      <div className="max-w-7xl mx-auto pt-12">
        {/* Header */}
        <div className="mb-12">
          <span className="text-blue-600 font-bold text-lg md:text-3xl block mb-2">
            Start exploring our sandbox
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Here’s some simple steps to get started
          </h2>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12">
          {sandboxSteps.map((step) => (
            <div key={step.stepNumber} className="flex flex-col space-y-3">
              {/* Number Circle Badge */}
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                {step.stepNumber}
              </div>

              {/* Title */}
              <h3 className="text-blue-500 text-base md:text-lg font-bold">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6 pt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors">
            Book Demo
          </button>
          <a
            href="#get-started"
            className="text-slate-900 font-bold text-sm underline hover:text-blue-600 transition-colors decoration-2 underline-offset-4"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}