"use client";

import React from "react";
import { getPath } from "@/utils/helper";

interface ApiFeature {
  id: number;
  title: string;
  description: string;
  imagePath: string;
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

export default function NewApiSection() {
  return (
    <section className="bg-[#F8FAFC] py-16 md:py-24 px-6 md:px-12 lg:px-20 font-sans">
      <div className="max-w-full mx-auto">
        {/* Header Block */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="text-blue-500 font-semibold text-sm md:text-base tracking-wide block mb-3">
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
            // Apply staggering effect on the right column (odd index in 0-based array)
            const isStaggered = index % 2 === 1;

            return (
              <div
                key={feature.id}
                className={`flex flex-col rounded-1xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300 ${
                  isStaggered ? "md:mt-16" : ""
                }`}
              >
                {/* Top Image Container Block */}
                <div className="bg-[#E9ECEF] p-6 md:pt-10 pb-0 flex items-center justify-center min-h-[280px] md:min-h-[340px]">
                  <img
                    src={getPath(feature.imagePath)}
                    alt={feature.title}
                    className="w-full h-auto max-h-86 object-contain rounded-xl shadow-xs"
                  />
                </div>

                {/* Bottom Dark Card Details */}
                <div className="bg-[#212529] p-6 md:p-8 space-y-3">
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
    </section>
  );
}