"use client";

import React, { useState, useEffect, useRef } from "react";
import { getPath } from "@/utils/helper";

const modules = [
  {
    tag: "Position Design",
    title: "Cash position views with clear context",
    desc: "Create clear cash-position views across balances, accounts, and programmes, combining internal and external records while keeping sources and timing visible.",
    img: "/products/treasury modules/image1.png",
  },
  {
    tag: "Settlement Control",
    title: "See obligations before they become exceptions",
    desc: "Organise settlement activity by payment states, references, timing, and financial records to clearly track pending items, timing differences, and unresolved issues throughout the settlement lifecycle.",
    img: "/products/treasury modules/image2.png",
  },
  {
    tag: "Liquidity Policy",
    title: "Configure thresholds for the right conversations",
    desc: "Define programme-specific liquidity thresholds and alerts with clear ownership, review rules, and escalation paths to support informed treasury decisions.",
    img: "/products/treasury modules/image3.png",
  },
  {
    tag: "Forecasting Inputs",
    title: "Build forecasts from stated assumptions",
    desc: "Combine planned cash flows, settlement schedules, and funding assumptions into transparent forecasts, allowing treasury teams to compare scenarios and track the assumptions behind them.",
    img: "/products/treasury modules/image4.png",
  },
  {
    tag: "Funding Workflow",
    title: "Put funding requests through a controlled path",
    desc: "Structure funding requests with clear amounts, purpose, references, roles, and approval paths, while defining decision rights, exceptions, and external dependencies.",
    img: "/products/treasury modules/image5.png",
  },
  {
    tag: "Treasury Reporting",
    title: "Prepare a traceable view for finance and operations",
    desc: "Create clear reporting views for positions, settlements, forecasts, exposures, and reconciliation, with visible source and timing context for effective operational oversight.",
    img: "/products/treasury modules/image6.png",
  },
  {
    tag: "Reconciliation Context",
    title: "Turn differences into assigned follow-up",
    desc: "Create reporting views that connect positions, settlements, forecasts, exposures, and reconciliation, with clear timing and source context for operational review.",
    img: "/products/treasury modules/image7.png",
  },
  {
    tag: "Connector Context",
    title: "Plan for provider-neutral data exchange",
    desc: "Define consistent treasury data structures while managing provider-specific formats, statuses, and delivery directions through controlled integrations.",
    img: "/products/treasury modules/image8.png",
  },
  {
    tag: "Ledger Context",
    title: "Connect position views to financial records",
    desc: "Connect treasury positions and settlements to ledger postings, making it clear where values originate and their current financial state.",
    img: "/products/treasury modules/image9.png",
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
  }, [showAll]);

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