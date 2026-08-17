"use client";

import React, { useRef, useEffect, useState } from "react";
import { Sun, Glasses, UserCheck, Loader2 } from "lucide-react";

interface Step4Props {
  isSubmitting: boolean;
  onScanComplete: (photoData: string) => void;
}

export default function Step4FaceScan({ isSubmitting, onScanComplete }: Step4Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(true);

  // Activate front user camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function enableFrontCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Front camera disabled or unavailable.", err);
        setHasCamera(false);
      }
    }

    enableFrontCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartScan = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (hasCamera && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, 400, 400);
      } else {
        ctx.fillStyle = "#334155";
        ctx.fillRect(0, 0, 400, 400);
      }
      onScanComplete(canvas.toDataURL("image/jpeg"));
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white text-slate-800">
      <div className="space-y-5 pt-2">
        <div className="text-center">
          <h2 className="text-sm font-bold text-[#0A63F8]">Fintech Connect</h2>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-lg font-bold text-slate-900">Verify your identity</h1>
          <p className="text-xs text-slate-500">
            Position your face within the frame to complete verification.
          </p>
        </div>

        {/* Oval Face Frame Container */}
        <div className="relative w-60 h-72 mx-auto rounded-[120px] overflow-hidden border-4 border-blue-600/90 shadow-lg bg-slate-900 flex items-center justify-center">
          {hasCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
              [ Live Face Capture ]
            </div>
          )}
        </div>

        {/* 3 Guidance Icons */}
        <div className="grid grid-cols-3 gap-2 py-2 text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0A63F8] flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-600">Ensure good lighting</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0A63F8] flex items-center justify-center">
              <Glasses className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-600">Remove glasses</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0A63F8] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-600">Look straight ahead</span>
          </div>
        </div>
      </div>

      {/* Trigger Action */}
      <div className="space-y-3 pt-4 pb-2 text-center">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleStartScan}
          className="w-full bg-[#0A63F8] hover:bg-blue-700 disabled:opacity-75 text-white text-xs font-semibold py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying Biometrics...
            </>
          ) : (
            "Start Scan"
          )}
        </button>
        <p className="text-[10px] text-slate-400 font-medium">
          * Encrypted &amp; Secure Biometric Data
        </p>
      </div>
    </div>
  );
}