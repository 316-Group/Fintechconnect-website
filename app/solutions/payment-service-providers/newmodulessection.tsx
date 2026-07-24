"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getPath } from '@/utils/helper';

const modules = [
  {
    tag: "Routing",
    title: "Intelligent Payment Routing",
    desc: "AI-powered routing engine that dynamically selects the optimal acquirer, rail, and currency path for every transaction — maximising approval rates and minimising processing costs in real time.",
    img: '/solutions/creditunions/digitalondoarding.png.png'
  },
  {
    tag: "Fraud",
    title: "AI Fraud & Risk Engine",
    desc: "Real-time transaction scoring using machine learning models trained on billions of payment data points. Reduce chargebacks, block fraud, and protect merchants — without blocking good customers.",
    img: '/solutions/creditunions/SMEengine.png'
  },
  {
    tag: "Acquiring",
    title: "Multi-Rail Acquiring",
    desc: "Accept card payments (Visa, Mastercard, Amex), open banking, SEPA, SWIFT, and local payment methods through a single unified API. One integration, every payment method your merchants need.",
    img: '/solutions/creditunions/whitelabel.png'
  },
  {
    tag: "Settlement",
    title: "Real-Time Settlement & Reconciliation",
    desc: "Move from T+2 to same-day or real-time settlement. Automated reconciliation, split payouts, and a real-time ledger give merchants instant visibility and PSPs full control over cash flow.",
    img: '/solutions/creditunions/treasury.png'
  },
  {
    tag: "Compliance",
    title: "PCI-DSS & 3DS2 Compliance",
    desc: "Inherit PCI-DSS Level 1 certification and 3DS2 strong customer authentication out of the box. Automated compliance reporting, tokenisation, and encrypted card data storage — no annual audit overhead.",
    img: '/solutions/creditunions/instantpayments.png'
  },
  {
    tag: "Merchant",
    title: "Merchant Management Portal",
    desc: "A white-label merchant portal for onboarding, KYB verification, transaction monitoring, dispute management, and real-time analytics. Give your merchants the tools they need — under your brand.",
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
          Essential Building Blocks to <br className="hidden md:inline" />Launch Fintech Today
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