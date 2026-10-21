'use client';
import React, { useState, useMemo } from 'react';
import { Search, Link2, RotateCcw, Copy, Check, ArrowRight } from 'lucide-react';

// --- Data Definitions ---

const PRIMITIVES = [
  { name: 'blue-600', value: '#0040DF', isColor: true, active: true },
  { name: 'slate-900', value: '#0F172A', isColor: true },
  { name: 'space-4', value: '16px', isColor: false, visual: 'w-4 h-4 bg-slate-100' },
  { name: 'radius-md', value: '8px', isColor: false, visual: 'w-4 h-4 rounded-md border border-slate-300' },
];

const SEMANTIC_ROLES = [
  { name: 'color.action.primary', description: 'Primary interaction intent', active: true },
  { name: 'surface.default', description: 'Standard card and container canvas' },
  { name: 'text.primary', description: 'High emphasis ledger typography' },
  { name: 'border.subtle', description: 'Sub-pixel matrix partitions' },
];

const COMPONENT_PARTS = [
  { name: 'button.primary.background', description: 'Buttons, segmented tabs', active: true },
  { name: 'card.container.surface', description: 'Balance card, telemetry pods' },
  { name: 'input.border.active', description: 'Transfer text inputs, comboboxes' },
  { name: 'badge.status.fill', description: 'Audit chips, review pills' },
];

const TOKENS = [
  { 
    name: 'color.action.primary', 
    value: '#0040DF', 
    isColor: true, 
    usedBy: ['Button', 'Toggle', 'Input'], 
    lightContrast: 'Contrast 7.2', 
    darkContrast: 'Contrast 12.4' 
  },
  { 
    name: 'surface.container.default', 
    value: '#FFFFFF', 
    isColor: true, 
    usedBy: ['Balance card', 'Ledger'], 
    lightContrast: 'Contrast 10.1', 
    darkContrast: 'Contrast 18.2' 
  },
  { 
    name: 'shape.radius.interactive', 
    value: '8px', 
    isColor: false, 
    visual: 'w-4 h-4 rounded-md border border-slate-300 bg-slate-50',
    usedBy: ['Button', 'Input'], 
    lightContrast: '—', 
    darkContrast: '—' 
  },
  { 
    name: 'typography.numerical.card', 
    value: 'Geist SemiBold 40px', 
    isColor: false, 
    visual: 'w-4 h-4 bg-slate-100 rounded text-[6px] font-bold flex items-center justify-center text-slate-600',
    visualText: 'Aa',
    usedBy: ['Balance card'], 
    lightContrast: 'Contrast 14.8', 
    darkContrast: 'Contrast 11.2' 
  },
  { 
    name: 'spacing.inset.card', 
    value: '24px (space-xl)', 
    isColor: false, 
    visual: 'w-4 h-4 border border-dashed border-slate-400 bg-slate-50',
    usedBy: ['Balance card', 'Input'], 
    lightContrast: '—', 
    darkContrast: '—' 
  },
  { 
    name: 'motion.duration.swift', 
    value: '150ms ease-out', 
    isColor: false, 
    visual: 'w-4 h-4 flex items-center justify-center',
    visualText: '⏱',
    usedBy: ['Button', 'Toggle'], 
    lightContrast: '—', 
    darkContrast: '—' 
  },
];

// --- Main Component ---

export default function TokenSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLineage, setActiveLineage] = useState('blue-600');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Determine current dynamic primary color based on lineage (for the preview)
  const activeColor = activeLineage === 'blue-600' ? '#0040DF' : 
                      activeLineage === 'slate-900' ? '#0F172A' : '#0040DF';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const filteredTokens = useMemo(() => {
    if (!searchQuery) return TOKENS;
    return TOKENS.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.usedBy.some(u => u.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const resetLineage = () => setActiveLineage('blue-600');

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:pl-20 lg:pr-14 font-sans text-slate-900 overflow-hidden">
      <div className="mx-auto max-w-full">
        
        {/* ========================================================
            SECTION 1: HOW TOKENS WORK
           ======================================================== */}
        <div className="mb-20">
          <div className="mb-8">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#0040DF]">How tokens work</p>
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">Raw values, meanings, and parts.</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
              Tokens abstract values into three functional layers. Change a raw variable, cascade intent down through semantic aliases, and resolve styling directly at component surfaces.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            
            {/* Column 1: Primitives */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[12px] font-bold text-slate-900">1. Primitives</h3>
                <span className="text-[10px] text-slate-400">Raw constants</span>
              </div>
              <div className="space-y-1">
                {PRIMITIVES.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveLineage(item.name)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors ${
                      activeLineage === item.name 
                        ? 'bg-slate-50 border-l-2 border-[#0040DF]' 
                        : 'border-l-2 border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.isColor ? (
                        <span className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: item.value }} />
                      ) : (
                        <span className={`inline-block ${item.visual}`} />
                      )}
                      <span className="text-[11px] font-medium text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{item.value}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Semantic Roles */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[12px] font-bold text-slate-900">2. Semantic Roles</h3>
                <span className="text-[10px] text-slate-400">Meaning & Intent</span>
              </div>
              <div className="space-y-1">
                {SEMANTIC_ROLES.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveLineage(item.name)}
                    className={`flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left transition-colors ${
                      activeLineage === item.name || (activeLineage === 'blue-600' && item.name === 'color.action.primary')
                        ? 'bg-slate-50' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-[11px] font-medium ${
                       activeLineage === item.name || (activeLineage === 'blue-600' && item.name === 'color.action.primary')
                        ? 'text-[#0040DF]'
                        : 'text-slate-700'
                    }`}>
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 3: Component Parts */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[12px] font-bold text-slate-900">3. Component Parts</h3>
                <span className="text-[10px] text-slate-400">Bound consumers</span>
              </div>
              <div className="space-y-1">
                {COMPONENT_PARTS.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveLineage(item.name)}
                    className={`flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left transition-colors ${
                      activeLineage === item.name || (activeLineage === 'blue-600' && item.name === 'button.primary.background')
                        ? 'bg-slate-50' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-[11px] font-medium ${
                      activeLineage === item.name || (activeLineage === 'blue-600' && item.name === 'button.primary.background')
                        ? 'text-[#0040DF]'
                        : 'text-slate-700'
                    }`}>
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lineage Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <div className="flex items-center gap-2 text-[11px]">
              <Link2 className="h-3.5 w-3.5 text-[#0040DF]" />
              <span className="font-semibold text-slate-700">Active lineage:</span>
              <span className="font-mono text-slate-500">blue-600</span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
              <span className="font-mono text-slate-500">color.action.primary</span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
              <span className="font-mono text-slate-500">button.primary.background</span>
            </div>
            <button 
              onClick={resetLineage}
              className="text-[11px] font-semibold text-slate-500 transition-colors hover:text-slate-900"
            >
              Reset active value
            </button>
          </div>
        </div>

        {/* ========================================================
            SECTION 2: TOKEN EXPLORE
           ======================================================== */}
        <div>
          <div className="mb-6">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#0040DF]">Token explore</p>
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">Search and preview active values.</h2>
          </div>

          {/* Dynamic Preview Card */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div 
                className="grid h-12 w-12 place-items-center rounded-xl text-white shadow-sm transition-colors duration-300"
                style={{ backgroundColor: activeColor }}
              >
                <span className="text-lg font-bold">$</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Dynamic Ledger Preview</p>
                <p className="text-[12px] font-medium text-slate-700">
                  <span className="text-slate-400">color.action.primary:</span> {activeColor}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                className="rounded-md px-4 py-2 text-[11px] font-bold text-white shadow-sm transition-transform active:scale-95"
                style={{ backgroundColor: activeColor }}
              >
                EXECUTE TRANSFER
              </button>
              <span className="font-mono text-sm font-semibold text-slate-900">$9,420.00</span>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Search Bar Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter token names..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 rounded-md border border-transparent bg-slate-50 py-1.5 pl-9 pr-3 text-[11px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0040DF] focus:bg-white"
                />
              </div>
              <span className="text-[10px] font-medium text-slate-400">{filteredTokens.length} tokens displayed</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-3 font-medium">Token Name</th>
                    <th className="px-6 py-3 font-medium">Value</th>
                    <th className="px-6 py-3 font-medium">Used By</th>
                    <th className="px-6 py-3 font-medium">Light Contrast</th>
                    <th className="px-6 py-3 font-medium">Dark Contrast</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] text-slate-700">
                  {filteredTokens.map((token) => (
                    <tr key={token.name} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3 font-mono text-slate-900">{token.name}</td>
                      <td className="px-6 py-3">
                        <button 
                          onClick={() => handleCopy(token.value)}
                          className="group flex items-center gap-2 rounded px-1.5 py-0.5 -ml-1.5 transition-colors hover:bg-slate-100"
                          title="Copy value"
                        >
                          {token.isColor ? (
                            <span 
                              className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm" 
                              style={{ backgroundColor: token.value }} 
                            />
                          ) : (
                            <span className={`inline-block ${token.visual}`}>{token.visualText}</span>
                          )}
                          <span className="font-mono text-slate-600">{token.value}</span>
                          {copiedToken === token.value ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-wrap gap-1">
                          {token.usedBy.map(use => (
                            <span key={use} className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                              {use}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-slate-500">{token.lightContrast}</td>
                      <td className="px-6 py-3 text-slate-500">{token.darkContrast}</td>
                    </tr>
                  ))}
                  {filteredTokens.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        No tokens found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}