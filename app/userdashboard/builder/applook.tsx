"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Contrast,
  LayoutTemplate,
  Moon,
  Palette as PaletteIcon,
  Pencil,
  Smile,
  Sun,
  Type,
  Zap,
} from "lucide-react";
import type { AppLook } from "../products/projectrecords";
import { FONTS, PALETTES, fontFor } from "./builder-data";
import { PRIMARY_BUTTON, StepBreadcrumb, StepFooter } from "./step-chrome";

const HEX = /^#[0-9a-f]{6}$/i;

/* ------------------------------ Small pieces ------------------------------ */

function Section({
  icon: Icon,
  title,
  subtitle,
  badge,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-blue-100 bg-blue-50 text-[#0040DF]">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            <p className="text-[11px] text-slate-500">{subtitle}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">{badge}</span>
      </div>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-xs font-semibold text-slate-800">{children}</p>;
}

/** A colour row: round swatch button (opens the picker) plus an editable hex chip. */
function ColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(value.toUpperCase());
  // Follow outside changes (picking a preset palette).
  const [shown, setShown] = useState(value);
  if (shown !== value) {
    setShown(value);
    setText(value.toUpperCase());
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <button
        type="button"
        onClick={() => pickerRef.current?.click()}
        aria-label={`Pick ${label.toLowerCase()}`}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white shadow-sm ring-2 ring-white"
        style={{ backgroundColor: value }}
      >
        <Pencil className="h-4 w-4" />
      </button>
      <input
        ref={pickerRef}
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-[11px] text-slate-500">{hint}</p>
      </div>
      <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: value }} />
        <input
          value={text}
          onChange={(event) => {
            const next = event.target.value.trim();
            setText(next);
            const hex = next.startsWith("#") ? next : `#${next}`;
            if (HEX.test(hex)) onChange(hex.toLowerCase());
          }}
          onBlur={() => setText(value.toUpperCase())}
          aria-label={`${label} hex code`}
          maxLength={7}
          className="w-[62px] bg-transparent font-mono text-xs font-semibold text-slate-800 outline-none"
        />
      </label>
    </div>
  );
}

/** A selectable card with a radio-style indicator in the corner. */
function ChoiceCard({
  selected,
  onSelect,
  children,
  className = "",
}: {
  selected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`relative rounded-xl text-left transition-all ${
        selected
          ? "border-2 border-[#0040DF] bg-white shadow-[0_4px_14px_rgba(0,64,223,0.10)]"
          : "border-2 border-transparent bg-[#F5F6FC] ring-1 ring-slate-200 hover:ring-slate-300"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return selected ? (
    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0040DF]" />
  ) : (
    <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300" />
  );
}

/* ------------------------------ Font picker ------------------------------ */

function FontPicker({ value, onChange }: { value: string; onChange: (font: string) => void }) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const font = fontFor(value);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-lg border-2 border-[#0040DF] bg-white px-3 py-2 text-left"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-blue-100 bg-blue-50 text-[#0040DF]">
          <Type className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-slate-900" style={{ fontFamily: font.stack }}>{font.name}</span>
          <span className="block truncate text-[10.5px] font-medium text-[#0040DF]">{font.description}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1.5 rounded-xl bg-white p-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.16)] ring-1 ring-slate-200">
          <ul role="listbox" aria-label="Font family">
            {FONTS.map((option) => (
              <li key={option.name}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.name === value}
                  onClick={() => {
                    onChange(option.name);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left hover:bg-slate-50"
                >
                  <span>
                    <span className="block text-sm font-semibold text-slate-900" style={{ fontFamily: option.stack }}>{option.name}</span>
                    <span className="block text-[10.5px] text-slate-500">{option.description}</span>
                  </span>
                  {option.name === value && <Check className="h-4 w-4 text-[#0040DF]" />}
                </button>
              </li>
            ))}
          </ul>
          <form
            className="mt-1 flex gap-1.5 border-t border-slate-100 p-1.5 pt-2.5"
            onSubmit={(event) => {
              event.preventDefault();
              const name = custom.trim();
              if (!name) return;
              onChange(name);
              setCustom("");
              setOpen(false);
            }}
          >
            <input
              value={custom}
              onChange={(event) => setCustom(event.target.value)}
              placeholder="Or enter another font family…"
              aria-label="Custom font family"
              className="min-w-0 flex-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-[#0040DF]"
            />
            <button type="submit" className="rounded-md bg-[#0040DF] px-3 text-xs font-semibold text-white disabled:bg-slate-300" disabled={!custom.trim()}>
              Use
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

const APPEARANCES: { id: AppLook["appearance"]; title: string; description: string; icon: React.ElementType; iconClass: string }[] = [
  { id: "light", title: "Light mode", description: "Clean, bright daytime interface (Most popular)", icon: Sun, iconClass: "border border-slate-200 bg-white text-slate-700" },
  { id: "dark", title: "Dark mode", description: "Sleek, modern, and easy on the eyes", icon: Moon, iconClass: "bg-[#1E2235] text-white" },
  { id: "dual", title: "Dual Mode", description: "Allow users to switch between light and dark mode", icon: Contrast, iconClass: "bg-[#CBD3F5] text-slate-800" },
];

const SHAPES: { id: AppLook["shape"]; title: string; description: string; radius: string }[] = [
  { id: "sharp", title: "Sharp edges", description: "Crisp, formal, and authoritative", radius: "rounded-none" },
  { id: "rounded", title: "Rounded corners", description: "Modern & friendly (Recommended)", radius: "rounded-md" },
  { id: "pill", title: "Pill shaped", description: "Soft, welcoming, and playful", radius: "rounded-full" },
];

const FEELS: { id: AppLook["brandFeel"]; title: string; icon: React.ElementType }[] = [
  { id: "trustworthy", title: "Trustworthy & Professional", icon: CheckCircle2 },
  { id: "modern", title: "Modern & Innovative", icon: Zap },
  { id: "friendly", title: "Simple & Friendly", icon: Smile },
];

/** "Choose how your app will look": colours, appearance, typography and shapes. */
export default function AppLookStep({
  initialLook,
  onBack,
  onOverview,
  onContinue,
}: {
  initialLook: AppLook;
  /** Gets the current look, so it is kept when coming back. */
  onBack: (look: AppLook) => void;
  onOverview: () => void;
  onContinue: (look: AppLook) => void;
}) {
  const [look, setLook] = useState<AppLook>(initialLook);
  const update = (patch: Partial<AppLook>) => setLook((current) => ({ ...current, ...patch }));

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-300">
      <StepBreadcrumb onOverview={onOverview} />
      <h1 className="text-2xl font-bold text-slate-900 md:text-[28px]">Choose how your app will look</h1>
      <p className="mt-1 max-w-xl text-sm text-slate-500">
        Pick your brand colors, fonts, and style. Our AI will automatically dress your entire mobile and web banking
        experience to match.
      </p>

      <div className="mt-6 space-y-5">
        {/* 1. Brand colours */}
        <Section icon={PaletteIcon} title="1. Brand Colors" subtitle="Pick a curated color theme or plug in your company brand colors" badge="Easy Pick">
          <Label>Popular color themes</Label>
          <div role="radiogroup" aria-label="Color theme" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {PALETTES.map((palette) => {
              const selected = look.paletteId === palette.id;
              return (
                <ChoiceCard
                  key={palette.id}
                  selected={selected}
                  onSelect={() => update({ paletteId: palette.id, primary: palette.primary, accent: palette.accent })}
                  className="p-3"
                >
                  <span className="flex items-center justify-between">
                    <span className="flex -space-x-1">
                      {palette.swatches.map((color, index) => (
                        <span key={index} className="h-4 w-4 rounded-full ring-2 ring-white" style={{ backgroundColor: color }} />
                      ))}
                    </span>
                    {selected && <CheckCircle2 className="h-4 w-4 text-[#0040DF]" />}
                  </span>
                  <span className="mt-3 block text-xs font-bold text-slate-900">{palette.name}</span>
                  <span className="mt-0.5 block text-[10.5px] leading-snug text-slate-500">{palette.description}</span>
                </ChoiceCard>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl bg-[#F5F6FC] p-3 ring-1 ring-slate-200">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-slate-800">Or customize your exact brand colors</p>
              <p className="text-[10.5px] text-slate-500">Hex codes or color picker</p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <ColorField
                label="Primary Brand Color"
                hint="Used for main buttons & header"
                value={look.primary}
                onChange={(primary) => update({ primary, paletteId: null })}
              />
              <ColorField
                label="Accent Color"
                hint="Used for badges & highlights"
                value={look.accent}
                onChange={(accent) => update({ accent, paletteId: null })}
              />
            </div>
          </div>

          <div className="mt-5">
            <Label>App Appearance</Label>
            <div role="radiogroup" aria-label="App appearance" className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {APPEARANCES.map(({ id, title, description, icon: Icon, iconClass }) => {
                const selected = look.appearance === id;
                return (
                  <ChoiceCard key={id} selected={selected} onSelect={() => update({ appearance: id })} className="flex items-center gap-3 p-3">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${iconClass}`} data-theme-keep>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-slate-900">{title}</span>
                      <span className="block text-[10.5px] text-slate-500">{description}</span>
                    </span>
                    <RadioDot selected={selected} />
                  </ChoiceCard>
                );
              })}
            </div>
          </div>
        </Section>

        {/* 2. Typography */}
        <Section icon={Type} title="2. Typography & Font Style" subtitle="Select the font personality that speaks to your audience" badge="Text Style">
          <Label>Choose or enter font family</Label>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Font family</p>
              <FontPicker value={look.font} onChange={(font) => update({ font })} />
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[10.5px] text-slate-500">Quick presets</span>
                {FONTS.map((font) => (
                  <button
                    key={font.name}
                    type="button"
                    aria-pressed={look.font === font.name}
                    onClick={() => update({ font: font.name })}
                    className={`rounded-full px-2.5 py-1 text-[10.5px] font-medium transition-colors ${
                      look.font === font.name ? "bg-[#0040DF] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-[#F5F6FC] p-3 ring-1 ring-slate-200">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-800">Text Size Feel</p>
                <p className="text-[10.5px] font-semibold text-[#0040DF]">
                  {look.textSize === "standard" ? "Comfortable Standard" : "Easy Read"}
                </p>
              </div>
              <div role="radiogroup" aria-label="Text size" className="grid grid-cols-2 gap-2">
                {([
                  { id: "standard", label: "Standard", className: "text-sm font-semibold" },
                  { id: "large", label: "Larger text (Easy read)", className: "text-base" },
                ] as const).map((option) => {
                  const selected = look.textSize === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => update({ textSize: option.id })}
                      className={`rounded-lg bg-white px-3 py-3 text-center text-slate-800 transition-all ${option.className} ${
                        selected ? "border-2 border-[#0040DF]" : "border-2 border-transparent ring-1 ring-slate-200 hover:ring-slate-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Section>

        {/* 3. Shapes */}
        <Section icon={LayoutTemplate} title="3. Card & Button Shapes" subtitle="Choose how sharp or curved your buttons and cards feel" badge="Shapes & Vibe">
          <Label>Button and card style</Label>
          <div role="radiogroup" aria-label="Button and card style" className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {SHAPES.map((shape) => {
              const selected = look.shape === shape.id;
              return (
                <ChoiceCard key={shape.id} selected={selected} onSelect={() => update({ shape: shape.id })} className="p-3">
                  <span
                    className={`block py-2 text-center text-[11px] font-medium text-white ${shape.radius}`}
                    style={{ backgroundColor: look.primary }}
                  >
                    Button Example
                  </span>
                  <span className="mt-3 flex items-end justify-between gap-2">
                    <span>
                      <span className="block text-xs font-bold text-slate-900">{shape.title}</span>
                      <span className="block text-[10.5px] text-slate-500">{shape.description}</span>
                    </span>
                    {selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0040DF]" />}
                  </span>
                </ChoiceCard>
              );
            })}
          </div>

          <div className="mt-5">
            <Label>Overall brand feel</Label>
            <div role="radiogroup" aria-label="Overall brand feel" className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {FEELS.map(({ id, title, icon: Icon }) => {
                const selected = look.brandFeel === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => update({ brandFeel: id })}
                    className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold transition-all ${
                      selected
                        ? "border-2 border-[#0040DF] bg-white text-[#0040DF]"
                        : "border-2 border-transparent bg-[#F5F6FC] text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {title}
                  </button>
                );
              })}
            </div>
          </div>
        </Section>
      </div>

      <StepFooter
        backLabel="Back to theme selection"
        onBack={() => onBack(look)}
        primary={
          <button type="button" onClick={() => onContinue(look)} className={PRIMARY_BUTTON}>
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        }
        note="Next: tell us a bit more about your vision (optional)."
      />
    </div>
  );
}
