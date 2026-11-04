// /client/app/userdashboard/studio/components/IconRail.tsx
'use client';

import React from 'react';
import { Layers, Box, Workflow, Palette, ShieldCheck, Settings } from 'lucide-react';

const ITEMS = [
  { id: 'layers', Icon: Layers, label: 'Navigator', active: true },
  { id: 'components', Icon: Box, label: 'Components' },
  { id: 'flow', Icon: Workflow, label: 'App flow' },
  { id: 'theme', Icon: Palette, label: 'Theme' },
  { id: 'compliance', Icon: ShieldCheck, label: 'Compliance', badge: 2 },
];

export default function IconRail() {
  return (
    <aside className="flex w-10 shrink-0 flex-col items-center border-r border-slate-200 bg-white py-2">
      {ITEMS.map(({ id, Icon, label, active, badge }) => (
        <button
          key={id}
          title={label}
          aria-label={label}
          className={`relative mb-0.5 grid h-9 w-9 place-items-center rounded-lg transition ${
            active ? 'bg-[#E8EEFF] text-[#0040DF]' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          <Icon className="h-4 w-4" />
          {badge ? (
            <span className="absolute -right-0.5 -top-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-rose-500 px-0.5 text-[8px] font-bold text-white">
              {badge}
            </span>
          ) : null}
        </button>
      ))}

      <div className="mt-auto flex flex-col items-center gap-1">
        <button
          title="Settings"
          aria-label="Settings"
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <Settings className="h-4 w-4" />
        </button>
        <span
          title="Apex Banking Core · connected (42ms)"
          className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"
        />
      </div>
    </aside>
  );
}