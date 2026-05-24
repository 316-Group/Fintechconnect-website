import React from 'react';

export default function BenefitsSection() {
  // Structured to separate the blue highlight from the dark text
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
    // 1. Replaced bg-gray-300 with the exact light lavender tint matching your design
    <section className="relative py-16 lg:py-24 bg-[#ebefff] overflow-hidden">
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
              className="relative px-8 lg:px-12 text-center py-6 lg:py-2"
            >
              {/*White Vertical Dividers between columns */}
              {index > 0 && (
                <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-32 w-1 bg-white"></div>
              )}

              {/* Content Block */}
              <div className="flex flex-col items-center">
                
                {/* 3. Two-Tone Split Title (Blue prefix + Dark suffix) */}
                <h3 className="text-xl lg:text-2xl font-semibold text-slate-900 mb-4">
                  <span className="text-[#0066ff]">{benefit.highlight}</span>{' '}
                  {benefit.text}
                </h3>

                {/* 4. Exact copy-matched descriptions */}
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