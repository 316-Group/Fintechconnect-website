import React from 'react';
import { getPath } from '@/utils/helper';


const modules = [
  { title: "Client Dashboard", desc: "Overview of customer accounts, recent transactions, and activity.", img: '/frontend.png' },
  { title: "KYC & AML Compliance", desc: "Automated identity verification, PEP screening, and risk scoring.", img: '/rates.png' },
  { title: "Payments API", desc: "Real-time payment initiation, scheduled transfers, and local rail access.", img: '/modules3.png' },
  { title: "Core Ledger", desc: "Immutable, real-time balance tracking for internal accounts.", img: '/frontend.png' },
  { title: "Card Issuing", desc: "Virtual and physical card creation, BIN management, and spend controls.", img: '/rates.png' },
  { title: "FX Engine", desc: "Live currency conversion with competitive rates and swap functionality.", img: '/modules3.png' },
  { title: "Product Factory", desc: "Define and configure specific account types, loans, and investment products.", img: '/frontend.png' },
  { title: "Fraud Monitoring", desc: "AI-driven transaction monitoring, anomaly detection, and rule-based alerts.", img: '/rates.png' },
  { title: "Customer Support Hub", desc: "In-app chat, ticket management, and integrated support tools.", img: '/modules3.png' },
];

export default function NewmodulesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="w-full px-3 lg:px-6 max-w-[92.5%] mx-auto">
        {/* Header Section */}
        <h2 className="text-4xl font-bold text-slate-900 mb-16">
          Essential Building Blocks to <><br /></>Launch Fintech Today
        </h2>
        

        {/* 3x3 Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <div 
  key={index} 
  // Removed px-6 from the parent
  className="bg-blue-100 rounded-2xl flex flex-col items-start text-left transition-transform hover:shadow-lg overflow-hidden group cursor-pointer"
>
  {/* Added px-6 directly to the text elements instead */}
  <h3 className="text-xl font-bold text-slate-900 mb-2 py-6 px-8">{module.title}</h3>
  <p className="text-sm text-slate-500 mb-4 flex-grow px-8">{module.desc}</p>

  {/* 2. The Blue Arrow Container */}
  <div className="px-6 mb-6">
    <svg 
      className="w-6 h-6 text-blue-600 transition-transform duration-300 group-hover:translate-x-2" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </div>
  
  {/* Now w-full naturally hits the very edges of the card */}
  <div className="w-full h-full mt-auto px-6">
    <img 
      src={getPath(module.img)} 
      alt={module.title} 
      // object-cover ensures no blank space is left inside the image block
      className="rounded-lg w-full h-full object-cover"
    />
  </div>
</div>
          ))}
        </div>
      </div>
    </section>
  );
}