// /client/app/userdashboard/studio/othertabs.tsx
'use client';

import React from 'react';
import {
  AlignCenterHorizontal, AlignEndHorizontal, AlignStartHorizontal, AlignVerticalSpaceBetween,
  ArrowDown, ArrowRight, CircleCheck, Columns3, Link2, Lock, LockOpen, Monitor, Pin,
  Smartphone, Tablet, TextWrap, Unlink2,
} from 'lucide-react';

/* ─────────────────────────── layout model ─────────────────────────── */

export type LayoutInsets = { top: number; right: number; bottom: number; left: number };
export type SizeMode = 'fixed' | 'fill' | 'hug';
export type LayoutDirection = 'horizontal' | 'vertical' | 'wrap';
export type LayoutAlign = 'start' | 'center' | 'end';
export type LayoutJustify = 'start' | 'space-between' | 'space-around';
export type LayoutPosition = 'relative' | 'absolute' | 'sticky';
export type ResponsiveTarget = 'mobile' | 'tablet' | 'desktop';

/** Layout properties stored on an object's box, edited from the Layout tab. */
export type LayoutFields = {
  margin?: LayoutInsets;
  widthMode?: SizeMode;
  heightMode?: SizeMode;
  minW?: number;
  maxW?: number;
  /** Keeps the width/height ratio when one of them is edited. */
  aspectLocked?: boolean;
  /** Auto layout (flex) applied to the component's own content. */
  autoLayout?: boolean;
  layoutDirection?: LayoutDirection;
  alignItems?: LayoutAlign;
  justifyContent?: LayoutJustify;
  rowGap?: number;
  colGap?: number;
  /** false = one value for all four padding sides. */
  paddingIndividual?: boolean;
  position?: LayoutPosition;
  zIndex?: number;
  /** Stretches the object between the left and right edges of its container. */
  pinLeftRight?: boolean;
  responsiveTarget?: ResponsiveTarget;
};

/** The parts of a studio box the Layout tab reads and writes. */
export type LayoutBox = LayoutFields & {
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  padding?: LayoutInsets;
  strokeWidth?: number;
};

const ZERO: LayoutInsets = { top: 0, right: 0, bottom: 0, left: 0 };

/** "Reset box" clears spacing and layout rules but keeps the object's size and position. */
const LAYOUT_RESET: Partial<LayoutBox> = {
  margin: undefined, padding: undefined, widthMode: undefined, heightMode: undefined,
  minW: undefined, maxW: undefined, aspectLocked: undefined, autoLayout: undefined,
  layoutDirection: undefined, alignItems: undefined, justifyContent: undefined,
  rowGap: undefined, colGap: undefined, paddingIndividual: undefined, position: undefined,
  zIndex: undefined, pinLeftRight: undefined, responsiveTarget: undefined,
};
const insetsCss = (i: LayoutInsets) => `${i.top}px ${i.right}px ${i.bottom}px ${i.left}px`;

const ALIGN_CSS: Record<LayoutAlign, string> = { start: 'flex-start', center: 'center', end: 'flex-end' };
const JUSTIFY_CSS: Record<LayoutJustify, string> = {
  start: 'flex-start', 'space-between': 'space-between', 'space-around': 'space-around',
};

/** Size of one dimension of the object's wrapper, honouring Fill / Hug / pinning. */
export function layoutSize(mode: SizeMode | undefined, pinned: boolean, fixed: number | undefined) {
  if (pinned || mode === 'fill') return '100%';
  if (mode === 'hug') return 'fit-content';
  return fixed;
}

/** Wrapper styles (margin, min/max width, position, stacking) for an object's box. */
export function layoutWrapperStyle(box: LayoutBox): React.CSSProperties {
  const style: React.CSSProperties = {};
  if (box.margin) style.margin = insetsCss(box.margin);
  if (box.minW !== undefined) style.minWidth = box.minW;
  if (box.maxW !== undefined) style.maxWidth = box.maxW;
  if (box.zIndex !== undefined) style.zIndex = box.zIndex;
  if (box.position === 'sticky') {
    style.position = 'sticky';
    style.top = 0;
  }
  return style;
}

/**
 * Auto layout turns the component's root card into a flex container, so its
 * direct parts are laid out horizontally, vertically or wrapped with gaps.
 */
export function autoLayoutCss(objectId: string, box: LayoutBox) {
  if (!box.autoLayout) return null;
  const direction = box.layoutDirection ?? 'vertical';
  const selector = `[data-module-id=${JSON.stringify(objectId)}] > [data-module-content-root] [data-module-content] > :first-child`;
  return `${selector} {
  display: flex !important;
  flex-direction: ${direction === 'vertical' ? 'column' : 'row'} !important;
  flex-wrap: ${direction === 'wrap' ? 'wrap' : 'nowrap'} !important;
  align-items: ${box.alignItems ? ALIGN_CSS[box.alignItems] : 'stretch'} !important;
  justify-content: ${JUSTIFY_CSS[box.justifyContent ?? 'start']} !important;
  row-gap: ${box.rowGap ?? 12}px !important;
  column-gap: ${box.colGap ?? 0}px !important;
}`;
}

/* ─────────────────────────── shared bits ─────────────────────────── */

const numberInputCls =
  'w-full min-w-0 bg-transparent text-[11px] font-semibold text-slate-800 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

const toNumber = (value: string) => (value === '' ? undefined : Math.max(0, Number(value) || 0));

function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center justify-between">
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-800">{children}</span>
      {right}
    </div>
  );
}

/** A number shown as plain text inside the box-model diagram, editable in place. */
function DiagramValue({
  value, onChange, label, className = '',
}: { value: number; onChange: (value: number) => void; label: string; className?: string }) {
  return (
    <input
      type="number"
      min={0}
      aria-label={label}
      title={label}
      value={value}
      onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
      className={`w-10 rounded bg-transparent text-center text-[10px] font-semibold outline-none hover:bg-white/70 focus:bg-white focus:ring-1 focus:ring-[#0040DF] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none ${className}`}
    />
  );
}

function Segmented<T extends string>({
  value, options, onChange,
}: {
  value: T;
  options: { id: T; label: string; Icon: React.ComponentType<{ className?: string }> }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg bg-[#EEF0FF] p-1">
      {options.map(({ id, label, Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-[11px] font-semibold transition ${
              active ? 'bg-white text-[#0040DF] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── Layout tab ─────────────────────────── */

export function LayoutTab({
  box, measured, supportsAutoLayout, onChange,
}: {
  box: LayoutBox;
  /** Rendered size, used when the box has no stored width/height. */
  measured: { w: number; h: number } | null;
  /** Auto layout only rearranges components (frames and shapes have no inner parts). */
  supportsAutoLayout: boolean;
  onChange: (patch: Partial<LayoutBox>) => void;
}) {
  const margin = box.margin ?? ZERO;
  const padding = box.padding ?? ZERO;
  const width = box.w ?? measured?.w ?? 0;
  const height = box.h ?? measured?.h ?? 0;
  const widthMode = box.pinLeftRight ? 'fill' : box.widthMode ?? 'fixed';
  const heightMode = box.heightMode ?? 'fixed';
  const individual = box.paddingIndividual !== false;
  const direction = box.layoutDirection ?? 'vertical';
  const position = box.position ?? 'relative';

  const setMargin = (side: keyof LayoutInsets, value: number) =>
    onChange({ margin: { ...margin, [side]: value } });
  const setPadding = (side: keyof LayoutInsets, value: number) =>
    onChange({ padding: individual ? { ...padding, [side]: value } : { top: value, right: value, bottom: value, left: value } });

  const setWidth = (value: number | undefined) => {
    const patch: Partial<LayoutBox> = { w: value, widthMode: 'fixed', pinLeftRight: false };
    if (box.aspectLocked && value !== undefined && width > 0 && height > 0) {
      patch.h = Math.round((value * height) / width);
    }
    onChange(patch);
  };
  const setHeight = (value: number | undefined) => {
    const patch: Partial<LayoutBox> = { h: value, heightMode: 'fixed' };
    if (box.aspectLocked && value !== undefined && width > 0 && height > 0) {
      patch.w = Math.round((value * width) / height);
    }
    onChange(patch);
  };

  const cycleSizeMode = (mode: SizeMode): SizeMode => (mode === 'fixed' ? 'fill' : mode === 'fill' ? 'hug' : 'fixed');
  const sizeModeLabel = (mode: SizeMode) => (mode === 'fill' ? 'Fill (100%)' : mode === 'hug' ? 'Hug' : 'Fixed');

  const alignButtons: {
    key: string; title: string; Icon: React.ComponentType<{ className?: string }>;
    active: boolean; onClick: () => void;
  }[] = [
    { key: 'start', title: 'Align start', Icon: AlignStartHorizontal, active: box.alignItems === 'start', onClick: () => onChange({ alignItems: box.alignItems === 'start' ? undefined : 'start' }) },
    { key: 'center', title: 'Align center', Icon: AlignCenterHorizontal, active: box.alignItems === 'center', onClick: () => onChange({ alignItems: box.alignItems === 'center' ? undefined : 'center' }) },
    { key: 'end', title: 'Align end', Icon: AlignEndHorizontal, active: box.alignItems === 'end', onClick: () => onChange({ alignItems: box.alignItems === 'end' ? undefined : 'end' }) },
    { key: 'between', title: 'Space between', Icon: AlignVerticalSpaceBetween, active: box.justifyContent === 'space-between', onClick: () => onChange({ justifyContent: box.justifyContent === 'space-between' ? 'start' : 'space-between' }) },
    { key: 'around', title: 'Space around', Icon: Columns3, active: box.justifyContent === 'space-around', onClick: () => onChange({ justifyContent: box.justifyContent === 'space-around' ? 'start' : 'space-around' }) },
  ];

  return (
    <div className="space-y-0 text-slate-700">
      {/* Box model & spacing */}
      <section className="border-b border-slate-200 px-3 py-3">
        <SectionTitle
          right={
            <button type="button" onClick={() => onChange(LAYOUT_RESET)} className="text-[11px] font-semibold text-[#0040DF] hover:underline">
              Reset box
            </button>
          }
        >
          Box Model &amp; Spacing
        </SectionTitle>

        <div className="rounded-xl bg-[#EEF0FF] p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Margin</span>
          </div>
          <div className="flex justify-center">
            <DiagramValue label="Margin top" value={margin.top} onChange={(v) => setMargin('top', v)} className="text-slate-600" />
          </div>
          <div className="flex items-center gap-1">
            <DiagramValue label="Margin left" value={margin.left} onChange={(v) => setMargin('left', v)} className="w-7 shrink-0 text-slate-600" />

            <div className="min-w-0 flex-1 rounded-lg bg-[#DCE1FF] px-1.5 py-2">
              <div className="flex items-start justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#0040DF]">Padding</span>
                <label className="flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  Border (
                  <input
                    type="number"
                    min={0}
                    aria-label="Border width"
                    value={box.strokeWidth ?? 0}
                    onChange={(e) => onChange({ strokeWidth: Math.max(0, Number(e.target.value) || 0) })}
                    className="w-5 bg-transparent text-center font-bold outline-none focus:bg-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  px)
                </label>
                <span className="w-10" />
              </div>
              <div className="flex justify-center">
                <DiagramValue label="Padding top" value={padding.top} onChange={(v) => setPadding('top', v)} className="text-[#0040DF]" />
              </div>
              <div className="flex items-center justify-between gap-1">
                <DiagramValue label="Padding left" value={padding.left} onChange={(v) => setPadding('left', v)} className="w-8 shrink-0 text-[#0040DF]" />
                <div className="min-w-0 truncate rounded-md bg-[#0040DF] px-2.5 py-2 text-center text-[11px] font-bold text-white shadow-sm">
                  {Math.round(width)} × {Math.round(height)} pt
                </div>
                <DiagramValue label="Padding right" value={padding.right} onChange={(v) => setPadding('right', v)} className="w-8 shrink-0 text-[#0040DF]" />
              </div>
              <div className="flex justify-center">
                <DiagramValue label="Padding bottom" value={padding.bottom} onChange={(v) => setPadding('bottom', v)} className="text-[#0040DF]" />
              </div>
            </div>

            <DiagramValue label="Margin right" value={margin.right} onChange={(v) => setMargin('right', v)} className="w-7 shrink-0 text-slate-600" />
          </div>
          <div className="flex justify-center">
            <DiagramValue label="Margin bottom" value={margin.bottom} onChange={(v) => setMargin('bottom', v)} className="text-slate-600" />
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="border-b border-slate-200 px-3 py-3">
        <SectionTitle
          right={
            <button
              type="button"
              aria-pressed={!!box.aspectLocked}
              title={box.aspectLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
              onClick={() => onChange({ aspectLocked: !box.aspectLocked })}
              className={`grid h-6 w-6 place-items-center rounded-md ${box.aspectLocked ? 'bg-[#EEF0FF] text-[#0040DF]' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
            >
              {box.aspectLocked ? <Lock className="h-3.5 w-3.5" /> : <LockOpen className="h-3.5 w-3.5" />}
            </button>
          }
        >
          Dimensions
        </SectionTitle>

        <div className="grid grid-cols-2 gap-2">
          {([
            { axis: 'W', title: 'Width', mode: widthMode, value: width, set: setWidth, setMode: (m: SizeMode) => onChange({ widthMode: m, pinLeftRight: false }) },
            { axis: 'H', title: 'Height', mode: heightMode, value: height, set: setHeight, setMode: (m: SizeMode) => onChange({ heightMode: m }) },
          ] as const).map(({ axis, title, mode, value, set, setMode }) => (
            <div key={axis} className="rounded-lg bg-[#EEF0FF] p-2">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700">{title}</span>
                <button
                  type="button"
                  title="Switch between Fixed, Fill and Hug"
                  onClick={() => setMode(cycleSizeMode(mode))}
                  className={`text-[10px] font-semibold ${mode === 'fixed' ? 'text-slate-500' : 'text-[#0040DF]'} hover:underline`}
                >
                  {sizeModeLabel(mode)}
                </button>
              </div>
              <label className="flex h-7 items-center gap-2 rounded-md bg-white px-2">
                <span className="text-[11px] font-semibold text-slate-500">{axis}</span>
                <input
                  type="number"
                  min={0}
                  aria-label={title}
                  value={Math.round(value) || ''}
                  onChange={(e) => set(toNumber(e.target.value))}
                  className={numberInputCls}
                />
                <span className="text-[10px] text-slate-400">px</span>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          {([
            { key: 'minW', label: 'Min-W', value: box.minW },
            { key: 'maxW', label: 'Max-W', value: box.maxW },
          ] as const).map(({ key, label, value }) => (
            <label key={key} className="flex h-8 items-center gap-2 rounded-lg bg-[#EEF0FF] px-2">
              <span className="text-[11px] text-slate-500">{label}:</span>
              <input
                type="number"
                min={0}
                placeholder="—"
                aria-label={label}
                value={value ?? ''}
                onChange={(e) => onChange({ [key]: toNumber(e.target.value) })}
                className={`${numberInputCls} text-right`}
              />
              <span className="text-[10px] text-slate-400">px</span>
            </label>
          ))}
        </div>
      </section>

      {/* Auto layout / flex */}
      <section className="border-b border-slate-200 px-3 py-3">
        <SectionTitle
          right={
            <button
              type="button"
              aria-pressed={!!box.autoLayout}
              disabled={!supportsAutoLayout}
              onClick={() => onChange({ autoLayout: !box.autoLayout })}
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition disabled:opacity-40 ${
                box.autoLayout ? 'bg-[#DCE1FF] text-[#0040DF]' : 'bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
            >
              {box.autoLayout ? 'Active' : 'Off'}
            </button>
          }
        >
          Auto Layout / Flex
        </SectionTitle>

        {!supportsAutoLayout ? (
          <p className="rounded-lg bg-slate-50 px-2.5 py-2 text-[11px] text-slate-500">
            Auto layout arranges the parts inside a component. Select a component to use it.
          </p>
        ) : (
          <div className={box.autoLayout ? '' : 'pointer-events-none opacity-50'}>
            <Segmented<LayoutDirection>
              value={direction}
              onChange={(value) => onChange({ layoutDirection: value })}
              options={[
                { id: 'horizontal', label: 'Horizontal', Icon: ArrowRight },
                { id: 'vertical', label: 'Vertical', Icon: ArrowDown },
                { id: 'wrap', label: 'Wrap', Icon: TextWrap },
              ]}
            />

            <div className="mb-1.5 mt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-600">Alignment &amp; Distribution</span>
              <span className="text-[10px] font-semibold text-[#0040DF]">
                {box.justifyContent && box.justifyContent !== 'start' ? box.justifyContent : box.alignItems ?? 'stretch'}
              </span>
            </div>
            <div className="flex gap-1 rounded-lg bg-[#EEF0FF] p-1">
              {alignButtons.map(({ key, title, Icon, active, onClick }) => (
                <button
                  key={key}
                  type="button"
                  title={title}
                  aria-pressed={active}
                  onClick={onClick}
                  className={`grid h-7 flex-1 place-items-center rounded-md transition ${
                    active ? 'bg-white text-[#0040DF] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              {([
                { key: 'rowGap', label: 'Row Gap', value: box.rowGap ?? 12 },
                { key: 'colGap', label: 'Col Gap', value: box.colGap ?? 0 },
              ] as const).map(({ key, label, value }) => (
                <label key={key} className="flex h-8 items-center gap-2 rounded-lg bg-[#EEF0FF] px-2">
                  <span className="shrink-0 text-[11px] text-slate-600">{label}</span>
                  <input
                    type="number"
                    min={0}
                    aria-label={label}
                    value={value}
                    onChange={(e) => onChange({ [key]: Math.max(0, Number(e.target.value) || 0) })}
                    className={`${numberInputCls} text-right`}
                  />
                  <span className="text-[10px] text-slate-400">px</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mt-2 rounded-lg bg-[#EEF0FF] p-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] text-slate-600">Padding values</span>
            <button
              type="button"
              aria-pressed={individual}
              onClick={() => onChange({ paddingIndividual: !individual })}
              className="flex items-center gap-1 text-[10px] font-semibold text-[#0040DF] hover:underline"
            >
              {individual ? <Link2 className="h-3 w-3" /> : <Unlink2 className="h-3 w-3" />}
              {individual ? 'Individual' : 'All sides'}
            </button>
          </div>
          {individual ? (
            <div className="grid grid-cols-4 gap-1.5">
              {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                <label key={side} className="flex flex-col items-center gap-0.5 rounded-md bg-white py-1">
                  <span className="text-[9px] font-semibold uppercase text-slate-400">{side[0]}</span>
                  <input
                    type="number"
                    min={0}
                    aria-label={`Padding ${side}`}
                    value={padding[side]}
                    onChange={(e) => setPadding(side, Math.max(0, Number(e.target.value) || 0))}
                    className={`${numberInputCls} text-center`}
                  />
                </label>
              ))}
            </div>
          ) : (
            <label className="flex h-8 items-center gap-2 rounded-md bg-white px-2">
              <span className="text-[11px] text-slate-500">All</span>
              <input
                type="number"
                min={0}
                aria-label="Padding, all sides"
                value={padding.top}
                onChange={(e) => setPadding('top', Math.max(0, Number(e.target.value) || 0))}
                className={`${numberInputCls} text-right`}
              />
              <span className="text-[10px] text-slate-400">px</span>
            </label>
          )}
        </div>
      </section>

      {/* Position & constraints */}
      <section className="border-b border-slate-200 px-3 py-3">
        <SectionTitle>Position &amp; Constraints</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex h-8 items-center justify-between gap-2 rounded-lg bg-[#EEF0FF] px-2">
            <span className="text-[11px] text-slate-500">Position:</span>
            <select
              aria-label="Position"
              value={position}
              onChange={(e) => onChange({ position: e.target.value as LayoutPosition })}
              className="min-w-0 cursor-pointer bg-transparent text-right text-[11px] font-semibold text-slate-800 outline-none"
            >
              <option value="relative">Relative</option>
              <option value="absolute">Absolute</option>
              <option value="sticky">Sticky</option>
            </select>
          </label>
          <label className="flex h-8 items-center gap-2 rounded-lg bg-[#EEF0FF] px-2">
            <span className="shrink-0 text-[11px] text-slate-500">Z-Index:</span>
            <input
              type="number"
              aria-label="Z-index"
              placeholder="auto"
              value={box.zIndex ?? ''}
              onChange={(e) => onChange({ zIndex: e.target.value === '' ? undefined : Number(e.target.value) || 0 })}
              className={`${numberInputCls} text-right`}
            />
          </label>
        </div>

        <button
          type="button"
          aria-pressed={!!box.pinLeftRight}
          onClick={() => onChange({ pinLeftRight: !box.pinLeftRight })}
          className="mt-2 flex w-full items-center gap-2.5 rounded-lg bg-[#EEF0FF] px-2.5 py-2.5 text-left"
        >
          <Pin className="h-4 w-4 shrink-0 text-[#0040DF]" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold text-slate-800">Pin to Left &amp; Right</span>
            <span className="block text-[10px] text-slate-500">Stretches with device viewport</span>
          </span>
          <CircleCheck className={`h-4 w-4 shrink-0 ${box.pinLeftRight ? 'text-[#0040DF]' : 'text-slate-300'}`} />
        </button>
      </section>

      {/* Responsive rules */}
      <section className="px-3 py-3">
        <SectionTitle>Responsive Rules</SectionTitle>
        <Segmented<ResponsiveTarget>
          value={box.responsiveTarget ?? 'mobile'}
          onChange={(value) => onChange({ responsiveTarget: value })}
          options={[
            { id: 'mobile', label: 'Mobile', Icon: Smartphone },
            { id: 'tablet', label: 'Tablet', Icon: Tablet },
            { id: 'desktop', label: 'Desktop', Icon: Monitor },
          ]}
        />
      </section>
    </div>
  );
}
