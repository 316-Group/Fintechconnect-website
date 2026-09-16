"use client";

import React, { useState, useEffect } from "react";
import { Info, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "onboarding_business_identity";

const INITIAL_FORM_DATA = {
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
  addressCountry: "United States",
};

export default function BusinessIdentity() {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/dashboard/form-data");
        const json = await res.json();
        if (json.authenticated && json.data?.businessIdentity) {
          setFormData(json.data.businessIdentity);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data.businessIdentity));
          setIsLoaded(true);
          return;
        }
      } catch (error) {
        console.error("Failed to load business identity server data", error);
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setFormData(JSON.parse(saved));
        } catch (error) {
          console.error("Error parsing stored form data:", error);
        }
      }
      setIsLoaded(true);
    }

    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleSaveAndContinue = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isFormValid || isSaving) return;
    setIsSaving(true);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      await fetch("/api/dashboard/form-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessIdentity: formData }),
      });
      router.push("/dashboard/organization/regulatorycompliance");
    } catch (error) {
      console.error("Failed to save business identity data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="w-full mx-auto space-y-6 min-h-screen font-sans text-slate-800">
      <div>
        <div className="text-xs text-slate-400 font-medium mb-5">
          Merchants &gt; New Onboarding &gt;{" "}
          <span className="text-slate-600">Business Profile</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Establish Business Identity
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Provide the legal foundation for your institution. This data is used
          for regulatory compliance and network registration.
        </p>
      </div>

      <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-blue-900">
            KYB Requirements
          </h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            Ensure all names match your official formation documents exactly.
            We will automatically cross-reference this data with global
            registries in the next step.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
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
          <p className="text-[11px] text-slate-400">
            Include suffixes like LLC, Inc., or Ltd.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              DBA Name (Optional)
            </label>
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

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <Link
            href="/dashboard/organization"
            className="px-5 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Back
          </Link>

          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={!isFormValid || isSaving}
            className={`px-6 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors ${
              isFormValid && !isSaving
                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            {isSaving ? "Saving..." : "Save and Continue \u2192"}
          </button>
        </div>
      </div>
    </main>
  );
}