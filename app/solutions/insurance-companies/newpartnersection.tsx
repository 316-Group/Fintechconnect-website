"use client";

import React from "react";
import { getPath } from "@/utils/helper";

interface LogoItem {
  id: string;
  name: string;
  logoUrl: string;
}

// TOP ROW LOGOS (Scrolls Left)
const topRowLogos: LogoItem[] = [
  { id: "clearbank", name: "ClearBank", logoUrl: "/solutions/logos/clearbank.png" },
  { id: "banking-circle", name: "Banking Circle", logoUrl: "/solutions/logos/bankingcircle.png" },
  { id: "visa", name: "VISA", logoUrl: "/solutions/logos/visa.png" },
  { id: "mtn", name: "MTN", logoUrl: "/solutions/logos/image5.png" },
  { id: "solaris", name: "Solaris Bank", logoUrl: "/solutions/logos/image6.png" },
  { id: "mambu", name: "Mambu", logoUrl: "/solutions/logos/kraken.png" },
  { id: "modulr", name: "Modulr", logoUrl: "/solutions/logos/mastercard.png" },
];

// BOTTOM ROW LOGOS (Scrolls Right)
const bottomRowLogos: LogoItem[] = [
  { id: "mastercard", name: "Mastercard", logoUrl: "/solutions/logos/mastercard.png" },
  { id: "veriff", name: "Veriff", logoUrl: "/solutions/logos/image6.png" },
  { id: "unlimit", name: "Unlimit", logoUrl: "/solutions/logos/un.png" },
  { id: "copper", name: "Copper", logoUrl: "/solutions/logos/visa.png" },
  { id: "sumsub", name: "Sumsub", logoUrl: "/solutions/logos/image7.png" },
  { id: "onfido", name: "Onfido", logoUrl: "/solutions/logos/kraken.png" },
  { id: "persona", name: "Persona", logoUrl: "/solutions/logos/bankingcircle.png" },
];

export default function NewPartnersSection() {
  const topMarqueeItems = [...topRowLogos, ...topRowLogos, ...topRowLogos];
  const bottomMarqueeItems = [...bottomRowLogos, ...bottomRowLogos, ...bottomRowLogos];

  return (
    <section className="bg-[#f4f5f7] text-slate-900 py-20 md:py-28 px-6 md:pl-12 pr-0 lg:pl-20 overflow-hidden font-sans">
      {/* INJECTED KEYFRAME ANIMATIONS */}
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0%); }
        }
        .animate-scroll-left {
          display: flex;
          width: max-content;
          animation: marqueeLeft 28s linear infinite;
        }
        .animate-scroll-right {
          display: flex;
          width: max-content;
          animation: marqueeRight 28s linear infinite;
        }
        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center">
        
        {/* LEFT COLUMN: Text Content & Call To Action */}
        <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-20">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Our Partner Network
          </p>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
            <span className="text-blue-600">50+</span> Pre-integrated partners
          </h2>
          
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal mb-8 max-w-md">
            Fintech Connect ships with pre-built connectors to the world's leading
            banking, payments, compliance, and crypto infrastructure providers. No
            custom integration work required.
          </p>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-7 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 text-sm cursor-pointer">
            See all connectors
          </button>
        </div>

        {/* RIGHT COLUMN: Infinite Dual-Direction Ticker Showcase */}
        <div className="lg:col-span-7 w-full md:px-0 relative overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_10%)]">
          
          <div className="flex flex-col gap-5">
            
            {/* ROW 1: Infinite Scroll LEFT */}
            <div className="overflow-hidden w-full">
              <div className="animate-scroll-left flex gap-10 items-center">
                {topMarqueeItems.map((item, index) => (
                  <div
                    key={`${item.id}-top-${index}`}
                    className="w-24 h-24 sm:w-40 sm:h-40 bg-[#2d3139] rounded-2xl flex items-center justify-center p-3 shrink-0 shadow-md hover:scale-105 transition-transform cursor-pointer"
                  >
                    <div className="w-16 h-16 sm:w-28 sm:h-28 aspect-square rounded-full overflow-hidden flex-none">
  <img
    src={getPath(item.logoUrl)}
    alt={`${item.name} logo`}
    className="w-full h-full object-cover scale-110" 
  />
</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROW 2: Infinite Scroll RIGHT */}
            <div className="overflow-hidden w-full pl-8 sm:pl-12">
              <div className="animate-scroll-right flex gap-10 items-center">
                {bottomMarqueeItems.map((item, index) => (
                  <div
                    key={`${item.id}-bottom-${index}`}
                    className="w-24 h-24 sm:w-40 sm:h-40 bg-[#2d3139] rounded-2xl flex items-center justify-center p-3 shrink-0 shadow-md hover:scale-105 transition-transform cursor-pointer"
                  >
                    <div className="w-16 h-16 sm:w-30 sm:h-30 rounded-full flex items-center justify-center shadow-inner overflow-hidden p-0">
                      <img
                        src={getPath(item.logoUrl)}
                        alt={`${item.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}