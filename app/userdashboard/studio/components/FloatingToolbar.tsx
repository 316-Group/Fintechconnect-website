// /client/app/userdashboard/studio/components/FloatingToolbar.tsx
'use client';

import React from 'react';
import { MousePointer2, Hand, PlusSquare, Zap, Grid3x3 } from 'lucide-react';
import type { Tool } from './types';

const TOOLS: { id: Tool; Icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { id: 'select', Icon: MousePointer2, label: 'Select' },
  { id: 'hand', Icon: Hand, label: 'Hand' },
  { id: 'insert', Icon: PlusSquare, label: 'Insert component' },
  { id: 'interactions', Icon: Zap, label: 'Interactions' },
  { id: 'snap', Icon: Grid3x3, label: 'Snap 16px' },
];

export default function FloatingToolbar({
  tool,
  onTool,
}: {
  tool: Tool;
  onTool: (t: Tool) => void;
}) {
  return (
    <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-0.5 rounded-xl bg-white px-1.5 py-1 shadow-lg ring-1 ring-slate-200">
      {TOOLS.map(({ id, Icon, label }) => {
        const active = tool === id;
        return (
          <button
            key={id}
            onClick={() => onTool(id)}
            title={label}
            aria-label={label}
            className={`grid h-7 w-7 place-items-center rounded-lg transition ${
              active ? 'bg-[#0040DF] text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
      <span className="ml-1 rounded-md bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600">
        Snap 16px
      </span>
    </div>
  );
}