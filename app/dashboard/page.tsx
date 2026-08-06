"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPath } from "@/utils/helper";
import OnboardingStep1 from "@/components/onboarding/OnboardingStep1";
import OnboardingStep2 from "@/components/onboarding/OnboardingStep2";
import OnboardingStep3 from "@/components/onboarding/OnboardingStep3";
import OnboardingStep4 from "@/components/onboarding/OnboardingStep4";
import OnboardingStep5 from "@/components/onboarding/OnboardingStep5";
import OnboardingStep6 from "@/components/onboarding/OnboardingStep6";
import OnboardingLoading from "@/components/onboarding/OnboardingLoading";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Distinct state for each step's selections
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedBuildOption, setSelectedBuildOption] = useState<string>("");

  useEffect(() => {
    const isOnboarding = searchParams.get("onboarding") === "true";
    if (isOnboarding) {
      setShowOnboarding(true);
    }
  }, [searchParams]);

  const handleStep1Next = () => {
    setCurrentStep(2);
  };

  const handleStep2Next = (roles: string[]) => {
    setSelectedRoles(roles);
    setCurrentStep(3);
  };

  const handleStep3Next = (goals: string[]) => {
    setSelectedGoals(goals);
    setCurrentStep(4);
  };

  const handleStep4Next = (industries: string[]) => {
    setSelectedIndustries(industries);
    setCurrentStep(5);
  };

  const handleFinalFinish = () => {
    // Sync onboarding data (selectedRoles, selectedGoals, selectedIndustries, selectedBuildOption) to your backend API here if needed.
    setShowOnboarding(false);
    router.replace("/dashboard/organization", { scroll: false });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSkip = () => {
    setShowOnboarding(false);
    router.replace("/dashboard/organization", { scroll: false });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      {/* Background Dashboard UI */}
      <img
        src={getPath("/surveybackground.png")}
        alt="Dashboard Background"
        className="fixed inset-0 w-full h-full object-fill opacity-60 pointer-events-none"
      />

      {/* Conditional Onboarding Steps */}
      {showOnboarding && currentStep === 1 && (
        <OnboardingStep1 onNext={handleStep1Next} onSkip={handleSkip} />
      )}

      {showOnboarding && currentStep === 2 && (
        <OnboardingStep2 onNext={handleStep2Next} onBack={handleBack} />
      )}

      {showOnboarding && currentStep === 3 && (
        <OnboardingStep3 onNext={handleStep3Next} onBack={handleBack} />
      )}

      {showOnboarding && currentStep === 4 && (
        <OnboardingStep4 onNext={handleStep4Next} onBack={handleBack} />
      )}

      {/* Step 5 */}
      {showOnboarding && currentStep === 5 && (
        <OnboardingStep5
          onNext={(buildOption) => {
            setSelectedBuildOption(buildOption);
            setCurrentStep(6); // Move to Loading Screen
          }}
          onBack={handleBack}
        />
      )}

      {/* Loading Screen */}
      {showOnboarding && currentStep === 6 && (
        <OnboardingLoading
          duration={12000}
          onComplete={() => {
            setCurrentStep(7); // Transition to Step 6 (Final Screen)
          }}
        />
      )}

      {/* Step 6: Final Completion Screen */}
      {showOnboarding && currentStep === 7 && (
        <OnboardingStep6 onContinue={handleFinalFinish} />
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