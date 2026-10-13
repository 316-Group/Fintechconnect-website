'use client';

import React from 'react';
import { Palette, LayoutGrid, CheckCheck } from 'lucide-react';

interface FeatureCard {
  id: number;
  icon: React.ReactNode;
  badgeText: string;
  badgeColor: string;
  title: string;
  description: string;
}

const cardsData: FeatureCard[] = [
  {
    id: 1,
    icon: <Palette className="w-5 h-5 text-blue-600" />,
    badgeText: 'Configurable',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    title: 'Brand & Visual System',
    description:
      'Full control over typography scales, light/dark theme swatches, button edge geometry, iconography styling, and corporate asset placement.',
  },
  {
    id: 2,
    icon: <LayoutGrid className="w-5 h-5 text-blue-600" />,
    badgeText: 'Configurable',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    title: 'Modules & Journeys',
    description:
      'Toggle account summaries, multi-currency wallets, virtual & physical card management, step-up security methods, and real-time ledger webhooks.',
  },
  {
    id: 3,
    icon: <CheckCheck className="w-5 h-5 text-blue-600" />,
    badgeText: 'Agreed Per Programme',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100',
    title: 'Release & Governance',
    description:
      'Store submissions, compliance reviews, dispute flows, push notification gateways, and dedicated sponsor bank boundaries are planned collaboratively.',
  },
];

export default function NewCardsSection() {
  return (
    <section className="w-full bg-[#f8faff] py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900">
      <div className="max-w-full mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            SCOPE &amp; RESPONSIBILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            What you configure, what stays with you.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal pt-1">
            Honest boundaries between your brand identity, modular journey layers, and institutional programme compliance.
          </p>
        </div>

        {/* 3-Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {cardsData.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div>
                {/* Top Row: Icon Badge & Status Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50/80 border border-blue-100/60 flex items-center justify-center shrink-0">
                    {card.icon}
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${card.badgeColor}`}>
                    {card.badgeText}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3 leading-snug">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
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