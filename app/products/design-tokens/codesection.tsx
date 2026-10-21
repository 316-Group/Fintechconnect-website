'use client';
import React, { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';

// --- Types & Constants ---

type FormatId = 'json' | 'css' | 'swift' | 'compose';

interface TokenFormat {
  id: FormatId;
  label: string;
  filename: string;
  code: string;
}

const TOKEN_COUNT = 8;

const JSON_OUTPUT = `{
  "color": {
    "action": {
      "primary": {
        "$value": "#0040DF",
        "$type": "color"
      }
    },
    "text": {
      "primary": {
        "$value": "#0F172A",
        "$type": "color"
      }
    },
    "surface": {
      "canvas": {
        "$value": "#F8F9FE",
        "$type": "color"
      },
      "container": {
        "$value": "#F1F2F7",
        "$type": "color"
      }
    }
  },
  "radius": {
    "base": {
      "$value": "8px",
      "$type": "dimension"
    }
  },
  "spacing": {
    "base": {
      "$value": "12px",
      "$type": "dimension"
    }
  },
  "font": {
    "family": {
      "base": {
        "$value": "Urbanist",
        "$type": "fontFamily"
      }
    },
    "size": {
      "body": {
        "$value": "14px",
        "$type": "dimension"
      }
    }
  }
}`;

const CSS_OUTPUT = `:root {
  /* Color */
  --color-action-primary: #0040DF;
  --color-text-primary: #0F172A;
  --color-surface-canvas: #F8F9FE;
  --color-surface-container: #F1F2F7;

  /* Shape & spacing */
  --radius-base: 8px;
  --spacing-base: 12px;

  /* Typography */
  --font-family-base: 'Urbanist', system-ui, sans-serif;
  --font-size-body: 14px;
}`;

const SWIFT_OUTPUT = `import SwiftUI

enum Tokens {
    enum Colors {
        static let actionPrimary = Color(hex: 0x0040DF)
        static let textPrimary = Color(hex: 0x0F172A)
        static let surfaceCanvas = Color(hex: 0xF8F9FE)
        static let surfaceContainer = Color(hex: 0xF1F2F7)
    }

    enum Radius {
        static let base: CGFloat = 8
    }

    enum Spacing {
        static let base: CGFloat = 12
    }

    enum Typography {
        static let familyBase = "Urbanist"
        static let sizeBody: CGFloat = 14
    }
}`;

const COMPOSE_OUTPUT = `package com.example.design.tokens

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

object Tokens {
    object Colors {
        val ActionPrimary = Color(0xFF0040DF)
        val TextPrimary = Color(0xFF0F172A)
        val SurfaceCanvas = Color(0xFFF8F9FE)
        val SurfaceContainer = Color(0xFFF1F2F7)
    }

    object Radius {
        val Base = 8.dp
    }

    object Spacing {
        val Base = 12.dp
    }

    object Typography {
        const val FamilyBase = "Urbanist"
        val SizeBody = 14.sp
    }
}`;

const FORMATS: TokenFormat[] = [
  { id: 'json', label: 'JSON', filename: 'tokens.canonical.json', code: JSON_OUTPUT },
  { id: 'css', label: 'CSS variables', filename: 'tokens.css', code: CSS_OUTPUT },
  { id: 'swift', label: 'SwiftUI', filename: 'Tokens.swift', code: SWIFT_OUTPUT },
  { id: 'compose', label: 'Compose', filename: 'Tokens.kt', code: COMPOSE_OUTPUT },
];

export default function CodeSection() {
  const [activeId, setActiveId] = useState<FormatId>('json');
  const [copied, setCopied] = useState(false);

  const active = FORMATS.find((f) => f.id === activeId) ?? FORMATS[0];

  // Reset the "Copied" state shortly after copying
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.code);
      setCopied(true);
    } catch (err) {
      console.error('Unable to copy code:', err);
    }
  };

  const handleSelect = (id: FormatId) => {
    setActiveId(id);
    setCopied(false);
  };

  return (
    <section
      className="w-full bg-[#F8F9FE] py-16 text-slate-900"
      
    >
      {/* Font (swap the @import for next/font if you prefer) */}
      <style>{`
        next/font;
      `}</style>

      <div className="mx-auto max-w-[1400px] px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-[#0040DF]">
              Export Suite
            </p>
            <h2 className="mb-2 text-4xl font-bold tracking-tight text-[#0B0F1A] md:text-[44px] md:leading-[1.1]">
              Format-ready output specs.
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-slate-500">
              Compiled outputs match native token conventions for web styling, standard JSON
              trees, and typed declarations.
            </p>
          </div>

          {/* Format tabs + copy */}
          <div className="flex items-center gap-3">
            <div
              role="tablist"
              aria-label="Export format"
              className="flex items-center gap-1 rounded-lg bg-white p-1.5 shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
            >
              {FORMATS.map((format) => (
                <button
                  key={format.id}
                  role="tab"
                  aria-selected={activeId === format.id}
                  onClick={() => handleSelect(format.id)}
                  className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF] ${
                    activeId === format.id
                      ? 'bg-[#1E40AF] text-white'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {format.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-[11px] font-bold text-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E40AF]"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span aria-live="polite">{copied ? 'Copied' : 'Copy code'}</span>
            </button>
          </div>
        </div>

        {/* Code Card */}
        <div className="rounded-xl bg-white p-3 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
          <div className="mb-2 flex items-center justify-between px-1 text-[11px] text-slate-600">
            <span>{active.filename}</span>
            <span>{TOKEN_COUNT} active canonical tokens</span>
          </div>

          <div
            className="max-h-[380px] overflow-auto rounded-lg bg-[#F3F4F8] p-3"
            tabIndex={0}
            aria-label={`${active.filename} contents`}
          >
            <pre className="m-0 font-mono text-xs leading-[1.7] text-slate-900">
              <code>{active.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}