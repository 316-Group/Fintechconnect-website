"use client";

import React from "react";
import { getPath } from "@/utils/helper";
import Link from "next/link";

interface LogoItem {
  id: string;
  name: string;
  logoUrl: string;
}

// ALL PARTNER LOGOS
const allLogos: LogoItem[] = [
  { id: "clearbank", name: "ClearBank", logoUrl: "/solutions/logos/clearbank.png" },
  { id: "banking-circle", name: "Banking Circle", logoUrl: "/solutions/logos/bankingcircle.png" },
  { id: "visa", name: "VISA", logoUrl: "/solutions/logos/inter.png" },
  { id: "mtn", name: "MTN", logoUrl: "/solutions/logos/mpesa.png" },
  { id: "solaris", name: "Solaris Bank", logoUrl: "/solutions/logos/flutterwave.png" },
  { id: "mambu", name: "Mambu", logoUrl: "/solutions/logos/un.png" },
  { id: "modulr", name: "Modulr", logoUrl: "/solutions/logos/mastercard.png" },
  { id: "mastercard", name: "Mastercard", logoUrl: "/solutions/logos/monovate.png" },
  { id: "veriff", name: "Veriff", logoUrl: "/solutions/logos/fireblocks.png" },
  { id: "unlimit", name: "Unlimit", logoUrl: "/solutions/logos/decta.png" },
  { id: "copper", name: "Copper", logoUrl: "/solutions/logos/mambu.png" },
  { id: "sumsub", name: "Sumsub", logoUrl: "/solutions/logos/mtn.png" },
  { id: "onfido", name: "Onfido", logoUrl: "/solutions/logos/solaris.png" },
  { id: "persona", name: "Persona", logoUrl: "/solutions/logos/currencycloud.png" },
];

// 8 tightly-packed vertical columns across the full screen width
const col1 = [...allLogos.slice(0, 7), ...allLogos.slice(0, 7)];
const col2 = [...allLogos.slice(3, 10), ...allLogos.slice(3, 10)];
const col3 = [...allLogos.slice(6, 13), ...allLogos.slice(6, 13)];
const col4 = [...allLogos.slice(2, 9), ...allLogos.slice(2, 9)];
const col5 = [...allLogos.slice(5, 12), ...allLogos.slice(5, 12)];
const col6 = [...allLogos.slice(1, 8), ...allLogos.slice(1, 8)];
const col7 = [...allLogos.slice(4, 11), ...allLogos.slice(4, 11)];
const col8 = [...allLogos.slice(7, 14), ...allLogos.slice(7, 14)];

const columns = [
  { items: col1, speed: "32s" },
  { items: col2, speed: "42s" },
  { items: col3, speed: "28s" },
  { items: col4, speed: "36s" },
  { items: col5, speed: "40s" },
  { items: col6, speed: "30s" },
  { items: col7, speed: "38s" },
  { items: col8, speed: "34s" },
];

export default function NewPartnersSection() {
  return (
    <section className="relative bg-[#f6f8fc] text-slate-900 py-24 md:py-32 px-2 overflow-hidden font-sans min-h-[600px] flex items-center justify-center">
      {/* GPU-ACCELERATED KEYFRAME ANIMATIONS */}
      <style>{`
        @keyframes marqueeUp {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(0, -50%, 0);
          }
        }
        @keyframes fadePulse {
          0%, 100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.95;
          }
        }
        .animate-scroll-up {
          animation: marqueeUp linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .animate-fade-pulse {
          animation: fadePulse 5s ease-in-out infinite;
          will-change: opacity;
        }
      `}</style>

      {/* BACKGROUND VERTICAL MARQUEE GRID */}
      <div className="absolute inset-0 z-0 flex justify-center gap-2.5 sm:gap-3.5 px-1 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]">
        {columns.map((col, colIdx) => (
          <div
            key={`col-${colIdx}`}
            className="w-28 sm:w-36 md:w-40 lg:w-44 flex flex-col overflow-hidden shrink-0"
          >
            <div
              className="animate-scroll-up flex flex-col gap-2.5 sm:gap-3.5"
              style={{ animationDuration: col.speed }}
            >
              {col.items.map((item, itemIdx) => {
                const delay = `${(itemIdx * 0.8 + colIdx * 0.5) % 5}s`;
                const duration = `${4 + ((itemIdx + colIdx) % 3)}s`;

                return (
                  <div
                    key={`${item.id}-col${colIdx}-${itemIdx}`}
                    className="animate-fade-pulse w-full aspect-square bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/80 transition-transform transform-gpu"
                    style={{
                      animationDelay: delay,
                      animationDuration: duration,
                    }}
                  >
                    <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex items-center justify-center p-1">
                      <img
                        src={getPath(item.logoUrl)}
                        alt={`${item.name} logo`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* RADIAL BACKDROP OVERLAY */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(246,248,252,0.98)_0%,rgba(246,248,252,0.88)_38%,rgba(246,248,252,0.15)_75%,transparent_100%)]" />

      {/* CENTERED CONTENT OVERLAY */}
      <div className="relative z-20 max-w-3xl mx-auto text-center flex flex-col items-center px-4">
        
        {/* DECORATIVE DASHED RING BEHIND TEXT */}
        <div className="absolute -top-24 sm:-top-32 w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] border border-dashed border-blue-300/40 rounded-full pointer-events-none -z-10 animate-spin-slow" />

        {/* SUBTITLE / LABEL */}
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Our Partner Network
        </p>

        {/* MAIN HEADING */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
          <span className="text-blue-600">50+</span> Pre-integrated partners
        </h2>

        {/* DESCRIPTION */}
        <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal mb-8 max-w-xl">
          Fintech Connect ships with pre-built connectors to the world's leading
          banking, payments, compliance, and crypto infrastructure providers. No
          custom integration work required.
        </p>

        {/* CALL TO ACTION BUTTON */}
        <Link
          href="/connectors"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 text-sm cursor-pointer"
        >
          See all connectors
        </Link>
      </div>
    </section>
  );
}