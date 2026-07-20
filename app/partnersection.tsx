"use client";

import React from "react";
import { getPath } from "@/utils/helper";

interface PartnerCard {
  id: string;
  title: string;
  description: string;
  image: string;
}

const partnerCards: PartnerCard[] = [
  {
    id: "banking-rails",
    title: "Banking Rails",
    description:
      "Connect to leading banking infrastructure providers for seamless account opening, fund settlement, and multi-currency operations across global markets.",
    image: '/partners/bankingrails.png',
  },
  {
    id: "card-networks",
    title: "Card Networks",
    description:
      "Issue and manage physical and virtual cards through the world's most trusted card networks and processors — from Visa and Mastercard to next-gen issuing platforms.",
    image: '/partners/cardnetworks.png',
  },
  {
    id: "compliance-kyc",
    title: "Compliance & KYC",
    description:
      "Automate identity verification, AML screening, and regulatory compliance with best-in-class KYC/KYB providers — onboard customers faster without compromising on risk.",
    image: '/partners/compliance.png',
  },
  {
    id: "crypto-custody",
    title: "Crypto Custody",
    description:
      "Secure digital assets with institutional-grade custody solutions, MPC wallets, hot/cold storage tiering, and on-chain monitoring — all integrated out of the box.",
    image: '/partners/crypto.png',
  },
  {
    id: "mobile-money",
    title: "Mobile Money Networks",
    description:
      "Reach customers across Africa and emerging markets through pre-integrated mobile money rails — from MTN MoMo and M-Pesa to Wave and Flutterwave.",
    image: '/partners/mobilemoney.png',
  },
  {
    id: "payments",
    title: "Payments",
    description:
      "Process domestic and cross-border payments at scale. Accept, route, and settle funds across 60+ currencies through a unified payments infrastructure layer.",
    image: '/partners/payments.png',
  },
];

export default function PartnerSection() {
  return (
    <section className="bg-[#f8f9fa] text-slate-900 py-20 md:py-28 px-6 md:px-12 lg:px-20">
      <div className="max-w-full mx-auto">
        
        {/* HEADER SECTION */}
        <div className="max-w-4xl mb-16 md:mb-20">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Our Partner Network
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-slate-900">
            <span className="text-blue-600">50+</span> Pre-integrated partners
          </h2>
          <p className="text-slate-600 text-lg md:text-xl font-normal leading-relaxed max-w-3xl">
            Fintech Connect ships with pre-built connectors to the world's leading
            banking, payments, compliance, and crypto infrastructure providers. No
            custom integration work required.
          </p>
        </div>

        {/* 3x2 CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partnerCards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              {/* TOP HALF: Lavender-Blue Graphic Container Placeholder */}
              {/* Replace the entire inner div below with your image tag or component when ready */}
              <div className="h-56 bg-[#eef0ff] flex items-center justify-center relative overflow-hidden">
  <img
    src={getPath(card.image)} // Use getPath(card.image) or card.image directly
    alt={card.title}
    className="w-full h-full object-contain p-4" 
  />
</div>

              {/* BOTTOM HALF: Text Content Details */}
              <div className="p-8 md:p-10 flex flex-col flex-grow bg-white">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-normal flex-grow">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}