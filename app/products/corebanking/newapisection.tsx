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
    title: "Well-documented APIs built by developers for developers",
    description:
      "Fapshi was birthed from frustration with existing solutions in the market, so we know your pain. Our APIs are straight to the point and well documented so that you can get started in minutes, not days. We are constantly working on the solution to make it a joy to work with.",
    imagePath: "/products/table.png",
  },
  {
    id: 3,
    title: "Well-documented APIs built by developers for developers",
    description:
      "Fapshi was birthed from frustration with existing solutions in the market, so we know your pain. Our APIs are straight to the point and well documented so that you can get started in minutes, not days. We are constantly working on the solution to make it a joy to work with.",
    imagePath: "/products/table.png",
  },
  {
    id: 4,
    title: "Well-documented APIs built by developers for developers",
    description:
      "Fapshi was birthed from frustration with existing solutions in the market, so we know your pain. Our APIs are straight to the point and well documented so that you can get started in minutes, not days. We are constantly working on the solution to make it a joy to work with.",
    imagePath: "/products/table.png",
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
    <section className="bg-[#F8FAFC] py-16 md:py-24 px-6 md:px-12 lg:px-20 font-sans space-y-24">
      <div className="max-w-full mx-auto">
        {/* Header Block */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="text-blue-500 font-semibold text-sm md:text-lg tracking-wide block mb-8">
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

        {/* Staggered Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {features.map((feature, index) => {
            const isLeftColumn = index % 2 === 0;

            return (
              <div
                key={feature.id}
                className={`flex flex-col rounded-1xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300 ${
                  isLeftColumn ? "md:mt-16" : ""
                }`}
              >
                {/* Top Image Container Block */}
                <div className="bg-[#E9ECEF] p-6 md:pt-10 pb-0 pl-0 pr-0 flex items-center justify-center min-h-[280px] md:min-h-[400px]">
                  <img
                    src={getPath(feature.imagePath)}
                    alt={feature.title}
                    className="w-full h-auto max-h-86 object-contain rounded-xl shadow-xs"
                  />
                </div>

                {/* Bottom Dark Card Details */}
                <div className="bg-[#212529] p-6 md:p-12 space-y-3">
                  <h3 className="text-white text-base md:text-lg font-bold leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
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