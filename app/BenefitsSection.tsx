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
    <section className="relative py-6 lg:py-10 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-8">
        {/* Heading */}
        <div className="text-center mb-4 lg:mb-8">
          <h2 className="text-2xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Your fintech,
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              powered by us
            </span>
            </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative"
                style={{
                  animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >

                {/* Card */}
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 group-hover:shadow-xl h-full">
                  {/* Icon background */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${benefit.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`}
                  ></div>

                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${benefit.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/0 via-white/50 to-white/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full"></div>
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