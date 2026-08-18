"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Sun, Glasses, UserCheck, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface Step4Props {
  isSubmitting: boolean;
  onScanComplete: (photoData: string) => void;
}

export default function Step4FaceScan({ isSubmitting, onScanComplete }: Step4Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [hasCamera, setHasCamera] = useState(true);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isLightingGood, setIsLightingGood] = useState(false);
  const [noGlassesConfirmed, setNoGlassesConfirmed] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Position your face inside the circle");

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

  // Continuous Video Frame Analysis (Face Detection & Lighting Check)
  const analyzeFrame = useCallback(async () => {
    if (!videoRef.current || videoRef.current.readyState < 2) return;

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // 1. Calculate Average Luminance (Lighting Quality Check)
    let totalBrightness = 0;
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      totalBrightness += 0.299 * r + 0.587 * g + 0.114 * b;
    }
    const avgBrightness = totalBrightness / (data.length / 16);
    const goodLight = avgBrightness > 45 && avgBrightness < 220;
    setIsLightingGood(goodLight);

    // 2. Native Browser FaceDetector API (with fallback color/contrast heuristic)
    let detected = false;
    if ("FaceDetector" in window) {
      try {
        // @ts-expect-error Native Shape Detection API
        const faceDetector = new window.FaceDetector({ fastMode: true });
        const faces = await faceDetector.detect(video);
        detected = faces.length > 0;
      } catch {
        detected = false;
      }
    } else {
      // Fallback: Check central oval density/skin tone presence in central region
      let skinPixels = 0;
      for (let y = 40; y < 120; y += 4) {
        for (let x = 40; x < 120; x += 4) {
          const idx = (y * canvas.width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Basic skin tone hue range check
          if (r > 60 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
            skinPixels++;
          }
        }
      }
      detected = skinPixels > 120;
    }

    setIsFaceDetected(detected);

    // Update Status Feedback Message
    if (!detected) {
      setStatusMessage("No face detected. Align your face in the oval.");
    } else if (!goodLight) {
      setStatusMessage("Too dark or too bright. Improve lighting.");
    } else {
      setStatusMessage("Face aligned! Ready to scan.");
    }
  }, []);

  useEffect(() => {
    if (!hasCamera) return;
    const interval = setInterval(() => {
      analyzeFrame();
    }, 300);

    return () => clearInterval(interval);
  }, [hasCamera, analyzeFrame]);

  const handleStartScan = () => {
    if (!isFaceDetected) return;

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

  const isScanReady = isFaceDetected && isLightingGood && noGlassesConfirmed;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white text-slate-800 font-sans">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

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

        {/* Oval Face Frame Container with Dynamic Border Color */}
        <div
          className={`relative w-60 h-72 mx-auto rounded-[120px] overflow-hidden border-4 transition-all duration-300 shadow-lg bg-slate-900 flex items-center justify-center ${
            isFaceDetected
              ? "border-blue-600 shadow-blue-500/20 ring-4 ring-blue-100"
              : "border-red-500 shadow-red-500/20 ring-4 ring-red-100 animate-pulse"
          }`}
        >
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

          {/* Real-time Status Overlay Badge */}
          <div
            className={`absolute bottom-4 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-md shadow-sm transition-all ${
              isFaceDetected
                ? "bg-emerald-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            {isFaceDetected ? (
              <>
                <CheckCircle2 className="w-3 h-3" /> Face Detected
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3" /> Face Not Visible
              </>
            )}
          </div>
        </div>

        {/* Dynamic Feedback Message Banner */}
        <div
          className={`p-2.5 rounded-xl text-center text-xs font-semibold transition-colors ${
            isScanReady
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {statusMessage}
        </div>

        {/* 3 Guidance Rule Checklist Badges */}
        <div className="grid grid-cols-3 gap-2 py-1 text-center">
          {/* Rule 1: Good Lighting */}
          <div
            className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
              isLightingGood
                ? "bg-blue-50/50 border-blue-200 text-[#0A63F8]"
                : "bg-slate-50 border-slate-200 text-slate-400"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                isLightingGood ? "bg-[#0A63F8] text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold">Good lighting</span>
          </div>

          {/* Rule 2: No Glasses */}
          <button
            type="button"
            onClick={() => setNoGlassesConfirmed(!noGlassesConfirmed)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all cursor-pointer ${
              noGlassesConfirmed
                ? "bg-blue-50/50 border-blue-200 text-[#0A63F8]"
                : "bg-amber-50 border-amber-300 text-amber-700"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                noGlassesConfirmed ? "bg-[#0A63F8] text-white" : "bg-amber-500 text-white"
              }`}
            >
              <Glasses className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold">No glasses</span>
          </button>

          {/* Rule 3: Look Straight Ahead */}
          <div
            className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
              isFaceDetected
                ? "bg-blue-50/50 border-blue-200 text-[#0A63F8]"
                : "bg-slate-50 border-slate-200 text-slate-400"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                isFaceDetected ? "bg-[#0A63F8] text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold">Look straight</span>
          </div>
        </div>
      </div>

      {/* Trigger Action */}
      <div className="space-y-3 pt-4 pb-2 text-center">
        <button
          type="button"
          disabled={isSubmitting || !isScanReady}
          onClick={handleStartScan}
          className="w-full bg-[#0A63F8] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying Biometrics...
            </>
          ) : !isFaceDetected ? (
            "Center Face to Scan"
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