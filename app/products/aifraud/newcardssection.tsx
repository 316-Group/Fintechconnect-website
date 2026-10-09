'use client';

import React from 'react';
import { Gauge, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import {getPath} from "@/utils/helper";

interface FeatureCard {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  imageSrc?: string;
}

const cardsData: FeatureCard[] = [
  {
    id: 1,
    icon: <Gauge className="w-4 h-4 text-blue-600" />,
    title: 'Velocity Caps',
    description:
      'Enforce upper expenditure limits across calendar intervals and physical access channels.',
    imageSrc: getPath('/products/cards/card1.png'), // Replace with your image path
  },
  {
    id: 2,
    icon: <SlidersHorizontal className="w-4 h-4 text-blue-600" />,
    title: 'MCC Rules Engine',
    description:
      'Lock usage to verified enterprise supplier codes and automatically block high-risk categories.',
    imageSrc: getPath('/products/cards/card2.png'), // Replace with your image path
  },
  {
    id: 3,
    icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
    title: 'Dual-Custody Thresholds',
    description:
      'Require programmatic secondary operational authorization for transactions exceeding risk limits.',
    imageSrc: getPath('/products/cards/card3.png'), // Replace with your image path
  },
];

export default function NewCardsSection() {
  return (
    <section className="w-full bg-[#f4f6fa] py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900">
      <div className="max-w-full mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            MULTI-JURISDICTION SCOPE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
            Fine-grained policy parameters configured at the software boundary.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal">
            Define programmatic rules and operational thresholds across individual cards or entire fleets.
          </p>
        </div>

        {/* 3-Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cardsData.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-slate-100/80 shadow-xs hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Image Container Slot at Top */}
              <div className="w-full h-48 sm:h-80 bg-slate-100 relative overflow-hidden">
                {card.imageSrc ? (
                  <img
                    src={card.imageSrc}
                    alt={card.title}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-slate-400 bg-slate-100">
                    Image Placeholder
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-3">
                {/* Title & Icon Header Row */}
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-snug">
                    {card.title}
                  </h3>
                  <div className="w-10 h-10 rounded-lg bg-blue-50/80 border border-blue-100/60 flex items-center justify-center shrink-0">
                    {card.icon}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}