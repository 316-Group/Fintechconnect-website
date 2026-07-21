"use client";

import React from "react";

interface LogoItem {
  id: string;
  name: string;
  logoBg: string;
  logoText?: string;
  // Optional image URL if you decide to use image files later
  imageUrl?: string;
}

// TOP ROW LOGOS (Scrolls Left)
const topRowLogos: LogoItem[] = [
  { id: "clearbank", name: "ClearBank", logoBg: "bg-[#9efff5]", logoText: "text-slate-900 font-bold text-xs" },
  { id: "banking-circle", name: "Banking Circle", logoBg: "bg-gradient-to-tr from-purple-700 to-indigo-500" },
  { id: "visa", name: "VISA", logoBg: "bg-white", logoText: "text-[#0057b8] font-extrabold text-sm tracking-tighter" },
  { id: "mtn", name: "MTN", logoBg: "bg-[#ffcc00]", logoText: "text-slate-900 font-black text-xs" },
  { id: "solaris", name: "Solaris Bank", logoBg: "bg-[#f95738]" },
  { id: "mambu", name: "Mambu", logoBg: "bg-[#00c9a7]" },
  { id: "modulr", name: "Modulr", logoBg: "bg-[#ffd166]" },
];

// BOTTOM ROW LOGOS (Scrolls Right)
const bottomRowLogos: LogoItem[] = [
  { id: "mastercard", name: "Mastercard", logoBg: "bg-black" },
  { id: "veriff", name: "Veriff", logoBg: "bg-[#003d36]" },
  { id: "unlimit", name: "Unlimit", logoBg: "bg-[#ccff00]", logoText: "text-slate-900 font-black text-sm" },
  { id: "copper", name: "Copper", logoBg: "bg-white", logoText: "text-purple-600 font-bold text-lg" },
  { id: "sumsub", name: "Sumsub", logoBg: "bg-[#5c42ff]" },
  { id: "onfido", name: "Onfido", logoBg: "bg-[#181a20]" },
  { id: "persona", name: "Persona", logoBg: "bg-[#3a0ca3]" },
];

export default function NewPartnersSection() {
  // Duplicate array rows to guarantee seamless 100% infinite looping
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

      <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: Text Content & Call To Action */}
        <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-6">
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
        <div className="lg:col-span-7 w-full md:px-0">
          
          {/* Subtle Fading Edge Gradients */}
          {/* <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-[#f4f5f7] to-transparent z-10 pointer-events-none" /> */}
          {/*<div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-[#f4f5f7] to-transparent z-10 pointer-events-none" /> */}

          <div className="flex flex-col gap-5">
            
            {/* ROW 1: Infinite Scroll LEFT */}
            <div className="overflow-hidden w-full">
              <div className="animate-scroll-left flex gap-10 items-center">
                {topMarqueeItems.map((item, index) => (
                  <div
                    key={`${item.id}-top-${index}`}
                    className="w-24 h-24 sm:w-40 sm:h-40 bg-[#2d3139] rounded-2xl flex items-center justify-center p-3 shrink-0 shadow-md hover:scale-105 transition-transform cursor-pointer"
                  >
                    {/* Circle Brand Badge */}
                    <div className={`w-16 h-16 sm:w-30 sm:h-30 rounded-full ${item.logoBg} flex items-center justify-center shadow-inner overflow-hidden p-1 text-center`}>
                      {item.id === "visa" && (
                        <span className="font-extrabold text-blue-800 text-sm italic tracking-tighter">VISA</span>
                      )}
                      {item.id === "clearbank" && (
                        <span className="font-bold text-slate-800 text-[10px] leading-tight">Clear.Bank</span>
                      )}
                      {item.id === "banking-circle" && (
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/80 animate-spin-slow" />
                      )}
                      {item.id === "mtn" && (
                        <span className="font-black text-black text-xs tracking-tighter">MoMo</span>
                      )}
                      {item.id === "solaris" && (
                        <div className="w-6 h-6 rounded-full bg-orange-200/40 border-2 border-white" />
                      )}
                      {!["visa", "clearbank", "banking-circle", "mtn", "solaris"].includes(item.id) && (
                        <span className={item.logoText || "text-white font-bold text-xs"}>
                          {item.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROW 2: Infinite Scroll RIGHT (Shifted Indent) */}
            <div className="overflow-hidden w-full pl-8 sm:pl-12">
              <div className="animate-scroll-right flex gap-10 items-center">
                {bottomMarqueeItems.map((item, index) => (
                  <div
                    key={`${item.id}-bottom-${index}`}
                    className="w-24 h-24 sm:w-40 sm:h-40 bg-[#2d3139] rounded-2xl flex items-center justify-center p-3 shrink-0 shadow-md hover:scale-105 transition-transform cursor-pointer"
                  >
                    {/* Circle Brand Badge */}
                    <div className={`w-16 h-16 sm:w-30 sm:h-30 rounded-full ${item.logoBg} flex items-center justify-center shadow-inner overflow-hidden p-1 text-center`}>
                      {item.id === "mastercard" && (
                        <div className="flex -space-x-2">
                          <div className="w-5 h-5 rounded-full bg-red-600" />
                          <div className="w-5 h-5 rounded-full bg-yellow-500/90" />
                        </div>
                      )}
                      {item.id === "veriff" && (
                        <div className="w-6 h-6 border-b-2 border-r-2 border-teal-400 transform -rotate-45" />
                      )}
                      {item.id === "unlimit" && (
                        <span className="font-black text-slate-900 text-sm">uN</span>
                      )}
                      {item.id === "copper" && (
                        <span className="font-bold text-purple-600 text-base">¢</span>
                      )}
                      {!["mastercard", "veriff", "unlimit", "copper"].includes(item.id) && (
                        <span className={item.logoText || "text-white font-bold text-xs"}>
                          {item.name}
                        </span>
                      )}
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