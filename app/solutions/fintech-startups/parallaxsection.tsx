import React, { useEffect, useState, useRef } from 'react';
import { getPath } from '@/utils/helper';

  // 1. Data Structure - Defined with unique content for each step to make the section functional
const struggles = [
  {
    id: 0,
    struggleTitle: "Delayed Time-to-Market",
    struggleDesc: "Building core banking technology and integrating multiple bank partners can take 6-12 months.",
    solutionTitle: "Our Solution",
    solutionDesc: "Fintech Connect provides production-ready modules for accounts, payments, FX, etc., so you can go live in weeks (with a sandbox to test)."
  },
  {
    id: 1,
    struggleTitle: "High upfront costs & compliance risk",
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

  return (
    <section className="bg-slate-900 text-white py-12 md:py-20 px-6 md:px-6 lg:px-16 font-sans">
      <div className="w-full mx-auto">
        
        {/* Main Heading */}
        <h2 className="text-3xl md:text-3xl font-bold mb-2 md:pl-4 md:max-w-[40%] leading-tight text-white tracking-tight">
          What Fintech Founders Struggle With and How Fintech Connect Fixes It
        </h2>

        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* LEFT COLUMN: Clickable Items (Accordion Style) */}
<div className="w-full lg:w-[1/3] relative py-12 ">
  {/* The vertical timeline line */}
  <div className="absolute left-[31px] top-20 bottom-20 w-0.5 bg-slate-800 z-0 hidden lg:block"></div>

  {struggles.map((item, index) => (
    <div 
      key={item.id}
      // Reduced vertical padding slightly for a cleaner click interaction flow
      className="relative flex flex-col justify-center py-6 pl-6"
    >
      
      {/* CLICKABLE HEADER ROW: Updates activeIndex on click */}
      <div 
        onClick={() => setActiveIndex(index)}
        className="relative flex items-center gap-6 cursor-pointer group select-none"
      >
        {/* Timeline Dot (Glows when active, highlights on hover) */}
        <div 
          className={`w-4 h-4 shrink-0 rounded-full z-10 transition-all duration-500 ${
            activeIndex === index 
              ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] scale-110' 
              : 'bg-slate-600 group-hover:bg-slate-400'
          }`}
        ></div>

        {/* Heading (Changes color when active, subtle highlight on hover) */}
        <h3 
          className={`text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-500 ${
            activeIndex === index 
              ? 'text-blue-500' 
              : 'text-slate-500 group-hover:text-slate-400'
          }`}
        >
          {item.struggleTitle}
        </h3>
      </div>
      
      {/* DESCRIPTION PANEL: Remains using the perfect grid-collapse transition */}
      <div 
        className={`pl-10 grid transition-all duration-500 ease-in-out ${
          activeIndex === index 
            ? 'grid-rows-[1fr] opacity-100 mt-5' 
            : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="bg-[#2a2a2a] p-6 md:p-8 rounded-md text-slate-200 leading-relaxed text-sm md:text-base">
            {item.struggleDesc}
          </div>
        </div>
      </div>

    </div>
  ))}
</div>

          {/* RIGHT COLUMN: Sticky Solution Box */}
<div className="w-full lg:w-[150%] relative">
  {/* The main sticky container */}
  <div className="sticky top-1/4 h-full max-w-[full] bg-[#1e1e1e] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl transition-all duration-500">
    
    {/* LEFT HALF: Image Container */}
    <div className="w-full md:w-[45%] h-60 md:h-full bg-slate-200 relative flex items-start p-6 border-b md:border-b-0 md:border-r border-gray-700 shrink-0">
      <img 
        src={getPath("/frontend.png")} 
        alt="Fintech Connect dashboard and mobile app visualization composite" 
        className="w-full h-full object-contain"
      />
    </div>

    {/* RIGHT HALF: Text & Button Content */}
    <div className="w-full md:w-1/2 p-8 lg:p-10 flex flex-col justify-center shrink-0">
      
      {/* FIX: Dynamic Solution Title based on active struggle in focus */}
      <h4 className="text-2xl font-bold text-blue-400 mb-4 tracking-tight">
        {struggles[activeIndex].solutionTitle}
      </h4>
      
      {/* FIX: Dynamic Solution Description based on active struggle in focus */}
      <p className="text-slate-300 text-sm md:text-base mb-8 leading-relaxed">
        {struggles[activeIndex].solutionDesc}
      </p>
      
      {/* Primary CTA Button */}
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg w-max transition-colors text-sm shadow-md shadow-blue-900/40">
        Book demo
      </button>
    </div>

  </div>
</div>

        </div>
      </div>
    </section>
  );
}