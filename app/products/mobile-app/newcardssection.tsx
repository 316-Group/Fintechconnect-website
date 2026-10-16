'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, LayoutGrid } from 'lucide-react';

interface FeatureCard {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const cardsData: FeatureCard[] = [
  {
    id: 1,
    icon: <Smartphone className="w-5 h-5 text-blue-600" />,
    title: 'A white-label app configured by you',
    description:
      'Complete standalone client banking app branded with your design tokens, colors, custom iconography, and typography.',
  },
  {
    id: 2,
    icon: <LayoutGrid className="w-5 h-5 text-blue-600" />,
    title: 'Components inside your existing app',
    description:
      'Embed modular balance cards, payment flows, or card management controls directly into your established iOS or Android application.',
  },
];

export default function NewCardsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#f8faff] py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900 overflow-hidden">
      <div className="max-w-full mx-auto space-y-12">
        
        {/* Header Section */}
        <div className={`max-w-3xl space-y-3 text-center mx-auto transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        }`}>
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-3">
            DELIVERY
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            A full app, or the pieces you need.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal pt-1 max-w-xl mx-auto">
            Deploy as a complete turnkey experience, or integrate individual mobile journey modules into your current codebase.
          </p>
        </div>

        {/* 2-Cards Grid with Staggered Left-to-Right Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-full mx-auto">
          {cardsData.map((card, index) => (
            <div
              key={card.id}
              className={`bg-white rounded-2xl p-7 sm:p-8 border border-slate-100/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-700 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-x-0 translate-y-0' 
                  : 'opacity-0 -translate-x-12'
              }`}
              style={{ transitionDelay: `${index * 250}ms` }}
            >
              <div>
                {/* Top Row: Icon Badge */}
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50/80 border border-blue-100/60 flex items-center justify-center shrink-0">
                    {card.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3 leading-snug">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}