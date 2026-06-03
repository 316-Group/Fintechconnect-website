"use client";
import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  // Global state to collapse/expand the entire section list
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  
  // Local state for individual accordion items
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "What is Fintech Connect and how does it work?",
      answer: "Fintech Connect is an innovative development platform that enables banks and financial institutions to build and deploy custom applications using prebuilt, production-ready templates. Instead of constructing architecture from scratch, you select your layout, configure your workflows, and launch."
    },
    {
      question: "How fast can we go live compared to traditional core integration?",
      answer: "Traditional core banking technology integrations and bank partner setups typically consume 6 to 12 months of development time. Fintech Connect bypasses this bottleneck, allowing financial institutions to move from concept to a live deployment environment in a matter of weeks."
    },
    {
      question: "What production modules are available out of the box?",
      answer: "We offer comprehensive, production-ready modules covering crucial banking infrastructure. This includes robust systems for account management, domestic and cross-border payments, foreign exchange (FX) mechanisms, and daily transaction reconciliations."
    },
    {
      question: "Do you provide an environment to test our setups before launching?",
      answer: "Yes, absolutely. Every Fintech Connect tier includes access to a completely isolated, fully functional sandbox environment. This allows your engineering teams to comprehensively test module APIs, simulate real-world transaction volumes, and validate compliance configurations safely before promoting to live production."
    },
    {
      question: "How does Fintech Connect mitigate compliance risks and upfront costs?",
      answer: "By utilizing our pre-configured infrastructure templates, you sidestep the massive capital expenditures associated with custom-built core banking stacks. Our components are pre-engineered with compliance frameworks in mind, heavily reducing regulatory friction and safeguarding your deployment against architectural vulnerabilities."
    },
    {
      question: "Can we customize the UI templates to match our bank's exact branding?",
      answer: "Yes. All design components and templates are fully white-labeled. You can inject your custom themes, logos, color palettes, fonts, and custom styling parameters directly through our administrative configuration dashboard or via design token overrides."
    },
    {
      question: "What security standards and encryption frameworks does the platform use?",
      answer: "Fintech Connect is built on a bank-grade security matrix. We utilize AES-256 encryption for data at rest, TLS 1.3 protocol architectures for data in transit, and multi-factor authentication layer structures. The code templates undergo rigid static analysis mapping to secure your network perimeter."
    },
    {
      question: "Does Fintech Connect support multi-tenant architectures for regional branches?",
      answer: "Yes, our core structure supports complex multi-tenancy. You can run segregated regional branch programs or unique financial brand subsets under an overarching root administrative directory, maintaining isolated ledger environments while standardizing global workflows."
    },
    {
      question: "How are system updates and regulatory patch cycles handled?",
      answer: "We deploy ongoing, zero-downtime micro-updates directly to your template libraries to ensure your system continuously aligns with shifting regional transaction rules. Critical structural adjustments or security patches can be staged automatically within your sandbox for review prior to production rollouts."
    },
    {
      question: "What analytics and transaction monitoring tools are integrated into the dashboard?",
      answer: "Our prebuilt user interfaces include native multi-currency telemetry dashboards. These give operations teams real-time performance tracking for transaction speed metrics, foreign exchange margin logs, system load indicators, and comprehensive auditable export trails."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#fcfcfd] py-12 md:py-12 md:px-12 border-t border-slate-100">
      <div className="max-w-full mx-auto px-6 lg:px-8">
        
        {/* CLICKABLE SECTION HEADER */}
        <div 
          onClick={() => setIsSectionOpen(!isSectionOpen)}
          className="group text-center mb-12 cursor-pointer select-none bg-gray-200 border border-slate-200/60 p-8 rounded-2xl shadow-sm hover:border-slate-300 transition-all duration-300"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors duration-200">
              Frequently Asked Questions
            </h2>
            
            {/* Header Status Text with Interactive Chevron */}
            <div className="flex items-center gap-2 text-slate-400 font-medium text-sm mt-1">
              <span>{isSectionOpen ? "Click to hide all questions" : "Click to view all questions"}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${isSectionOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* ENTIRE ACCORDION CONTAINER: Collapses everything via Grid rows */}
        <div 
          className={`grid transition-all duration-500 ease-in-out ${
            isSectionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden space-y-4 p-1">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              
              return (
                <div 
                  key={index}
                  className="bg-gray-200 border border-slate-200/80 rounded-xl transition-all duration-300 shadow-sm overflow-hidden"
                >
                  {/* Individual Trigger Button */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex cursor-pointer items-center justify-between p-6 text-left font-semibold text-slate-800 hover:text-blue-600 transition-colors duration-200 focus:outline-none select-none gap-4"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base md:text-lg tracking-tight">
                      {faq.question}
                    </span>
                    
                    {/* Individual Plus/Minus Icon */}
                    <div className="relative w-5 h-5 shrink-0 flex items-center justify-center">
                      <span 
                        className={`absolute w-4 h-0.5 bg-slate-400 rounded-full transition-transform duration-300 ease-out ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                      <span 
                        className={`absolute h-4 w-0.5 bg-slate-400 rounded-full transition-transform duration-300 ease-out ${
                          isOpen ? 'rotate-90 scale-0' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Individual Panel Content */}
                  <div 
                    className={`grid transition-all duration-300 ease-in-out px-6 ${
                      isOpen 
                        ? 'grid-rows-[1fr] opacity-100 pb-6' 
                        : 'grid-rows-[0fr] opacity-0 pb-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-slate-600 leading-relaxed text-sm md:text-base font-normal">
                        {faq.answer}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}