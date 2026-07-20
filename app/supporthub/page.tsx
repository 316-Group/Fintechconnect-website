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
  },
  {
    category: "Security & compliance",
    faqs: [
      {
        question: "How do you protect customer data and credentials?",
        answer: "We utilize bank-grade AES-256 encryption at rest and TLS 1.3 in transit. Sensitive credentials, payment keys, and authorization tokens are strictly isolated within dedicated cloud hardware security modules (HSMs)."
      },
      {
        question: "How does your KYC/AML tooling integrate with our flows?",
        answer: "Our system routes client telemetry through automated verification loops via pre-built vendor webhooks. You can use our customized drop-in web components to collect documentation, execute real-time sanction list lookups, and receive risk scoring profiles seamlessly."
      },
      {
        question: "How do you support PCI and card security requirements?",
        answer: "Fintech Connect maintains a certified PCI-DSS Level 1 architecture. By rendering our hosted tokenization entry fields directly inside your client-side applications, your servers never touch raw PAN details, dramatically shrinking your auditing compliance scope."
      }
    ]
  },
  {
    category: "Payments, ledger & reconciliation",
    faqs: [
      {
        question: "How does the ledger handle multi-currency and bookkeeping?",
        answer: "Our ledger engine utilizes strict immutable double-entry accounting standards. Balances adjust automatically relative to underlying settlement instructions, natively tracking spot rates, gas costs, and fractional clearing balances cross-border."
      },
      {
        question: "How are settlements and reconciliations handled?",
        answer: "Automated cron matching tools process clearing statements against incoming webhooks at midnight daily. Any anomalies, network transaction drops, or timing mismatches generate explicit flags inside your operational dashboard for immediate attention."
      },
      {
        question: "Transactions failing or stuck - how do I troubleshoot?",
        answer: "Every request features a global deterministic correlation ID. You can track full routing network paths, upstream partner logs, and contextual payload errors directly from the developer console telemetry views."
      }
    ]
  },
  {
    category: "Cards issuing & wallet products",
    faqs: [
      {
        question: "How do I issue physical or virtual cards?",
        answer: "Virtual card elements can be instantiated dynamically via single API calls with instantly restricted tokens. For physical variants, our platform routes configurations to global regional print partners who handle stamping, custom branding, and shipping logistics."
      },
      {
        question: "How do mobile wallets and crypto wallets integrate with your products?",
        answer: "We offer native integration paths for standard Apple Pay and Google Wallet network push provisioning. Digital asset structures run in parallel via isolated ledger keys, allowing token routing to map directly to core banking structures."
      },
      {
        question: "What is the chargeback and dispute process?",
        answer: "When an end-user triggers a dispute flag, funds are provisionally held. Your back-office operators can review the claim data, attach merchant evidence packets, and submit formalized responses directly to card brands using our automated ledger tooling."
      }
    ]
  },
  {
    category: "Crypto payments & custody",
    faqs: [
      {
        question: "How do on-chain crypto payments work on your platform?",
        answer: "Our infrastructure maps localized deposits onto ephemeral on-chain payment contracts. Transactions track across multiple gas-optimized network listeners to update system ledgers instantly upon block finality confirmations."
      },
      {
        question: "Do you support fiat ↔ crypto conversion and liquidity?",
        answer: "Yes. Deep integrations with licensed market makers enable zero-slippage automated routing between common fiat rails and major stablecoins, offering stable liquidity pools across domestic clearings."
      },
      {
        question: "How are crypto private keys and custody handled?",
        answer: "Assets are secured using multi-layer Multi-Party Computation (MPC) custody systems. Key shards reside in separate geographical fault zones, preventing single points of failure and guaranteeing that authorization requires distinct quorum steps."
      }
    ]
  },
  {
    category: "White-label UI & mobile apps",
    faqs: [
      {
        question: "How customizable is the white-label interface?",
        answer: "Our frontend architectures are totally modular. You can define complete brand palettes, custom styling guidelines, dynamic UI dashboard component configurations, and tailored routing systems using a simple centralized JSON asset sheet."
      },
      {
        question: "Can you deliver native iOS/Android apps and handle app-store submissions?",
        answer: "Yes, our mobile kits compile into native packages using highly optimized frameworks. We provide complete compilation assistance, pipeline automation workflows, and continuous store deployment compliance guidelines for both market channels."
      }
    ]
  },
  {
    category: "Back-office, reporting & admin",
    faqs: [
      {
        question: "What back-office features are included for operations teams?",
        answer: "Our operations suite offers role-based administrative control systems, customer account state toggles, audit monitoring utilities, fee engine rules override configurations, and direct technical diagnostic logs."
      },
      {
        question: "Can I export reports or connect the back-office to our accounting systems?",
        answer: "Data tables export directly into raw CSV and XLSX formats. Furthermore, you can stream continuous financial states into enterprise ledger systems like QuickBooks, Xero, or specialized enterprise resource planning setups via standard synchronization webhooks."
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

      {/* VIBRANT HERO SECTION */}
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
                          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
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