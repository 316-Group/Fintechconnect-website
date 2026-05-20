import React from 'react';

const modules = [
  { title: "Client Dashboard", desc: "Overview of customer accounts, recent transactions, and activity.", img: "https://via.placeholder.com/400x250?text=Dashboard" },
  { title: "KYC & AML Compliance", desc: "Automated identity verification, PEP screening, and risk scoring.", img: "https://via.placeholder.com/400x250?text=Compliance" },
  { title: "Payments API", desc: "Real-time payment initiation, scheduled transfers, and local rail access.", img: "https://via.placeholder.com/400x250?text=API" },
  { title: "Core Ledger", desc: "Immutable, real-time balance tracking for internal accounts.", img: "https://via.placeholder.com/400x250?text=Ledger" },
  { title: "Card Issuing", desc: "Virtual and physical card creation, BIN management, and spend controls.", img: "https://via.placeholder.com/400x250?text=Cards" },
  { title: "FX Engine", desc: "Live currency conversion with competitive rates and swap functionality.", img: "https://via.placeholder.com/400x250?text=FX+Engine" },
  { title: "Product Factory", desc: "Define and configure specific account types, loans, and investment products.", img: "https://via.placeholder.com/400x250?text=Product+Factory" },
  { title: "Fraud Monitoring", desc: "AI-driven transaction monitoring, anomaly detection, and rule-based alerts.", img: "https://via.placeholder.com/400x250?text=Fraud+AI" },
  { title: "Customer Support Hub", desc: "In-app chat, ticket management, and integrated support tools.", img: "https://via.placeholder.com/400x250?text=Support" },
];

export default function ModulesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Header Section */}
        <h2 className="text-4xl font-bold text-slate-900 mb-6">
          Fintech Connect powers <span className="text-blue-600">innovators</span>
        </h2>
        <p className="text-slate-600 max-w-4xl mx-auto mb-16">
          Fintech Connect gives your team a modular, pre-integrated platform of financial 
          building blocks. Pick the modules you need, configure them to your brand, 
          and go live with a fully regulated fintech product.
        </p>

        {/* 3x3 Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <div 
              key={index} 
              className="bg-slate-100 p-6 rounded-3xl flex flex-col items-start text-left transition-transform hover:shadow-lg"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2">{module.title}</h3>
              <p className="text-sm text-slate-500 mb-6 flex-grow">{module.desc}</p>
              
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-slate-200 rounded-2xl overflow-hidden mt-auto">
                <img 
                  src={module.img} 
                  alt={module.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}