"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getPath } from '@/utils/helper';

const modules = [
  { 
    tag: "Compliance",
    title: "KYC & AML Compliance", 
    desc: "Verify individuals and businesses across 190+ countries in minutes. Automated document checks, biometric liveness detection, and UBO identification.", 
    img: '/moduleimages/kyc.png' 
  },
  { 
    tag: "Core",
    title: "Core Banking Engine", 
    desc: "Launch a fully featured banking core without building one. Manage multi-currency accounts, automate transaction processing, and connect to global payment rails.", 
    img: '/moduleimages/corebanking.png' 
  },
  { 
    tag: "Payments",
    title: "Global Payments Infrastructure", 
    desc: "Power payments across local and international rails in 180+ countries. Real-time transaction processing with full payment traceability at every step.", 
    img: '/moduleimages/globalpayments.png' 
  },
  { 
    tag: "Security",
    title: "AI Fraud Monitoring", 
    desc: "A self-learning fraud engine that scores every transaction in under 50ms. Behavioural profiling, anomaly detection, and automated alerts.", 
    img: '/moduleimages/AIfraud.png' 
  },
  { 
    tag: "Cards",
    title: "Card Issuing", 
    desc: "Issue branded virtual and physical cards without owning any card infrastructure. Configure spend controls, and go live with your card programme in weeks.", 
    img: '/moduleimages/cardissuing.png' 
  },
  { 
    tag: "White Label",
    title: "White Label Bank Portal", 
    desc: "Deploy a fully branded web and mobile banking experience with account dashboards, transfers, card management, and a powerful admin back-office. No frontend development required.", 
    img: '/moduleimages/whitelabel.png' 
  },
  { 
    tag: "Security",
    title: "Wallet-as-a-Service", 
    desc: "Launch branded, secure digital wallets with multi-currency support, instant P2P transfers, and integrated KYC onboarding without building wallet infrastructure from scratch.", 
    img: '/moduleimages/walletasaservice.png' 
  },
  { 
    tag: "Cards",
    title: "Real-Time Ledger", 
    desc: "A robust, double-entry accounting engine built for regulatory-grade transparency and financial accuracy. Every transaction processed on your platform is automatically recorded, traceable, and auditable.", 
    img: '/moduleimages/realtimeledger.png' 
  },
  { 
    tag: "White Label",
    title: "Crypto Wallets", 
    desc: "Offer your users institutional-grade, multi-asset crypto wallets with real-time balance tracking, full transaction histories, and configurable hot/cold storage tiering.", 
    img: '/moduleimages/cryptowallets.png' 
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
  }, [showAll]);

  const desktopStaggerDelay = (index % 3) * 100;

  return (
    <div 
      ref={cardRef} 
      className={`bg-blue-100/70 rounded-3xl flex flex-col items-start text-left overflow-hidden group cursor-pointer transition-all duration-700 ease-out hover:shadow-xl ${
        index >= 4 && !showAll ? 'hidden md:flex' : 'flex'
      } ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-12 pointer-events-none'
      }`}
      style={{ transitionDelay: `${desktopStaggerDelay}ms` }}
    >
      {/* Top Padding & Category Tag Badge */}
      <div className="pt-8 px-8 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-blue-600 text-xs font-semibold tracking-wide">
          <span className="text-[10px]">✦</span>
          {module.tag}
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2 px-8">{module.title}</h3>
      <p className="text-sm text-slate-600 mb-6 flex-grow px-8 leading-relaxed">{module.desc}</p>

      {/* Blue Arrow Indicator Container */}
      <div className="px-8 mb-6">
        <svg 
          className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:translate-x-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
      
      {/* Image Asset Element Container */}
      <div className="w-full h-full mt-auto px-6 pb-6">
        <img 
          src={getPath(module.img)} 
          alt={module.title} 
          className="rounded-xl w-full h-full object-cover shadow-sm"
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
          Essential Building Blocks <br className="hidden md:inline" />for modern banking
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