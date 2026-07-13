"use client";

import React, { useState, useEffect, useRef } from 'react';
import Navbar from "@/app/navbar";
import Footersection from "@/app/Footersection";

// Filter Categories
const categories = [
  "All connectors",
  "BaaS",
  "Card Issuing",
  "Crypto Infrastructure",
  "Compliance",
  "Payments",
  "Utilities"
];

// Database for connectors
const connectorsData = [
  {
    name: "Clear Junction",
    category: "BaaS",
    desc: "Clear Junction provides payment processing and financial services solutions, enabling businesses to access banking infrastructure, virtual IBANs, and local payment rails globally.",
    iconType: "clear"
  },
  {
    name: "Currency Cloud",
    category: "Payments",
    desc: "Currency Cloud specialises in delivering sophisticated cross-border payment solutions, allowing businesses to execute multi-currency transfers, access real-time FX rates, and automate international workflows.",
    iconType: "currency"
  },
  {
    name: "Banking Circle",
    category: "BaaS",
    desc: "Banking Circle offers innovative payment and banking solutions tailored for financial institutions and businesses, providing fast, cost-effective, and fully transparent global clearing capabilities.",
    iconType: "banking"
  },
  {
    name: "Railsr",
    category: "BaaS",
    desc: "Railsr is an enterprise-grade platform delivering secure infrastructure for moving, storing, and issuing digital assets, powered by multi-party computation (MPC) technology.",
    iconType: "fireblocks"
  },
  {
    name: "ComplyAdvantage",
    category: "Compliance",
    desc: "ComplyAdvantage provides AI-driven financial crime risk detection, automating AML screening, KYC onboarding checks, and real-time transaction monitoring to ensure regulatory safety.",
    iconType: "compliance"
  },
  {
    name: "Plaid",
    category: "Utilities",
    desc: "Plaid acts as an open banking data network connecting applications securely with users' bank accounts, facilitating instant identity verification, balance checks, and asset evaluation.",
    iconType: "utilities"
  }
];

// component to render the custom geometric company icons from the screenshot
const ConnectorIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "clear-junction":
      return (
        <div className="w-16 h-16 bg-[#0f172a] rounded-xl flex items-center justify-center p-3">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h6a4 4 0 014 4v1a4 4 0 01-4 4H9m-1-5h4" />
            <circle cx="7" cy="11" r="2" fill="white" />
          </svg>
        </div>
      );
    case "currency-cloud":
      return (
        <div className="w-16 h-16 bg-[#0f172a] rounded-xl flex items-center justify-center p-3">
          <svg viewBox="0 0 24 24" className="w-full h-full text-[#ff6b35]" fill="currentColor">
            <path d="M4 16c3-1 5-4 8-4s5 3 8 4M4 8c3-1 5-4 8-4s5 3 8 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
      );
    case "banking-circle":
      return (
        <div className="w-16 h-16 bg-[#0f172a] rounded-xl flex items-center justify-center p-2">
          <svg viewBox="0 0 24 24" className="w-full h-full text-white animate-spin-slow" fill="currentColor">
            {[...Array(16)].map((_, i) => (
              <rect key={i} x="11.5" y="1" width="1" height="6" rx="0.5" transform={`rotate(${i * 22.5} 12 12)`} />
            ))}
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center p-3 text-white font-bold text-xl">
          FL
        </div>
      );
  }
};

export default function ConnectorsPage() {
  const [activeTab, setActiveTab] = useState("All connectors");
  
  // Cascade Animation States
  const [heroVisible, setHeroVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createObserver = (setVis: (v: boolean) => void, thresh = 0.1) => {
      return new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setVis(true);
        }
      }, { threshold: thresh });
    };

    const o1 = createObserver(setHeroVisible, 0.05);
    const o2 = createObserver(setFilterVisible, 0.1);
    const o3 = createObserver(setGridVisible, 0.05);

    if (heroRef.current) o1.observe(heroRef.current);
    if (filterRef.current) o2.observe(filterRef.current);
    if (gridRef.current) o3.observe(gridRef.current);

    return () => {
      o1.disconnect();
      o2.disconnect();
      o3.disconnect();
    };
  }, [activeTab]); // Reset observers on filter toggle to capture layout changes smoothly

  // Filtering Logic Engine
  const filteredConnectors = connectorsData.filter(item => 
    activeTab === "All connectors" ? true : item.category === activeTab
  );

  const getAnimatedClass = (visible: boolean) => 
    `transition-all duration-700 ease-out ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12 pointer-events-none'
    }`;

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans">
      <Navbar />

      {/* VIBRANT CRIMSON HERO SECTION */}
      <div 
        ref={heroRef}
        className="w-full bg-blue-600 text-white py-20 lg:py-28 px-6 md:px-20 overflow-hidden"
      >
        <div className="max-w-[92.5%] mx-auto flex flex-col justify-center">
          <h1 
            className={`text-4xl md:text-6xl font-bold tracking-tight mb-8 ${getAnimatedClass(heroVisible)}`}
            style={{ transitionDelay: '0ms' }}
          >
            Fintech Connect Connectors
          </h1>
          <p 
            className={`text-lg md:text-xl font-normal max-w-5xl text-white/95 leading-relaxed ${getAnimatedClass(heroVisible)}`}
            style={{ transitionDelay: '150ms' }}
          >
            Accelerate your financial project launch with proven Fintech Connect partners who bring their expertise, reliability, and security.
          </p>
        </div>
      </div>

      {/* FILTER BUTTON SEGMENT BAR CONTAINER */}
      <div 
        ref={filterRef}
        className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm overflow-x-auto scrollbar-none"
      >
        <div className="max-w-[92.5%] mx-auto px-3 lg:px-6 py-6">
          <div 
            className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-700 ${
              filterVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            {categories.map((category, idx) => {
              const isActive = activeTab === category;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab(category);
                    setGridVisible(false); // Reset grid visual entry state for clean cascade retrigger
                  }}
                  className={`py-4 px-2 text-center text-xs md:text-sm font-semibold border-r border-b lg:border-b-0 border-slate-200 last:border-r-0 transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#2563eb] text-white border-[#2563eb]' 
                      : 'bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONNECTORS GRID SECTION */}
      <section className="py-16 md:py-24">
        <div className="w-full px-3 lg:px-6 max-w-[92.5%] mx-auto">
          <div 
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredConnectors.length > 0 ? (
              filteredConnectors.map((connector, index) => (
                <div
                  key={index}
                  className={`bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col items-start text-left hover:shadow-xl hover:-translate-y-1 ${
                    gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12 pointer-events-none'
                  }`}
                  style={{ 
                    transitionDelay: `${(index % 3) * 120}ms`,
                    transitionProperty: 'opacity, transform',
                    transitionDuration: '700ms'
                  }}
                >
                  {/* Custom Graphic Square */}
                  <div className="mb-8">
                    <ConnectorIcon type={connector.iconType} />
                  </div>

                  {/* Text Meta Details */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {connector.name}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed font-normal flex-grow">
                    {connector.desc}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-slate-400 font-medium text-lg">
                No connectors found in this category.
              </div>
            )}
          </div>
        </div>
      </section>

      <Footersection />
    </div>
  );
}