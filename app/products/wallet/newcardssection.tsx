'use client';

import React from 'react';
import { Globe, GitFork, Shield } from 'lucide-react';

interface FeatureCard {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const cardsData: FeatureCard[] = [
  {
    id: 1,
    icon: <Globe className="w-5 h-5 text-blue-600" />,
    title: 'Multi-Currency Sub-Ledgers',
    description:
      'Establish isolated balance nodes for 60+ ISO currency codes under a singular owner profile. Decimal precision, notation rules, and rounding logic are configured per denomination.',
  },
  {
    id: 2,
    icon: <GitFork className="w-5 h-5 text-blue-600" />,
    title: 'Cross-Border Settlement Routing',
    description:
      'Define programmatic routing bridges connecting local depository accounts with international disbursement paths. Maintain intermediate settlement accounts during transit.',
  },
  {
    id: 3,
    icon: <Shield className="w-5 h-5 text-blue-600" />,
    title: 'Programme Funding Boundaries',
    description:
      'Segment treasury float pools, establish distinct programmatic reserves for chargeback protection, and set automated threshold triggers to replenish operational balances.',
  },
];

export default function NewCardsSection() {
  return (
    <section className="w-full bg-[#f4f6fa] py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900">
      <div className="max-w-full mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="max-w-2xl">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            MULTI-JURISDICTION SCOPE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
            Multi-currency parameters built into core objects.
          </h2>
          <p className="text-slate-500 text-sm sm:text-lg leading-relaxed font-normal">
            Configure geographic corridors, segregated accounts, and currency pair settlement directly inside wallet templates.
          </p>
        </div>

        {/* 3-Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cardsData.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-start hover:shadow-md transition-shadow duration-200"
            >
              {/* Icon Badge */}
              <div className="w-15 h-15 rounded-xl bg-blue-50/80 border border-blue-100/60 flex items-center justify-center mt-8 mb-8 shrink-0">
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-5 leading-snug">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal mb-10">
                {card.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}