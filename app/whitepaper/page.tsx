"use client";

import React, { useState } from 'react';
import { getPath } from '@/utils/helper';
import Navbar from '@/app/navbar';
import FooterSection from '../Footersection';

export default function WhitepaperSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    companyName: '',
    role: '',
    institutionType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-white">
      <Navbar />
      <section className="bg-white py-12 md:py-20 px-4 sm:px-6 lg:px-12 font-sans text-slate-900">
      <div className="max-w-full md:p-12 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* LEFT COLUMN: Content & Details */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          
          {/* Tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span className="text-sm font-semibold text-slate-700">
              Security Documentation
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
            Security Architecture & <br />
            <span className="text-blue-600">Compliance Whitepaper</span>
          </h1>

          {/* Description */}
          <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
            A comprehensive 42-page technical document covering Fintech Connect's full security architecture, certification framework, penetration testing results, data residency policies, and incident response procedures.
          </p>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              PCI-DSS Level 1
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              ISO 27001
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              SOC 2 Type II
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-700">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              GDPR Compliant
            </div>
          </div>

          {/* Bullet Points */}
          <ul className="space-y-4 text-slate-800 font-medium text-base md:text-lg">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
              <span>42 pages of technical security documentation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
              <span>Full encryption and data residency architecture</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
              <span>MPC crypto custody security model</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
              <span>Penetration testing methodology and findings summary</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
              <span>P1-P4 incident response SLA framework</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
              <span>Regulatory compliance mapping (PCI-DSS, ISO 27001, SOC 2, GDPR)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0"></span>
              <span>Third-party audit and certification status</span>
            </li>
          </ul>

        </div>

        {/* RIGHT COLUMN: Preview Header + Form */}
        <div className="lg:col-span-5 w-full bg-slate-100/70 rounded-3xl overflow-hidden border border-slate-200/60 shadow-xl shadow-slate-200/50">
          
          {/* Top Blue Container for Preview Image */}
          <div className="bg-blue-600 pb-0 sm:pt-10 pb-0 flex justify-center min-h-[full] relative overflow-hidden">
            {/* Swap the src string below with your image asset path when ready */}
            <img 
              src={getPath('/whitepaper.png')} 
              alt="Security Architecture Whitepaper Preview" 
              className="w-full max-w-[full] px-12 h-full object-cover rounded-xl shadow-2xl"
            />
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Download the Whitepaper
            </h3>
            <p className="text-slate-600 text-sm mt-1 mb-12">
              Instant access - sent to your work email
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Mike"
                    required
                    className="w-full bg-slate-200/80 text-slate-900 placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Daniel"
                    required
                    className="w-full bg-slate-200/80 text-slate-900 placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  name="workEmail"
                  value={formData.workEmail}
                  onChange={handleChange}
                  placeholder="Mike123@company.com"
                  required
                  className="w-full bg-slate-200/80 text-slate-900 placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your company"
                  required
                  className="w-full bg-slate-200/80 text-slate-900 placeholder-slate-400 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-200/80 text-slate-900 appearance-none text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all invalid:text-slate-400"
                  >
                    <option value="" disabled hidden>
                      Select your role
                    </option>
                    <option value="cto_ciso">CTO / CISO / Head of Security</option>
                    <option value="developer">Engineering / Product Lead</option>
                    <option value="compliance">Compliance / Risk Officer</option>
                    <option value="executive">Executive / Business Lead</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Institution Type Select */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Institution Type
                </label>
                <div className="relative">
                  <select
                    name="institutionType"
                    value={formData.institutionType}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-200/80 text-slate-900 appearance-none text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all invalid:text-slate-400"
                  >
                    <option value="" disabled hidden>
                      Select institution type
                    </option>
                    <option value="psp">Payment Service Provider (PSP)</option>
                    <option value="fintech">Fintech / Neobank</option>
                    <option value="bank">Commercial Bank / Credit Union</option>
                    <option value="insurance">Insurance Company</option>
                    <option value="enterprise">Enterprise Merchant</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-600/30 text-sm mt-4 active:scale-[0.99]"
              >
                Download Whitepaper
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
        <FooterSection />
    </div>
  );
}