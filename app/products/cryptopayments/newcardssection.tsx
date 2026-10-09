'use client';

import React from 'react';
import { Hand, RefreshCw, Archive } from 'lucide-react';
import { getPath } from "@/utils/helper";

interface FeatureCard {
  id: number;
  badge: string;
  badgeColor: string;
  iconBg: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  imageSrc?: string;
}

const cardsData: FeatureCard[] = [
  {
    id: 1,
    badge: 'OPERATIONAL STATE GATE',
    badgeColor: 'text-amber-700',
    iconBg: 'bg-amber-50/90 border-amber-100/80 text-amber-600',
    icon: <Hand className="w-4 h-4" />,
    title: 'Blocked-Pending-Review Queue',
    description:
      'Missing travel-rule metadata or screening alerts place transactions into a locked human review state. Never auto-rejected without triage, never auto-approved.',
    imageSrc: getPath('/products/cards/card1.png'),
  },
  {
    id: 2,
    badge: 'PROTOCOL ANOMALY ENGINE',
    badgeColor: 'text-blue-600',
    iconBg: 'bg-blue-50/90 border-blue-100/80 text-blue-600',
    icon: <RefreshCw className="w-4 h-4" />,
    title: 'Chain Reorg & Dropped Tx Triage',
    description:
      'Automated detection of network drops or block reorganizations with automatic routing to operations review without losing transaction context.',
    imageSrc: getPath('/products/cards/card2.png'),
  },
  {
    id: 3,
    badge: 'FORENSIC INTEGRITY',
    badgeColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50/90 border-emerald-100/80 text-emerald-600',
    icon: <Archive className="w-4 h-4" />,
    title: 'Preserved Historic Confirmations',
    description:
      'Historic confirmation records and depth states are permanently retained as append-only audit evidence, never silently overwritten by reorganization updates.',
    imageSrc: getPath('/products/cards/card3.png'),
  },
];

export default function NewCardsSection() {
  return (
    <section className="w-full bg-[#f4f6fa] py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900">
      <div className="max-w-full mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            FAULT &amp; EXCEPTION RESILIENCE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Engineered for when on-chain events require operational intervention.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal pt-1">
            Explicit exception paths, human review gates, and immutable state histories built directly into the orchestration engine.
          </p>
        </div>

        {/* 3-Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {cardsData.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-slate-100/80 shadow-xs hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Image Container Slot at Top */}
              <div className="w-full h-52 sm:h-72 bg-slate-100/60 relative overflow-hidden">
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
                <div>
                  {/* Icon & Eyebrow Badge Row */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${card.iconBg}`}>
                      {card.icon}
                    </div>
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug mb-2">
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