"use client";

import React, { useState } from 'react';
import Navbar from "@/app/navbar";
import Footersection from "@/app/Footersection";

interface FAQItem {
  question: string;
  answer: string;
}

interface SupportSection {
  category: string;
  faqs: FAQItem[];
}

const supportData: SupportSection[] = [
  {
    category: "Getting started",
    faqs: [
      {
        question: "How do I sign up for an account?",
        answer: "To sign up, click on the 'Get Started' button in the navigation bar. Fill out your company profile, email address, and operational jurisdiction to begin our standard sandbox access setup."
      },
      {
        question: "What onboarding support will we receive?",
        answer: "Every technical team receives access to our developer slack channel, comprehensive API documentation, and a dedicated integration engineer who will assist you during the initial setup phases."
      },
      {
        question: "How long does a typical implementation take?",
        answer: "Depending on your architecture, standard integrations can go live in as little as 2 to 4 weeks. Complex enterprise deployments leveraging custom core banking templates generally average 6 to 8 weeks."
      },
      {
        question: "What documentation and tools do you provide?",
        answer: "We provide complete TypeScript Open-API specifications, an active Postman collection, comprehensive client SDKs for popular backend frameworks, and a full dashboard analytics tool."
      }
    ]
  },
  {
    category: "API, integration & connectors",
    faqs: [
      {
        question: "How do connectors work and which integrations are available?",
        answer: "Connectors act as pre-built unified middleware links between your platform and premium financial vendors. Available integrations span top global BaaS providers, instant card networks, AML/KYC platforms, and asset custodians."
      },
      {
        question: "Sandbox testing best practices for integrations",
        answer: "We recommend simulating high concurrent request volumes using our specialized delay mocks, executing boundary value test mutations on webhooks, and ensuring idempotency keys are handled perfectly on all POST endpoints."
      },
      {
        question: "What's the process to move from sandbox to production?",
        answer: "Once your automated test suite scores a 100% pass rate in the sandbox environment, submit your compliance review documentation via the developer panel. Our internal security operations desk will review it and provision live API credentials within 48 hours."
      }
    ]
  }
];

export default function SupportHubPage() {
  // Track open state using a composite string identifier: "sectionIndex-faqIndex"
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col antialiased">
      <Navbar />

      {/* VIBRANT CRIMSON HERO SECTION */}
      <div className="w-full bg-blue-600 text-white py-16 md:py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-full mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Fintech Connect Support Hub
          </h1>
          <p className="text-lg md:text-xl font-normal max-w-4xl text-white/95 leading-relaxed">
            From onboarding to troubleshooting - we're here to make your fintech journey faster, safer, and smoother
          </p>
        </div>
      </div>

      {/* MAIN DOCUMENTATION ACCORDION CONTENT */}
      <main className="flex-grow py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-full mx-auto flex flex-col gap-16 md:gap-24">
          
          {supportData.map((section, sectionIdx) => (
            <div 
              key={sectionIdx} 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start border-b border-slate-100 pb-12 last:border-b-0"
            >
              {/* Left Column: Category Label */}
              <div className="md:col-span-1">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {section.category}
                </h2>
              </div>

              {/* Right Column: Dynamic Interactive Accordions */}
              <div className="md:col-span-2 border-t border-slate-200">
                {section.faqs.map((faq, faqIdx) => {
                  const currentId = `${sectionIdx}-${faqIdx}`;
                  const isOpen = openFaqId === currentId;

                  return (
                    <div 
                      key={faqIdx} 
                      className="border-b border-slate-200"
                    >
                      <button
                        onClick={() => toggleFaq(currentId)}
                        className="w-full py-5 flex items-center justify-between text-left group hover:text-[#f0004c] transition-colors focus:outline-none"
                      >
                        <span className="text-lg font-semibold text-slate-900 group-hover:text-[#f0004c] transition-colors pr-6">
                          {faq.question}
                        </span>
                        
                        {/* Smoothly shifting Plus/Minus symbol */}
                        <div className="relative flex items-center justify-center w-6 h-6 shrink-0 text-slate-500 group-hover:text-[#f0004c]">
                          <span className={`absolute w-4 h-0.5 bg-current transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                          <span className={`absolute h-4 w-0.5 bg-current transform transition-transform duration-200 ${isOpen ? 'rotate-90 scale-0' : ''}`} />
                        </div>
                      </button>

                      {/* Accordion expand collapse animation container */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-60 pb-6' : 'max-h-0'
                        }`}
                      >
                        <p className="text-slate-600 text-base leading-relaxed font-normal">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        </div>
      </main>

      <Footersection />
    </div>
  );
}