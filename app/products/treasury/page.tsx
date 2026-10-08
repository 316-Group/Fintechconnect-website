"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/app/navbar";
import { getPath } from "@/utils/helper";
import DynamicSection from "@/app/solutions/credit-unions/dynamicsection";
import { Globe } from "@/components/ui/globe";
import Footersection from "@/app/Footersection";
import Newmodulessection from "@/app/products/treasury/newmodulessection";
import BackgroundSection from "@/app/solutions/credit-unions/backgroundsection";
import HoverSection from "@/app/products/treasury/hoversection";
import NewfeaturesSection from "@/app/products/treasury/newfeaturessection";
import Newpartnersection from "@/app/products/treasury/newpartnersection";
import NewApiSection from "@/app/products/treasury/newapisection";
import NewCarouselSection from "@/app/products/treasury/newcarouselsection";
import NewDynamicSection from "@/app/products/treasury/newdynamicsection";
import PlatformSection from "@/app/products/treasury/platformsection";
import MiddleLayerSection from "@/app/products/treasury/middlelayersection";
import CardSection from "./cardsection";

export default function ForCreditUnions() {
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

  const getAnimatedClass = (isVisible: boolean) =>
    `transition-all duration-700 ease-out ${
      isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-12 pointer-events-none"
    }`;

  return (
    <div className="bg-[#EEF3FF] font-sans">
      <Navbar />

      {/* Hero Header & Dashboard Preview Section */}
      <div ref={heroRef} className="pt-10 md:pt-16 pb-12 md:pb-20 w-full">
        <section className="max-w-full mx-auto px-6 md:pl-20 pr-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-25 items-center">
          
          {/* Left Column: Heading, Subtitle & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <h1
              className={`text-3xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.15] ${getAnimatedClass(
                heroVisible
              )}`}
              style={{ transitionDelay: "0ms" }}
            >
              Bring cash, settlement and liquidity decisions into{" "}
              <span className="text-blue-600 block sm:inline">
                one considered operating view
              </span>
            </h1>

            <p
              className={`text-slate-600 font-normal text-sm md:text-base leading-relaxed ${getAnimatedClass(
                heroVisible
              )}`}
              style={{ transitionDelay: "150ms" }}
            >
              Treasury Management gives financial teams a clear product foundation for assembling position views, 
              settlement obligations, liquidity thresholds, funding workflows, foreign-exchange considerations, and reporting.
            </p>

            <div
              className={`${getAnimatedClass(heroVisible)}`}
              style={{ transitionDelay: "300ms" }}
            >
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-7 rounded-lg transition-all shadow-sm text-sm active:scale-95 cursor-pointer">
                Book demo
              </button>
            </div>
          </div>

          {/* Right Column: Dashboard Image Showcase */}
          <div
            className={`w-full lg:col-span-7 flex justify-center lg:justify-end lg:pr-0 ${getAnimatedClass(
              heroVisible
            )}`}
            style={{ transitionDelay: "450ms" }}
          >
            <img
              src={getPath("/products/treasury.png")}
              alt="Treasury Management Dashboard"
              className="w-full h-auto lg:max-w-none object-contain lg:object-right lg:pr-0"
            />
          </div>
        </section>
      </div>

      {/* Brand Value Proposition Section */}
      <section className="bg-white py-16 md:py-24 px-6 md:px-12 lg:px-20 border-t border-slate-100">
        <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
          
          {/* Left Column - Heading */}
          <div className="md:col-span-5">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A treasury layer designed around accountable decisions
            </h2>
          </div>

          {/* Right Column - Paragraph Description */}
          <div className="md:col-span-7 space-y-6">
            <p className="text-slate-700 text-base md:text-2xl leading-relaxed font-normal">
              Fintech Connect Treasury Management is the proposed module for shaping that layer around each programmes products, partners, calendars, and responsibility model.
               It is intended to help institutions define how position data is assembled, how thresholds surface work, and how approved actions move through controlled workflows. 
              The result is a more coherent treasury operating design that can sit alongside the ledger, payment flows, reconciliation processes, and selected connected sources.
            </p>
          </div>

        </div>
      </section>

      {/* Subsections */}
      <Newmodulessection />
      <NewfeaturesSection />
      <MiddleLayerSection />
      <NewApiSection />
      <Newpartnersection />
      <NewCarouselSection />
      {/* <CardSection /> */}
      <PlatformSection />
      <NewDynamicSection />
      <HoverSection />
      <Footersection />
    </div>
  );
}