import React from 'react';
import { Check } from 'lucide-react';

export default function WhyUsSection() {
  return (
    <section className="relative bg-white text-black py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center pb-30">
        
        {/* Left Side: Content Area */}
        <div className="flex flex-col items-start max-w-xl order-2 lg:order-1">
          {/* Section Tag */}
          <span className="text-sm lg:text-base font-normal text-slate-900 mb-3 tracking-wide">
            Why Us
          </span>
          
          {/* Main Title with Custom Green Accent Accent */}
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 leading-[1.15] mb-6 tracking-tight">
            Future-proof{' '}
            <span className="text-blue-500 inline-block">
              financial technology platform
            </span>
          </h2>
          
          {/* Paragraph*/}
          <p className="text-slate-800 text-sm lg:text-base leading-relaxed mb-8 font-normal">
            We empower financial institutions with cutting-edge tech solutions providing great 
            customer experiences, ultimate performance, and extreme scalability. Our modular 
            cloud-native digital banking platform, enables building unique fintech solutions 
            across the world. With the partner ecosystem and API orchestration layer, our 
            clients have quick access to payment services from market-leading companies.
          </p>
          
          {/* Pill Styled Contact Button */}
          <button className="bg-black hover:bg-slate-800 text-white text-sm lg:text-base font-semibold py-3.5 px-8 rounded-full transition-all shadow-sm active:scale-95">
            Contact us
          </button>
        </div>

        {/* Right Side: Mockup & Asset Composition Area */}
        <div className="relative w-full max-w-lg mx-auto lg:mx-0 order-1 lg:order-2 py-8 lg:py-0">
          
          {/* Main Image Container */}
          <div className="w-full aspect-[4/3] bg-slate-100 rounded-[36px] overflow-hidden shadow-sm border border-slate-200/50 relative">
            {/* image */}
            <img 
              src="/whyUs image.png" 
              alt="Why Us image" 
              className="w-full h-full object-cover object-center"
              
            />
          </div>

          {/* Floating Widget 1: Currencies / Balance Panel (Top Left) */}
          <div className="absolute -top-4 -left-4 lg:-left-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-slate-100 p-4 w-60 flex flex-col z-10 transition-transform hover:-translate-y-1 duration-300">
            {/* GBP Row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-lg">🇬🇧</span>
                <span className="font-semibold text-slate-900 text-sm lg:text-base">
                  26,529<span className="text-slate-400 font-normal">.00</span>
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 tracking-wider">GBP</span>
            </div>
            
            {/* USD Row */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-lg">🇺🇸</span>
                <span className="font-semibold text-slate-900 text-sm lg:text-base">
                  5,530<span className="text-slate-400 font-normal">.00</span>
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 tracking-wider">USD</span>
            </div>

            {/* EUR Row */}
            <div className="flex items-center justify-between py-2 pt-2.5">
              <div className="flex items-center gap-3">
                <span className="text-lg">🇪🇺</span>
                <span className="font-semibold text-slate-900 text-sm lg:text-base">
                  14,109<span className="text-slate-400 font-normal">.00</span>
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 tracking-wider">EUR</span>
            </div>
          </div>

          {/* Floating Widget 2: "Done" Success Notification Status (Bottom Right) */}
          <div className="absolute -bottom-6 -right-4 lg:-right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-slate-100 px-6 py-4 flex flex-col items-center justify-center min-w-[110px] z-10 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-10 h-10 bg-[#00ebd0] rounded-full flex items-center justify-center text-white mb-2 shadow-sm shadow-[#00ebd0]/20">
              <Check className="w-5 h-5 stroke-[3.5]" />
            </div>
            <span className="font-medium text-slate-800 text-sm">
              Done
            </span>
          </div>

        </div>

      </div>
        {/* ========================================================
            PART 2: Extended Section (Image Left, Text Right)
           ======================================================== */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ">
          
          {/* Left Side: 1 Large Dashboard Image Placeholder */}
          <div className="relative w-full max-w-xl mx-auto lg:mx-0 py-4">
            {/* Wrapper matching the original rounded layout frame style */}
            <div className="w-full">
              {/* PLACEHOLDER: Replace this path with your combined dashboard asset */}
              <img 
                src="/transfersimage.png" 
                alt="Transfers dashboard image" 
                className="w-full h-full object-contain object-center"
              /> 
            </div>
          </div>

          {/* Right Side: New Design Text Content Area */}
          <div className="flex flex-col items-start max-w-xl">
            {/* Context Tag Line */}
            <span className="text-sm lg:text-base font-normal text-slate-500 mb-3 tracking-wide">
              Get more with 316 Money
            </span>
            
            {/* Section Main Header */}
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 leading-[1.15] mb-6 tracking-tight">
              No middleman, One platform, proprietary software.
            </h2>
            
            {/*Text */}
            <p className="text-slate-700 text-sm lg:text-base leading-relaxed mb-8 font-normal">
              Hold multiple currencies in cash to use for your international banking needs. 
              Get unbeatable exchange rates when you convert, effortlessly make payments 
              from your currency wallets at no extra cost.
            </p>
            
            {/* Action Button */}
            <button className="bg-black hover:bg-slate-800 text-white text-sm lg:text-base font-semibold py-3.5 px-8 rounded-full transition-all shadow-sm active:scale-95">
              Learn more
            </button>
          </div>

        </div>

    </section>
  );
}