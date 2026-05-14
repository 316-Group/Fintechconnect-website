import React from 'react';
import { Zap, Infinity, PlugIcon } from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Zap,
      title: '6x faster',
      description: 'Deploy banking solutions in weeks, not years. Get to market faster than ever before.',
      color: 'from-amber-400 to-orange-400',
    },
    {
      icon: Infinity,
      title: 'No limits',
      description: 'Leverage the professional services and support of our team to build the fintech you envision, without constraints.',
      color: 'from-blue-400 to-cyan-400',
    },
    {
      icon: PlugIcon,
      title: '50+ integrations',
      description: 'Get instant access to payment and compliance services provided by the leading companies.',
      color: 'from-emerald-400 to-teal-400',
    },
  ];

  return (
    <section className="relative py-6 lg:py-10 bg-gray-300 overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-4 lg:mb-8">
          <h2 className="text-2xl lg:text-5xl font-semibold text-slate-800 mb-4 leading-tight">
            Your Fintech,
            <span className="bg-blue-600 bg-clip-text text-transparent">
              powered by us
            </span>
            </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid lg:grid-cols-3 gap-0 lg:gap-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative px-6 lg:px-0"
                style={{
                  animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* White vertical separator line (visible between columns) */}
                {/*{index > 0 && index % 3 !== 0 && (
                  <div className="hidden lg:block absolute left-0 top-1/4 bottom-1/4 w-px bg-white/40"></div>
                )}*/}
 
                {/* Content - no card background */}
                <div className="relative py-8 lg:py-0 text-center">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${benefit.color} text-slate-800 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} />
                  </div>
 
                  {/* Title */}
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-3">
                    {benefit.title}
                  </h3>
 
                  {/* Description */}
                  <p className="text-slate-800 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}