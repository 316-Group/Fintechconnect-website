'use client';

import React from 'react';
import { Workflow, Landmark, ArrowLeftRight, FileText } from 'lucide-react';

interface FeatureCard {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const cardsData: FeatureCard[] = [
  {
    id: 1,
    icon: <Workflow className="w-5 h-5 text-blue-600" />,
    title: 'One wallet layer, any approved custody arrangement',
    description:
      'Connects operational workflows and ledger allocations regardless of the institutional custody framework chosen for your programme.',
  },
  {
    id: 2,
    icon: <Landmark className="w-5 h-5 text-blue-600" />,
    title: 'Balances that say exactly what they are',
    description:
      'Available, pending and held shown as distinct states, with explicit asset and precision so nothing is assumed or rounded away.',
  },
  {
    id: 3,
    icon: <ArrowLeftRight className="w-5 h-5 text-blue-600" />,
    title: 'Controls before movement',
    description:
      'Enforce threshold rules, allowlists, and approver policies before any transaction can be dispatched to your signing arrangement.',
  },
  {
    id: 4,
    icon: <FileText className="w-5 h-5 text-blue-600" />,
    title: 'Records you can trace',
    description:
      'Every state transition, operator action, and review checkpoint recorded into an immutable sequential log with cryptographic digest tags.',
  },
];

export default function NewCardsSection() {
  return (
    <section className="w-full bg-[#f8faff] py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900">
      <div className="max-w-full mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="max-w-3xl space-y-3 text-center mx-auto">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            ARCHITECTURAL FOUNDATION
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Designed for programmatic certainty.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal pt-1 max-w-xl mx-auto">
            Deterministic recordkeeping engineered around your governance profile and enterprise boundaries.
          </p>
        </div>

        {/* 4-Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch max-w-full mx-auto">
          {cardsData.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-7 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div>
                {/* Top Row: Icon Badge */}
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50/80 border border-blue-100/60 flex items-center justify-center shrink-0">
                    {card.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-3 leading-snug">
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