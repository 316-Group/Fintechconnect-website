'use client';

import React from 'react';
import { Globe, GitFork, Shield } from 'lucide-react';
import { getPath } from "@/utils/helper";

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
    icon: <Globe className="w-4 h-4 text-blue-600" />,
    title: 'Connect Identity & Business Records',
    description:
      'Bring permitted KYC/KYB, ownership, and screening context into investigation workflows.',
    imageSrc: getPath('/products/cards/card1.png'),
  },
  {
    id: 2,
    icon: <GitFork className="w-4 h-4 text-blue-600" />,
    title: 'Relate Alerts to Financial State',
    description:
      'Reference transaction states without silently altering financial records.',
    imageSrc: getPath('/products/cards/card2.png'),
  },
  {
    id: 3,
    icon: <Shield className="w-4 h-4 text-blue-600" />,
    title: 'Preserve Review History',
    description:
      'Keep case evidence, assignments, approvals, policy references, and decision reasons connected.',
    imageSrc: getPath('/products/cards/card3.png'),
  },
];

export default function NewCardsSection() {
  return (
    <section className="w-full bg-[#f8faff] py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900">
      <div className="max-w-full mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            PRODUCT EXTENSIONS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Connect AML operations to the wider financial ecosystem.
          </h2>
        </div>

        {/* 3-Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {cardsData.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-slate-100/80 shadow-xs hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Image Container Slot at Top */}
              <div className="w-full h-48 sm:h-64 bg-slate-100 relative overflow-hidden">
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
                <div className="space-y-3">
                  {/* Icon Box */}
                  <div className="w-9 h-9 rounded-xl bg-blue-50/80 border border-blue-100/60 flex items-center justify-center shrink-0">
                    {card.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}