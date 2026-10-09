'use client';

import React from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Webhook, 
  Clock 
} from 'lucide-react';
import { getPath } from '@/utils/helper';

interface SecurityCard {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  href?: string;
}

const securityCards: SecurityCard[] = [
  {
    id: 1,
    icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
    title: 'Access and permissions',
    description: 'Role-based access, approval hierarchies, and spend limits per account.',
    linkText: 'See limits and permissions',
    href: '#',
  },
  {
    id: 2,
    icon: <FileText className="w-5 h-5 text-blue-600" />,
    title: 'Immutable audit trail',
    description: 'Append-only ledger journals* record every state change.',
    linkText: 'See ledger design',
    href: '#',
  },
  {
    id: 3,
    icon: <Webhook className="w-5 h-5 text-blue-600" />,
    title: 'Signed events',
    description: 'Webhooks are signed and versioned, and writes use idempotency keys.',
    linkText: 'Read the API docs',
    href: '#',
  },
  {
    id: 4,
    icon: <Clock className="w-5 h-5 text-blue-600" />,
    title: 'Fraud and risk controls',
    description: 'Rules and monitoring checks before funds move.',
    linkText: 'See risk monitoring',
    href: '#',
  },
];

export default function SecuritySection() {
  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900">
      <div className="max-w-full mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
              SECURITY AND TRUST
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Security and control built into every wallet journey
            </h2>
          </div>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-sm font-normal">
            Permissions, audit trails, and signed events are part of the platform, not add-ons.
          </p>
        </div>

        {/* 4 Cards Grid Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityCards.map((card) => (
            <div
              key={card.id}
              className="bg-[#f4f6fa] rounded-2xl p-6 border border-slate-100/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div>
                {/* Icon Container */}
                <div className="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100/60 flex items-center justify-center mb-6">
                  {card.icon}
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-lg text-slate-500 leading-relaxed font-normal mb-6">
                  {card.description}
                </p>
              </div>

              {/* Bottom Action Link */}
              <a
                href={card.href || '#'}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors group mt-auto"
              >
                <span>{card.linkText}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          ))}
        </div>

        {/* Bottom Dark Banner */}
        <img
            src={getPath("/products/wallet/securitybackground.png")}
            alt="Security and Trust Banner"
            className="w-full h-auto rounded-2xl mt-12"
          />
      
  

      </div>
    </section>
  );
}