"use client";

import React, { useState, useEffect, useRef } from "react";
import { getPath } from "@/utils/helper";

const modules = [
  {
    tag: "Accounts",
    title: "Multi-Currency Accounts & vIBANs",
    desc: "Open accounts in minutes and issue unique virtual IBANs and localised account numbers across 70+ jurisdictions. Every account carries its own balance states, permissions and lifecycle rules.",
    img: "/products/corebanking modules/image1.png",
  },
  {
    tag: "Treasury",
    title: "Treasury & Liquidity Management",
    desc: "Manage float, reserves and settlement positions from one dashboard. Real-time liquidity views, multi-currency support, automated sweeps and AI-assisted rebalancing recommendations.",
    img: "/products/corebanking modules/image2.png",
  },
  {
    tag: "Ledger",
    title: "Double-Entry Ledger Core",
    desc: "A sub-millisecond, immutable double-ledger underneath every product you build. Real-time balance reservations, full audit trail, and no manual reconciliation at month end.",
    img: "/products/corebanking modules/image3.png",
  },
  {
    tag: "Cards",
    title: "Card Issuing",
    desc: "Issue branded virtual and physical cards without owning card infrastructure. Configure spend controls, velocity limits and FX fees, and launch your card programme in weeks.",
    img: "/products/corebanking modules/image4.png",
  },
  {
    tag: "Multi-Currency",
    title: "FX & Multi-Currency Settlement",
    desc: "Hold, convert and settle in 60+ currencies from a single account. Real-time rates, low-spread conversion and same-day settlement, with no hidden fees and full regulatory transparency.",
    img: "/products/corebanking modules/image5.png",
  },
  {
    tag: "Embedded Finance",
    title: "Wallets & Embedded Finance",
    desc: "Embed wallets, savings accounts, virtual cards and micro-lending directly into your product. Offer your customers a branded financial account with zero banking infrastructure of your own.",
    img: "/products/corebanking modules/image6.png",
  },
  {
    tag: "Compliance",
    title: "KYC, AML & Regulatory Compliance",
    desc: "Automated identity verification, sanctions and PEP screening, transaction monitoring and regulatory reporting, pre-certified for FCA, PRA and GDPR. Compliance overhead drops without the rigour dropping with it.",
    img: "/products/corebanking modules/image7.png",
  },
  {
    tag: "Risk",
    title: "Fraud & Transaction Risk Monitoring",
    desc: "A self-learning fraud engine that scores every transaction in under 50ms. Behavioural profiling, network analysis, velocity rules and anomaly detection, with an automated case workflow for anything flagged.",
    img: "/products/corebanking modules/image8.png",
  },
  {
    tag: "Payments",
    title: "Global Payments Infrastructure",
    desc: "Move money domestically and cross-border across 180+ countries. SWIFT, SEPA, Faster Payments, ACH and local rails, with intelligent routing and end-to-end transaction traceability.",
    img: "/products/corebanking modules/image9.png",
  },
];

// 1. Isolated Child Card Component to Handle Staggered/Lazy Loading Entries
const ModuleCard = ({
  module,
  index,
  showAll,
}: {
  module: any;
  index: number;
  showAll: boolean;
}) => {
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
        rootMargin: "0px 0px -30px 0px",
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
      className={`bg-[#E9E9FD]/70 rounded-2xl flex flex-col items-start text-left overflow-hidden group cursor-pointer transition-all duration-700 ease-out hover:shadow-lg ${
        index >= 4 && !showAll ? "hidden md:flex" : "flex"
      } ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-12 pointer-events-none"
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
      <h3 className="text-xl font-bold text-slate-900 mb-2 mt-2 px-8">
        {module.title}
      </h3>
      <p className="text-sm text-slate-600 mb-4 flex-grow px-8 leading-relaxed">
        {module.desc}
      </p>

      {/* Blue Arrow Indicator */}
      <div className="px-8 mb-6">
        <svg
          className="w-6 h-6 text-blue-600 transition-transform duration-300 group-hover:translate-x-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>

      {/* Image Asset Container */}
      <div className="w-full mt-auto px-6 pb-6">
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
    <section className="py-24 bg-[#F5F5F5]">
      <div className="w-full px-3 lg:px-6 max-w-[92.5%] mx-auto">
        {/* Header Section */}
        <h2
          ref={headerRef}
          className={`text-4xl font-bold text-slate-900 mb-16 transition-all duration-700 ease-out ${
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-12 pointer-events-none"
          }`}
        >
          Everything You Need to Operate Like a Real Bank
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
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>
      </div>
    </section>
  );
}