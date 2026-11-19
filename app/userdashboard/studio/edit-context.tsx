// /client/app/userdashboard/studio/edit-context.tsx
'use client';

import React, {
  createContext, useCallback, useContext, useState, useRef, useEffect,
  useMemo, useLayoutEffect,
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

export interface ElementBox {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export interface PlacedAsset {
  id: string;
  name: string;
  url: string;
}

const EMPTY_PLACED_ASSETS: PlacedAsset[] = [];
const EMPTY_HIDDEN_ELEMENTS: string[] = [];

export const CORNER_HANDLES = [
  { k: 'nw', cls: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize' },
  { k: 'ne', cls: 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize' },
  { k: 'sw', cls: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize' },
  { k: 'se', cls: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize' },
] as const;

export const EDGE_HANDLES = [
  { k: 'n', cls: 'top-0 inset-x-2 h-2 -translate-y-1/2 cursor-ns-resize' },
  { k: 's', cls: 'bottom-0 inset-x-2 h-2 translate-y-1/2 cursor-ns-resize' },
  { k: 'w', cls: 'left-0 inset-y-2 w-2 -translate-x-1/2 cursor-ew-resize' },
  { k: 'e', cls: 'right-0 inset-y-2 w-2 translate-x-1/2 cursor-ew-resize' },
] as const;

export interface EditState {
  mode: 'view' | 'edit';
  selectedId: ModuleId | null;
  overrides: Record<string, ModuleOverrides>;
  textStyles: Record<string, Record<string, EditableTextStyle>>;
  elementBoxes: Record<string, Record<string, ElementBox>>;
  placedAssets: Record<string, PlacedAsset[]>;
  hiddenElements: Record<string, string[]>;
  addPlacedAsset: (moduleId: string, asset: PlacedAsset) => void;
  deleteElement: (moduleId: string, elementId: string) => void;
  activeElementId: string | null;
  setActiveElementId: (id: string | null) => void;
  setElementBox: (moduleId: string, elementId: string, patch: Partial<ElementBox> | null) => void;
  resetElementBoxes: (moduleId: string) => void;
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

/** Every saveable map owned by useEditOverrides. */
export type EditOverridesSnapshot = {
  overrides: Record<string, ModuleOverrides>;
  textStyles: Record<string, Record<string, EditableTextStyle>>;
  elementBoxes: Record<string, Record<string, ElementBox>>;
  placedAssets: Record<string, PlacedAsset[]>;
  hiddenElements: Record<string, string[]>;
};

/** Owns the override and element tinkering maps — put one of these at the top of StudioClient. */
export function useEditOverrides() {
  const [overrides, setOverrides] = useState<Record<string, ModuleOverrides>>({});
  const [textStyles, setTextStyles] = useState<Record<string, Record<string, EditableTextStyle>>>({});
  const [elementBoxes, setElementBoxes] = useState<Record<string, Record<string, ElementBox>>>({});
  const [placedAssets, setPlacedAssets] = useState<Record<string, PlacedAsset[]>>({});
  const [hiddenElements, setHiddenElements] = useState<Record<string, string[]>>({});
  const [activeElementId, setActiveElementId] = useState<string | null>(null);

  const addPlacedAsset = useCallback((moduleId: string, asset: PlacedAsset) => {
    setPlacedAssets((prev) => ({
      ...prev,
      [moduleId]: [...(prev[moduleId] ?? []), asset],
    }));
  }, []);

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

  const setElementBox = useCallback((
    moduleId: string,
    elementId: string,
    patch: Partial<ElementBox> | null,
  ) => {
    setElementBoxes((prev) => {
      const currentModule = prev[moduleId] ?? {};
      if (patch === null) {
        const next = { ...currentModule };
        delete next[elementId];
        if (Object.keys(next).length === 0) {
          const rest = { ...prev };
          delete rest[moduleId];
          return rest;
        }
        return { ...prev, [moduleId]: next };
      }
      const existing = currentModule[elementId] ?? {};
      const updated = { ...existing, ...patch };
      return {
        ...prev,
        [moduleId]: {
          ...currentModule,
          [elementId]: updated,
        },
      };
    });
  }, []);

  const deleteElement = useCallback((moduleId: string, elementId: string) => {
    if (elementId.startsWith('asset-')) {
      setPlacedAssets((prev) => ({
        ...prev,
        [moduleId]: (prev[moduleId] ?? []).filter((asset) => asset.id !== elementId),
      }));
    } else {
      setHiddenElements((prev) => ({
        ...prev,
        [moduleId]: [...new Set([...(prev[moduleId] ?? []), elementId])],
      }));
    }
    setElementBox(moduleId, elementId, null);
    setActiveElementId((current) => current === elementId ? null : current);
  }, [setElementBox]);

  const resetElementBoxes = useCallback((moduleId: string) => {
    setElementBoxes((prev) => {
      const rest = { ...prev };
      delete rest[moduleId];
      return rest;
    });
    setHiddenElements((prev) => {
      const rest = { ...prev };
      delete rest[moduleId];
      return rest;
    });
    setActiveElementId(null);
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
    setElementBoxes((prev) => {
      const rest = { ...prev };
      delete rest[moduleId];
      return rest;
    });
    setPlacedAssets((prev) => {
      const rest = { ...prev };
      delete rest[moduleId];
      return rest;
    });
    setHiddenElements((prev) => {
      const rest = { ...prev };
      delete rest[moduleId];
      return rest;
    });
    setActiveElementId(null);
  }, []);

  /** Replaces every map at once (loading a saved build, undo/redo). Missing maps become empty. */
  const restore = useCallback((saved: Partial<EditOverridesSnapshot>) => {
    setOverrides(saved.overrides ?? {});
    setTextStyles(saved.textStyles ?? {});
    setElementBoxes(saved.elementBoxes ?? {});
    setPlacedAssets(saved.placedAssets ?? {});
    setHiddenElements(saved.hiddenElements ?? {});
    setActiveElementId(null);
  }, []);

  return {
    restore,
    overrides,
    textStyles,
    elementBoxes,
    placedAssets,
    hiddenElements,
    addPlacedAsset,
    deleteElement,
    activeElementId,
    setActiveElementId,
    setElementBox,
    resetElementBoxes,
    setText,
    setColor,
    setTextStyle,
    reset,
  };
}

export const useScope = () => useContext(ScopeContext);
export const useEdit  = () => useContext(EditContext);

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
 * Identifies the element within the host component cleanly and deterministically.
 */
export function getTinkerElementId(el: HTMLElement, host: HTMLElement): string {
  // 1. Button element
  const button = el.closest<HTMLElement>('button, [role="button"]:not([data-text-slot])');
  if (button && host.contains(button)) {
    if (button.dataset.studioElement) return button.dataset.studioElement;
    const aria = button.getAttribute('aria-label');
    if (aria) return `btn-${aria.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const txt = button.textContent?.trim().slice(0, 16).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (txt) return `btn-${txt}`;
    const allButtons = Array.from(host.querySelectorAll<HTMLElement>('button, [role="button"]:not([data-text-slot])'));
    const idx = allButtons.indexOf(button);
    return `btn-${idx >= 0 ? idx : 'action'}`;
  }

  // 2. Editable text slot
  const textSlot = el.closest<HTMLElement>('[data-text-slot]');
  if (textSlot && host.contains(textSlot)) {
    return textSlot.getAttribute('data-text-slot')!;
  }

  // 3. Explicit data-studio-element
  const explicit = el.closest<HTMLElement>('[data-studio-element]');
  if (explicit && host.contains(explicit)) {
    return explicit.getAttribute('data-studio-element')!;
  }

  // 4. Tap component
  const tap = el.closest<HTMLElement>('[data-tap-root]');
  if (tap && host.contains(tap)) {
    return tap.getAttribute('data-tap-root') || 'tap-action';
  }

  // 5. Direct or meaningful child container (e.g. image, svg, section)
  const candidate = el.closest<HTMLElement>('img, svg, [data-slot]');
  if (candidate && host.contains(candidate)) {
    if (candidate.dataset.slot) return candidate.dataset.slot;
    const tag = candidate.tagName.toLowerCase();
    const all = Array.from(host.querySelectorAll(tag));
    return `${tag}-${all.indexOf(candidate)}`;
  }

  // 6. Direct child of host
  let curr: HTMLElement | null = el;
  while (curr && curr.parentElement !== host) {
    curr = curr.parentElement;
  }
  if (curr && curr !== host) {
    const children = Array.from(host.children);
    const idx = children.indexOf(curr);
    return `part-${idx >= 0 ? idx : '0'}`;
  }

  return 'element';
}

/**
 * Finds the DOM node inside host corresponding to an elementId.
 */
export function findElementById(host: HTMLElement, id: string): HTMLElement | null {
  // 1. Explicit data-studio-element
  const explicit = host.querySelector<HTMLElement>(`[data-studio-element="${id}"]`);
  if (explicit) return explicit;

  // 2. Button with btn- prefix
  if (id.startsWith('btn-')) {
    const raw = id.slice(4);
    const byAria = host.querySelector<HTMLElement>(`button[aria-label="${raw}" i]`);
    if (byAria) return byAria;
    if (/^\d+$/.test(raw)) {
      const allButtons = Array.from(host.querySelectorAll<HTMLElement>('button, [role="button"]:not([data-text-slot])'));
      return allButtons[parseInt(raw, 10)] ?? null;
    }
    const allButtons = Array.from(host.querySelectorAll<HTMLElement>('button, [role="button"]:not([data-text-slot])'));
    for (const b of allButtons) {
      const txt = b.textContent?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (txt === raw) return b;
    }
  }

  // 3. Editable text slot
  const byTextSlotChild = host.querySelector<HTMLElement>(`[data-text-slot="${id}"]`);
  if (byTextSlotChild) return byTextSlotChild;

  // 5. By data-tap-root or data-slot or id
  const bySlot = host.querySelector<HTMLElement>(`[data-tap-root="${id}"], [data-slot="${id}"], #${id}`);
  if (bySlot) return bySlot;

  // 6. By part-N
  if (id.startsWith('part-')) {
    const idx = parseInt(id.slice(5), 10);
    return (host.children[idx] as HTMLElement) ?? null;
  }

  return null;
}

/**
 * Apply a sub-component's width/height. Parts that contain text use the size as a
 * minimum, so the container keeps growing with the text (e.g. a larger font size);
 * images, icons and other non-text parts get the exact size.
 */
function applyElementSize(el: HTMLElement, w: number | undefined, h: number | undefined) {
  const growsWithText = !!el.textContent?.trim();
  const [widthKey, otherWidthKey] = growsWithText ? ['minWidth', 'width'] as const : ['width', 'minWidth'] as const;
  const [heightKey, otherHeightKey] = growsWithText ? ['minHeight', 'height'] as const : ['height', 'minHeight'] as const;
  el.style[widthKey] = w !== undefined ? `${w}px` : '';
  el.style[otherWidthKey] = '';
  el.style[heightKey] = h !== undefined ? `${h}px` : '';
  el.style[otherHeightKey] = '';
  if ((w !== undefined || h !== undefined) && window.getComputedStyle(el).display === 'inline') {
    el.style.display = 'inline-block';
  }
}

/**
 * The text slot a resize of `el` should scale: the part itself when it is a text field,
 * or its only text slot when the part holds nothing but that text. Buttons and parts
 * with icons/images keep their font size when resized.
 */
function scalableTextSlot(el: HTMLElement): HTMLElement | null {
  if (el.dataset.textSlot) return el;
  if (el.tagName === 'BUTTON' || el.querySelector('svg, img, button')) return null;
  const slots = el.querySelectorAll<HTMLElement>('[data-text-slot]');
  if (slots.length !== 1) return null;
  return slots[0].textContent?.trim() === el.textContent?.trim() ? slots[0] : null;
}

/**
 * Format a human-friendly display name for an element.
 */
export function getElementDisplayName(id: string, targetEl?: HTMLElement | null): string {
  if (targetEl) {
    const textSlot = targetEl.getAttribute('data-text-slot') || targetEl.querySelector('[data-text-slot]')?.getAttribute('data-text-slot');
    if (textSlot) {
      return textSlot.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();
    }
    const aria = targetEl.getAttribute('aria-label');
    if (aria) return aria;
    const txt = targetEl.textContent?.trim().slice(0, 16);
    if (txt) return txt;
  }
  if (id.startsWith('btn-')) {
    return id.slice(4).replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim() + ' Button';
  }
  return id.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();
}

/**
 * Explicit helper to wrap any component part as a draggable, resizable element.
 */
export function DraggableElement({
  id,
  className,
  style,
  children,
}: {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const scope = useScope();
  const edit = useEdit();
  const box = edit?.elementBoxes[scope.moduleId ?? '']?.[id];
  const isSelected = edit?.activeElementId === id && scope.active;

  const resolvedStyle: React.CSSProperties = {
    ...style,
    ...(box?.x !== undefined || box?.y !== undefined ? {
      transform: `translate(${box.x ?? 0}px, ${box.y ?? 0}px)`,
      position: 'relative',
      zIndex: isSelected ? 20 : 10,
    } : {}),
    ...(box?.w !== undefined ? { width: `${box.w}px` } : {}),
    ...(box?.h !== undefined ? { height: `${box.h}px` } : {}),
  };

  return (
    <div
      data-studio-element={id}
      className={className}
      style={resolvedStyle}
    >
      {children}
    </div>
  );
}

/**
 * Wraps every component to provide deep element tinkering (dragging & resizing with 4-corner handles).
 */
export function ElementTinkerHost({
  moduleId,
  passive,
  children,
}: {
  moduleId: ModuleId;
  passive?: boolean;
  children: React.ReactNode;
}) {
  const edit = useEdit();
  const hostRef = useRef<HTMLDivElement>(null);
  const active = !passive && edit?.mode === 'edit' && edit.selectedId === moduleId;
  const activeElementId = edit?.activeElementId ?? null;
  const elementBoxes = edit?.elementBoxes ?? {};
  const moduleAssets = edit?.placedAssets[moduleId];
  const placedAssets = moduleAssets ?? EMPTY_PLACED_ASSETS;
  const hiddenElements = edit?.hiddenElements[moduleId] ?? EMPTY_HIDDEN_ELEMENTS;
  const hiddenElementsRef = useRef<{ moduleId: ModuleId; ids: string[] }>({ moduleId, ids: [] });
  // Stabilize currentModBoxes — avoid creating a new {} on every render
  const currentModBoxes = useMemo(
    () => elementBoxes[moduleId] ?? {},
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elementBoxes[moduleId]],
  );

  const [overlayRect, setOverlayRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    borderRadius: number;
  } | null>(null);

  // Keep a ref to the latest overlay updater so effects can call it without
  // needing it in their dependency arrays (avoids infinite render loops).
  const updateOverlayRef = useRef<() => void>(() => undefined);

  // Recalculate overlay rectangle
  const updateOverlay = useCallback(() => {
    if (!active || !activeElementId || !hostRef.current) {
      setOverlayRect(null);
      return;
    }
    const targetEl = findElementById(hostRef.current, activeElementId);
    if (!targetEl) {
      setOverlayRect(null);
      return;
    }
    const hostRect = hostRef.current.getBoundingClientRect();
    const elRect = targetEl.getBoundingClientRect();
    const scaleX = hostRect.width / hostRef.current.offsetWidth || 1;
    const scaleY = hostRect.height / hostRef.current.offsetHeight || 1;

    const borderRadius = parseInt(window.getComputedStyle(targetEl).borderRadius, 10) || 4;

    setOverlayRect({
      left: (elRect.left - hostRect.left) / scaleX,
      top: (elRect.top - hostRect.top) / scaleY,
      width: elRect.width / scaleX,
      height: elRect.height / scaleY,
      borderRadius,
    });
  }, [active, activeElementId]);

  // Keep the ref in sync so event handlers always call the latest version
  useLayoutEffect(() => { updateOverlayRef.current = updateOverlay; }, [updateOverlay]);

  // Apply saved boxes to matching elements whenever boxes or moduleId changes.
  // Uses the ref so updateOverlay is NOT a dependency → no loop.
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    for (const [elId, box] of Object.entries(currentModBoxes)) {
      const el = findElementById(host, elId);
      if (el) {
        if (box.x !== undefined || box.y !== undefined) {
          el.style.transform = `translate(${box.x ?? 0}px, ${box.y ?? 0}px)`;
          el.style.position = el.dataset.studioAsset === 'true' ? 'absolute' : 'relative';
        } else {
          el.style.transform = '';
        }
        applyElementSize(el, box.w, box.h);
      }
    }
    // Schedule overlay update after the DOM settles
    requestAnimationFrame(() => { updateOverlayRef.current(); });
  }, [currentModBoxes, moduleId, placedAssets]);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const previous = hiddenElementsRef.current.moduleId === moduleId
      ? hiddenElementsRef.current.ids
      : [];
    for (const elementId of previous) {
      if (hiddenElements.includes(elementId)) continue;
      const element = findElementById(host, elementId);
      if (element) element.style.display = '';
    }
    for (const elementId of hiddenElements) {
      const element = findElementById(host, elementId);
      if (element) element.style.display = 'none';
    }
    hiddenElementsRef.current = { moduleId, ids: hiddenElements };
  }, [hiddenElements, moduleId]);

  // Update overlay on window resize
  useEffect(() => {
    if (!active || !activeElementId) return;
    updateOverlay();
    const handler = () => updateOverlayRef.current();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [active, activeElementId, updateOverlay]);

  // Keep the selection outline wrapped around the part when its size changes on its own
  // (e.g. a larger font size grows a text container).
  const moduleTextStyles = edit?.textStyles[moduleId];
  const moduleOverrides = edit?.overrides[moduleId];
  useEffect(() => {
    const host = hostRef.current;
    if (!active || !activeElementId || !host) return;
    const target = findElementById(host, activeElementId);
    if (!target) return;
    const observer = new ResizeObserver(() => updateOverlayRef.current());
    observer.observe(target);
    updateOverlayRef.current();
    return () => observer.disconnect();
  }, [active, activeElementId, moduleTextStyles, moduleOverrides]);

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active) return;
    if (e.button !== 0) return;

    const targetNode = e.target as HTMLElement;
    // If clicking on corner handle, resize handles it
    if (targetNode.closest('[data-corner-handle]')) return;
    // If clicking on overlay controls or text input, skip dragging
    if (targetNode.closest('[data-overlay-control]')) return;
    if (targetNode.tagName === 'INPUT' || targetNode.tagName === 'TEXTAREA') return;

    const candidate = targetNode.closest('[data-studio-element], button, [data-text-slot], [role="button"]') as HTMLElement | null;
    if (!candidate || !hostRef.current?.contains(candidate)) {
      // Clicked outside elements - deselect element
      edit?.setActiveElementId(null);
      return;
    }

    const elementId = getTinkerElementId(candidate, hostRef.current);
    const targetEl = findElementById(hostRef.current, elementId) || candidate;

    e.preventDefault();
    e.stopPropagation();

    edit?.setActiveElementId(elementId);
    if (candidate.dataset.textSlot) {
      edit?.setActiveTextSlot(candidate.dataset.textSlot);
    }

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const currentBox = currentModBoxes[elementId] ?? {};
    const baseX = currentBox.x ?? 0;
    const baseY = currentBox.y ?? 0;

    const hostRect = hostRef.current.getBoundingClientRect();
    const scaleX = hostRect.width / hostRef.current.offsetWidth || 1;
    const scaleY = hostRect.height / hostRef.current.offsetHeight || 1;

    let hasMoved = false;

    const onMouseMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - startClientX) / scaleX;
      const dy = (ev.clientY - startClientY) / scaleY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        hasMoved = true;
      }
      const nextX = Math.round(baseX + dx);
      const nextY = Math.round(baseY + dy);

      targetEl.style.transform = `translate(${nextX}px, ${nextY}px)`;
      targetEl.style.position = targetEl.dataset.studioAsset === 'true' ? 'absolute' : 'relative';
      targetEl.style.zIndex = '30';

      edit?.setElementBox(moduleId, elementId, {
        ...currentBox,
        x: nextX,
        y: nextY,
      });
      updateOverlayRef.current();
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      updateOverlayRef.current();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Corner resize logic
  const handleResize = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hostRef.current || !activeElementId) return;
    const targetEl = findElementById(hostRef.current, activeElementId);
    if (!targetEl) return;

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const currentBox = currentModBoxes[activeElementId] ?? {};
    const baseX = currentBox.x ?? 0;
    const baseY = currentBox.y ?? 0;
    const startW = currentBox.w ?? targetEl.offsetWidth;
    const startH = currentBox.h ?? targetEl.offsetHeight;
    // Resizing a text field from its corners scales the text with the box.
    const textSlotEl = scalableTextSlot(targetEl);
    const textSlot = textSlotEl?.dataset.textSlot;
    const startFontSize = textSlotEl ? Number.parseFloat(window.getComputedStyle(textSlotEl).fontSize) || 14 : 14;

    const hostRect = hostRef.current.getBoundingClientRect();
    const scaleX = hostRect.width / hostRef.current.offsetWidth || 1;
    const scaleY = hostRect.height / hostRef.current.offsetHeight || 1;

    const onMouseMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - startClientX) / scaleX;
      const dy = (ev.clientY - startClientY) / scaleY;
      const patch: ElementBox = { ...currentBox };

      if (handle.includes('e')) {
        patch.w = Math.max(16, Math.round(startW + dx));
      }
      if (handle.includes('w')) {
        patch.w = Math.max(16, Math.round(startW - dx));
        patch.x = Math.round(baseX + dx);
      }
      if (handle.includes('s')) {
        patch.h = Math.max(16, Math.round(startH + dy));
      }
      if (handle.includes('n')) {
        patch.h = Math.max(16, Math.round(startH - dy));
        patch.y = Math.round(baseY + dy);
      }

      // Only corner drags scale the text; edges just resize the box.
      if (textSlot && handle.length === 2 && patch.w !== undefined && patch.h !== undefined) {
        const ratio = Math.sqrt((patch.w / (startW || 1)) * (patch.h / (startH || 1)));
        edit?.setTextStyle(moduleId, textSlot, {
          fontSize: Math.max(4, Math.round(startFontSize * ratio * 10) / 10),
        });
      }

      applyElementSize(targetEl, patch.w, patch.h);
      targetEl.style.transform = `translate(${patch.x ?? 0}px, ${patch.y ?? 0}px)`;
      targetEl.style.position = targetEl.dataset.studioAsset === 'true' ? 'absolute' : 'relative';
      targetEl.style.zIndex = '30';

      edit?.setElementBox(moduleId, activeElementId, patch);
      updateOverlayRef.current();
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      updateOverlayRef.current();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      ref={hostRef}
      data-studio-tinker-host={moduleId}
      onMouseDown={handleMouseDown}
      onClickCapture={(e) => {
        if (active) {
          // In design mode, prevent firing prototype navigation
          e.stopPropagation();
        }
      }}
      className={`relative ${active ? 'studio-tinker-active' : ''}`}
    >
      {active && (
        <style>{`
          .studio-tinker-active button,
          .studio-tinker-active [data-text-slot],
          .studio-tinker-active [data-studio-element],
          .studio-tinker-active [data-tap-root],
          .studio-tinker-active [role="button"]:not([data-text-slot]) {
            cursor: move !important;
            transition: outline 0.15s ease !important;
          }
          /* Highlight only the innermost hovered part, like Figma. */
          .studio-tinker-active :is(button, [data-text-slot], [data-studio-element], [data-tap-root], [role="button"]):hover:not(:has(:is(button, [data-text-slot], [data-studio-element], [data-tap-root], [role="button"]):hover)) {
            outline: 1.5px solid #0040DF !important;
            outline-offset: 2px !important;
          }
        `}</style>
      )}

      {children}

      {placedAssets.map((asset) => {
        const box = currentModBoxes[asset.id] ?? {};
        return (
          <div
            key={asset.id}
            data-studio-element={asset.id}
            data-studio-asset="true"
            role="img"
            aria-label={asset.name}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: box.w ?? 64,
              height: box.h ?? 64,
              transform: `translate(${box.x ?? 0}px, ${box.y ?? 0}px)`,
              zIndex: activeElementId === asset.id ? 35 : 25,
              backgroundImage: `url("${asset.url}")`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
            }}
          />
        );
      })}

      {/* Mini box enclosing the active element */}
      {active && activeElementId && overlayRect && (
        <div
          data-studio-overlay="true"
          className="pointer-events-none absolute z-40 transition-none"
          style={{
            left: Math.round(overlayRect.left),
            top: Math.round(overlayRect.top),
            width: Math.round(overlayRect.width),
            height: Math.round(overlayRect.height),
          }}
        >
          {/* Outline around the element */}
          <div
            className="absolute inset-0 border-2 border-[#0040DF] shadow-[0_0_0_1px_rgba(255,255,255,0.7)]"
            style={{
              borderRadius: Math.max(2, overlayRect.borderRadius),
            }}
          />

          {/* Edge strips (resize from any side) and the 4 corner handles */}
          {EDGE_HANDLES.map((h) => (
            <span
              key={h.k}
              data-corner-handle={h.k}
              onMouseDown={(e) => handleResize(e, h.k)}
              className={`pointer-events-auto absolute ${h.cls}`}
            />
          ))}
          {CORNER_HANDLES.map((h) => (
            <span
              key={h.k}
              data-corner-handle={h.k}
              onMouseDown={(e) => handleResize(e, h.k)}
              className={`pointer-events-auto absolute h-2.5 w-2.5 rounded-full border-2 border-[#0040DF] bg-white shadow-sm hover:scale-125 transition-transform ${h.cls}`}
            />
          ))}

        </div>
      )}
    </div>
  );
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
  const isSelectedSlot = (edit?.activeTextSlot === slot || edit?.activeElementId === slot) && scope.moduleId === edit.selectedId;
  const isFinancialValue = /balance|amount|available|total|value|^amt$|^bal$|^tx\d+Amount$/i.test(slot);
  const displayValue = scope.variant === 'Masked' && isFinancialValue
    ? value.replace(/\d/g, '•')
    : scope.variant === 'Negative' && isFinancialValue && !/^\s*-/.test(value)
      ? value.replace(/^(\s*)([$€£¥])/, '$1-$2').replace(/^((?!\s*[-$€£¥]).+)/, '-$1')
      : value;

  const elementBox = edit?.elementBoxes[scope.moduleId ?? '']?.[slot];
  // A text container's set width/height (from resizing or the text panel) is a minimum:
  // the container still grows to fit the text, e.g. when the font size goes up.
  const { width: styleWidth, height: styleHeight, ...textStyleRest } = textStyle;
  const minWidth = elementBox?.w ?? styleWidth;
  const minHeight = elementBox?.h ?? styleHeight;
  const resolvedStyle: React.CSSProperties = {
    ...style,
    ...textStyleRest,
    ...(elementBox?.x !== undefined || elementBox?.y !== undefined ? {
      transform: `translate(${elementBox.x ?? 0}px, ${elementBox.y ?? 0}px)`,
      position: 'relative',
      zIndex: isSelectedSlot ? 20 : 10,
      display: 'inline-block',
    } : {}),
    ...(minWidth !== undefined ? { minWidth, display: 'inline-block' } : {}),
    ...(minHeight !== undefined ? { minHeight, display: 'inline-block' } : {}),
    ...(scope.variant === 'Negative' && isFinancialValue && !textStyle.color ? { color: '#dc2626' } : {}),
    ...(textStyle.textAlign ? { display: 'block', width: '100%' } : {}),
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
      title="Click to select/drag, double-click to edit text"
      data-text-slot={slot}
      data-text-slot-selected={isSelectedSlot || undefined}
      onClick={(e) => { 
        if (scope.active) {
          e.stopPropagation(); 
          if (edit?.activeElementId === slot || edit?.activeTextSlot === slot) {
            setEditing(true); 
          } else {
            edit?.setActiveElementId(slot);
            edit?.setActiveTextSlot(slot);
          }
        }
      }}
      onDoubleClick={(e) => {
        if (scope.active) {
          e.stopPropagation();
          setEditing(true);
          edit?.setActiveTextSlot(slot);
        }
      }}
      className={`${className ?? ''} transition ${
        scope.active ? 'cursor-move' : ''
      }`}
      style={resolvedStyle}
    >
      {displayValue}
    </span>
  );
}
