"use client";

import React from "react";
import { getPath } from "@/utils/helper";

interface APIFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const apiFeatures: APIFeature[] = [
  {
    title: "RESTful APIs & Webhooks",
    description:
      "Clean, versioned REST endpoints for every module. Real-time event webhooks for payments, KYC status, fraud alerts, and more.",
    icon: (
      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "Full Sandbox Environment",
    description:
      "Test every integration end-to-end in an isolated sandbox with simulated KYC, payments, card authorizations, and fraud events.",
    icon: (
      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "SDKs for React, React Native & More",
    description:
      "Pre-built SDKs for web and mobile. Import, configure, and deploy financial UI and API integrations in hours, not weeks.",
    icon: (
      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: "99.99% Uptime SLA",
    description:
      "Enterprise-grade infrastructure on AWS and GCP with multi-region failover, auto-scaling, and a guaranteed 99.99% uptime SLA.",
    icon: (
      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function APISection() {
  return (
    <section className="bg-black text-white py-10 md:py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* LEFT COLUMN: Text Content & Features */}
        <div className="lg:col-span-5 flex flex-col items-start">
          
          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            <span className="text-blue-500">API-first</span> from day one
          </h2>

          {/* Subtitle Paragraph */}
          <p className="text-slate-400 text-base md:text-lg leading-relaxed font-normal mb-10">
            Every Fintech Connect module is accessible via a clean, well-documented
            REST API. Your engineering team can integrate, test, and go live without
            waiting on vendor support.
          </p>

          {/* Feature Items List */}
          <div className="flex flex-col gap-8 w-full mb-10">
            {apiFeatures.map((feature, index) => (
              <div key={index} className="flex gap-4 items-start">
                {/* Icon Container Box */}
                <div className="w-7 h-7 rounded bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-1">
                  {feature.icon}
                </div>
                
                {/* Text Content */}
                <div>
                  <h3 className="text-white font-bold text-base md:text-lg mb-1 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Call To Action Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-all shadow-sm text-sm active:scale-95">
            Book Demo
          </button>
        </div>

        {/* RIGHT COLUMN: API Documentation & Graphic Showcase Placeholder */}
        <div className="lg:col-span-7 relative w-full flex justify-center lg:justify-end">
          
            
            <img 
              src={getPath("/APIsectionimage.png")} 
              alt="API Documentation Showcase" 
              className="w-full max-h-150 object-contain shadow-2xl lg:mt-45" 
            />
            
        
        </div>

      </div>
    </section>
  );
}