import React from 'react';
import { Globe } from "@/components/ui/globe";

export default function DynamicSection() {
  return (
    <section className="relative w-full bg-[#fcfcfd] py-10 md:py-16 px-6 md:px-5 overflow-hidden min-h-[85vh] flex items-center">
      
      {/* GLOBE CONTAINER 
          Positions the Magic UI globe absolutely on the right side, 
          letting it bleed beautifully off-screen to match the layout.
      */}
      <div className="absolute top-3/5 md:top-145 -translate-y-2/3 -right-29 md:-right-85 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] pointer-events-none z-0">
    <Globe className="w-full h-full" />
  </div>

      {/* CONTENT INNER WRAPPER */}
      <div className="relative z-10 max-w-full mx-auto px-1 md:px-16 w-full flex flex-col md:gap-24">
        
        {/* Top Text Block (Asymmetric split wrapper) */}
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.15] mb-6">
            Tap into the world’s local payments network
          </h2>
          <p className="text-sm md:text-base md:text-slate-500 leading-relaxed font-normal mb-6">
            Airwallex’s proprietary local payments network offers you a faster, more cost-effective, and
            transparent alternative to legacy banking. Operate like a local business from anywhere in the
            world - open accounts with local bank details in minutes, accept payments in local currency to
            avoid costly forced conversion fees, hold funds in a multi-currency wallet, convert currencies
            at interbank rates, and make high-speed transfers around the world in a few clicks.
          </p>
        </div>

        {/* Bottom Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 w-full max-w-full">
          
          {/* Stat 1 */}
          <div className="flex flex-col max-w-[210px]">
            <span className="text-4xl md:text-5xl font-bold text-[#ff5a36] mb-3">
              70+
            </span>
            <span className="text-xs md:text-sm text-slate-700 font-medium leading-normal">
              countries where you can collect funds like a local
            </span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col max-w-[210px]">
            <span className="text-4xl md:text-5xl font-bold text-[#e6007a] mb-3">
              120+
            </span>
            <span className="text-xs md:text-sm text-slate-700 font-medium leading-normal">
              countries to which you can make local transfers
            </span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col max-w-[210px]">
            <span className="text-4xl md:text-5xl font-bold text-[#4a00e0] mb-3">
              $235B+
            </span>
            <span className="text-xs md:text-sm text-slate-700 font-medium leading-normal">
              global payments processed annually
            </span>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col max-w-[210px]">
            <span className="text-4xl md:text-5xl font-bold text-[#9400d3] mb-3">
              180+
            </span>
            <span className="text-xs md:text-sm text-slate-700 font-medium leading-normal">
              countries from which you can accept payments
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}