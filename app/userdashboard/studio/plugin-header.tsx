'use client';

import React from 'react';
import { ChevronLeft, PanelLeftClose } from 'lucide-react';

/** The top bar of a plugin's view in the left panel: back, the plugin's logo and name, collapse. */
export function PluginHeader({
  logo,
  title,
  onBack,
  onCollapse,
}: {
  logo: React.ReactNode;
  title: string;
  onBack: () => void;
  onCollapse: () => void;
}) {
  const button = 'grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-white hover:text-[#0040DF]';
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 px-2 py-2">
      <button type="button" onClick={onBack} title="Back to plugins" aria-label="Back to plugins" className={button}>
        <ChevronLeft className="h-4 w-4" />
      </button>
      {logo}
      <span className="min-w-0 flex-1 truncate text-[12px] font-bold text-slate-900">{title}</span>
      <button type="button" onClick={onCollapse} title="Collapse left panel" aria-label="Collapse left panel" className={button}>
        <PanelLeftClose className="h-4 w-4" />
      </button>
    </div>
  );
}
