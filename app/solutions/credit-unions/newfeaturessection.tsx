import React from 'react';
import { getPath } from '@/utils/helper';

const features = [
  {
    iconPath: '/icons/speed icon.png',
    title: 'Launch in 6 – 8 Weeks',
    description: 'Our pre-built modules eliminate the infrastructure groundwork. Your team focuses on member experience — we handle the compliance, integrations, and infrastructure. No lengthy procurement cycles.',
  },
  {
    iconPath: '/icons/cost icon.png', 
    title: 'Member-Centric by Design',
    description: 'Every module is built to enhance the member relationship — from personalised savings nudges to proactive loan alerts. AI-powered insights help your team serve members before they even ask.',
  },
  {
    iconPath: '/icons/flexible icon.png', 
    title: 'Affordable Modular Pricing',
    description: 'Pay only for the modules you use. Our SaaS pricing model is designed for credit unions of all sizes — from community cooperatives to regional institutions with tens of thousands of members.',
  },
  {
    iconPath: '/icons/compliance icon.png',
    title: 'Pre-Certified Compliance',
    description: 'Every module ships with FCA-aligned, PCI-DSS Level 1, and GDPR compliance built in. Your credit union inherits our certifications — no separate audit cycles or dedicated compliance teams required.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-blue-50/40 py-16 md:py-24">
      <div className="w-full px-3 lg:px-6 max-w-[92.5%] mx-auto">
        
        <div className="mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Compete with neobanks <br className="hidden md:inline" />
            without losing <span className="text-blue-600">what makes you special</span>
          </h2>
          
          <p className="mt-4 max-w-3xl text-base md:text-lg text-gray-600 leading-relaxed">
            Credit unions that partner with Fintech Connect retain their member-first identity while delivering the digital experience members expect.
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