"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getPath } from '@/utils/helper';

const modules = [
  { title: "KYC & AML Compliance", desc: "Verify individuals and businesses across 190+ countries in minutes. Automated document checks, biometric liveness detection, and UBO identification ", img: '/frontend.png' },
  { title: "Core Banking Engine", desc: "Launch a fully featured banking core without building one. Manage multi-currency accounts, automate transaction processing, and connect to global payment rails", img: '/rates.png' },
  { title: "Global Payments Infrastructure", desc: "Power payments across and local and international rails in 180+ countries. Real-time transaction processing with full payment traceability at every step.", img: '/modules3.png' },
  { title: " AI Fraud Monitoring", desc: "A self-learning fraud engine that scores every transaction in under 50ms. Behavioural profiling, anomaly detection, and automated alerts.", img: '/frontend.png' },
  { title: "Card Issuing", desc: "Issue branded virtual and physical  cards without owning any card infrastructure. Configure spend controls, and go live with your card programme in weeks.", img: '/rates.png' },
  { title: "White Label Bank Portal", desc: "Deploy a fully branded web and mobile banking experience with account dashboards, transfers, card management, and a powerful admin back-office. No frontend development required.", img: '/modules3.png' },
  { title: "Wallet-as-a-Service", desc: "Launch branded, secure digital wallets with multi-currency support, instant P2P transfers, and integrated KYC onboarding  without building wallet infrastructure from scratch.", img: '/frontend.png' },
  { title: "Real-Time Ledger", desc: "A robust, double-entry accounting engine built for regulatory-grade transparency and financial accuracy. Every transaction processed on your platform is automatically recorded, traceable, and auditable.", img: '/rates.png' },
  { title: "Crypto Wallets", desc: "Offer your users institutional-grade, multi-asset crypto wallets with real-time balance tracking, full transaction histories, and configurable hot/cold storage tiering. ", img: '/modules3.png' },
];

// 1. Separate Self-Observing Card Component
const ModuleCard = ({ module, index }: { module: any; index: number }) => {
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
        threshold: 0.15, // Triggers when 15% of the individual card is visible
        rootMargin: "0px 0px -50px 0px" // Slight offset so it triggers cleanly as you scroll down
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Dynamically resets stagger delays per row on desktop (0ms, 100ms, 200ms)
  const desktopStaggerDelay = (index % 3) * 100;

  return (
    <div 
      ref={cardRef} 
      className={`bg-blue-100 rounded-2xl flex flex-col items-start text-left overflow-hidden group cursor-pointer transition-all duration-700 ease-out hover:shadow-lg ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-12 pointer-events-none'
      }`}
      style={{ transitionDelay: `${desktopStaggerDelay}ms` }}
    >
      <h3 className="text-xl font-bold text-slate-900 mb-2 py-6 px-8">{module.title}</h3>
      <p className="text-sm text-slate-500 mb-4 flex-grow px-8">{module.desc}</p>

      {/* Blue Arrow Container */}
      <div className="px-6 mb-6">
        <svg 
          className="w-6 h-6 text-blue-600 transition-transform duration-300 group-hover:translate-x-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
      
      {/* Image Container */}
      <div className="w-full h-full mt-auto px-6">
        <img 
          src={getPath(module.img)} 
          alt={module.title} 
          className="rounded-lg w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

// 2. Main Section Component
export default function ModulesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="w-full px-3 md:px-20 max-w-[full] mx-auto md:text-center">
        {/* Header Section */}
        <h2 className="text-4xl font-bold text-slate-900 mb-6">
          Modular first <span className="text-blue-600">architecture to customize your banking ecosystem</span>
        </h2>
        <p className="text-slate-600 max-w-4xl mx-auto mb-16">
          Fintech Connect gives your team a modular, pre-integrated platform of financial 
          building blocks. Pick the modules you need, configure them to your brand, 
          and go live with a fully regulated fintech product.
        </p>

        {/* 3x3 Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <ModuleCard key={index} module={module} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}