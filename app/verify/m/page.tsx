"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Smartphone, ShieldCheck } from "lucide-react";

import Step1Intro from "@/app/verify/m/Step1";
import Step2SelectId from "@/app/verify/m/Step2";
import Step3CaptureId from "@/app/verify/m/Step3";
import Step4FaceScan from "@/app/verify/m/Step4";
import Step5Success from "@/app/verify/m/Step5";

function MobileVerifyContent() {
  const searchParams = useSearchParams();
  const sessionId =
    searchParams.get("session") ||
    searchParams.get("session_id") ||
    "demo_session_123";

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedDocType, setSelectedDocType] =
    useState<string>("drivers_license");
  const [idPhoto, setIdPhoto] = useState<
    string | { front: string; back: string } | null
  >(null);
  const [facePhoto, setFacePhoto] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Screen Guard Check: Redirect/Block if opened on Desktop browser
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileUA =
        /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        );
      const isNarrowScreen = window.innerWidth < 768;

      // Treat as desktop if screen is wider than 768px and not a mobile UA
      setIsDesktop(!isMobileUA && !isNarrowScreen);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Broadcast step updates or completion status back to the backend/desktop real-time channel
  const notifyDesktopSession = async (status: string, payload?: any) => {
    try {
      await fetch("/api/verify/session-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          status, // e.g., 'IN_PROGRESS', 'VERIFIED', 'FAILED'
          step: currentStep,
          ...payload,
        }),
      });
    } catch (err) {
      console.warn("Failed to dispatch session update:", err);
    }
  };

  // Final payload submission to verification API
  const handleFinalSubmission = async (capturedFace: string) => {
    setIsSubmitting(true);
    setFacePhoto(capturedFace);

    try {
      // Simulate API call processing OCR and Biometric Match
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Broadcast 'VERIFIED' status to trigger real-time Desktop transition
      await notifyDesktopSession("VERIFIED", {
        docType: selectedDocType,
        verifiedAt: new Date().toISOString(),
      });

      setCurrentStep(5);
    } catch (error) {
      alert("Biometric verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Desktop Screen Guard overlay
  if (isDesktop) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6">
          <Smartphone className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-2">
          Mobile Device Required
        </h2>
        <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
          This verification flow requires native camera access for live facial
          recognition. Please scan the QR code on your desktop screen using
          your smartphone camera.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Secure Mobile
          Handoff
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex justify-center font-sans antialiased">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-xl">
        {currentStep === 1 && (
          <Step1Intro
            applicantName="Jessica Pearson"
            onNext={() => {
              notifyDesktopSession("STARTED");
              setCurrentStep(2);
            }}
          />
        )}

        {currentStep === 2 && (
          <Step2SelectId
            selectedDocType={selectedDocType}
            setSelectedDocType={setSelectedDocType}
            onNext={() => setCurrentStep(3)}
            onCancel={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3CaptureId
            docType={selectedDocType}
            onCapture={(photoData) => {
              setIdPhoto(photoData);
              setCurrentStep(4);
            }}
          />
        )}

        {currentStep === 4 && (
          <Step4FaceScan
            isSubmitting={isSubmitting}
            onScanComplete={handleFinalSubmission}
          />
        )}

        {currentStep === 5 && (
          <Step5Success
            livePhoto={facePhoto}
            idPhoto={idPhoto}
            onDone={() => {
              if (typeof window !== "undefined") {
                window.close();
              }
            }}
          />
        )}
      </div>
    </main>
  );
}

// Fallback skeleton rendered during static pre-rendering
function VerifyLoadingFallback() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans">
      <div className="text-xs text-slate-400 animate-pulse">
        Loading verification session...
      </div>
    </main>
  );
}

// Export default wrapper with Suspense boundary to fix GitHub Pages pre-render error
export default function MobileVerifyPage() {
  return (
    <Suspense fallback={<VerifyLoadingFallback />}>
      <MobileVerifyContent />
    </Suspense>
  );
}