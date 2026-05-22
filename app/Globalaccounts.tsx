import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { getPath } from '@/utils/helper';


export default function GlobalAccountsSection() {
  const features = [
    'Flexible and global',
    'Corporate and personal accounts',
    'Employee roles and access customization',
    'Multiple regions and currencies to choose from',
  ];

  return (
    <section className="bg-white text-black py-16 lg:py-24 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Top Title */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-slate-900">
            <span className="text-blue-500">Global</span> Accounts
          </h2>
        </div>

        {/* Core Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 lg:mb-28">
          
          {/* Left Column: Copy Content & Feature List */}
          <div className="flex flex-col items-start max-w-xl order-2 lg:order-1">
            <h3 className="text-2xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-[1.2] mb-4">
              Our global account is{' '}
              <span className="text-blue-500">your bridge</span> to international
              business & personal finance
            </h3>
            
            <p className="text-slate-500 text-xs lg:text-sm leading-relaxed mb-8 font-light">
              It grants you access to multiregional accounts, tailored to your business needs. 
              Enjoy convenient mobile and web interfaces for effortless asset management. 
              Leverage stability and convenience by making payments in multiple currencies.
            </p>

            {/* Custom Plus Icon Feature Items */}
            <ul className="space-y-4 w-full">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3.5 text-slate-900 font-medium text-sm lg:text-base">
                  <Plus className="w-5 h-5 text-blue-500 stroke-[3]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Dashboard Mockup Asset Placeholder */}
          <div className="relative w-full max-w-xl mx-auto lg:mx-0 order-1 lg:order-2">
            {/*image*/}
              <img 
                src={getPath("/globalaccounts image.png")} 
                alt="Latest transactions overview ledger interface" 
                className="w-full h-full object-contain object-center"
              />
          </div>

        </div>

        {/* Lower Banner Callout Box */}
        <div className="w-full bg-[#f0f4ff] rounded-[32px] px-8 py-10 lg:py-14 lg:px-16 text-center max-w-7xl mx-auto flex flex-col items-center justify-center shadow-sm border border-blue-100/20">
          <p className="text-slate-900 text-base lg:text-2xl font-medium tracking-tight max-w-4xl leading-snug mb-8">
            <span className="text-blue-500 font-semibold">Send and receive</span> funds seamlessly 
            through various channels, with the control and transparency you expect from a 
            cutting-edge financial service.
          </p>
          
          {/* Action Button with Arrow Icon */}
          <button className="bg-black hover:bg-slate-800 text-white text-sm lg:text-base font-semibold py-3.5 px-8 rounded-full transition-all flex items-center gap-2 group shadow-md active:scale-95">
            <span>Get started</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
}