"use client";

import React, { useEffect, useRef, useState } from "react";
import { User, TrendingUp, CheckCircle2, Shield } from "lucide-react";

const cardsData = [
  {
    id: "A",
    number: "01",
    title: "Held by your institution",
    whoSigns: "Programme infrastructure and authorized internal signers per designated mandate.",
    typicalFit: "Treasury operations, enterprise working capital, and internal liquidity reserves.",
  },
  {
    id: "B",
    number: "02",
    title: "Held by an approved custodian",
    whoSigns: "Third-party regulated custodian via programmatic signature mandates.",
    typicalFit: "Regulated corporate programmes, institutional funds, and regulated financial entities.",
  },
  {
    id: "C",
    number: "03",
    title: "Held by the end user",
    whoSigns: "End user via an external independent client interface or native device key.",
    typicalFit: "Self-directed participant models and open ecosystem interfaces.",
  },
];

export default function ModelSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Trigger only once
        }
      },
      { 
        threshold: 0.15, // Trigger when 15% of the section is visible
        rootMargin: "0px 0px -50px 0px" 
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-[#f4f6fc] py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900 overflow-hidden"
    >
      <div className="max-w-full mx-auto space-y-12">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block">
            WALLET MODEL
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Who holds the keys is a programme decision.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal pt-1">
            Fintech Connect orchestrates wallet records and workflow. The custody arrangement is agreed for each programme and provided through an approved custody profile.
          </p>
        </div>

        {/* 3 CARDS GRID CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {cardsData.map((card, index) => (
            <div
              key={card.id}
              // Scroll animation classes + Hover "pop up" classes
              className={`
                relative bg-white rounded-2xl p-6 sm:p-8 
                border border-slate-200/80 shadow-sm 
                flex flex-col justify-between space-y-8 
                transform transition-all duration-500 ease-out
                hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl hover:border-blue-600 hover:z-10 group
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
              `}
              // Delay is only applied before the element is visible, preventing hover lag after animation
              style={{ transitionDelay: isVisible ? "0ms" : `${index * 150}ms` }}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 transition-colors duration-300 group-hover:text-blue-600">
                    ARRANGEMENT {card.id}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 transition-colors duration-300 group-hover:text-blue-600">
                    {card.number}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                    {card.title}
                  </h3>
                </div>

                <div className="space-y-4 pt-2 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[12px] transition-colors duration-300 group-hover:text-blue-600">
                      <User className="w-3.5 h-3.5 transition-colors duration-300 group-hover:text-blue-600" />
                      <span>Who signs</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-normal text-[13px]">
                      {card.whoSigns}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[12px] transition-colors duration-300 group-hover:text-blue-600">
                      <TrendingUp className="w-3.5 h-3.5 transition-colors duration-300 group-hover:text-blue-600" />
                      <span>Typical fit</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-normal text-[13px]">
                      {card.typicalFit}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Info Boxes (Identical across all cards) */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3.5 space-y-1 transition-colors duration-300 group-hover:border-blue-100">
                  <div className="flex items-center gap-2 text-[12px] font-extrabold text-blue-600">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>What Fintech Connect handles</span>
                  </div>
                  <p className="text-[13px] text-slate-500 leading-relaxed pl-5">
                    Wallet records, policies, screening checkpoints, approvals, audit trail.
                  </p>
                </div>

                <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3.5 space-y-1 transition-colors duration-300 group-hover:border-blue-100">
                  <div className="flex items-center gap-2 text-[13px] font-extrabold text-slate-700">
                    <Shield className="w-3.5 h-3.5 shrink-0 text-slate-500 transition-colors duration-300 group-hover:text-blue-600" />
                    <span>What stays with the programme</span>
                  </div>
                  <p className="text-[13px] text-slate-500 leading-relaxed pl-5">
                    Custody arrangement, licensing and regulatory approvals, customer relationship &amp; dispute policies.
                  </p>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* BOTTOM CTA BUTTON */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-105 cursor-pointer text-center"
          >
            Start building your wallet
          </button>
        </div>

      </div>
    </section>
  );
}