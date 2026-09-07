"use client";

import React from "react";
import { getPath } from "@/utils/helper";

interface ApiFeature {
  id: number;
  title: string;
  description: string;
  imagePath: string;
}

interface SandboxStep {
  stepNumber: number;
  title: string;
  description: string;
}

const features: ApiFeature[] = [
  {
    id: 1,
    title: "Well-documented APIs built by developers for developers",
    description:
      "Fapshi was birthed from frustration with existing solutions in the market, so we know your pain. Our APIs are straight to the point and well documented so that you can get started in minutes, not days. We are constantly working on the solution to make it a joy to work with.",
    imagePath: "/products/table.png",
  },
  {
    id: 2,
    title: "AI-driven liquidity projections and cash flow insights",
    description:
      "Forecast future transaction volumes and stress-test liquid balances in real time with machine learning models engineered to keep your operational treasury balanced and secure.",
    imagePath: "/products/apiimage.png",
  },
  {
    id: 3,
    title: "Real-time webhook events and instant payment syncing",
    description:
      "Stream live payment state updates directly into your infrastructure with zero latency. Seamlessly manage event retries, cryptographic signatures, and automated ledger reconciliations.",
    imagePath: "/products/apiimage.png",
  },
  {
    id: 4,
    title: "Enterprise security and automated compliance engine",
    description:
      "Built-in bank-grade encryption, automated KYC verification workflows, and multi-region failover protocols ensure your financial applications stay compliant and resilient at scale.",
    imagePath: "/products/apiimage.png",
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
    <section className="bg-[#f4f5f7] py-16 md:py-24 px-6 md:px-12 lg:px-20 font-sans space-y-24">
      <div className="max-w-full mx-auto">
        {/* Header Block */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="text-blue-500 font-semibold text-sm md:text-lg tracking-wide block mb-4">
            Built for developers
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Well-documented APIs built by developers for developers
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Fapshi was birthed from frustration with existing solutions in the
            market, so we know your pain. Our APIs are straight to the point and
            well documented so that you can get started in minutes, not days.
            We are constantly working on the solution to make it a joy to work
            with.
          </p>
        </div>

        {/* Staggered Dark Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {features.map((feature, index) => {
            const isRightColumn = index % 2 === 1;

            return (
              <div
                key={feature.id}
                className={`flex flex-col bg-[#1c1d21] p-4 md:p-5 rounded-[28px] shadow-lg transition-transform duration-300 ${
                  isRightColumn ? "md:mt-16" : ""
                }`}
              >
                {/* White Mockup Inner Container */}
                <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 flex items-center justify-center overflow-hidden">
                  <img
                    src={getPath(feature.imagePath)}
                    alt={feature.title}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>

                {/* Card Text Content */}
                <div className="px-3 md:px-5 pb-4 md:pb-6 space-y-3">
                  <h3 className="text-white text-lg md:text-xl font-bold leading-snug tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sandbox Onboarding Steps Section */}
      <div className="max-w-full mx-auto pt-12">
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