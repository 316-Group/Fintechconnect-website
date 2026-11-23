'use client';

import React, { useState, useSyncExternalStore } from 'react';
import {
  ChevronRight, Component, Frame, Group, Type, Square, Circle, Triangle, Star, Minus,
  ArrowRight, Spline, MessageCircle, Image as ImageIcon, Box, Layers, Trash2, Plus, X,
  GripVertical,
} from 'lucide-react';

/* ═══════════════════════════ Saved components store ═══════════════════════════ */

/**
 * A frame the user saved from the canvas. `clip` holds the frame and everything in it
 * in the studio's clipboard format, so placing it is the same as pasting it.
 */
export type SavedComponent = {
  id: string;
  name: string;
  createdAt: number;
  layerCount: number;
  clip: unknown;
};

/** Drag data type used when a saved component is dragged out of the left panel. */
export const CREATED_DRAG_TYPE = 'application/x-pf-created-id';

const STORAGE_KEY = 'fc-studio.created-components';
const EMPTY: SavedComponent[] = [];
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cached: SavedComponent[] = EMPTY;

function readSaved(): SavedComponent[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cached;
  }
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cached = Array.isArray(parsed) ? (parsed as SavedComponent[]) : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function writeSaved(list: SavedComponent[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Storage is full or blocked (e.g. large images in the frame).
    return false;
  }
  listeners.forEach((listener) => listener());
  return true;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep other tabs of the studio in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** Saved components, kept in the browser so they survive a page refresh. */
export function useCreatedComponents(): SavedComponent[] {
  return useSyncExternalStore(subscribe, readSaved, () => EMPTY);
}

export function findCreatedComponent(id: string): SavedComponent | undefined {
  return readSaved().find((item) => item.id === id);
}

/** Save a frame. Returns false when the browser couldn't store it. */
export function saveCreatedComponent(name: string, clip: unknown, layerCount: number): boolean {
  const item: SavedComponent = {
    id: `created-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim() || 'Component',
    createdAt: Date.now(),
    layerCount,
    clip,
  };
  return writeSaved([item, ...readSaved()]);
}

export function renameCreatedComponent(id: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  writeSaved(readSaved().map((item) => (item.id === id ? { ...item, name: trimmed } : item)));
}

export function deleteCreatedComponent(id: string) {
  writeSaved(readSaved().filter((item) => item.id !== id));
}

/* ═══════════════════════════ Layers ═══════════════════════════ */

/** A row in the layers tree: a frame, a group, or a single object. */
export type LayerNode = {
  key: string;
  name: string;
  kind: string;
  /** The object a click selects (a group selects its main shape). */
  selectKey: string;
  children: LayerNode[];
};

export type LayerSection = { title: string; nodes: LayerNode[] };

const LAYER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  frame: Frame,
  group: Group,
  'shape-text': Type,
  'shape-rect': Square,
  'shape-circle': Circle,
  'shape-triangle': Triangle,
  'shape-star': Star,
  'shape-line': Minus,
  'shape-arrow': ArrowRight,
  'shape-scribble': Spline,
  'shape-comment': MessageCircle,
  asset: ImageIcon,
  component: Component,
  element: Box,
};

function LayerRow({
  node, depth, selectedKey, collapsed, onToggle, onSelect,
}: {
  node: LayerNode;
  depth: number;
  selectedKey: string | null;
  collapsed: Set<string>;
  onToggle: (key: string) => void;
  onSelect: (key: string) => void;
}) {
  const Icon = LAYER_ICONS[node.kind] ?? Square;
  const hasChildren = node.children.length > 0;
  const isOpen = hasChildren && !collapsed.has(node.key);
  // A picked group highlights its own row; when only its main shape is selected, the
  // group row is lightly marked.
  const isSelected = node.key === selectedKey;
  const isGroupOfSelected = !isSelected && node.kind === 'group' && node.selectKey === selectedKey;
  const isContainer = node.kind === 'frame' || node.kind === 'group';

  return (
    <li className="list-none">
      <div
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={hasChildren ? isOpen : undefined}
        // A group row picks the whole group (its own key); other rows pick their object.
        onClick={() => onSelect(node.kind === 'group' ? node.key : node.selectKey)}
        className={`group flex h-7 cursor-pointer items-center gap-1 rounded-md pr-2 text-[11px] ${
          isSelected
            ? 'bg-[#0040DF] text-white'
            : isGroupOfSelected
              ? 'bg-[#DCE3FF] text-slate-800'
              : 'text-slate-700 hover:bg-slate-100'
        }`}
        style={{ paddingLeft: 4 + depth * 14 }}
      >
        <button
          type="button"
          tabIndex={hasChildren ? 0 : -1}
          aria-label={isOpen ? 'Collapse layer' : 'Expand layer'}
          onClick={(event) => {
            event.stopPropagation();
            if (hasChildren) onToggle(node.key);
          }}
          className={`grid h-4 w-4 shrink-0 place-items-center rounded ${hasChildren ? '' : 'invisible'}`}
        >
          <ChevronRight className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-90' : ''} ${isSelected ? 'text-white/80' : 'text-slate-400'}`} />
        </button>
        <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-white' : isContainer ? 'text-[#0040DF]' : 'text-slate-400'}`} />
        <span className={`min-w-0 flex-1 truncate ${isContainer ? 'font-semibold' : 'font-medium'}`}>{node.name}</span>
      </div>
      {isOpen && (
        <ul className="m-0 p-0">
          {node.children.map((child) => (
            <LayerRow
              key={child.key}
              node={child}
              depth={depth + 1}
              selectedKey={selectedKey}
              collapsed={collapsed}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/* ═══════════════════════════ Left panel menu item ═══════════════════════════ */

function SavedRow({
  item, onAddToPhone, onDragChange,
}: {
  item: SavedComponent;
  onAddToPhone: (id: string) => void;
  onDragChange: (id: string | null) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);

  const commitRename = () => {
    if (draft !== null) renameCreatedComponent(item.id, draft);
    setDraft(null);
  };

  return (
    <div
      draggable={draft === null}
      onDragStart={(event) => {
        event.dataTransfer.setData(CREATED_DRAG_TYPE, item.id);
        // Plain text too: some browsers only start a drag that carries a standard type.
        event.dataTransfer.setData('text/plain', item.name);
        event.dataTransfer.effectAllowed = 'copy';
        // The studio draws a live preview of the frame under the cursor, so hide the browser's image.
        const blank = document.createElement('div');
        Object.assign(blank.style, {
          position: 'fixed', top: '-100px', left: '-100px', width: '1px', height: '1px', opacity: '0',
        });
        document.body.appendChild(blank);
        event.dataTransfer.setDragImage(blank, 0, 0);
        setTimeout(() => blank.remove(), 0);
        onDragChange(item.id);
      }}
      onDragEnd={() => onDragChange(null)}
      title="Drag onto the canvas to use it"
      className="group flex cursor-grab items-center gap-2 rounded-md border border-slate-100 bg-white px-2 py-1.5 hover:border-[#0040DF]/40 active:cursor-grabbing"
    >
      <GripVertical className="h-3 w-3 shrink-0 text-slate-300" />
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#EDEFFC] text-[#0040DF]">
        <Component className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        {draft === null ? (
          <p
            className="truncate text-[11px] font-semibold text-slate-800"
            onDoubleClick={() => setDraft(item.name)}
            title="Double-click to rename"
          >
            {item.name}
          </p>
        ) : (
          <input
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitRename}
            onKeyDown={(event) => {
              if (event.key === 'Enter') commitRename();
              if (event.key === 'Escape') setDraft(null);
            }}
            aria-label="Component name"
            className="w-full rounded border border-[#0040DF] px-1 text-[11px] font-semibold text-slate-800 outline-none"
          />
        )}
        <p className="text-[9px] text-slate-500">
          {item.layerCount} {item.layerCount === 1 ? 'layer' : 'layers'}
        </p>
      </div>
      <button
        type="button"
        title="Add to the phone"
        aria-label={`Add ${item.name} to the phone`}
        onClick={() => onAddToPhone(item.id)}
        className="grid h-5 w-5 shrink-0 place-items-center rounded text-slate-400 hover:bg-[#E8EDFF] hover:text-[#0040DF]"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        title="Delete saved component"
        aria-label={`Delete ${item.name}`}
        onClick={() => {
          if (window.confirm(`Delete "${item.name}" from created components?`)) deleteCreatedComponent(item.id);
        }}
        className="grid h-5 w-5 shrink-0 place-items-center rounded text-slate-300 opacity-0 hover:bg-red-50 hover:text-red-500 focus:opacity-100 group-hover:opacity-100"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}

/**
 * The "Created Components" page menu item: frames the user saved (drag them onto the
 * canvas), and a Figma-style layers tree of the frames and groups being built.
 */
export function CreatedComponentsMenuItem({
  sections, selectedKey, onSelectLayer, query, onAddToPhone, onDragChange,
}: {
  sections: LayerSection[];
  selectedKey: string | null;
  onSelectLayer: (key: string) => void;
  query: string;
  /** Place a saved component straight into the phone. */
  onAddToPhone: (id: string) => void;
  /** The saved component being dragged (null when the drag ends), for the cursor preview. */
  onDragChange: (id: string | null) => void;
}) {
  const saved = useCreatedComponents();
  const [expanded, setExpanded] = useState(true);
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());

  const search = query.trim().toLowerCase();
  const visibleSaved = search ? saved.filter((item) => item.name.toLowerCase().includes(search)) : saved;
  const layerSections = sections.filter((section) => section.nodes.length > 0);

  const toggle = (key: string) => setCollapsed((previous) => {
    const next = new Set(previous);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });

  return (
    <li className="relative mb-2 list-none">
      <div className={`rounded-xl border transition ${expanded ? 'border-slate-200 bg-white shadow-sm' : 'border-transparent'}`}>
        <div
          onClick={() => setExpanded((value) => !value)}
          className="flex cursor-pointer items-center gap-2 px-2.5 py-1.5"
        >
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#E8EDFF] text-[#0040DF]">
            <Component className="h-3.5 w-3.5" />
          </span>
          <span className="min-w-0 flex-1 truncate text-left text-[12px] font-medium text-slate-700">
            Created Components
          </span>
          <span className="shrink-0 rounded-full bg-[#E3E6F7] px-2 py-0.5 text-[10px] font-medium text-slate-500">
            {saved.length} saved
          </span>
          <span className="grid h-5 w-5 place-items-center rounded-full text-slate-400">
            {expanded ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </span>
        </div>

        {expanded && (
          <div className="space-y-3 border-t border-slate-100 px-2 pb-2 pt-2">
            <div className="space-y-1">
              <p className="px-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">Saved</p>
              {visibleSaved.length === 0 ? (
                <p className="rounded-md bg-[#F7F8FF] px-2 py-2 text-[10px] text-slate-500">
                  {saved.length === 0
                    ? 'Right-click a frame and choose “Save as component” to keep it here.'
                    : 'No saved components match your search.'}
                </p>
              ) : (
                visibleSaved.map((item) => (
                  <SavedRow key={item.id} item={item} onAddToPhone={onAddToPhone} onDragChange={onDragChange} />
                ))
              )}
            </div>

            <div className="space-y-1">
              <p className="flex items-center gap-1 px-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                <Layers className="h-3 w-3" /> Layers
              </p>
              {layerSections.length === 0 ? (
                <p className="rounded-md bg-[#F7F8FF] px-2 py-2 text-[10px] text-slate-500">
                  Draw a frame to see its layers here.
                </p>
              ) : (
                layerSections.map((section) => (
                  <div key={section.title}>
                    <p className="px-1 pb-0.5 pt-1 text-[9px] font-semibold text-slate-400">{section.title}</p>
                    <ul role="tree" aria-label={`${section.title} layers`} className="m-0 p-0">
                      {section.nodes.map((node) => (
                        <LayerRow
                          key={node.key}
                          node={node}
                          depth={0}
                          selectedKey={selectedKey}
                          collapsed={collapsed}
                          onToggle={toggle}
                          onSelect={onSelectLayer}
                        />
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
