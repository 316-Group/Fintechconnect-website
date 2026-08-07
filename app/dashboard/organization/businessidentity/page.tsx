"use client";

import React, { useState } from "react";
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  UserCheck, 
  FileText, 
  Eye, 
  Info, 
  MessageSquare, 
  HelpCircle,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

export default function BusinessIdentity() {
  const [formData, setFormData] = useState({
    legalName: "",
    dbaName: "",
    registrationNumber: "",
    country: "United States",
    industry: "",
    houseNumber: "",
    addressLine2: "",
    streetName: "",
    town: "",
    postCode: "",
    addressCountry: "United States"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Check that all required fields (excluding optional dbaName and addressLine2) are filled
  const isFormValid = Boolean(
    formData.legalName.trim() &&
    formData.registrationNumber.trim() &&
    formData.country.trim() &&
    formData.industry.trim() &&
    formData.houseNumber.trim() &&
    formData.streetName.trim() &&
    formData.town.trim() &&
    formData.postCode.trim() &&
    formData.addressCountry.trim()
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 pl-0 pr-4 py-5 border-b border-slate-100">
            <svg width="150" height="50" viewBox="100 0 150 201" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.0129111 -0.999917 -0.999917 -0.0129111 353.906 103.367)" fill="#0A63F8"/>
              <path d="M49.302 120.528C45.9887 120.528 42.8654 119.937 39.9321 118.755C36.9987 117.552 34.4874 115.928 32.3982 113.88C30.3089 111.833 28.6629 109.385 27.46 106.537C26.2571 103.666 25.6556 100.606 25.6556 97.3565C25.6556 94.1066 26.2571 91.0572 27.46 88.2082C28.6629 85.3382 30.3089 82.8796 32.3982 80.8326C34.4874 78.7856 36.9987 77.1712 39.9321 75.9894C42.8654 74.8076 45.9887 74.2167 49.302 74.2167C53.4593 74.2167 57.2579 75.1136 60.6978 76.9074C64.1587 78.68 66.9549 81.1386 69.0864 84.283L60.3812 89.6644C59.1572 87.8706 57.5745 86.4566 55.633 85.4226C53.6915 84.3885 51.5811 83.8715 49.302 83.8715C45.5034 83.8715 42.3273 85.1588 39.7738 87.7334C37.2203 90.2869 35.9435 93.4946 35.9435 97.3565C35.9435 101.218 37.2203 104.437 39.7738 107.011C42.3273 109.565 45.5034 110.842 49.302 110.842C51.6022 110.842 53.7126 110.335 55.633 109.322C57.5745 108.288 59.1572 106.874 60.3812 105.08L69.0864 110.462C66.9549 113.606 64.1587 116.075 60.6978 117.869C57.2579 119.642 53.4593 120.528 49.302 120.528ZM89.3773 120.528C84.2914 120.528 80.039 118.871 76.6203 115.558C73.2226 112.245 71.5238 108.13 71.5238 103.213C71.5238 98.2956 73.2226 94.1805 76.6203 90.8672C80.039 87.554 84.2914 85.8974 89.3773 85.8974C92.7327 85.8974 95.7716 86.6571 98.4939 88.1766C101.216 89.6749 103.348 91.7536 104.888 94.4126C106.429 97.0505 107.199 99.9839 107.199 103.213C107.199 106.442 106.429 109.385 104.888 112.044C103.348 114.682 101.216 116.761 98.4939 118.281C95.7716 119.779 92.7327 120.528 89.3773 120.528ZM83.5844 109.037C85.1249 110.599 87.0559 111.38 89.3773 111.38C91.6987 111.38 93.6296 110.599 95.1702 109.037C96.7107 107.476 97.481 105.534 97.481 103.213C97.481 100.891 96.7107 98.9498 95.1702 97.3882C93.6296 95.8265 91.6987 95.0457 89.3773 95.0457C87.0559 95.0457 85.1249 95.8265 83.5844 97.3882C82.0439 98.9498 81.2736 100.891 81.2736 103.213C81.2736 105.534 82.0439 107.476 83.5844 109.037ZM132.302 85.8974C136.1 85.8974 139.16 87.0475 141.482 89.3478C143.803 91.627 144.964 94.6659 144.964 98.4645V119.737H135.499V101.662C135.499 99.6568 134.908 98.0529 133.726 96.8501C132.565 95.6472 131.014 95.0457 129.073 95.0457C127.047 95.0457 125.401 95.6683 124.135 96.9134C122.889 98.1374 122.267 99.7623 122.267 101.788V119.737H112.802V86.6888H122.267V89.9809C124.926 87.2586 128.271 85.8974 132.302 85.8974ZM171.364 85.8974C175.162 85.8974 178.222 87.0475 180.544 89.3478C182.865 91.627 184.026 94.6659 184.026 98.4645V119.737H174.561V101.662C174.561 99.6568 173.97 98.0529 172.788 96.8501C171.628 95.6472 170.077 95.0457 168.135 95.0457C166.109 95.0457 164.463 95.6683 163.197 96.9134C161.952 98.1374 161.329 99.7623 161.329 101.788V119.737H151.864V86.6888H161.329V89.9809C163.988 87.2586 167.333 85.8974 171.364 85.8974ZM223.975 103.339C223.975 104.479 223.911 105.471 223.785 106.315H199.157C199.748 108.172 200.793 109.628 202.291 110.683C203.789 111.738 205.572 112.266 207.641 112.266C209.413 112.266 211.028 111.918 212.484 111.221C213.94 110.525 215.09 109.649 215.934 108.594L222.297 114.102C220.503 116.128 218.319 117.711 215.744 118.85C213.17 119.969 210.384 120.528 207.387 120.528C202.133 120.528 197.743 118.861 194.219 115.527C190.716 112.171 188.964 108.003 188.964 103.023C188.964 99.8362 189.724 96.9345 191.243 94.3176C192.784 91.7008 194.905 89.6433 197.606 88.1449C200.307 86.6466 203.304 85.8974 206.596 85.8974C211.555 85.8974 215.692 87.554 219.005 90.8672C222.318 94.1805 223.975 98.3378 223.975 103.339ZM206.469 94.0644C204.697 94.0644 203.146 94.6025 201.816 95.6788C200.487 96.734 199.579 98.1796 199.094 100.016H213.94C213.412 98.1585 212.484 96.7023 211.154 95.6472C209.825 94.592 208.263 94.0644 206.469 94.0644ZM245.31 120.528C240.224 120.528 235.972 118.871 232.553 115.558C229.155 112.245 227.457 108.13 227.457 103.213C227.457 98.2956 229.155 94.1805 232.553 90.8672C235.972 87.554 240.224 85.8974 245.31 85.8974C248.602 85.8974 251.588 86.636 254.268 88.1133C256.949 89.5694 259.059 91.5742 260.6 94.1277L252.369 99.1292C251.673 97.8841 250.702 96.8923 249.457 96.1536C248.212 95.415 246.83 95.0457 245.31 95.0457C242.989 95.0457 241.058 95.8265 239.517 97.3882C237.977 98.9498 237.206 100.891 237.206 103.213C237.206 105.534 237.977 107.476 239.517 109.037C241.058 110.599 242.989 111.38 245.31 111.38C246.83 111.38 248.212 111.01 249.457 110.272C250.702 109.533 251.673 108.541 252.369 107.296L260.6 112.266C259.059 114.841 256.949 116.867 254.268 118.344C251.588 119.8 248.602 120.528 245.31 120.528ZM285.987 95.299H277.503V107.423C277.503 110.061 278.886 111.38 281.65 111.38C283.022 111.38 284.467 110.989 285.987 110.208V119.104C284.109 120.053 281.998 120.528 279.656 120.528C275.773 120.528 272.861 119.494 270.919 117.426C268.999 115.337 268.038 112.519 268.038 108.974V95.299H263.037V86.6888H268.038V78.4901H277.503V86.6888H285.987V95.299Z" fill="black"/>
              <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.999793 -0.0203619 -0.0203619 0.999793 253.736 21.9693)" fill="#0A63F8"/>
              <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.849868 -0.526995 -0.526995 0.849868 302.125 28.4821)" fill="#0A63F8"/>
              <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.480664 -0.876905 -0.876905 0.480664 337.863 59.1159)" fill="#0A63F8"/>
              <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.503146 -0.864202 -0.864202 -0.503146 346.105 149.786)" fill="#0A63F8"/>
              <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.721529 -0.692385 -0.692385 -0.721529 324.629 178.293)" fill="#0A63F8"/>
              <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.900044 -0.435799 -0.435799 -0.900044 288.037 194.412)" fill="#0A63F8"/>
              <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.999533 -0.0305672 -0.0305672 -0.999533 248.223 200.014)" fill="#0A63F8"/>
            </svg>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <a href="/dashboard/organization/businessidentity" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-medium text-sm">
              <Building2 className="w-4 h-4" />
              Organization
            </a>
            <a href="/dashboard/organization/regulatorycompliance" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
              <ShieldCheck className="w-4 h-4" />
              Compliance
            </a>
            <a href="/dashboard/organization/verification" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
              <CheckCircle2 className="w-4 h-4" />
              Verification & KYB
            </a>
            <a href="/dashboard/organization/beneficialownership" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
              <UserCheck className="w-4 h-4" />
              Beneficial Ownership
            </a>
            <a href="/dashboard/organization/documents" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
              <FileText className="w-4 h-4" />
              Documents
            </a>
            <a href="/dashboard/organization/review" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
              <Eye className="w-4 h-4" />
              Review
            </a>
          </nav>
        </div>

        {/* Sidebar Footer Widget */}
        <div className="space-y-3">
          <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
            Save Progress
          </button>
          
          <div className="bg-slate-100 p-3 rounded-lg space-y-2">
            <div className="flex justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <span>Current Status</span>
              <span>25%</span>
            </div>
            <div className="text-xs font-medium text-slate-700">Step 1 of 4</div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-600 h-full w-1/4 rounded-full" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb & Header */}
        <div>
          <div className="text-xs text-slate-400 font-medium mb-1">
            Merchants &gt; New Onboarding &gt; <span className="text-slate-600">Business Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Establish Business Identity</h1>
          <p className="text-sm text-slate-500 mt-1">
            Provide the legal foundation for your institution. This data is used for regulatory compliance and network registration.
          </p>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between relative">
            <div className="flex flex-col items-center z-10">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                1
              </div>
              <span className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-wider">Organization</span>
            </div>
            
            <div className="flex-1 h-[2px] bg-slate-200 mx-2" />

            <div className="flex flex-col items-center z-10">
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-semibold">
                2
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Compliance</span>
            </div>

            <div className="flex-1 h-[2px] bg-slate-200 mx-2" />

            <div className="flex flex-col items-center z-10">
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-semibold">
                3
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Verification</span>
            </div>

            <div className="flex-1 h-[2px] bg-slate-200 mx-2" />

            <div className="flex flex-col items-center z-10">
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-semibold">
                4
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Ownership</span>
            </div>

            <div className="flex-1 h-[2px] bg-slate-200 mx-2" />

            <div className="flex flex-col items-center z-10">
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-semibold">
                5
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Documents</span>
            </div>

            <div className="flex-1 h-[2px] bg-slate-200 mx-2" />

            <div className="flex flex-col items-center z-10">
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-semibold">
                6
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Review</span>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          {/* Legal Company Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Legal Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="legalName"
              placeholder="As registered with tax authorities"
              value={formData.legalName}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <p className="text-[11px] text-slate-400">Include suffixes like LLC, Inc., or Ltd.</p>
          </div>

          {/* DBA Name & Registration Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">DBA Name (Optional)</label>
              <input
                type="text"
                name="dbaName"
                placeholder="Doing Business As"
                value={formData.dbaName}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Company Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="registrationNumber"
                placeholder="CRN or EIN"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Country of Incorporation & Industry Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Country of Incorporation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pr-8"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Industry Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pr-8"
                >
                  <option value="">Select an industry</option>
                  <option value="financial-services">Financial Services</option>
                  <option value="e-commerce">E-Commerce</option>
                  <option value="software">Software / SaaS</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Registered Office Address Section */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700">
              Registered Office Address <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="houseNumber"
                placeholder="House Name or Number *"
                value={formData.houseNumber}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <input
                type="text"
                name="addressLine2"
                placeholder="Second line of Address (Optional)"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <input
                type="text"
                name="streetName"
                placeholder="Street Name *"
                value={formData.streetName}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <input
                type="text"
                name="town"
                placeholder="Town *"
                value={formData.town}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <input
                type="text"
                name="postCode"
                placeholder="Post code *"
                value={formData.postCode}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <div className="relative">
                <select
                  name="addressCountry"
                  value={formData.addressCountry}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pr-8"
                >
                  <option value="United States">United States</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* KYB Requirements Callout Box */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-blue-900">KYB Requirements</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                Ensure all names match your official formation documents exactly. We will automatically cross-reference this data with global registries in the next step.
              </p>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex justify-between items-center pt-2">
            <Link
              href="/dashboard/organization"
              className="px-5 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Back
            </Link>

            {isFormValid ? (
              <Link
                href="/dashboard/organization/regulatorycompliance"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
              >
                Save and Continue &rarr;
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="px-6 py-2 bg-slate-200 text-slate-400 rounded-lg text-sm font-semibold flex items-center gap-2 cursor-not-allowed transition-colors"
              >
                Save and Continue &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Footer Support Links */}
        <div className="flex justify-center items-center gap-6 pt-2 pb-6 text-xs font-semibold text-blue-600">
          <button className="flex items-center gap-1.5 hover:underline">
            <MessageSquare className="w-4 h-4" />
            Chat with Compliance
          </button>
          <button className="flex items-center gap-1.5 hover:underline">
            <HelpCircle className="w-4 h-4" />
            Onboarding Documentation
          </button>
        </div>
      </main>
    </div>
  );
}