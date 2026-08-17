"use client";

import React, { useRef, useEffect, useState } from "react";
import { Lightbulb, Eye, Frame } from "lucide-react";

interface Step3Props {
  docType: string;
  onCapture: (photoData: string) => void;
}

export default function Step3CaptureId({ docType, onCapture }: Step3Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(true);

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

  const handleTakePhoto = () => {
    // Generate snapshot or mock image payload
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
        ctx.fillText("Sample ID Document Capture", 200, 200);
      }
      onCapture(canvas.toDataURL("image/jpeg"));
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#111827] text-white">
      {/* Top Title Bar */}
      <div className="p-4 text-center border-b border-slate-800 bg-[#111827]">
        <h2 className="text-xs font-semibold text-slate-300">Identity Verification</h2>
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
        <div className="relative z-10 w-full max-w-[320px] h-[200px] border-2 border-blue-500/80 rounded-2xl shadow-[0_0_0_9999px_rgba(15,23,42,0.75)] flex items-center justify-center">
          <span className="text-[10px] font-bold tracking-widest text-white/80 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs uppercase border border-white/10">
            PLACE ID CARD WITHIN FRAME
          </span>
        </div>
      </div>

      {/* Bottom Floating Sheet Overlay */}
      <div className="bg-white text-slate-800 rounded-t-3xl p-6 space-y-5 -mt-4 relative z-20">
        <div className="text-center">
          <h3 className="text-sm font-bold text-slate-900">
            Align your ID within the frame
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Front of your {docType.replace("_", " ")}
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

        {/* Capture Action Button */}
        <button
          type="button"
          onClick={handleTakePhoto}
          className="w-full bg-[#0A63F8] hover:bg-blue-700 text-white text-xs font-semibold py-3.5 rounded-xl transition-colors shadow-md cursor-pointer"
        >
          Take Photo
        </button>
      </div>
    </div>
  );
}