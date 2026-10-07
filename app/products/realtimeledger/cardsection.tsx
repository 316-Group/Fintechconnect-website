'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface StepCard {
  stepNumber: number;
  title: string;
  description: string;
  isHighlighted?: boolean;
}

const cardData: StepCard[] = [
  {
    stepNumber: 1,
    title: 'Existing Clients',
    description:
      'Businesses, founders, merchants or corporate clients you already serve.',
  },
  {
    stepNumber: 2,
    title: 'Branded Financial Products',
    description:
      'Businesses, founders, merchants or corporate clients you already serve.',
  },
  {
    stepNumber: 3,
    title: 'Monthly Activity',
    description:
      'Balances, transactions, spend, FX flows and payment volume.',
  },
  {
    stepNumber: 4,
    title: 'Recurring Financial Revenue',
    description:
      'A new revenue layer built around relationships you already own.',
    isHighlighted: true,
  },
];

export default function CardSection() {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-[#f4f6fa] py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans overflow-hidden">
      <div
        ref={sectionRef}
        className="max-w-full mx-auto bg-[#eef2f8]/60 border border-slate-200/60 rounded-[36px] p-6 sm:p-10 lg:p-12 shadow-xs"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* LEFT SIDE: Heading & Call to Action */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6">
            <span className="text-[11px] font-extrabold tracking-widest text-blue-600 uppercase mb-3 block">
              PARTNER ECONOMICS
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
              From client relationship to{' '}
              <span className="text-blue-600">revenue layer.</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-sm font-normal">
              Fintech Connect is designed for partners who already have trust,
              distribution or payment volume, and want to monetise that access
              under their own brand.
            </p>

            <button className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-full border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer">
              <span>See example models</span>
              <ArrowRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          {/* RIGHT SIDE: Animated Shuffle Cards */}
          <div className="lg:col-span-8 w-full">
            <div className="flex flex-col sm:flex-row items-stretch justify-between gap-1.5 sm:gap-0">
              {cardData.map((card, index) => {
                // Stack offset calculations when hidden (semi-stacked to the left)
                const stackedOffsetX = (cardData.length - 1 - index) * -60;
                const stackedOffsetY = (cardData.length - 1 - index) * 8;
                const transitionDelay = `${index * 140}ms`;

                return (
                  <React.Fragment key={card.stepNumber}>
                    {/* CARD ITEM */}
                    <div
                      className={`w-full sm:flex-1 min-h-[250px] sm:min-h-[270px] sm:min-w-[210px] rounded-xl p-6 flex flex-col justify-start transition-all duration-700 ease-out transform-gpu shrink-0 ${
                        card.isHighlighted
                          ? 'bg-[#003bd1] text-white shadow-xl'
                          : 'bg-white text-slate-900 border border-slate-100 shadow-xs'
                      }`}
                      style={{
                        transitionDelay,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible
                          ? 'translate3d(0, 0, 0) scale(1)'
                          : `translate3d(${stackedOffsetX}px, ${stackedOffsetY}px, 0) scale(0.92)`,
                      }}
                    >
                      {/* STEP NUMBER BADGE */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-8 shrink-0 ${
                          card.isHighlighted
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {card.stepNumber}
                      </div>

                      {/* CARD CONTENT */}
                      <div className="space-y-2.5">
                        <h3
                          className={`font-bold text-base sm:text-lg leading-snug ${
                            card.isHighlighted ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {card.title}
                        </h3>
                        <p
                          className={`text-xs leading-relaxed font-normal ${
                            card.isHighlighted
                              ? 'text-blue-100'
                              : 'text-slate-500'
                          }`}
                        >
                          {card.description}
                        </p>
                      </div>
                    </div>

                    {/* SEPARATOR CHEVRON BETWEEN CARDS */}
                    {index < cardData.length - 1 && (
                      <div
                        className="hidden sm:flex items-center justify-center shrink-0 transition-opacity duration-500 px-0.5"
                        style={{
                          transitionDelay: `${(index + 1) * 140}ms`,
                          opacity: isVisible ? 1 : 0,
                        }}
                      >
                        <div className="w-5 h-5 rounded-full bg-blue-50/80 flex items-center justify-center shrink-0">
                          <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}