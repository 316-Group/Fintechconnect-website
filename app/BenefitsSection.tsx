"use client"; // Enforce client-side rendering for scroll tracking hooks

import React, { useState, useEffect, useRef } from 'react';

export default function BenefitsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger the animation sequence when the section enters the viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Clean up and disconnect tracking once triggered to optimize memory
          if (containerRef.current) observer.unobserve(containerRef.current);
        }
      },
      { threshold: 0.7 } // Trigger when 70% of the section is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const benefits = [
    {
      highlight: '6x',
      text: 'Faster',
      description: 'Than the industry average to go live with a new fintech product.',
    },
    {
      highlight: 'No',
      text: 'limits',
      description: 'Leverage the professional services provided by our team to build a bespoke solution.',
    },
    {
      highlight: '50 +',
      text: 'Integrations',
      description: 'Get instant access to payments and compliance services provided by the leading companies.',
    },
  ];

  return (
    <section 
      ref={containerRef} 
      className="relative py-16 lg:py-24 bg-[#ebefff] overflow-hidden"
    >
      <div className="w-full px-6 lg:px-6 max-w-[92.5%] mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-12 lg:mb-20">
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight">
            Your Fintech,{' '}
            <span className="text-[#0066ff]">
              powered by us
            </span>
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid lg:grid-cols-3 gap-0">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`relative px-8 lg:px-12 text-center py-6 lg:py-2 transition-all duration-700 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12 pointer-events-none'
              }`}
              // Creates a 200ms cascade delay between each column sequence
              style={{ transitionDelay: `${index * 500}ms` }}
            >
              {/* White Vertical Dividers between columns */}
              {index > 0 && (
                <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-32 w-1 bg-white"></div>
              )}

              {/* Content Block */}
              <div className="flex flex-col items-center">
                
                {/* Two-Tone Split Title */}
                <h3 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-4">
                  <span className="text-[#0066ff]">{benefit.highlight}</span>{' '}
                  {benefit.text}
                </h3> 

                {/* Descriptions */}
                <p className="text-slate-500 text-sm lg:text-[15px] leading-relaxed max-w-sm">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}