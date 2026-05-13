"use client";
import React from 'react';
import Navbar from './navbar';
import BenefitsSection from '@/app/BenefitsSection';
import FeaturesSection from './Featuressection';

export default function MarketingHome() {
  return (
    <div className="bg-black">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 leading-[1.1] mb-6">
              Fintech Connect by 316 <br />
              <span className="text-white">Deployed in Weeks.</span>
            </h1>
            <p className="text-l text-slate-500 mb-10 leading-relaxed">
              We are business builders. Since our founding in 1996, Partners Group has
              invested more than USD 221 billion in private markets opportunities on behalf of our clients
              globally. Empower your institution with prebuilt, white-label app templates. 
              Connect your core banking systems to a world-class mobile experience 
              without the multi-year development cycle.
            </p>
            <div className="flex gap-4">
              <button className="bg-emerald-300 text-black px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition shadow-lg">
                Request Demo
              </button>
              <button className="border border-slate-300 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 transition">
                Book Consultation
              </button>
            </div>
          </div>
          
          {/* Visual Placeholder for a Product Mockup */}
          <div className="relative">
            <div className="relative flex items-center justify-center">
               {/*high-quality product screenshot*/}
               <img 
                  src="/Group 2085662636.png" 
                  alt="Product screenshot"
                  className="w-full h-full object-contain rounded-2xl shadow-2xl"
                />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Trust Bar */}
      <section className="bg-slate-50 py-12 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Trusted by forward-thinking institutions
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            {/* Replace these with actual Partner Logos later */}
            <div className="text-2xl font-bold text-slate-400 italic">GLOBAL BANK</div>
            <div className="text-2xl font-bold text-slate-400 italic">MERIDIAN</div>
            <div className="text-2xl font-bold text-slate-400 italic">EQUITY TRUST</div>
            <div className="text-2xl font-bold text-slate-400 italic">NEO-FIN</div>
          </div>
        </div>
      </section>
    </div>
  );
}