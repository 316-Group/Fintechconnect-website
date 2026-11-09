// /client/app/userdashboard/studio/edit-context.tsx
'use client';

import React, {
  createContext, useCallback, useContext, useEffect, useState,
} from 'react';
import type { ModuleId } from './phone-cards';

export interface ModuleOverrides {
  text:   Record<string, string>;
  colors: Record<string, string>;
}

export interface EditState {
  mode: 'view' | 'edit';
  selectedId: ModuleId | null;
  overrides: Record<string, ModuleOverrides>;
  setText:  (moduleId: ModuleId, slot: string, value: string | null) => void;
  setColor: (moduleId: ModuleId, slot: string, value: string | null) => void;
  reset:    (moduleId: ModuleId) => void;
}

const EditContext = createContext<EditState | null>(null);
interface ScopeValue { moduleId: ModuleId | null; active: boolean }
const ScopeContext = createContext<ScopeValue>({ moduleId: null, active: false });

export function EditProvider({ value, children }: { value: EditState; children: React.ReactNode }) {
  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}

/** Wrap every rendered module so its text/colors can opt into editing. */
export function ModuleScope({
  moduleId, passive, children,
}: { moduleId: ModuleId; passive?: boolean; children: React.ReactNode }) {
  const edit = useContext(EditContext);
  const active = !passive && edit?.mode === 'edit' && edit.selectedId === moduleId;
  return <ScopeContext.Provider value={{ moduleId, active }}>{children}</ScopeContext.Provider>;
}

/** Owns the override map — put one of these at the top of StudioClient. */
export function useEditOverrides() {
  const [overrides, setOverrides] = useState<Record<string, ModuleOverrides>>({});

  const setText = useCallback((moduleId: string, slot: string, value: string | null) => {
    setOverrides((prev) => {
      const cur = prev[moduleId] ?? { text: {}, colors: {} };
      const text = { ...cur.text };
      if (value === null || value === '') delete text[slot]; else text[slot] = value;
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

  const reset = useCallback((moduleId: string) => {
    setOverrides((prev) => {
      const { [moduleId]: _omit, ...rest } = prev;
      return rest;
    });
  }, []);

  return { overrides, setText, setColor, reset };
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

/**
 * Inline-editable text. Renders plain <span> when not selected; when the
 * module is selected, it becomes click-to-edit with an input on activation.
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
  const [editing, setEditing] = useState(false);

  useEffect(() => { if (!scope.active) setEditing(false); }, [scope.active]);

  if (!edit || !scope.moduleId || !scope.active) {
    return <span className={className} style={style}>{value}</span>;
  }

  if (editing) {
    return (
      <input
        autoFocus
        defaultValue={value}
        onClick={(e) => e.stopPropagation()}
        onBlur={(e) => {
          const v = e.target.value;
          edit.setText(scope.moduleId!, slot, v === '' || v === fallback ? null : v);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter')  (e.target as HTMLInputElement).blur();
          if (e.key === 'Escape') setEditing(false);
        }}
        className={`${className ?? ''} rounded bg-white px-1 text-slate-900 outline-none ring-2 ring-[#0040DF]`}
        style={{ ...style, color: '#0f172a' }}
      />
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      title="Click to edit"
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      className={`${className ?? ''} cursor-text rounded transition hover:bg-blue-100/60 hover:ring-1 hover:ring-[#0040DF]/40`}
      style={style}
    >
      {value}
    </span>
  );
}