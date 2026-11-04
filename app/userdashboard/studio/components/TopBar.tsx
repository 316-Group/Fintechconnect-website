// /client/app/userdashboard/studio/components/TopBar.tsx
'use client';

import React from 'react';
import {
  ChevronDown,
  Undo2,
  Redo2,
  Smartphone,
  Monitor,
  Tablet,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Share2,
  PhoneCall,
} from 'lucide-react';
import type { DeviceType, StudioMode } from './types';

interface Props {
  mode: StudioMode;
  onMode: (m: StudioMode) => void;
  device: DeviceType;
  onDevice: (d: DeviceType) => void;
  zoom: number;
  onZoom: (z: number) => void;
  saveState: 'saving' | 'saved' | 'unsaved';
  onSaveState: (s: 'saving' | 'saved' | 'unsaved') => void;
  onPublish: () => void;
}

const MODES: { id: StudioMode; label: string }[] = [
  { id: 'design', label: 'Design' },
  { id: 'prototype', label: 'Prototype' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'code', label: 'Code' },
];

export default function TopBar({
  mode,
  onMode,
  device,
  onDevice,
  zoom,
  onZoom,
  saveState,
  onPublish,
}: Props) {
  const saveLabel =
    saveState === 'saving' ? 'Saving…' : saveState === 'unsaved' ? 'Unsaved changes' : 'Saved 12s ago';
  const saveDot =
    saveState === 'unsaved' ? 'bg-amber-500' : saveState === 'saving' ? 'bg-amber-400 animate-pulse' : 'bg-blue-500';

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-2">
      {/* Logo + project switcher */}
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-1.5">
          <div className="grid h-6 w-6 place-items-center rounded-md bg-[#0040DF] text-white">
            <span className="text-[10px] font-black">F</span>
          </div>
          <p className="text-[12px] font-bold leading-none">
            Fintec<span className="text-[#0040DF]">Connect</span>
          </p>
        </div>
        <span className="h-5 w-px bg-slate-200" aria-hidden />
        <button className="flex items-center gap-1 rounded-md px-1 py-1 text-left hover:bg-slate-100">
          <div className="leading-tight">
            <p className="whitespace-nowrap text-[10px] font-semibold">Apex Digital Bank</p>
            <p className="hidden whitespace-nowrap text-[9px] text-slate-500 xl:block">US Core BaaS · Sandbox</p>
          </div>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
        <div className="hidden items-center gap-1.5 whitespace-nowrap rounded-md px-1 py-1 text-[10px] text-slate-500 xl:flex">
          <span className={`h-1.5 w-1.5 rounded-full ${saveDot}`} />
          {saveLabel}
        </div>
        <div className="hidden items-center gap-0.5 xl:flex">
          <button className="grid h-6 w-6 place-items-center rounded-md text-slate-500 hover:bg-slate-100">
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button className="grid h-6 w-6 place-items-center rounded-md text-slate-300">
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Mode switcher */}
      <div className="mx-auto flex shrink-0 items-center gap-0.5 rounded-lg bg-slate-100 p-0.5">
        {MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onMode(m.id)}
              className={`flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-[9px] font-semibold transition ${
                active
                  ? 'bg-white text-[#0040DF] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {active && <span className="h-1.5 w-1.5 rounded-full bg-[#0040DF]" />}
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Right controls */}
      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <button
            onClick={() => onDevice('iphone')}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold ${
              device === 'iphone' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Smartphone className="h-3 w-3" /> iPhone 15 Pro
          </button>
          <button
            onClick={() => onDevice('pixel')}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold ${
              device === 'pixel' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Monitor className="h-3 w-3" /><span className="hidden 2xl:inline">Pixel 8</span>
          </button>
          <button
            onClick={() => onDevice('tablet')}
            className={`grid h-6 w-6 place-items-center rounded-md ${
              device === 'tablet' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Tablet className="h-3 w-3" />
          </button>
        </div>

        <div className="flex items-center gap-1 rounded-lg px-1 text-slate-500">
          <button
            onClick={() => onZoom(Math.max(50, zoom - 10))}
            className="grid h-6 w-6 place-items-center rounded-md hover:bg-slate-100"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="w-9 text-center text-[10px] font-semibold">{zoom}%</span>
          <button
            onClick={() => onZoom(Math.min(400, zoom + 10))}
            className="grid h-6 w-6 place-items-center rounded-md hover:bg-slate-100"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onZoom(100)}
            className="grid h-6 w-6 place-items-center rounded-md hover:bg-slate-100"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <span className="h-5 w-px bg-slate-200" aria-hidden />

        <button className="hidden h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-slate-100 xl:grid">
          <PhoneCall className="h-3.5 w-3.5" />
        </button>
        <button className="hidden h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-slate-100 xl:grid">
          <Share2 className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={onPublish}
          className="rounded-md bg-[#0040DF] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#0036BF]"
        >
          Publish App
        </button>
      </div>
    </header>
  );
}