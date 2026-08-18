"use client";

import React, { useRef, useEffect, useState } from "react";
import { Lightbulb, Eye, Frame, Check, RotateCcw, ArrowRight } from "lucide-react";

interface Step3Props {
  docType: string;
  onCapture: (photoData: string | { front: string; back: string }) => void;
}

export default function Step3CaptureId({ docType, onCapture }: Step3Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(true);

  // Check if document requires both front and back scans
  const requiresBackScan = docType === "drivers_license" || docType === "national_id";
  const [currentSide, setCurrentSide] = useState<"front" | "back">("front");
  const [frontCapturedData, setFrontCapturedData] = useState<string | null>(null);

  // Activate device camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function enableCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Camera access denied or unmounted, using fallback canvas preview.", err);
        setHasCamera(false);
      }
    }

    enableCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureFrame = (): string => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (hasCamera && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, 640, 400);
      } else {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(0, 0, 640, 400);
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px sans-serif";
        ctx.fillText(
          `Sample ${docType.replace("_", " ")} (${currentSide.toUpperCase()}) Capture`,
          140,
          200
        );
      }
      return canvas.toDataURL("image/jpeg");
    }
    return "";
  };

  const handleTakePhoto = () => {
    const photoData = captureFrame();

    if (requiresBackScan) {
      if (currentSide === "front") {
        setFrontCapturedData(photoData);
        setCurrentSide("back");
      } else {
        // Front and back both captured
        onCapture({
          front: frontCapturedData || "",
          back: photoData,
        });
      }
    } else {
      // Single sided document (e.g., Passport)
      onCapture(photoData);
    }
  };

  const handleRetakeFront = () => {
    setFrontCapturedData(null);
    setCurrentSide("front");
  };

  const docLabel =
    docType === "drivers_license"
      ? "Driver's License"
      : docType === "national_id"
      ? "National ID"
      : "Passport";

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#111827] text-white">
      {/* Top Title Bar */}
      <div className="p-4 text-center border-b border-slate-800 bg-[#111827] flex items-center justify-between px-6">
        <h2 className="text-xs font-semibold text-slate-300">Identity Verification</h2>
        {requiresBackScan && (
          <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/30 uppercase tracking-wider">
            {currentSide === "front" ? "Step 1: Front Side" : "Step 2: Back Side"}
          </span>
        )}
      </div>

      {/* Live Camera Viewfinder Window */}
      <div className="relative flex-1 flex items-center justify-center p-4 bg-black overflow-hidden min-h-[360px]">
        {hasCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-slate-500 text-xs">
            [ Camera Viewfinder Live Stream ]
          </div>
        )}

        {/* ID Bounding Box Overlay Frame */}
        <div className="relative z-10 w-full max-w-[320px] h-[200px] border-2 border-blue-500/80 rounded-2xl shadow-[0_0_0_9999px_rgba(15,23,42,0.75)] flex flex-col items-center justify-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-white/90 bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs uppercase border border-white/10">
            {requiresBackScan
              ? `PLACE ${currentSide.toUpperCase()} OF ${docLabel.toUpperCase()} WITHIN FRAME`
              : "PLACE ID CARD WITHIN FRAME"}
          </span>
        </div>
      </div>

      {/* Bottom Floating Sheet Overlay */}
      <div className="bg-white text-slate-800 rounded-t-3xl p-6 space-y-4 -mt-4 relative z-20">
        {/* Step Status Badges for 2-Step Scans */}
        {requiresBackScan && (
          <div className="flex items-center justify-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                frontCapturedData
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : currentSide === "front"
                  ? "bg-blue-50 text-[#0A63F8] border border-blue-200"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {frontCapturedData ? <Check className="w-3 h-3" /> : null}
              1. Front Scan
            </div>
            <div className="w-4 h-0.5 bg-slate-200" />
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                currentSide === "back"
                  ? "bg-blue-50 text-[#0A63F8] border border-blue-200"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              2. Back Scan
            </div>
          </div>
        )}

        <div className="text-center">
          <h3 className="text-sm font-bold text-slate-900">
            {requiresBackScan
              ? currentSide === "front"
                ? `Align the FRONT of your ${docLabel}`
                : `Now, align the BACK of your ${docLabel}`
              : `Align your ${docLabel} within the frame`}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {requiresBackScan
              ? currentSide === "front"
                ? "Ensure all text and your photo are clearly visible"
                : "Flip your ID card over and position the back side in frame"
              : "Photo page required. Must show all 4 corners clearly."}
          </p>
        </div>

        {/* 3 Guidance Tips */}
        <div className="grid grid-cols-3 gap-2 py-1 text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0A63F8] flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-600">Good lighting</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0A63F8] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-600">No glare</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0A63F8] flex items-center justify-center">
              <Frame className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-600">Info is clear</span>
          </div>
        </div>

        {/* Capture Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleTakePhoto}
            className="w-full bg-[#0A63F8] hover:bg-blue-700 text-white text-xs font-semibold py-3.5 rounded-xl transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {requiresBackScan ? (
              currentSide === "front" ? (
                <>
                  Capture Front &amp; Continue <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Capture Back &amp; Complete <Check className="w-4 h-4" />
                </>
              )
            ) : (
              "Take Photo"
            )}
          </button>

          {/* Option to retake front photo when on back scan step */}
          {requiresBackScan && currentSide === "back" && (
            <button
              type="button"
              onClick={handleRetakeFront}
              className="w-full text-xs font-semibold text-slate-500 hover:text-slate-800 py-1.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Front Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}