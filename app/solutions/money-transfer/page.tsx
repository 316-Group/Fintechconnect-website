"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Navbar from "@/app/navbar";
import { getPath } from "@/utils/helper";
import Footersection from "@/app/Footersection";

// 1. Dynamic Imports: Split heavy below-the-fold sections into separate JS chunks
const ParallaxSection = dynamic(() => import("@/app/solutions/money-transfer/parallaxsection"), {
  ssr: false,
});
const Newmodulessection = dynamic(() => import("@/app/solutions/money-transfer/newmodulessection"));
const Newpartnersection = dynamic(() => import("@/app/solutions/money-transfer/newpartnersection"));
const NewfeaturesSection = dynamic(() => import("@/app/solutions/money-transfer/newfeaturessection"));
const DynamicSection = dynamic(() => import("@/app/solutions/money-transfer/dynamicsection"));
const BackgroundSection = dynamic(() => import("@/app/solutions/money-transfer/backgroundsection"));
const HoverSection = dynamic(() => import("@/app/solutions/money-transfer/hoversection"));

export default function ForPaymentServiceProviders() {
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroVisible(true);
          if (heroRef.current) observer.unobserve(heroRef.current);
        }
      },
      { threshold: 0.05 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 2. Optimized GPU-accelerated transition helper
  const getAnimatedClass = (isVisible: boolean) =>
    `transition-[opacity,transform] duration-700 ease-out will-change-transform ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12 pointer-events-none"
    }`;

  return (
    <div className="bg-blue-100 font-sans">
      <Navbar />

      {/* Hero Master Wrapper */}
      <div ref={heroRef} className="pt-10 md:pt-12 w-full border-b-[5px] border-blue-600">
        
        {/* Hero Content Section */}
        <section className="md:text-center pl-6 md:pt-12 pb-12 px-4 max-w-5xl mx-auto">
          <h1
            className={`text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight max-w-full ${getAnimatedClass(
              heroVisible
            )}`}
            style={{ transitionDelay: "0ms" }}
          >
            Send money <span className="text-blue-600">anywhere in the world </span> in seconds not days
          </h1>

          <p
            className={`text-slate-600 font-normal text-base md:text-lg mb-8 leading-relaxed md:max-w-[85%] mx-auto ${getAnimatedClass(
              heroVisible
            )}`}
            style={{ transitionDelay: "150ms" }}
          >
            Fintech Connect gives money transfer operators the cross-border rails, FX engine, compliance
            infrastructure, and payout network to move money globally — fast, cheap, and fully compliant.
          </p>

          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-all shadow-sm shadow-blue-600/20 text-sm active:scale-95 ${getAnimatedClass(
              heroVisible
            )}`}
            style={{ transitionDelay: "300ms" }}
          >
            Book demo
          </button>
        </section>

        {/* Hero Showcase Images */}
        <div className={`${getAnimatedClass(heroVisible)}`} style={{ transitionDelay: "450ms" }}>
          {/* Mobile Image */}
          <div className="block md:hidden w-full overflow-hidden rounded-2xl shadow-2xl shadow-slate-300/60 pl-4 pr-0 pt-10 pb-20">
            <img
              src={getPath("/solutions/insurancecompanies.png")}
              alt="Fintech Connect dashboard visualization mobile"
              className="w-full h-auto transform scale-128 origin-left"
              loading="eager"
            />
          </div>

          {/* Desktop Image */}
          <img
            src={getPath("/solutions/creditunions.png")}
            alt="Fintech Connect dashboard visualization"
            className="hidden md:block w-full max-h-230 mx-auto md:pl-70 md:py-0 md:mb-0 md:object-contain rounded-2xl shadow-2xl shadow-slate-300/60"
            loading="eager"
          />
        </div>
      </div>

      {/* Brand Value Proposition */}
      <section className="bg-white py-16 md:py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          <div className="md:col-span-5">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Built to help money transfer <br /> operators move faster <br /> and cost less.
            </h2>
          </div>

          <div className="md:col-span-7">
            <p className="text-slate-800 text-base md:text-2xl leading-relaxed font-normal">
              Fintech Connect gives MTOs a modern infrastructure layer — real-time FX, pre-integrated payout
              networks (including mobile money), automated AML/KYC, and a white-label consumer app — all
              deployable in weeks.
            </p>
          </div>
        </div>
      </section>

      {/* Lazy Loaded Heavy Subsections */}
      <ParallaxSection />
      <Newmodulessection />
      <Newpartnersection />
      <NewfeaturesSection />
      <DynamicSection />
      <BackgroundSection />
      <HoverSection />
      <Footersection />
    </div>
  );
}