"use client";
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPath } from '@/utils/helper';

// Data structure
const categories = [
  {
    title: 'Fintechs',
    items: [
      { name: 'Fintech Startups', desc: 'Launch your MVP with pre-built modules, ready-made UI, and out-of-the-box compliance — no infrastructure build required.', image: '/cards/fintech.png' },
      { name: 'Neobanks', desc: 'Full-stack digital banking infrastructure with real-time ledger, multi-bank rails, and a white-label mobile app built for scale.', image: '/cards/neobanks.png' },
      { name: 'Digital Wallet Providers', desc: 'Launch branded fiat and crypto wallets with instant P2P transfers, flexible top-ups, and a white-label SDK ready to embed.', image: '/cards/digitalwallet.png' },
      { name: 'Money Transfer Services', desc: 'Move money across borders with multi-currency FX, global payout rails, and automated AML screening built in from day one.', image: '/cards/moneytransfer.png' },
    ]
  },
  {
    title: 'Banking',
    items: [
      { name: 'Commercial & Retail Banks', desc: 'Modernise without replacing your legacy core. Add digital accounts, real-time payments, and card and crypto capabilities  — in weeks.', image: '/cards/commercial.png' },
      { name: 'Payment Service Providers', desc: 'Utilize Fintech Connect to offer seamless payment solutions.', image: '/cards/PSPs.png' },
      { name: 'Credit Unions', desc: 'Upgrade your member experience on any budget. Modern mobile banking, digital lending, and seamless onboarding — built for community-first institutions.', image: '/cards/creditunions.png' },
      { name: 'Insurance Companies', desc: 'Offer innovative insurance products while maintaining regulatory compliance.', image: '/cards/insurancecompanies.png' },
    ]
  },
  {
    title: 'Crypto',
    items: [
      { name: 'Crypto & Web3 Banks', desc: 'Bridge DeFi and traditional finance with MPC wallets, fiat on/off ramps, and on-chain compliance — in one regulated platform.', image: '/cards/web3.png' },
      { name: 'Crypto Cards', desc: 'Issue branded crypto-linked Visa or Mastercard cards with real-time fiat-to-crypto authorization and granular spend controls.', image: '/cards/finance.png' },
      { name: 'Crypto Wallets', desc: 'Deploy MPC-secured, multi-chain custodial wallets with hot/cold storage tiering and compliance tools built directly in.', image: '/cards/digitalwallet.png' },
      { name: 'Crypto Exchanges', desc: 'Add fiat on/off ramps and real-time settlement to your exchange with institutional liquidity and integrated KYC/AML.', image: '/cards/moneytransfer.png' },
    ]
  },
  {
    title: 'Payments',
    items: [
      { name: 'Payment Service Providers (PSPs)', desc: '	Connect to global payment rails, issue payout cards, and manage high-volume cross-border settlements — all from one platform.', image: '/cards/payments.png' },
      { name: 'Merchant Acquirers', desc: 'Accept payments in 180+ countries with a locally optimised checkout experience, real-time FX, and built-in fraud protection.', image: '/cards/insurance.png' },
      { name: 'Embedded Finance Providers', desc: 'Embed financial services — accounts, cards, and lending — directly into any non-financial product via a single, powerful API.', image: '/cards/finance.png' },
      { name: 'Payment & Disbursement Platforms', desc: 'Automate mass payouts to employees, gig workers, and vendors globally. Multi-currency, compliant, and traceable at every step', image: '/cards/moneytransfer.png' },
    ]
  },
  {
    title: 'Insurance & Embedded Finance',
    items: [
      { name: 'Insurance Companies', desc: 'Issue claims payout cards, create policyholder wallets, and automate premium collections — all through a compliant, embedded finance layer.', image: '/cards/payments.png' },
      { name: 'Insurtech Startups', desc: 'Launch digital insurance products with embedded financial services from day one. KYC, wallets, and card issuance — pre-integrated and ready.', image: '/cards/crypto.png' },
      { name: 'Lending Platforms', desc: 'Disburse loans instantly to digital wallets or branded cards. Automate repayment collection with real-time ledger tracking and full audit trails', image: '/cards/insurance.png' },
      { name: 'BNPL Providers', desc: 'Power Buy Now Pay Later products with a compliant credit disbursement engine, real-time KYC, and virtual card issuance for instant spending.', image: '/cards/moneytransfer.png' },
    ]
  },
];

const Card = ({ item }: { item: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      // 1. Reduced mobile width to 75vw and mobile height to 220px. Desktop returns to 280px height.
      className="relative w-[75vw] sm:w-[45vw] md:w-[35vw] lg:w-[32vw] xl:w-[28vw] h-[220px] sm:h-[280px] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 snap-start border border-slate-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={getPath(item.image)} alt={item.name} className="w-full h-full object-cover" />

      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-black/60 z-10"
        initial={{ height: '30%' }}
        animate={{ height: isHovered ? '100%' : '30%' }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* 2. Reduced padding inside the card for mobile (bottom/left/right-4 vs sm:bottom-6) */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20">
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 5, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              // 3. Reduced text size and margin for mobile descriptions
              className="text-slate-200 text-xs sm:text-sm leading-relaxed mt-1 sm:mt-2"
            >
              <h3 className="text-white text-lg sm:text-xl font-bold mb-1">{item.name}</h3>
              {item.desc}
            </motion.div>
          )}
          {!isHovered && (
            <div className="text-white text-lg sm:text-xl font-bold">{item.name}</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CarouselRow = ({ category }: { category: any }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 400;
      const scrollAmount = cardWidth + 12;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-12">
      {/* 4. Swapped pr-20 to pr-6 lg:pr-20 for responsive padding */}
      <div className="flex justify-between items-center mb-4 pr-6 lg:pr-20">
        <h3 className="text-lg sm:text-xl font-medium text-[#0066ff]">{category.title}</h3>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 bg-slate-900 rounded-full hover:bg-blue-600 transition"><ChevronLeft size={18} /></button>
          <button onClick={() => scroll('right')} className="p-2 bg-slate-900 rounded-full hover:bg-blue-600 transition"><ChevronRight size={18} /></button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        // 5. Responsive right padding inside the scroll track
        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth snap-x pb-4 pr-6 lg:pr-20"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {category.items.map((item: any, i: number) => <Card key={i} item={item} />)}
      </div>
    </div>
  );
};

export default function CarouselSection() {
  const [showAll, setShowAll] = useState(false);
  const visibleCategories = showAll ? categories : categories.slice(0, 3);

  return (
    <section className="bg-[#0a0a0a] py-16 md:py-24 text-white overflow-hidden">
      {/* 6. Responsive left padding for the entire section wrapper */}
      <div className="w-full pl-6 lg:pl-20">
        
        {/* 7. Responsive right padding for the text container */}
        <div className="pr-6 lg:pr-20">
          <h2 className="md:text-center text-3xl md:text-4xl font-bold mb-4">
            Fintech Connect powers <span className="text-blue-500">innovators</span>
          </h2>
          <p className="mt-4 md:mt-6 md:text-center text-slate-400 mb-12 md:mb-16 max-w-3xl mx-auto text-sm md:text-base">
            Fintech Connect gives your team a modular, pre-integrated platform of financial building blocks. Pick the modules you need, configure them to your brand, and go live with a fully regulated fintech product.
          </p>
        </div>

        {visibleCategories.map((cat, idx) => (
          <CarouselRow key={idx} category={cat} />
        ))}

        {/* 8. Responsive padding for the button wrapper */}
        <div className="flex justify-center mt-8 md:mt-12 pr-6 lg:pr-20">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-white font-semibold text-base md:text-lg border-b border-white pb-1 hover:text-blue-400 hover:border-blue-400 transition-colors"
          >
            {showAll ? 'Show less' : 'View all'}
          </button>
        </div>
      </div>
    </section>
  );
}