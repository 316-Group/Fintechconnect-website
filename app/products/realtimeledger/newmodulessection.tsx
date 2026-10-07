"use client";

import React, { useState, useEffect, useRef } from "react";
import { getPath } from "@/utils/helper";

const modules = [
  {
    tag: "Ledger Foundations",
    title: "Shape the books behind your product",
    desc: "Model ledger accounts, journals, and posting rules to clearly track financial activity, connect transactions to product events, and define how fees, adjustments, and settlements are handled.",
    img: "/products/realtimeledger modules/image1.png",
  },
  {
    tag: "Financial State",
    title: "Distinguish intent from finality",
    desc: "Clearly model financial states and transitions, from pending and held to settled, reversed, or failed, so product, operations, and finance teams can align on how each is represented, communicated, and reconciled.",
    img: "/products/realtimeledger modules/image2.png",
  },
  {
    tag: "Available Funds",
    title: "Account for value before it moves",
    desc: "Separate ledger, available, pending, and held balances to support clear authorisation, release, expiry, and reversal flows without treating every amount as immediately booked.",
    img: "/products/realtimeledger modules/image3.png",
  },
  {
    tag: "Immutable History",
    title: "Correct through a new financial event",
    desc: "Maintain a clear financial history by recording corrections and reversals as new linked entries, with the original event, reason, approval, and corrective action visible for review.",
    img: "/products/realtimeledger modules/image4.png",
  },
  {
    tag: "Financial Context",
    title: "Make balances explainable",
    desc: "Connect balances to their underlying entries, states, and references, giving product, finance, and operations teams a clear view of how each financial position was formed.",
    img: "/products/realtimeledger modules/image5.png",
  },
  {
    tag: "Control Evidence",
    title: "Prepare records for comparison and review",
    desc: "Support reconciliation with structured records that connect internal entries, external transactions, fees, and settlements, enabling clear matching, exception handling, and controlled adjustments.",
    img: "/products/realtimeledger modules/image6.png",
  },
  {
    tag: "Event Orchestration",
    title: "Relate movement events to posting states",
    desc: "Connect payment and transfer events to related ledger entries, covering initiation, validation, settlement, returns, and reversals while supporting asynchronous updates and exception handling.",
    img: "/products/realtimeledger modules/image7.png",
  },
  {
    tag: "Positional Context",
    title: "Inform position and close workflows",
    desc: "Use ledger records to understand financial positions, settlement obligations, and timing while distinguishing expected activity from booked activity for clearer treasury review.",
    img: "/products/realtimeledger modules/image8.png",
  },
  {
    tag: "Product Context",
    title: "Link product rules to ledger treatment",
    desc: "Connect product and account details with ledger postings and balances, giving product and finance teams a shared view of account lifecycles, limits, fees, and customer relationships.",
    img: "/products/realtimeledger modules/image9.png",
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