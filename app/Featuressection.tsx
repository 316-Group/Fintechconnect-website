import React from 'react';
import { TrendingUp, Lock, Zap, Globe, BarChart3, Shield } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Monitor your transactions and balances with instant updates and comprehensive insights.',
      image: '/feature-analytics.png',
    },
    {
      icon: Lock,
      title: 'Bank-Grade Security',
      description: 'Enterprise-level encryption and compliance with international security standards.',
      image: '/feature-security.png',
    },
    {
      icon: Zap,
      title: 'Instant Transfers',
      description: 'Send and receive funds globally in seconds with competitive exchange rates.',
      image: '/feature-transfers.png',
    },
    {
      icon: Globe,
      title: 'Multi-Currency Support',
      description: 'Manage accounts in 50+ currencies with real-time conversion rates.',
      image: '/feature-currency.png',
    },
    {
      icon: BarChart3,
      title: 'Advanced Reporting',
      description: 'Generate detailed reports for compliance, audits, and strategic planning.',
      image: '/feature-reporting.png',
    },
    {
      icon: Shield,
      title: 'Fraud Protection',
      description: 'AI-powered detection systems to protect your accounts and transactions.',
      image: '/feature-fraud.png',
    },
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-8">
        {/* Heading Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Build from scratch,
            <span className="text-blue-600">launch in weeks.</span>
          </h2>
          <p className="text-center text-slate-600">
            Our global account allows you to easily convert funds between different assets,
            either manually or automatically, ensuring access to favorable exchange rates 
            and seamless international transactions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative"
                style={{
                  animation: `slideUp 0.6s ease-out ${index * 0.08}s both`,
                }}
              >
                {/* Card Container */}
                <div className="relative h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col">
                  {/* Image Area */}
                  <div className="relative w-full h-48 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden border-b border-slate-200 group-hover:from-slate-200 group-hover:to-slate-100 transition-colors duration-300">
                    {/* Placeholder for product screenshot */}
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback: show gradient with icon if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Icon placeholder when image is not available */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                      <Icon size={48} className="text-blue-400 opacity-40" />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Icon Badge */}
                    <div className="inline-flex p-2.5 rounded-lg bg-blue-100 text-blue-600 mb-4 w-fit group-hover:bg-blue-200 transition-colors duration-300">
                      <Icon size={20} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed flex-grow">
                      {feature.description}
                    </p>

                    {/* Bottom accent line */}
                    <div className="mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-semibold text-blue-600">Learn more →</span>
                    </div>
                  </div>
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