"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getPath } from '@/utils/helper';

const modules = [
  {
    tag: "Fiat Rails",
    title: "Fiat Banking Rails & Payment Processing",
    desc: "Pre-established banking relationships for fiat deposits and withdrawals via bank transfer, card, and open banking — in GBP, EUR, USD, and 60+ currencies. Instant deposits, same-day withdrawals, and full AML compliance.",
    img: '/products/corebanking modules/image9.png'
  },
  {
    tag: "Custody",
    title: "MPC Exchange Custody",
    desc: "Institutional-grade MPC custody for user funds with hot/warm/cold tiering, multi-signature withdrawal approvals, and proof-of-reserves reporting. Supports 100+ blockchains and all major token standards.",
    img: '/products/realtimeledger modules/image4.png'
  },
  {
    tag: "KYC/KYB",
    title: "Exchange KYC & Institutional KYB",
    desc: "Onboard retail traders in under 5 minutes with biometric KYC, and institutional clients with full KYB, source-of-funds verification, and enhanced due diligence — pre-certified for FATF Travel Rule compliance.",
    img: '/products/corebanking modules/image7.png'
  },
  {
    tag: "AML",
    title: "On-Chain AML & Transaction Monitoring",
    desc: "Real-time on-chain transaction monitoring with wash trading detection, mixer screening, sanctioned address blocking, and automated SAR filing. Pre-integrated with Chainanalysis and Elliptic.",
    img: '/solutions/creditunions/treasury.png'
  },
  {
    tag: "Liquidity",
    title: "Liquidity Management & Market Making",
    desc: "Access institutional liquidity providers and automated market-making infrastructure to ensure competitive spreads and deep order books from day one — without waiting months to build liquidity organically.",
    img: '/solutions/creditunions/instantpayments.png'
  },
  {
    tag: "Reporting",
    title: "Regulatory Reporting & Proof of Reserves",
    desc: "Automated regulatory reporting for FCA, MiCA, VARA, and other jurisdictions — including proof-of-reserves attestations, transaction reporting, and suspicious activity reports. Stay compliant without a dedicated compliance team.",
    img: '/solutions/creditunions/compliance.png'
  },
  {
    tag: "Cards",
    title: "Card Issuing",
    desc: "Issue branded virtual and physical cards without owning any card infrastructure. Configure spend controls, velocity limits, and FX fees — and go live with your card programme in weeks.",
    img: '/moduleimages/cardissuing.png'
  },
  {
    tag: "Payments",
    title: "Global Payments Infrastructure",
    desc: "Power domestic and cross-border payments across 180+ countries. Real-time transaction processing with full payment traceability, FX routing, and SWIFT/SEPA/Faster Payments connectivity.",
    img: '/moduleimages/globalpayments.png'
  },
  {
    tag: "Multi-currency",
    title: "Multi-currency Support",
    desc: "Hold, convert, and transact in 60+ currencies from a single account. Offer your customers multi-currency wallets with real-time FX rates, low-spread conversions, and same-day settlement — with no hidden fees and full regulatory transparency.",
    img: '/solutions/creditunions/multicurrency.png'
  },
];

// 1. Isolated Child Card Component to Handle Staggered/Lazy Loading Entries
const ModuleCard = ({ module, index, showAll }: { module: any; index: number; showAll: boolean }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (cardRef.current) observer.unobserve(cardRef.current);
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: "0px 0px -30px 0px"
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [showAll]); // Refires dynamically when mobile unhides cards, triggering their entry cascade

  // Dynamic remainder delay logic to reset cascading rhythms row-by-row on desktop grids
  const desktopStaggerDelay = (index % 3) * 100;

  return (
    <div 
      ref={cardRef} 
      className={`bg-[#eef2ff]/70 rounded-2xl flex flex-col items-start text-left overflow-hidden group cursor-pointer transition-all duration-700 ease-out hover:shadow-lg ${
        index >= 4 && !showAll ? 'hidden md:flex' : 'flex'
      } ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-12 pointer-events-none'
      }`}
      style={{ transitionDelay: `${desktopStaggerDelay}ms` }}
    >
      {/* Category Pill Tag */}
      {module.tag && (
        <div className="pt-6 px-8 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
          <span className="text-blue-500">✦</span>
          <span>{module.tag}</span>
        </div>
      )}

      {/* Card Header & Content */}
      <h3 className="text-xl font-bold text-slate-900 mb-2 mt-2 px-8">{module.title}</h3>
      <p className="text-sm text-slate-600 mb-4 flex-grow px-8 leading-relaxed">{module.desc}</p>

      {/* Blue Arrow Indicator */}
      <div className="px-8 mb-6">
        <svg 
          className="w-6 h-6 text-blue-600 transition-transform duration-300 group-hover:translate-x-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
      
      {/* Image Asset Container */}
      <div className="w-full mt-auto px-6">
        <img 
          src={getPath(module.img)} 
          alt={module.title} 
          className="rounded-xl w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

// 2. Main Structural Layout Component
export default function NewmodulesSection() {
  const [showAll, setShowAll] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLHeadingElement>(null);

  // Dedicated Observer for the Section's H2 Title Copy
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          if (headerRef.current) observer.unobserve(headerRef.current);
        }
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="w-full px-3 lg:px-6 max-w-[92.5%] mx-auto">
        
        {/* Header Section */}
        <h2 
          ref={headerRef}
          className={`text-4xl font-bold text-slate-900 mb-16 transition-all duration-700 ease-out ${
            headerVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-12 pointer-events-none'
          }`}
        >
          Essential Building Blocks <br className="hidden md:inline" />for Crypto Wallets & Cards
        </h2>
        
        {/* 3x3 Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <ModuleCard 
              key={index} 
              module={module} 
              index={index} 
              showAll={showAll} 
            />
          ))}
        </div>

        {/* MOBILE TOGGLE ACTION BUTTON CONTAINER */}
        <div className="flex justify-center mt-8 md:hidden">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-black font-semibold text-base md:text-lg border-b border-black pb-1 hover:text-blue-400 hover:border-blue-400 transition-colors"
          >
            {showAll ? 'Show Less' : 'View All'}
          </button>
        </div>

      </div>
    </section>
  );
}