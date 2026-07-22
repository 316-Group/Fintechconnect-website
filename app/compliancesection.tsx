"use client";

import React from "react";

interface Badge {
  label: string;
}

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const complianceBadges: Badge[] = [
  { label: "PCI-DSS Level 1" },
  { label: "ISO 27001" },
  { label: "SOC 2 Type II" },
  { label: "GDPR Compliant" },
  { label: "AML / CFT Ready" },
];

const featureCards: FeatureCard[] = [
  {
    title: "AES-256 Encryption",
    description:
      "All data at rest is encrypted with AES-256. All data in transit is protected with TLS 1.3. Cryptographic keys are managed via HSM with automatic rotation.",
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "MPC Crypto Custody",
    description:
      "Digital assets are secured with Multi-Party Computation (MPC) technology. No single point of key compromise. Hot/cold storage tiering with institutional-grade custody controls.",
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    title: "Banking Rails",
    description:
      "Continuous SIEM monitoring, automated vulnerability scanning, and a dedicated security operations centre (SOC) watching your platform around the clock.",
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
];

export default function ComplianceSection() {
  return (
    <section className="bg-white text-slate-900 py-20 md:py-28 px-6 md:px-12 lg:px-20 font-sans">
      <div className="max-w-full mx-auto flex flex-col items-center">
        
        {/* HEADER AREA */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">
            Security &amp; Compliance
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-6 text-slate-900">
            Feel protected. <span className="text-blue-600">Stay compliant.</span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal max-w-4xl mx-auto">
            Every module on the Fintech Connect platform is built to the highest security and regulatory
            standards. Your clients, your regulators, and your board can have full confidence.
          </p>
        </div>

        {/* BADGES ROW */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-16 md:mb-20">
          {complianceBadges.map((badge, idx) => (
            <div
              key={idx}
              className="bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm"
            >
              <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>

        {/* 3 FEATURE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16 md:mb-20">
          {featureCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-[#f8f9fa] rounded-3xl p-8 md:p-10 flex flex-col items-start border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Blue Icon Box */}
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-8 shrink-0">
                {card.icon}
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                {card.title}
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* BOTTOM WHITEPAPER BANNER */}
        <div className="w-full bg-[#0052FF] text-white rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xl">
          <div className="max-w-2xl">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
              Read our Security Whitepaper
            </h3>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed font-normal">
              Full technical documentation of our security architecture, certifications, penetration testing
              results, and incident response procedures.
            </p>
          </div>

          <button className="bg-[#00e599] hover:bg-[#00cc88] text-slate-950 font-bold py-3.5 px-8 rounded-xl transition-all duration-200 text-sm whitespace-nowrap cursor-pointer shadow-sm active:scale-95 shrink-0">
            Download Whitepaper
          </button>
        </div>

      </div>
    </section>
  );
}