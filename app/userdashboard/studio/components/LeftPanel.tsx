// /client/app/userdashboard/studio/components/LeftPanel.tsx
'use client';

import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  PlusCircle,
  Diamond,
  Box,
  Type,
  MousePointer2,
  Square,
} from 'lucide-react';
import type { LeftTab, LayerNode } from './types';
import { LAYER_TREE } from './seed';

interface Props {
  tab: LeftTab;
  onTab: (t: LeftTab) => void;
  selectedLayerId: string;
  onSelectLayer: (id: string) => void;
}

const TABS: { id: LeftTab; label: string }[] = [
  { id: 'navigator', label: 'Navigator' },
  { id: 'comps', label: 'Comps' },
  { id: 'assets', label: 'Assets' },
];

function LayerIcon({ kind }: { kind: LayerNode['kind'] }) {
  const cls = 'h-3 w-3 shrink-0 text-slate-400';
  if (kind === 'master') return <Diamond className="h-3 w-3 shrink-0 text-indigo-500" />;
  if (kind === 'text') return <Type className={cls} />;
  if (kind === 'button') return <MousePointer2 className={cls} />;
  if (kind === 'shape') return <Square className={cls} />;
  return <Box className={cls} />;
}

function LayerRow({
  node,
  depth,
  selectedLayerId,
  onSelect,
}: {
  node: LayerNode;
  depth: number;
  selectedLayerId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(node.id === 'home' || node.id === 'balance');
  const selected = selectedLayerId === node.id;

  return (
    <div>
      <div
        onClick={() => onSelect(node.id)}
        className={`group flex cursor-pointer items-center gap-1.5 rounded-md py-1 pr-1 text-[10px] transition ${
          selected ? 'bg-[#E8EEFF] text-[#0040DF]' : 'hover:bg-slate-50'
        }`}
        style={{ paddingLeft: 6 + depth * 12 }}
      >
        {node.children?.length ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            className="grid h-3 w-3 place-items-center text-slate-400"
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            {open ? <ChevronDown className="h-2.5 w-2.5" /> : <ChevronRight className="h-2.5 w-2.5" />}
          </button>
        ) : (
          <span className="w-3" />
        )}
        <LayerIcon kind={node.kind} />
        <span
          className={`truncate ${node.kind === 'screen' || node.kind === 'master' ? 'font-semibold' : ''} ${
            selected ? 'text-[#0040DF]' : 'text-slate-700'
          }`}
        >
          {node.label}
        </span>
        {node.kind === 'screen' && (
          <span className="ml-auto rounded bg-[#E8EEFF] px-1 py-0 text-[8px] font-semibold text-[#0040DF]">
            Screen
          </span>
        )}
        {node.kind === 'master' && (
          <span className="ml-auto rounded bg-indigo-100 px-1 py-0 text-[8px] font-semibold text-indigo-700">
            Master
          </span>
        )}
        {!node.children?.length && node.count ? (
          <span className="ml-auto text-[8px] text-slate-400">({node.count})</span>
        ) : null}
      </div>

      {open && node.children?.map((c) => (
        <LayerRow
          key={c.id}
          node={c}
          depth={depth + 1}
          selectedLayerId={selectedLayerId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default function LeftPanel({ tab, onTab, selectedLayerId, onSelectLayer }: Props) {
  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTab(t.id)}
              className={`relative flex-1 py-2.5 text-[9px] font-bold uppercase tracking-wider ${
                active ? 'text-[#0040DF]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {t.label}
              {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[#0040DF]" />}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="border-b border-slate-100 p-2">
        <div className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1.5">
          <Search className="h-3 w-3 text-slate-400" />
          <input
            placeholder="Search layers, props"
            className="w-full bg-transparent text-[10px] text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Flow header */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
          App flow <ChevronsUpDown className="h-2.5 w-2.5" />
          <span className="text-[9px] font-semibold text-slate-500">· Consumer DDA</span>
        </div>
        <button className="grid h-5 w-5 place-items-center rounded text-slate-400 hover:bg-slate-100">
          <ChevronsUpDown className="h-3 w-3" />
        </button>
      </div>

      {/* Layer tree */}
      <div className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-3">
        {LAYER_TREE.map((n) => (
          <LayerRow
            key={n.id}
            node={n}
            depth={0}
            selectedLayerId={selectedLayerId}
            onSelect={onSelectLayer}
          />
        ))}
      </div>

      {/* Master component callout */}
      <div className="border-t border-slate-200 bg-indigo-50/50 p-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-indigo-700">
            <Diamond className="h-2.5 w-2.5" /> Master Component
          </div>
          <span className="text-[9px] font-semibold text-slate-500">v2.1</span>
        </div>
        <p className="mt-1 text-[9px] leading-snug text-slate-500">
          Changes to BalanceCard cascade across all <span className="font-semibold text-slate-700">6</span> linked
          white-label screens.
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <button className="rounded bg-white px-1.5 py-1 text-[8px] font-semibold text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50">
            View linked instances
          </button>
          <button className="rounded bg-indigo-600 px-1.5 py-1 text-[8px] font-semibold text-white hover:bg-indigo-700">
            Publish update
          </button>
        </div>
      </div>

      {/* Add New Screen */}
      <div className="border-t border-slate-200 p-2">
        <button className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-slate-300 py-1.5 text-[10px] font-semibold text-slate-600 hover:border-[#0040DF] hover:text-[#0040DF]">
          <PlusCircle className="h-3 w-3" /> Add New Screen
        </button>
      </div>
    </aside>
  );
}