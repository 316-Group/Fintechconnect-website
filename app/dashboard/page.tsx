"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import OnboardingStep1 from "@/components/onboarding/OnboardingStep1";
import OnboardingStep2 from "@/components/onboarding/OnboardingStep2";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);

  useEffect(() => {
    // Check if the URL has ?onboarding=true
    const isOnboarding = searchParams.get("onboarding") === "true";
    if (isOnboarding) {
      setShowOnboarding(true);
    }
  }, [searchParams]);

  const handleNextStep = () => {
    // Move to Step 2
    setCurrentStep(2);
  };

  const handleStep2Next = (selectedOptions: string[]) => {
    // Save selections to state (or sync with database/API)
    setBusinessTypes(selectedOptions);
    // Advance to Step 3
    setCurrentStep(3);
  };

  const handleSkip = () => {
    setShowOnboarding(false);
    // Remove query parameter without triggering a page reload
    router.replace("/dashboard", { scroll: false });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      {/* Background Dashboard UI */}
      <img
        src="/surveybackground.png"
        alt="Dashboard Background"
        className="fixed inset-0 w-full h-full object-fill opacity-60 pointer-events-none"
      />

      {/* Conditional Onboarding Steps */}
      {showOnboarding && currentStep === 1 && (
        <OnboardingStep1 onNext={handleNextStep} onSkip={handleSkip} />
      )}

      {showOnboarding && currentStep === 2 && (
        <OnboardingStep2 onNext={handleStep2Next} />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <DashboardContent />
    </Suspense>
  );
}