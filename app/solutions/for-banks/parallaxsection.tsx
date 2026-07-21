import React, { useEffect, useState, useRef } from 'react';
import { getPath } from '@/utils/helper';

  // 1. Data Structure - Defined with unique content for each step to make the section functional
const struggles = [
  {
    id: 0,
    struggleTitle: "Legacy Core Systems blocking innovation",
    struggleDesc: "Monolithic cores make it impossible to launch new products quickly. Every change requires months of testing and regulatory sign-off.",
    solutionTitle: "Our Solution",
    solutionDesc: "Fintech Connect provides production-ready modules for core banking, KYC/AML, payments, card issuing, and fraud monitoring. Go live in weeks with a fully compliant, white-labelled banking platform — with a sandbox to test everything first."
  },
  {
    id: 1,
    struggleTitle: "Compliance overheads eating margins.",
    struggleDesc: "Navigating regulatory frameworks and securing initial capital drains resources before you even launch.",
    solutionTitle: "Reduced Overhead",
    solutionDesc: "Our pre-compliant infrastructure and established partner networks drastically cut down your initial capital requirements."
  },
  {
    id: 2,
    struggleTitle: "Scaling without failure",
    struggleDesc: "Legacy systems and fragmented API integrations often break under the pressure of rapid user growth.",
    solutionTitle: "High-Availability Core",
    solutionDesc: "Built on modern microservices, our core banking engine ensures 99.99% uptime even during peak transaction volumes."
  },
  {
    id: 3,
    struggleTitle: "Operational Complexity", // duplicate from image, need logical unique description
    struggleDesc: "Managing daily reconciliations, cross-border settlements, and compliance reporting requires massive manual effort.",
    solutionTitle: "Automated Workflows",
    solutionDesc: "Automate your back-office operations with real-time ledger syncing and built-in automated compliance checks."
  }
];

export default function ParallaxSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect which item is currently in focus
  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveIndex(Number((entry.target as HTMLElement).dataset.index));
        }
      });
    };

    // rootMargin focuses the trigger area to the middle 10% of the screen
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-45% 0px -45% 0px", 
      threshold: 0,
    });

    const elements = document.querySelectorAll('.parallax-step');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Mobile Scroll Swipe Handler to recalculate card active index matching pagination metrics
  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    if (index !== activeIndex && index >= 0 && index < struggles.length) {
      setActiveIndex(index);
    }
  };

  return (
    <section className="bg-gray-950 text-white py-12 md:py-20 px-6 md:px-6 lg:px-16 font-sans">
      <div className="w-full mx-auto">
        
      {/* ========================================================== */}
        {/* 1. MOBILE-ONLY CAROUSEL VIEW (Visible on mobile/tablet)     */}
        {/* ========================================================== */}
        <div className="block lg:hidden w-full">
          {/* Main Mobile Heading */}
          <h2 className="text-2xl font-bold mb-8 text-white tracking-tight leading-tight">
            What Fintech Founders Struggle With and How Fintech Connect Fixes It
          </h2>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            The Problems
          </p>

          {/* Swipe Container utilizing native layout snapping mechanism */}
          <div 
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex w-full overflow-x-auto snap-x snap-mandatory gap-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {struggles.map((item, index) => (
              <div 
                key={item.id} 
                className="w-full shrink-0 snap-center flex flex-col gap-4"
              >
                {/* Active Module Indicator Row */}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                  <h3 className="text-lg font-bold text-blue-400 tracking-tight">
                    {item.struggleTitle}
                  </h3>
                </div>

                {/* Left Side Problem Context Box */}
                <div className=" p-5 text-slate-300 text-sm md:text-2xl leading-relaxed font-normal">
                  {item.struggleDesc}
                </div>

                {/* Right Side Strategy Content Box */}
                <div className="w-full lg:w-[150%] relative pt-8 md:pb-12">
                {/* The main sticky container */}
                <div className="sticky top-24 h-full max-w-[full] bg-[#1e1e1e] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl transition-all duration-500">
                <div className="w-full md:w-[45%] h-60 md:h-auto bg-slate-200 relative flex items-start p-6 border-b md:border-b-0 md:border-r border-gray-700 shrink-0 order-1">
                  <img 
                    src={getPath("/solutions/forbanks/solution1.png")} 
                    alt="Fintech Connect Visual Architecture" 
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="w-full md:w-1/2 p-8 lg:p-10 flex flex-col justify-center shrink-0 order-2">
                  <h4 className="text-2xl font-bold text-blue-400 mb-4 tracking-tight">
                    {struggles[activeIndex].solutionTitle}
                  </h4>
                  <p className="text-slate-300 text-sm md:text-2xl mb-8 leading-relaxed">
                    {struggles[activeIndex].solutionDesc}
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg w-max transition-colors text-sm shadow-md shadow-blue-900/40">
                    Book demo
                  </button>
                </div>
              </div>
            </div>
              </div>
            ))}
          </div>

          {/* Pagination Counter Indicator & Vector Component */}
          <div className="flex items-center justify-end gap-3 mt-6 text-sm font-semibold text-slate-400 tracking-wide">
            <span>{activeIndex + 1} of {struggles.length}</span>
            <div className="w-14 h-[1px] bg-slate-500 relative flex items-center justify-end">
              <span className="absolute right-0 border-t border-r border-slate-500 w-1.5 h-1.5 rotate-45 transform -translate-y-[0.5px]"></span>
            </div>
          </div>
        </div>
        
        {/* ========================================================== */}
        {/* 2. DESKTOP PARALLAX VIEW (Hidden on mobile/tablet)         */}
        {/* ========================================================== */}
        <div className="hidden lg:block w-full">
          {/* Desktop Main Heading */}
          <h2 className="text-3xl md:text-3xl font-bold mb-2 md:pl-4 md:max-w-[40%] leading-tight text-white tracking-tight">
            What Fintech Founders Struggle With and How Fintech Connect Fixes It
          </h2>

          <p className="text-white text-sm md:text-base mb-12 md:mt-16 md:mb-0 md:pl-4 md:max-w-[40%] leading-relaxed">
          The Problems.
        </p>

          <div className="flex flex-col lg:flex-row gap-16 relative items-stretch">
            
            {/* LEFT COLUMN: Clickable Items (Accordion Style) */}
            <div className="w-full lg:w-[1/3] relative pt-0 pb-6 ">
            {/* The vertical timeline line */}
            <div className="absolute left-[31px] top-20 bottom-20 w-0.5 bg-slate-800 z-0"></div>

              {struggles.map((item, index) => (
                <div 
                  key={item.id}
                  data-index={index}
                  className="parallax-step relative flex flex-col justify-center py-12 pl-6"
                >
                  <div 
                    onClick={() => setActiveIndex(index)}
                    className="relative flex items-center gap-12 cursor-pointer group select-none"
                  >
                    <div className={`w-4 h-4 shrink-0 rounded-full z-10 transition-all duration-500 ${
                      activeIndex === index 
                        ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] scale-110' 
                        : 'bg-slate-600 group-hover:bg-slate-400'
                    }`}></div>

                    <h3 className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-500 ${
                      activeIndex === index ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-400'
                    }`}>
                      {item.struggleTitle}
                    </h3>
                  </div>
                  
                  <div className={`pl-10 grid transition-all duration-500 ease-in-out ${
                    activeIndex === index ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0 mt-0'
                  }`}>
                    <div className="overflow-hidden">
                      <div className="p-6 md:p-8 text-slate-200 leading-relaxed text-sm md:text-lg">
                        {item.struggleDesc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN: Sticky Solution Box */}
<div className="w-full lg:w-[150%] relative pt-0 pb-12">
  {/* The main sticky container */}
  <div className="sticky top-24 h-full max-w-[full] bg-[#1e1e1e] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl transition-all duration-500">
                <div className="w-full md:w-[45%] h-60 md:h-auto bg-slate-200 relative flex items-start p-6 border-b md:border-b-0 md:border-r border-gray-700 shrink-0">
                  <img 
                    src={getPath("/frontend.png")} 
                    alt="Fintech Connect Visual Architecture" 
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="w-full md:w-1/2 p-8 lg:p-10 flex flex-col justify-center shrink-0">
                  <h4 className="text-2xl font-bold text-blue-400 mb-4 tracking-tight">
                    {struggles[activeIndex].solutionTitle}
                  </h4>
                  <p className="text-slate-300 text-sm md:text-base mb-8 leading-relaxed">
                    {struggles[activeIndex].solutionDesc}
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg w-max transition-colors text-sm shadow-md shadow-blue-900/40">
                    Book demo
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}