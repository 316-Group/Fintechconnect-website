"use client";
import React from 'react';
import Navbar from './navbar';
import BenefitsSection from '@/app/BenefitsSection';
import FeaturesSection from './Featuressection';
import WhyUsSection from './Whyussection';
import FooterSection from './Footersection';
import GlobalAccountsSection from './Globalaccounts';
import FeelProtectedSection from './Feelprotectedsection';

export default function MarketingHome() {
  return (
    <div className="bg-black">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-black text-white pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden w-full">
      
      {/* 2. Responsive outer grid framework allowing right image to flush perfectly */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Content Column (Spans 5 columns out of 12) */}
        <div className="flex flex-col items-start z-10 lg:col-span-5 order-2 lg:order-1">
          
          {/* Micro Mini Badge Label */}
          <div className="inline-flex items-center rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-[#00ebcd] font-light mb-6 tracking-wide">
            Modular. Integrated. Compliant.
          </div>

          {/* Heading - weights and branding blue split */}
          <h1 className="text-4xl lg:text-[52px] font-bold tracking-tight leading-[1.1] mb-6">
            White label bespoke solutions for{' '}
            <span className="text-blue-500 inline-block">
              Fintechs
            </span>
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
          
          {/*Product Mockup */}
          {/* 3. Right Mockup Image Frame (Spans remaining 7 columns and breaks right margin) */}
        <div className="relative w-full lg:col-span-7 order-1 lg:order-2 lg:pl-4 min-h-[300px] sm:min-h-[400px] lg:min-h-[520px] flex items-center">
          
          {/* This absolute trick breaks out of the max-w container boundaries on desktop */}
          <div className="w-full lg:absolute lg:left-0 lg:right-[-100vw] lg:w-[calc(100%+20vw)] h-full flex items-center justify-start">
            <img 
              src="/Group 2085662636.png" 
              alt="Fintech Connect desktop dashboard interface displaying multi-currency balances and transaction history beside an overlaying smartphone application view" 
              className="w-full h-full lg:h-[110%] object-contain object-left pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              
            />
          </div>
        </div>
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Why Us Section */}
      <WhyUsSection />

      {/* Global Accounts Section */}
      <GlobalAccountsSection />

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

      {/* Feel Protected Section */}
      <FeelProtectedSection />

      {/* Footer */}
      <FooterSection />
    </div>
   );
}