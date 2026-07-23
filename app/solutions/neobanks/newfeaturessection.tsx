import React from 'react';
import { getPath } from '@/utils/helper';

const features = [
  {
    iconPath: '/icons/speed icon.png',
    title: 'Claims Settled in Hours, Not Days',
    description: 'Real-time claims disbursement to policyholder wallets or bank accounts reduces average settlement time from 3–5 days to under 4 hours — dramatically improving policyholder satisfaction and retention.',
  },
  {
    iconPath: '/icons/cost icon.png', 
    title: 'AI Fraud Prevention Built In',
    description: 'Our AI fraud engine scores every claim and premium transaction in under 50ms. Detect coordinated fraud rings, velocity attacks, and anomalous behaviour before payments are processed.',
  },
  {
    iconPath: '/icons/flexible icon.png', 
    title: 'New Revenue via Embedded Finance',
    description: 'Embed savings accounts, virtual cards, and micro-lending into your insurance products. Increase policyholder lifetime value and create new revenue streams without becoming a bank.',
  },
  {
    iconPath: '/icons/compliance icon.png',
    title: 'Deploy in 4 - 8 Weeks',
    description: 'Our pre-built modules integrate with your existing insurance platform via API — no core system replacement required. Go live with premium wallets, claims payments, and fraud monitoring in weeks.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-blue-50/40 py-16 md:py-24">
      <div className="w-full px-3 lg:px-6 max-w-[92.5%] mx-auto">
        
        <div className="mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Settle claims faster, collect premiums <br className="hidden md:inline" />
            smarter, grow with <span className="text-blue-600">embedded finance</span>
          </h2>
          
          <p className="mt-4 max-w-3xl text-base md:text-lg text-gray-600 leading-relaxed">
            Insurance companies that partner with Fintech Connect reduce operational costs, improve policyholder satisfaction, and unlock new revenue streams.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <img 
                    src={getPath(feature.iconPath)} 
                    alt={`${feature.title} icon`} 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed flex-grow">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;