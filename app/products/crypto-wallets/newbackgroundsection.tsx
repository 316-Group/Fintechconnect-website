import React, { useEffect, useRef, useState } from 'react';
import { getPath } from "@/utils/helper";

interface StatItem {
  value: string;
  label: string;
  isBlue?: boolean;
}

const statsData: StatItem[] = [
  {
    value: '200+',
    label: 'PREBUILT UI COMPONENTS',
  },
  {
    value: '100%',
    label: 'WCAG AAA & ACCESSIBLE',
    isBlue: true,
  },
  {
    value: '3x',
    label: 'FASTER TIME TO MARKET',
  },
  {
    value: 'iOS & Web',
    label: 'AVERAGE RESPONSE LATENCY',
    isBlue: true,
  },
  {
    value: '$40B+',
    label: 'DAY ONE PRODUCTION READINESS',
  },
];

export default function NewBackgroundSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect after triggering so it only animates once
        }
      },
      { 
        threshold: 0.2, // Trigger when 20% of the section is visible in the viewport
        rootMargin: '0px 0px -50px 0px' // Slight offset so it triggers just before it's fully centered
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative max-w-full h-[530px] md:h-[400px] bg-[#050508] overflow-hidden flex items-center justify-center font-sans"
    >
      {/* Background Image */}
      <img 
        src={getPath("/products/newbackground.jpg")}
        alt="White Label Banking Experience Preview"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-full mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-0">
          
          {statsData.map((stat, index) => {
            const showDivider = index === 0 || index === 1 || index === 3;

            return (
              <div 
                key={index} 
                className={`
                  flex flex-col items-center text-center flex-1 relative 
                  transition-all duration-700 ease-out transform
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                // Inline style used for dynamic delay to avoid Tailwind CSS purging dynamic class names
                style={{ transitionDelay: `${index * 180}ms` }}
              >
                {/* Value */}
                <h3 
                  className={`text-4xl md:text-5xl font-bold mb-3 tracking-tight ${
                    stat.isBlue ? 'text-[#2b5bf6]' : 'text-white'
                  }`}
                >
                  {stat.value}
                </h3>
                
                {/* Label */}
                <p className="text-[10px] md:text-xs text-gray-400 font-medium tracking-wider uppercase">
                  {stat.label}
                </p>

                {/* Vertical Divider */}
                {showDivider && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gray-800/80" />
                )}
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}