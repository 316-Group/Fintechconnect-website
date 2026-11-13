// /client/app/userdashboard/studio/edit-context.tsx
'use client';

import React, {
  createContext, useCallback, useContext, useState,
} from 'react';
import type { ModuleId } from './phone-cards';

export interface ModuleOverrides {
  text:   Record<string, string>;
  colors: Record<string, string>;
}

export type EditableTextStyle = Pick<
  React.CSSProperties,
  | 'fontFamily'
  | 'fontWeight'
  | 'fontSize'
  | 'lineHeight'
  | 'letterSpacing'
  | 'color'
  | 'backgroundColor'
  | 'textAlign'
  | 'textDecorationLine'
  | 'textTransform'
  | 'fontStyle'
  | 'width'
  | 'height'
  | 'opacity'
  | 'textShadow'
  | 'WebkitTextStroke'
>;

export interface EditState {
  mode: 'view' | 'edit';
  selectedId: ModuleId | null;
  overrides: Record<string, ModuleOverrides>;
  textStyles: Record<string, Record<string, EditableTextStyle>>;
  setText:  (moduleId: ModuleId, slot: string, value: string | null) => void;
  setColor: (moduleId: ModuleId, slot: string, value: string | null) => void;
  setTextStyle: (moduleId: ModuleId, slot: string, patch: Partial<EditableTextStyle> | null) => void;
  reset:    (moduleId: ModuleId) => void;
  activeTextSlot: string | null;
  setActiveTextSlot: (slot: string | null) => void;
}

const EditContext = createContext<EditState | null>(null);
interface ScopeValue {
  moduleId: ModuleId | null;
  active: boolean;
  variant: 'Default' | 'Masked' | 'Negative';
}
const ScopeContext = createContext<ScopeValue>({ moduleId: null, active: false, variant: 'Default' });

export function EditProvider({ value, children }: { value: EditState; children: React.ReactNode }) {
  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}

/** Wrap every rendered module so its text/colors can opt into editing. */
export function ModuleScope({
  moduleId, passive, variant, children,
}: {
  moduleId: ModuleId;
  passive?: boolean;
  variant?: 'Default' | 'Masked' | 'Negative';
  children: React.ReactNode;
}) {
  const edit = useContext(EditContext);
  const active = !passive && edit?.mode === 'edit' && edit.selectedId === moduleId;
  return <ScopeContext.Provider value={{ moduleId, active, variant: variant ?? 'Default' }}>{children}</ScopeContext.Provider>;
}

/** Owns the override map — put one of these at the top of StudioClient. */
export function useEditOverrides() {
  const [overrides, setOverrides] = useState<Record<string, ModuleOverrides>>({});
  const [textStyles, setTextStyles] = useState<Record<string, Record<string, EditableTextStyle>>>({});

  const setText = useCallback((moduleId: string, slot: string, value: string | null) => {
    setOverrides((prev) => {
      const cur = prev[moduleId] ?? { text: {}, colors: {} };
      const text = { ...cur.text };
      if (value === null) delete text[slot]; else text[slot] = value;
      return { ...prev, [moduleId]: { text, colors: cur.colors } };
    });
  }, []);

  const setColor = useCallback((moduleId: string, slot: string, value: string | null) => {
    setOverrides((prev) => {
      const cur = prev[moduleId] ?? { text: {}, colors: {} };
      const colors = { ...cur.colors };
      if (value === null || value === '') delete colors[slot]; else colors[slot] = value;
      return { ...prev, [moduleId]: { text: cur.text, colors } };
    });
  }, []);

  const setTextStyle = useCallback((
    moduleId: string,
    slot: string,
    patch: Partial<EditableTextStyle> | null,
  ) => {
    setTextStyles((prev) => {
      const currentModule = prev[moduleId] ?? {};
      const nextStyle: EditableTextStyle = patch === null ? {} : { ...currentModule[slot] };
      if (patch !== null) {
        for (const [key, value] of Object.entries(patch)) {
          if (value === undefined || value === null) {
            delete nextStyle[key as keyof EditableTextStyle];
          } else {
            Object.assign(nextStyle, { [key]: value });
          }
        }
      }

      const nextModule = { ...currentModule };
      if (Object.keys(nextStyle).length) nextModule[slot] = nextStyle;
      else delete nextModule[slot];

      if (Object.keys(nextModule).length) return { ...prev, [moduleId]: nextModule };
      const rest = { ...prev };
      delete rest[moduleId];
      return rest;
    });
  }, []);

  const reset = useCallback((moduleId: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[moduleId];
      return next;
    });
    setTextStyles((prev) => {
      const rest = { ...prev };
      delete rest[moduleId];
      return rest;
    });
  }, []);

  return { overrides, textStyles, setText, setColor, setTextStyle, reset };
}

const useScope = () => useContext(ScopeContext);
const useEdit  = () => useContext(EditContext);

/** Read a text slot, falling back to the component's live value. */
export function useModuleText(slot: string, fallback: string): string {
  const edit = useEdit(); const scope = useScope();
  if (!edit || !scope.moduleId) return fallback;
  return edit.overrides[scope.moduleId]?.text[slot] ?? fallback;
}

/** Read a color slot, falling back to the component's live value. */
export function useModuleColor(slot: string, fallback: string): string {
  const edit = useEdit(); const scope = useScope();
  if (!edit || !scope.moduleId) return fallback;
  return edit.overrides[scope.moduleId]?.colors[slot] ?? fallback;
}

export function useModuleTextStyle(slot: string): EditableTextStyle {
  const edit = useEdit();
  const scope = useScope();
  if (!edit || !scope.moduleId) return {};
  return edit.textStyles[scope.moduleId]?.[slot] ?? {};
}

/**
 * Selected text can be edited inline or through the text-formatting panel.
 */
export function EditableText({
  slot, fallback, className, style,
}: {
  slot: string; fallback: string;
  className?: string; style?: React.CSSProperties;
}) {
  const edit  = useEdit();
  const scope = useScope();
  const value = useModuleText(slot, fallback);
  const textStyle = useModuleTextStyle(slot);
  const [editing, setEditing] = useState(false);
  const isEditing = editing && edit?.activeTextSlot === slot;
  const isSelectedSlot = edit?.activeTextSlot === slot && scope.moduleId === edit.selectedId;
  const isFinancialValue = /balance|amount|available|total|value|^amt$|^bal$|^tx\d+Amount$/i.test(slot);
  const displayValue = scope.variant === 'Masked' && isFinancialValue
    ? value.replace(/\d/g, '•')
    : scope.variant === 'Negative' && isFinancialValue && !/^\s*-/.test(value)
      ? value.replace(/^(\s*)([$€£¥])/, '$1-$2').replace(/^((?!\s*[-$€£¥]).+)/, '-$1')
      : value;
  const resolvedStyle: React.CSSProperties = {
    ...style,
    ...textStyle,
    ...(scope.variant === 'Negative' && isFinancialValue && !textStyle.color ? { color: '#dc2626' } : {}),
    ...(textStyle.textAlign ? { display: 'block', width: '100%' } : {}),
    ...(textStyle.width !== undefined || textStyle.height !== undefined ? { display: 'inline-block' } : {}),
  };

  if (!edit || !scope.moduleId || !scope.active) {
    return <span className={className} style={resolvedStyle}>{displayValue}</span>;
  }

  if (isEditing) {
    return (
      <input
        autoFocus
        value={value}
        onChange={(e) => edit.setText(scope.moduleId!, slot, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter')  (e.target as HTMLInputElement).blur();
          if (e.key === 'Escape') setEditing(false);
        }}
        data-text-slot={slot}
        className={`${className ?? ''} rounded bg-white px-1 outline-none ring-2 ring-[#0040DF]`}
        style={{ ...resolvedStyle, color: textStyle.color ?? '#0f172a' }}
      />
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      title="Click to edit"
      data-text-slot={slot}
      data-text-slot-selected={isSelectedSlot || undefined}
      onClick={(e) => { 
        e.stopPropagation(); 
        setEditing(true); 
        edit.setActiveTextSlot(slot);
      }}
      className={`${className ?? ''} cursor-text rounded transition ${
        isSelectedSlot
          ? 'bg-blue-100/60 ring-2 ring-[#0040DF]'
          : 'hover:bg-blue-100/60 hover:ring-1 hover:ring-[#0040DF]/40'
      }`}
      style={resolvedStyle}
    >
      {displayValue}
    </span>
  );
}