// /client/app/userdashboard/studio/StudioClient.tsx
'use client';

import React, { useCallback, useEffect, useLayoutEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Urbanist, Outfit } from 'next/font/google';
import Link from 'next/link';
import {
  ArrowLeft, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsUpDown,
  Layers, Box, Workflow, Palette, ShieldCheck, Settings, Plus, PlusCircle,
  Trash2, Undo2, Home, Wallet,
  BarChart3, User, Play, Code2, Check, Braces, X, Diamond, CreditCard,
  Search, Upload, Eye, EyeOff, Image as ImageIcon, Pipette,
  Bell, List, ArrowRightLeft, Landmark, PiggyBank, Activity,
  CircleDollarSign, Coins, LayoutGrid, Type, Square, Circle, Minus,
  Sparkles, Sun, Droplet, SlidersHorizontal, Move, MousePointer2, Hand,
  Frame, Star, ArrowRight, Spline, MessageCircle,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Underline, Pencil, Puzzle,
} from 'lucide-react';
import {
  PAGES, APP_KINDS, PAGE_TO_TAB, TAB_TO_PAGE, SINGLE_SLOT,
  ModuleView, pageModulesFor, moduleFor, allModulesFor,
  buildInitialPages,
  type ModuleId, type PageId, type AppKind, type TabId,
  type RadiusMode, type Radius, type ViewCtx, type ViewActions,
  RADII, INITIAL_BALANCE, INITIAL_INCOME, INITIAL_OUTCOME,
  INITIAL_TRANSACTIONS, INITIAL_SAVINGS, HISTORY_LIMIT,
  noopActions,
} from './phone-cards';

import {
  EditProvider,
  useEdit,
  useEditOverrides,
  getElementDisplayName,
  getTinkerElementId,
  findElementById,
  type EditableTextStyle,
  type EditOverridesSnapshot,
  type ElementBox,
  type ModuleEdits,
  moduleEditsOf,
} from './edit-context';
import {
  loadStudioBuild, resolveActiveProject, saveStudioBuild, type StudioProjectInfo,
} from '../products/projectstorage';
import { EDITABLE_SCHEMA } from './editable-schema';
import AssetTab, { draggedAssetId, isAssetDrag, type AssetItem } from './assettab';
import { PluginsPanel, type PluginImage } from './plugins';
import {
  LayoutTab, autoLayoutCss, layoutSize, layoutWrapperStyle, type LayoutFields,
} from './othertabs';
import { CodeTab, type CodeSource } from './codetab';
import {
  DEFAULT_LOGIC_STATE, LogicRuntime, LogicSummary, LogicTab, appSchemeFor, logicKey,
  type LogicMap, type LogicState, type LogicTrigger,
} from './logictab';
import { TopBar, type DeviceType, type SaveStatus, type StudioMode } from './topbar';
import {
  AlignmentGuides, SNAP_DISTANCE_PX, createSnapSession, elementRect, unionRect,
  type Guide, type SnapPointer, type SnapRect, type SnapSession,
} from './alignment-guides';
import {
  COMMENT_AUTHOR, COMMENT_CURSOR, COMMENT_UI_ATTR, CommentLayer, CommentsPanel,
  type CanvasComment, type CommentDraft,
} from './comments';
import {
  CREATED_DRAG_TYPE, CreatedComponentsMenuItem, findCreatedComponent, saveCreatedComponent, useCreatedComponents,
  type LayerNode, type LayerSection,
} from './createdcomponents';

const urbanist = Urbanist({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

const CORNER_HANDLES = [
  { k: 'nw', cls: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize' },
  { k: 'ne', cls: 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize' },
  { k: 'sw', cls: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize' },
  { k: 'se', cls: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize' },
] as const;

/** Invisible strips along each side, so objects can be resized from any edge (like Figma). */
const EDGE_HANDLES = [
  { k: 'n', cls: 'top-0 inset-x-2 h-2 -translate-y-1/2 cursor-ns-resize' },
  { k: 's', cls: 'bottom-0 inset-x-2 h-2 translate-y-1/2 cursor-ns-resize' },
  { k: 'w', cls: 'left-0 inset-y-2 w-2 -translate-x-1/2 cursor-ew-resize' },
  { k: 'e', cls: 'right-0 inset-y-2 w-2 translate-x-1/2 cursor-ew-resize' },
] as const;

/**
 * Stacking order for canvas objects: an object drawn (or added) later sits above every
 * object drawn before it, whatever is selected or hovered. A layer grouped into a shape
 * stays just above that shape, even if it was drawn first.
 */
function stackLevels(ids: string[], parentOf: (id: string) => string | undefined, isFrame: (id: string) => boolean) {
  const index = new Map(ids.map((id, i) => [id, i]));
  const levels = new Map<string, number>();
  const levelOf = (id: string, seen: Set<string>): number => {
    const known = levels.get(id);
    if (known !== undefined) return known;
    let level = 2 * (index.get(id) ?? 0);
    const parent = parentOf(id);
    if (parent && index.has(parent) && !isFrame(parent) && !seen.has(parent)) {
      level = Math.max(level, levelOf(parent, new Set(seen).add(id)) + 1);
    }
    levels.set(id, level);
    return level;
  };
  ids.forEach((id) => levelOf(id, new Set()));
  return levels;
}

/** The groups among these objects: each group's shape and every layer grouped into it. */
function canvasGroups(ids: string[], parentOf: (id: string) => string | undefined, isFrame: (id: string) => boolean) {
  const present = new Set(ids);
  const childrenOf = new Map<string, string[]>();
  ids.forEach((id) => {
    const parent = parentOf(id);
    if (!parent || !present.has(parent) || isFrame(parent)) return;
    childrenOf.set(parent, [...(childrenOf.get(parent) ?? []), id]);
  });
  return [...childrenOf.keys()].map((root) => {
    const members = [root];
    for (let i = 0; i < members.length; i += 1) {
      (childrenOf.get(members[i]) ?? []).forEach((child) => { if (!members.includes(child)) members.push(child); });
    }
    return members;
  });
}

/**
 * A group's area: the box around every layer of the group (it grows and moves with them).
 *
 * - When the group is picked as a whole (its Layers row, or the space between its items),
 *   a solid selection border goes around all of its items. While just one of its items is
 *   selected, a lighter border shows which group that item belongs to. Otherwise nothing
 *   is drawn, so no border stays on screen.
 * - The hit area fills the same box underneath every object (but above frames), so a
 *   click or drag in the space between the layers picks and moves the group, and a
 *   right-click there opens the group's menu. It does this by passing the event on to
 *   the group's shape (`ids[0]`), so it behaves exactly like grabbing that shape.
 *
 * Both measure their sibling objects (by `attr`) in the shared container.
 */
function GroupOutline({ ids, attr, active, selected, onSelectGroup, hidden, interactive, hitZIndex }: {
  ids: string[];
  attr: 'data-module-id' | 'data-workspace-shape-id';
  /** One of the group's items is selected. */
  active: boolean;
  /** The group itself is picked as a whole. */
  selected: boolean;
  /** Pick the whole group (after a left-click in the space between its items). */
  onSelectGroup: () => void;
  hidden: boolean;
  /** Whether the space between the layers can be clicked (not while drawing, panning or dragging). */
  interactive: boolean;
  /** Just above frames and below every other object. */
  hitZIndex: number;
}) {
  const outlineRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLDivElement>(null);
  const idsKey = ids.join('\n');
  React.useLayoutEffect(() => {
    const outline = outlineRef.current;
    const hit = hitRef.current;
    const container = outline?.parentElement;
    if (!outline || !hit || !container) return;
    const members = () => idsKey.split('\n')
      .map((id) => container.querySelector<HTMLElement>(`:scope > [${attr}="${CSS.escape(id)}"]`))
      .filter((el): el is HTMLElement => !!el);
    const place = () => {
      const els = members();
      if (hidden || els.length < 2) {
        outline.style.display = 'none';
        hit.style.display = 'none';
        return;
      }
      let left = Infinity; let top = Infinity; let right = -Infinity; let bottom = -Infinity;
      els.forEach((el) => {
        left = Math.min(left, el.offsetLeft);
        top = Math.min(top, el.offsetTop);
        right = Math.max(right, el.offsetLeft + el.offsetWidth);
        bottom = Math.max(bottom, el.offsetTop + el.offsetHeight);
      });
      const pad = 6;
      [outline, hit].forEach((el) => {
        el.style.left = `${left - pad}px`;
        el.style.top = `${top - pad}px`;
        el.style.width = `${right - left + pad * 2}px`;
        el.style.height = `${bottom - top + pad * 2}px`;
      });
      outline.style.display = active || selected ? 'block' : 'none';
      hit.style.display = 'block';
    };
    place();
    const observer = new ResizeObserver(place);
    members().forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });

  /** Hand a press in the gap to the group's shape, so it selects / drags / opens the menu for the group. */
  const forwardToGroup = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const root = hitRef.current?.parentElement
      ?.querySelector<HTMLElement>(`:scope > [${attr}="${CSS.escape(ids[0])}"]`);
    if (!root) return;
    event.preventDefault();
    event.stopPropagation();
    const { clientX, clientY, screenX, screenY, button, buttons, ctrlKey, metaKey, shiftKey, altKey } = event;
    root.dispatchEvent(new MouseEvent(event.type, {
      bubbles: true, cancelable: true, view: window,
      clientX, clientY, screenX, screenY, button, buttons, ctrlKey, metaKey, shiftKey, altKey,
    }));
    // A plain left-click in the gap picks the whole group (Ctrl/Cmd+click adds the shape
    // to the multi-selection instead).
    if (event.type === 'mousedown' && button === 0 && !ctrlKey && !metaKey) onSelectGroup();
  };

  return (
    <>
      <div
        ref={hitRef}
        aria-hidden
        data-group-hit-area
        onMouseDown={forwardToGroup}
        onContextMenu={forwardToGroup}
        onClick={(event) => { if (interactive) event.stopPropagation(); }}
        className={`absolute !m-0 rounded-[4px] ${
          interactive ? 'pointer-events-auto cursor-move' : 'pointer-events-none'
        } ${interactive && !active && !selected ? 'hover:outline hover:outline-1 hover:outline-[#0040DF]/40' : ''}`}
        style={{ zIndex: hitZIndex }}
      />
      <div
        ref={outlineRef}
        aria-hidden
        data-group-outline
        data-group-selected={selected ? 'true' : undefined}
        className={`pointer-events-none absolute !m-0 border ${
          selected ? 'border-[#0040DF]' : 'rounded-[4px] border-[#0040DF]/60'
        }`}
        style={{ zIndex: 9000 }}
      />
    </>
  );
}

/**
 * The selection border and resize handles, drawn above every object (like Figma) so a
 * selected object that sits under newer ones can still be resized from any side. It is
 * rendered in the object's container and follows the object (`attr` = `id`) there.
 */
function SelectionChrome({ attr, id, inset, onResizeStart }: {
  attr: 'data-module-id' | 'data-workspace-shape-id';
  id: string;
  inset: number;
  onResizeStart: (event: React.MouseEvent<HTMLSpanElement>, handle: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const chrome = ref.current;
    const target = chrome?.parentElement?.querySelector<HTMLElement>(`:scope > [${attr}="${CSS.escape(id)}"]`);
    if (!chrome || !target) {
      if (chrome) chrome.style.display = 'none';
      return;
    }
    const place = () => {
      chrome.style.display = 'block';
      chrome.style.left = `${target.offsetLeft - inset}px`;
      chrome.style.top = `${target.offsetTop - inset}px`;
      chrome.style.width = `${target.offsetWidth + inset * 2}px`;
      chrome.style.height = `${target.offsetHeight + inset * 2}px`;
      // Same centre as the object, so its rotation (and any offset) applies unchanged.
      chrome.style.transform = target.style.transform;
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(target);
    return () => observer.disconnect();
  });
  return (
    <div
      ref={ref}
      data-selection-chrome
      className="pointer-events-none absolute !m-0 border border-[#0040DF]"
      style={{ zIndex: 9100 }}
    >
      {EDGE_HANDLES.map((handle) => (
        <span
          key={handle.k}
          onMouseDown={(event) => onResizeStart(event, handle.k)}
          className={`pointer-events-auto absolute ${handle.cls}`}
        />
      ))}
      {CORNER_HANDLES.map((handle) => (
        <span
          key={handle.k}
          onMouseDown={(event) => onResizeStart(event, handle.k)}
          className={`pointer-events-auto absolute h-2 w-2 rounded-full border border-[#0040DF] bg-white shadow-sm ${handle.cls}`}
        />
      ))}
    </div>
  );
}

/** Name for a new frame: one more than the highest "Frame N" already used. */
function nextFrameName(boxes: ModuleBox[]): string {
  const highest = boxes.reduce((max, box) => {
    const match = /^Frame (\d+)$/.exec(box.name ?? '');
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `Frame ${highest + 1}`;
}

/**
 * Every object nested under `rootId` through `frameId` links: a frame's children, and
 * objects grouped into a shape (which may itself sit in a frame). Parents come before children.
 */
function descendantIds(rootId: string, ids: string[], parentOf: (id: string) => string | undefined): string[] {
  const result: string[] = [];
  const seen = new Set([rootId]);
  const queue = [rootId];
  while (queue.length) {
    const parent = queue.shift()!;
    for (const id of ids) {
      if (seen.has(id) || parentOf(id) !== parent) continue;
      seen.add(id);
      result.push(id);
      queue.push(id);
    }
  }
  return result;
}

/** Clipboard entries for an object and its descendants, each child pointing at its parent's entry. */
function clipboardTree<T extends { id: string; parent?: string }>(
  items: T[],
  toItem: (item: T) => ClipboardItem | null,
): ClipboardItem[] {
  const index = new Map<string, number>();
  const result: ClipboardItem[] = [];
  items.forEach((item) => {
    const entry = toItem(item);
    if (!entry) return;
    const parent = item.parent !== undefined ? index.get(item.parent) : undefined;
    index.set(item.id, result.length);
    result.push(parent !== undefined ? { ...entry, parent } : entry);
  });
  return result;
}

/** Small Figma-style name tag above a frame's top-left corner. */
function FrameLabel({ name, selected }: { name: string; selected: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute bottom-full left-0 mb-1 select-none whitespace-nowrap text-[11px] font-medium leading-none ${
        selected ? 'text-[#0040DF]' : 'text-slate-500'
      }`}
    >
      {name}
    </span>
  );
}

type IconType = React.ComponentType<{ className?: string }>;
type IconMeta = { Icon: IconType; bg: string; text: string };
type ModuleMeta = ReturnType<typeof allModulesFor>[number];
type CompLibraryId = 'banking' | 'crypto' | 'general';

const COMP_LIBRARY_ORDER: CompLibraryId[] = ['banking', 'crypto', 'general'];

const COMP_LIBRARY_META: Record<
  CompLibraryId,
  { label: string; description: string; img: string; bg: string; text: string }
> = {
  banking: { label: 'Banking UIs', description: 'Accounts, cards, payments & money movement', img: '/dashboard/compstab1.png' , bg: 'bg-blue-50', text: 'text-blue-600' },
  crypto: { label: 'Crypto UIs', description: 'Wallets, tokens, swaps & on-chain activity', img: '/dashboard/compstab2.png', bg: 'bg-violet-50', text: 'text-violet-600' },
  general: { label: 'General UIs', description: 'Shared app chrome, alerts, settings & more', img: '/dashboard/compstab3.png', bg: 'bg-slate-100', text: 'text-slate-600' },
};

const COMP_SUBGROUPS: { id: string; label: string; Icon: IconType; bg: string; text: string }[] = [
  { id: 'financial', label: 'Financial Card & Balance', Icon: CreditCard, bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { id: 'cards', label: 'Cards', Icon: CreditCard, bg: 'bg-blue-50', text: 'text-blue-600' },
  { id: 'activity', label: 'Activity & Transactions', Icon: Activity, bg: 'bg-cyan-50', text: 'text-cyan-600' },
  { id: 'alerts', label: 'Alerts', Icon: Bell, bg: 'bg-amber-50', text: 'text-amber-600' },
  { id: 'payments', label: 'Payments & Transfers', Icon: ArrowRightLeft, bg: 'bg-violet-50', text: 'text-violet-600' },
  { id: 'savings', label: 'Savings & Vaults', Icon: PiggyBank, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { id: 'quick', label: 'Quick Actions', Icon: LayoutGrid, bg: 'bg-purple-50', text: 'text-purple-600' },
  { id: 'navigation', label: 'Navigation & Profile', Icon: LayoutGrid, bg: 'bg-slate-100', text: 'text-slate-600' },
  { id: 'insights', label: 'Insights', Icon: BarChart3, bg: 'bg-sky-50', text: 'text-sky-600' },
  { id: 'security', label: 'Security & Compliance', Icon: ShieldCheck, bg: 'bg-rose-50', text: 'text-rose-600' },
  { id: 'crypto', label: 'Crypto & Tokens', Icon: Coins, bg: 'bg-violet-50', text: 'text-violet-600' },
  { id: 'general', label: 'General Components', Icon: Box, bg: 'bg-slate-100', text: 'text-slate-600' },
];

function libraryForModule(mod: ModuleMeta): CompLibraryId {
  const t = `${mod.id} ${mod.title} ${mod.subtitle}`.toLowerCase();
  if (/crypto|coin|token|blockchain|web3|defi|swap|nft/.test(t)) return 'crypto';
  if (/bank|account|card|balance|saving|vault|payment|send|transfer|transaction|wallet|kyc|bill|deposit|fx|money/.test(t)) return 'banking';
  return 'general';
}

function subgroupForModule(mod: ModuleMeta): string {
  const t = `${mod.id} ${mod.title} ${mod.subtitle}`.toLowerCase();
  if (/alert|notification/.test(t)) return 'alerts';
  if (/activity|transaction|history|feed/.test(t)) return 'activity';
  if (/saving|vault/.test(t)) return 'savings';
  if (/send|transfer|payment|bill|top.?up/.test(t)) return 'payments';
  if (/card management|manage card|freeze|virtual card|physical card|card controls/.test(t)) return 'cards';
  if (/card|balance|wallet|amount|financial/.test(t)) return 'financial';
  if (/quick|action|grid/.test(t)) return 'quick';
  if (/header|greeting|profile|setting|bottom|dock|tab|navigation/.test(t)) return 'navigation';
  if (/chart|insight|analytic/.test(t)) return 'insights';
  if (/security|kyc|face|freeze|compliance/.test(t)) return 'security';
  if (/crypto|coin|token|swap/.test(t)) return 'crypto';
  return 'general';
}

function pageIconMeta(pageId: PageId, label: string): IconMeta {
  const key = `${pageId} ${label}`.toLowerCase();
  if (key.includes('home')) return { Icon: Home, bg: 'bg-blue-50', text: 'text-blue-600' };
  if (key.includes('card')) return { Icon: CreditCard, bg: 'bg-indigo-50', text: 'text-indigo-600' };
  if (key.includes('activity') || key.includes('insight')) return { Icon: BarChart3, bg: 'bg-cyan-50', text: 'text-cyan-600' };
  if (key.includes('send') || key.includes('transfer')) return { Icon: ArrowRightLeft, bg: 'bg-violet-50', text: 'text-violet-600' };
  if (key.includes('payment') || key.includes('bill')) return { Icon: Wallet, bg: 'bg-emerald-50', text: 'text-emerald-600' };
  if (key.includes('history')) return { Icon: List, bg: 'bg-sky-50', text: 'text-sky-600' };
  if (key.includes('notification') || key.includes('alert')) return { Icon: Bell, bg: 'bg-amber-50', text: 'text-amber-600' };
  if (key.includes('saving') || key.includes('vault')) return { Icon: PiggyBank, bg: 'bg-emerald-50', text: 'text-emerald-600' };
  if (key.includes('account')) return { Icon: Landmark, bg: 'bg-blue-50', text: 'text-blue-600' };
  if (key.includes('security') || key.includes('kyc') || key.includes('compliance')) return { Icon: ShieldCheck, bg: 'bg-rose-50', text: 'text-rose-600' };
  if (key.includes('setting') || key.includes('profile')) return { Icon: User, bg: 'bg-slate-100', text: 'text-slate-600' };
  return { Icon: Layers, bg: 'bg-slate-100', text: 'text-slate-600' };
}

function moduleIconMeta(id: ModuleId, title = ''): IconMeta {
  const key = `${id} ${title}`.toLowerCase();
  if (key.includes('alert') || key.includes('notification')) return { Icon: Bell, bg: 'bg-amber-50', text: 'text-amber-600' };
  if (key.includes('card') || key.includes('balance') || key.includes('wallet')) return { Icon: CreditCard, bg: 'bg-indigo-50', text: 'text-indigo-600' };
  if (key.includes('transaction') || key.includes('activity') || key.includes('history') || key.includes('feed')) return { Icon: List, bg: 'bg-cyan-50', text: 'text-cyan-600' };
  if (key.includes('saving') || key.includes('vault')) return { Icon: PiggyBank, bg: 'bg-emerald-50', text: 'text-emerald-600' };
  if (key.includes('send') || key.includes('transfer') || key.includes('payment') || key.includes('bill') || key.includes('topup')) return { Icon: ArrowRightLeft, bg: 'bg-violet-50', text: 'text-violet-600' };
  if (key.includes('quick') || key.includes('action') || key.includes('grid')) return { Icon: LayoutGrid, bg: 'bg-purple-50', text: 'text-purple-600' };
  if (key.includes('header') || key.includes('greeting')) return { Icon: Type, bg: 'bg-blue-50', text: 'text-blue-600' };
  if (key.includes('amount') || key.includes('display')) return { Icon: CircleDollarSign, bg: 'bg-emerald-50', text: 'text-emerald-600' };
  if (key.includes('bottom') || key.includes('dock') || key.includes('tab')) return { Icon: Home, bg: 'bg-slate-100', text: 'text-slate-600' };
  if (key.includes('face') || key.includes('freeze') || key.includes('security') || key.includes('kyc')) return { Icon: ShieldCheck, bg: 'bg-rose-50', text: 'text-rose-600' };
  if (key.includes('chart') || key.includes('insight') || key.includes('analytic')) return { Icon: BarChart3, bg: 'bg-sky-50', text: 'text-sky-600' };
  if (key.includes('crypto') || key.includes('coin') || key.includes('token')) return { Icon: Coins, bg: 'bg-violet-50', text: 'text-violet-600' };
  if (key.includes('shape')) return { Icon: Square, bg: 'bg-slate-100', text: 'text-slate-600' };
  return { Icon: Box, bg: 'bg-slate-100', text: 'text-slate-600' };
}

/** Everything about the app being built that Save progress stores (and undo/redo restores). */
type StudioDesign = {
  appKind: AppKind;
  pageModules: Record<PageId, ModuleId[]>;
  boxes: Record<string, ModuleBox>;
  workspaceShapes: WorkspaceShape[];
  logic: LogicMap;
} & EditOverridesSnapshot;
type SavedBuildData = { design?: Partial<StudioDesign>; comments?: CanvasComment[] };
const UNDO_LIMIT = 60;
/** How long editing must pause before the build is auto-saved. */
const AUTO_SAVE_DELAY_MS = 1200;
type RightTab = 'design' | 'layout' | 'logic' | 'data' | 'code';
type DragState = { id: ModuleId; from: 'library' | 'canvas' } | null;
type CornerRadii = { topLeft: number; topRight: number; bottomRight: number; bottomLeft: number };
type ShapeType = NonNullable<ModuleBox['shapeType']>;
const COMPONENT_SHAPES: ShapeType[] = ['rounded', 'sharp', 'pill', 'squircle'];
type CanvasShapeType = 'shape-rect' | 'shape-circle' | 'shape-triangle' | 'shape-star' | 'shape-line' | 'shape-arrow' | 'shape-scribble';
/**
 * `component` is a live instance of a library component placed on the workspace.
 * `element` is a flattened copy of a component part (button, icon, block…) pasted onto the canvas.
 */
type CanvasInsertType = CanvasShapeType | 'shape-text' | 'shape-comment' | 'frame' | 'asset' | 'component' | 'element';
type DrawBox = Pick<ModuleBox, 'x' | 'y' | 'w' | 'h' | 'flipX' | 'flipY' | 'freehandPath'>;
type DrawPreview = { type: CanvasInsertType; box: DrawBox };
type WorkspaceShape = {
  id: string;
  type: CanvasInsertType;
  box: ModuleBox;
  frameId?: string;
  componentId?: ModuleId;
  /** A component copy's own edits (text, colours, parts), kept apart from the phone's copy. */
  edits?: ModuleEdits;
};
type ShapeMoveEnd = (
  id: ModuleId,
  pointer: { x: number; y: number },
  grabRatio: { x: number; y: number },
) => void;
type ShapeMoveUpdate = (
  id: ModuleId,
  box: ModuleBox,
  pointer: { x: number; y: number },
  grabRatio: { x: number; y: number },
) => void;
/** Starts alignment-guide snapping for a phone object about to be moved or resized. */
type PhoneSnapStart = (id: ModuleId, mode: 'move' | 'resize') => SnapSession | null;
type ShapeDragPreviewItem = {
  id: string;
  type: CanvasInsertType;
  box: ModuleBox;
  componentId?: ModuleId;
  edits?: ModuleEdits;
  left: number;
  top: number;
  scale: number;
};
type ShapeDragPreview = { items: ShapeDragPreviewItem[] };
/** One object on the studio clipboard. `parent` points at the index of the frame it belongs to. */
type ClipboardItem = {
  type: CanvasInsertType;
  box: ModuleBox;
  componentId?: ModuleId;
  parent?: number;
  /** Rendered size of a copied component, used when it is pasted as a free-floating object. */
  size?: { w: number; h: number };
  /** A copied component's edits, so the copy looks like the original did. */
  edits?: ModuleEdits;
};
/** items[0] is the anchor: on paste its top-left corner lands at the cursor. */
type StudioClipboard = { label: string; items: ClipboardItem[] };
type PasteTarget = { target: 'phone' | 'workspace'; point: { x: number; y: number }; clientY: number };
type ContextMenuState = {
  x: number;
  y: number;
  /** What was right-clicked: the part under the cursor (if any) first, then its whole object. */
  targets: {
    name: string;
    copy: () => StudioClipboard | null;
    remove: () => void;
    /** Frames can be renamed from the menu. */
    rename?: { value: string; apply: (name: string) => void };
  }[];
  paste: PasteTarget | null;
  /** Extra actions such as grouping the Ctrl+clicked selection. */
  actions?: { label: string; run: () => void; disabled?: boolean }[];
};
type ComponentVariant = 'Default' | 'Masked' | 'Negative';
type FillGradient = {
  type: 'Linear' | 'Radial';
  startColor: string;
  endColor: string;
  angle: number;
};

type ImageFill = {
  url: string;
  name: string;
  fit: 'fill' | 'fit' | 'crop' | 'tile';
  opacity: number;
  visible: boolean;
};

type EffectType = 'none' | 'glassmorphism' | 'shadow' | 'blur';

type Insets = { top: number; right: number; bottom: number; left: number };

type ModuleBox = LayoutFields & {
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  frameId?: string;
  flipX?: boolean;
  flipY?: boolean;
  /** Display name, e.g. "Frame 3". */
  name?: string;
  text?: string;
  /** Extra formatting for text layers (letter spacing, case, decoration…) from the text panel. */
  textStyle?: EditableTextStyle;
  textColor?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  fontStyle?: string;
  textAlign?: string;
  lineHeight?: number | string;
  /** Markup of a flattened `element` copy. */
  html?: string;
  freehandPath?: string;
  rotation?: number;
  opacity?: number;
  padding?: Insets;
  cornerRadius?: CornerRadii;
  cornerRadiusLinked?: boolean;
  shapeType?: 'rounded' | 'sharp' | 'pill' | 'squircle';
  strokeWidth?: number;
  strokeColor?: string;
  strokeAlign?: 'inside' | 'center' | 'outside';
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  fillType?: 'none' | 'color' | 'image';
  fillColor?: string;
  fillGradient?: FillGradient;
  variant?: ComponentVariant;
  imageFill?: ImageFill;
  assetUrl?: string;
  assetName?: string;
  /**
   * Set on single-colour icons (e.g. from Iconify): the icon is drawn in this colour, using
   * its image as a mask, and the right panel's Icon color edits it.
   */
  iconColor?: string;
  effectType?: EffectType;
  glassBlur?: number;
  glassSaturation?: number;
  shadowX?: number;
  shadowY?: number;
  shadowBlur?: number;
  shadowColor?: string;
  layerBlur?: number;
};

/** Objects drawn purely as a stroke (they keep a visible line by default). */
const STROKE_ONLY_TYPES: CanvasInsertType[] = ['shape-line', 'shape-arrow', 'shape-scribble'];
/** Layers that are grouped into a shape rather than becoming a group's parent. */
const NON_CONTAINER_TYPES = new Set<string>([...STROKE_ONLY_TYPES, 'shape-text', 'shape-comment']);

function createShapeBox(type: CanvasInsertType, geometry: DrawBox): ModuleBox {
  return {
    ...geometry,
    fillType: ['shape-text', 'shape-comment', 'shape-line', 'shape-scribble'].includes(type) ? 'none' : 'color',
    // Frames default to plain white; other shapes to a light grey (like Figma) so they
    // stay visible without a border.
    fillColor: type === 'frame' ? '#ffffff' : '#D9D9D9',
    // No default border, except on line-type objects which are drawn with their stroke.
    strokeWidth: STROKE_ONLY_TYPES.includes(type) ? 2 : 0,
    strokeColor: STROKE_ONLY_TYPES.includes(type) ? '#0040DF' : '#000000',
    text: type === 'shape-text' ? '' : undefined,
  };
}

type FrameCandidate = { id: string; box: ModuleBox };

/** The smallest frame containing the centre of `box`, i.e. the frame an object dropped there belongs to. */
function frameContaining(frames: FrameCandidate[], box: ModuleBox): string | undefined {
  const centerX = (box.x ?? 0) + (box.w ?? 0) / 2;
  const centerY = (box.y ?? 0) + (box.h ?? 0) / 2;
  return frames
    .filter(({ box: frame }) => {
      const x = frame.x ?? 0;
      const y = frame.y ?? 0;
      return centerX >= x && centerX <= x + (frame.w ?? 0) && centerY >= y && centerY <= y + (frame.h ?? 0);
    })
    .sort((a, b) => (a.box.w ?? 0) * (a.box.h ?? 0) - (b.box.w ?? 0) * (b.box.h ?? 0))[0]?.id;
}

/** Whether `inner` lies completely within `outer` (used when a frame is drawn around existing objects). */
function boxEncloses(outer: ModuleBox, inner: ModuleBox): boolean {
  const ox = outer.x ?? 0;
  const oy = outer.y ?? 0;
  const ix = inner.x ?? 0;
  const iy = inner.y ?? 0;
  return ix >= ox && iy >= oy
    && ix + (inner.w ?? 0) <= ox + (outer.w ?? 0)
    && iy + (inner.h ?? 0) <= oy + (outer.h ?? 0);
}

function canvasInsertTypeForId(id: string): CanvasInsertType | null {
  const types: CanvasInsertType[] = [
    'asset', 'element', 'frame', 'shape-rect', 'shape-circle', 'shape-triangle', 'shape-star',
    'shape-line', 'shape-arrow', 'shape-scribble', 'shape-text', 'shape-comment',
  ];
  return types.find((type) => id.startsWith(`${type}-`)) ?? null;
}

/** A time-based id fragment, so objects created after reloading a saved build never reuse its ids. */
function uniqueIdPart() {
  return Date.now().toString(36);
}

/** Rounds a CSS pixel value to the nearest physical pixel, so transformed content stays crisp. */
function snapToDevicePixel(value: number): number {
  const ratio = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  return Math.round(value * ratio) / ratio;
}

/** Marks a drag that started in the component library (readable during dragover, unlike the data). */
const LIBRARY_DRAG_TYPE = 'application/x-pf-from-library';

/**
 * Hide the browser's own drag image: the studio draws a live preview of the dragged
 * component under the cursor instead (see LibraryDragPreview).
 */
function hideNativeDragImage(event: React.DragEvent) {
  const blank = document.createElement('div');
  Object.assign(blank.style, {
    position: 'fixed', top: '-100px', left: '-100px', width: '1px', height: '1px', opacity: '0',
  });
  document.body.appendChild(blank);
  event.dataTransfer.setDragImage(blank, 0, 0);
  setTimeout(() => blank.remove(), 0);
}

/** Width the dragged component preview is drawn at (it renders at preview width, scaled down). */
const DRAG_PREVIEW_WIDTH = 200;

/** The cursor position during an HTML drag (null until the first drag event). */
function useDragPoint() {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    let frame = 0;
    const track = (event: DragEvent) => {
      const { clientX, clientY } = event;
      // Some browsers report 0,0 for the last events of a drag.
      if (clientX === 0 && clientY === 0) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPoint({ x: clientX, y: clientY }));
    };
    window.addEventListener('dragover', track, true);
    window.addEventListener('drag', track, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('dragover', track, true);
      window.removeEventListener('drag', track, true);
    };
  }, []);
  return point;
}

/** Card that follows the cursor while something is dragged, with a label under the preview. */
function DragFollower({ point, label, children }: {
  point: { x: number; y: number };
  label: string;
  children: React.ReactNode;
}) {
  return createPortal(
    // data-theme-keep: components are previewed in their real (light) colours in dark mode too.
    <div
      aria-hidden
      data-theme-keep
      className="pointer-events-none fixed z-[300] overflow-hidden rounded-xl bg-white opacity-90 shadow-[0_12px_32px_rgba(15,23,42,0.22)] ring-2 ring-[#0040DF]"
      style={{ left: point.x + 14, top: point.y + 14, width: DRAG_PREVIEW_WIDTH }}
    >
      {children}
      <p className="truncate border-t border-slate-100 bg-[#F7F8FF] px-2 py-1 text-[10px] font-semibold text-[#0040DF]">
        {label}
      </p>
    </div>,
    document.body,
  );
}

/** A scaled-down render of a saved (created) component's frame and layers, following the cursor. */
function CreatedDragPreview({ id, ctx }: { id: string; ctx: ViewCtx }) {
  const point = useDragPoint();
  const saved = useCreatedComponents().find((item) => item.id === id);
  const clip = saved?.clip as StudioClipboard | undefined;
  const anchor = clip?.items[0]?.box;
  if (!point || !saved || !clip || !anchor || typeof document === 'undefined') return null;
  const width = Math.max(1, anchor.w ?? 200);
  const height = Math.max(1, anchor.h ?? 120);
  const scale = Math.min(1, DRAG_PREVIEW_WIDTH / width, 160 / height);
  return (
    <DragFollower point={point} label={saved.name}>
      <div className="flex justify-center bg-[#F7F8FF] p-2">
        <div className="relative overflow-hidden" style={{ width: width * scale, height: height * scale }}>
          <div className="absolute left-0 top-0" style={{ width, height, zoom: scale }}>
            {clip.items.map((item, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  left: (item.box.x ?? 0) - (anchor.x ?? 0),
                  top: (item.box.y ?? 0) - (anchor.y ?? 0),
                  ...(item.type === 'shape-text'
                    ? { display: 'flex', minWidth: item.box.w, minHeight: item.box.h }
                    : { width: item.box.w ?? item.size?.w ?? 100, height: item.box.h ?? item.size?.h ?? 100 }),
                }}
              >
                <CanvasObjectContent
                  type={item.type}
                  shapeId={`${item.type}-created-drag-${index}`}
                  box={item.box}
                  componentId={item.componentId}
                  edits={item.edits}
                  ctx={ctx}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DragFollower>
  );
}

/** A live, scaled-down render of the component being dragged from the library, following the cursor. */
function LibraryDragPreview({ id, ctx, onMeasure }: {
  id: ModuleId;
  ctx: ViewCtx;
  /** Reports the component's size at preview width, used when it is dropped on the canvas. */
  onMeasure: (size: { w: number; h: number }) => void;
}) {
  const point = useDragPoint();
  if (!point || typeof document === 'undefined') return null;
  const scale = DRAG_PREVIEW_WIDTH / COMPONENT_PREVIEW_WIDTH;
  return (
    <DragFollower point={point} label={moduleFor(id)?.title ?? 'Component'}>
      <div
        ref={(element) => {
          const height = element ? element.getBoundingClientRect().height / scale : 0;
          if (height > 0) onMeasure({ w: COMPONENT_PREVIEW_WIDTH, h: Math.round(height) });
        }}
        style={{ width: COMPONENT_PREVIEW_WIDTH, zoom: scale }}
      >
        <ModuleView id={id} ctx={ctx} passive isolated />
      </div>
    </DragFollower>
  );
}

/** The screen size of each preview device, in canvas pixels. */
function deviceDimensions(device: DeviceType) {
  return device === 'iphone' ? { w: 320, h: 640 }
    : device === 'pixel' ? { w: 340, h: 640 }
    : device === 'desktop' ? { w: 960, h: 600 }
    : { w: 700, h: 680 };
}

/** Height of the phone's status bar, above the page body that objects are placed in. */
const STATUS_BAR_HEIGHT = 32;

function assetDimensions(asset: AssetItem) {
  if (asset.w && asset.h) return { w: asset.w, h: asset.h };
  if (asset.kind === 'logo') return { w: 80, h: 40 };
  if (asset.kind === 'media') return { w: 120, h: 80 };
  if (asset.kind === 'token') return { w: 48, h: 48 };
  return { w: 36, h: 36 };
}

/** The right panel's colour picker key for an icon's own colour (other keys are schema colour slots). */
const ICON_COLOR_PICKER = '__icon-color';
const CSS_HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/* ═══════════════════════════ IconRail ═══════════════════════════ */

/** What the left pane shows: the navigator (pages, components, assets) or the plugins panel. */
type LeftView = 'navigator' | 'plugins';

function IconRail({ view, onView }: { view: LeftView; onView: (view: LeftView) => void }) {
  const items: { Icon: IconType; label: string; view?: LeftView; badge?: number }[] = [
    { Icon: Layers, label: 'Navigator', view: 'navigator' },
    { Icon: Puzzle, label: 'Plugins', view: 'plugins' },
    { Icon: Workflow, label: 'App flow' },
    { Icon: Palette, label: 'Theme' },
    { Icon: ShieldCheck, label: 'Compliance', badge: 2 },
  ];
  return (
    <aside className="flex w-14 shrink-0 flex-col items-center border-r border-slate-200 bg-white py-2">
      {items.map(({ Icon, label, view: target, badge }) => {
        const active = !!target && target === view;
        return (
        <button key={label} type="button" title={label} aria-label={label} aria-pressed={target ? active : undefined}
          onClick={target ? () => onView(target) : undefined}
          className={`relative mb-0.5 grid h-9 w-9 place-items-center rounded-lg ${active ? 'bg-[#E8EEFF] text-[#0040DF]' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}>
          <Icon className="h-4 w-4" />
          {badge ? (<span className="absolute -right-0.5 -top-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-rose-500 px-0.5 text-[8px] font-bold text-white">{badge}</span>) : null}
        </button>
        );
      })}
      <div className="mt-auto flex flex-col items-center gap-1">
        <Link
          href="/userdashboard/"
          title="Back to dashboard"
          aria-label="Back to dashboard"
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <button title="Settings" className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
          <Settings className="h-4 w-4" />
        </button>
        <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
      </div>
    </aside>
  );
}

/* ═══════════════════════════ LeftPanel ═══════════════════════════ */

function PageMenuItem({
  pageId, label, count, active, expanded, accent, singleSlot, canvasModules,
  appKind, onSelect, onToggleExpand, onAddModule, onRemoveModule,
  onStartDrag, onEndDrag, drag, selectedId, onSelectModule, onSelectTextSlot, onShowPreview,
}: {
  pageId: PageId; label: string; count: number; active: boolean; expanded: boolean;
  accent: string; singleSlot: boolean; canvasModules: ModuleId[]; appKind: AppKind;
  onSelect: () => void; onToggleExpand: () => void;
  onAddModule: (id: ModuleId) => void; onRemoveModule: (id: ModuleId) => void;
  onStartDrag: (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => void;
  onEndDrag: () => void; drag: DragState;
  selectedId: ModuleId | null;
  onSelectModule: (id: ModuleId) => void;
  onSelectTextSlot: (id: ModuleId, slot: string | null) => void;
  onShowPreview: (id: ModuleId, event: React.MouseEvent) => void;
}) {
  const pageComponents = allModulesFor().filter((m) => pageModulesFor(pageId, appKind).includes(m.id));
  const pageMeta = pageIconMeta(pageId, label);
  
  const [expandedLayerId, setExpandedLayerId] = useState<ModuleId | null>(null);
  const [activeSubLayer, setActiveSubLayer] = useState<string | null>(null);

  // Helper to generate layers dynamically from the schema
  const getLayers = (modId: ModuleId) => {
    const schema = EDITABLE_SCHEMA[modId];
    const layers: { id: string; label: string; type: 'text' | 'color'; Icon: IconType }[] = [];
    
    if (schema?.text) {
      schema.text.forEach((t) => layers.push({ id: `text:${t.slot}`, label: t.label, type: 'text', Icon: Type }));
    }
    if (schema?.colors) {
      schema.colors.forEach((c) => layers.push({ id: `color:${c.slot}`, label: c.label, type: 'color', Icon: Palette }));
    }
    return layers;
  };

  return (
    <li className="relative list-none mb-2">
      <div className={`rounded-xl border transition ${expanded ? 'border-slate-200 bg-white shadow-sm' : 'border-transparent'}`}>
        <div
          onClick={() => {
            if (!active) onSelect();
            onToggleExpand();
          }}
          className={`flex cursor-pointer items-center gap-2 px-2.5 py-1.5 ${
            !expanded && active ? 'rounded-xl bg-[#EDEFFC]' : ''
          }`}
        >
          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${pageMeta.bg} ${pageMeta.text}`}>
            <pageMeta.Icon className="h-3.5 w-3.5" />
          </span>

          <div className="flex min-w-0 flex-1 items-center gap-1">
            <span
              className={`min-w-0 flex-1 truncate text-left text-[12px] ${
                active ? 'font-semibold text-[#0040DF]' : 'font-medium text-slate-700'
              }`}
            >
              {label}
            </span>
          </div>

          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
              active ? 'bg-[#0040DF] font-semibold text-white' : 'bg-[#E3E6F7] font-medium text-slate-500'
            }`}
          >
            {count} comps
          </span>

          <span className="grid h-5 w-5 place-items-center rounded-full text-slate-400">
            {expanded ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </span>
        </div>

        {expanded && (
          <div className="space-y-0.5 border-t border-slate-100 px-2 pb-2 pt-1">
            {singleSlot && (
              <p className="mb-1 rounded-md bg-blue-50 px-2 py-1 text-[9px] font-medium text-blue-700">
                Single slot page — adding replaces current.
              </p>
            )}

            {pageComponents.map((mod) => {
              const isAdded = canvasModules.includes(mod.id);
              const isDragging = drag?.id === mod.id && drag.from === 'library';
              const modMeta = moduleIconMeta(mod.id, mod.title);
              const isSelected = mod.id === selectedId;
              const hasLayersExpanded = expandedLayerId === mod.id;
              const layers = getLayers(mod.id);
              const hasLayers = layers.length > 0;

              return (
                <div key={mod.id} className="flex flex-col">
                  <div
                    draggable
                    onDragStart={(e) => onStartDrag(e, mod.id, 'library')}
                    onDragEnd={onEndDrag}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!active) onSelect();
                      onSelectModule(mod.id);
                      // Toggle the layer dropdown
                      setExpandedLayerId(isSelected ? (hasLayersExpanded ? null : mod.id) : mod.id);
                      setActiveSubLayer(null);
                    }}
                    className={`group flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 ${
                      isSelected ? 'bg-[#0040DF] text-white' : 'hover:bg-slate-100/80'
                    } ${isDragging ? 'opacity-50' : ''}`}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-md ${
                          isSelected ? 'bg-white/20 text-white' : `${modMeta.bg} ${modMeta.text}`
                        }`}
                      >
                        <modMeta.Icon className="h-3 w-3" />
                      </span>
                      <span className={`truncate text-[11px] font-medium ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                        {mod.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Eye Icon for Preview */}
                      <button
                        type="button"
                        title="Preview component"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowPreview(mod.id, e);
                        }}
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded hover:bg-slate-200 ${
                          isSelected ? 'text-white/80 hover:text-white hover:bg-white/20' : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      {isSelected && hasLayers && (
                        <ChevronRight className={`h-3 w-3 text-white/80 transition-transform ${hasLayersExpanded ? 'rotate-90' : ''}`} />
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          isAdded ? onRemoveModule(mod.id) : onAddModule(mod.id);
                        }}
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded hover:bg-slate-200 ${
                          isSelected ? 'text-white/80 hover:text-white hover:bg-white/20' : isAdded ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      >
                        {isAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Dynamic nested layers */}
                  {isSelected && hasLayersExpanded && (
                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-[#0040DF]/20 pl-2 pb-1">
                      {layers.map((layer) => {
                        const isSubActive = activeSubLayer === layer.id;
                        return (
                          <div
                            key={layer.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSubLayer(layer.id);
                              onSelectTextSlot(
                                mod.id,
                                layer.type === 'text' ? layer.id.slice('text:'.length) : null,
                              );
                            }}
                            className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-[10px] transition-colors ${
                              isSubActive
                                ? 'bg-[#0040DF] text-white'
                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                            }`}
                          >
                            <layer.Icon className={`h-3 w-3 ${isSubActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{layer.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </li>
  );
}

/** Width components render at in the hover preview's live render area (320px card minus padding). */
const COMPONENT_PREVIEW_WIDTH = 288;

/**
 * A component tile in the library grid. The component renders at the hover preview's
 * width, then scales down uniformly to fit the tile, so it is never squished.
 */
function ComponentThumbnail({ id, ctx }: { id: ModuleId; ctx: ViewCtx }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const content = contentRef.current;
    if (!frame || !content) return;
    // The observer also fires once straight away, which sets the initial scale.
    const observer = new ResizeObserver(() => {
      const fit = Math.min(
        frame.clientWidth / COMPONENT_PREVIEW_WIDTH,
        frame.clientHeight / (content.offsetHeight || 1),
      );
      setScale((previous) => (Math.abs(previous - fit) < 0.001 ? previous : fit));
    });
    observer.observe(frame);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} data-theme-keep className="relative h-full w-full overflow-hidden rounded-md bg-[#F7F8FF]">
      <div
        ref={contentRef}
        data-thumb-content
        className="pointer-events-none absolute left-1/2 top-1/2"
        style={{
          width: COMPONENT_PREVIEW_WIDTH,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center',
        }}
      >
        <ModuleView id={id} ctx={ctx} passive isolated />
      </div>
    </div>
  );
}

type LayerSource = { id: string; key: string; type: string; name: string; parent?: string };

/**
 * Build a Figma-style layers tree from canvas objects linked by their parent (frame or
 * group) id. Frontmost layers are listed first. A shape with layers grouped into it is
 * shown as a group holding the shape and those layers.
 */
function buildLayerNodes(items: LayerSource[]): LayerNode[] {
  const ids = new Set(items.map((item) => item.id));
  const childrenOf = new Map<string, LayerSource[]>();
  const roots: LayerSource[] = [];
  items.forEach((item) => {
    if (item.parent && item.parent !== item.id && ids.has(item.parent)) {
      childrenOf.set(item.parent, [...(childrenOf.get(item.parent) ?? []), item]);
    } else {
      roots.push(item);
    }
  });
  let groupCount = 0;
  const visited = new Set<string>();
  const build = (item: LayerSource): LayerNode => {
    visited.add(item.id);
    const children = (childrenOf.get(item.id) ?? [])
      .filter((child) => !visited.has(child.id))
      .map(build)
      .reverse();
    const node: LayerNode = { key: item.key, name: item.name, kind: item.type, selectKey: item.key, children: [] };
    if (item.type === 'frame') return { ...node, children };
    if (children.length === 0) return node;
    groupCount += 1;
    return {
      key: `g:${item.key}`,
      name: `Group ${groupCount}`,
      kind: 'group',
      selectKey: item.key,
      children: [...children, node],
    };
  };
  return roots.map(build).reverse();
}

/** The name a canvas object gets in the layers tree. */
function layerName(type: CanvasInsertType, box: ModuleBox, componentId?: ModuleId): string {
  if (type === 'shape-text') return box.text?.trim().slice(0, 40) || 'Text';
  if (type === 'component') return (componentId && moduleFor(componentId)?.title) || 'Component';
  return canvasObjectTitle(`${type}-layer` as ModuleId, box) ?? 'Shape';
}

function LeftPanel({
  appKind, onAppKind, activePage, onSelectPage, expandedPage, onToggleExpand,
  pageModules, accent, onStartDrag, onEndDrag, drag, onAddModule, onRemoveModule,
  selectedId, onSelectModule, onAssetClick, onAssetApply, measured,
  onSelectTextSlot, onCollapse, layerSections, selectedLayerKey, onSelectLayer,
  onAddCreatedToPhone, onCreatedDragChange,
}: {
  layerSections: LayerSection[];
  selectedLayerKey: string | null;
  onSelectLayer: (key: string) => void;
  onAddCreatedToPhone: (id: string) => void;
  onCreatedDragChange: (id: string | null) => void;
  appKind: AppKind; onAppKind: (k: AppKind) => void;
  activePage: PageId; onSelectPage: (p: PageId) => void;
  expandedPage: PageId | null; onToggleExpand: (p: PageId) => void;
  pageModules: Record<PageId, ModuleId[]>;
  accent: string; drag: DragState;
  onStartDrag: (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => void;
  onEndDrag: () => void;
  onAddModule: (id: ModuleId, variant?: ComponentVariant) => void; onRemoveModule: (id: ModuleId) => void;
  selectedId: ModuleId | null;
  onSelectModule: (id: ModuleId) => void;
  onSelectTextSlot: (id: ModuleId, slot: string | null) => void;
  onAssetClick: (asset: AssetItem) => void;
  onAssetApply: (asset: AssetItem) => void;
  onCollapse: () => void;
  measured: Record<string, { w: number; h: number }>;
}){
  const [tab, setTab] = useState<'navigator' | 'comps' | 'assets'>('navigator');
  const [query, setQuery] = useState('');
  const [compLibrary, setCompLibrary] = useState<CompLibraryId | null>(null);
  const [activeCompSubgroup, setActiveCompSubgroup] = useState<string | null>(null);
  const [previewInfo, setPreviewInfo] = useState<{ id: ModuleId; top: number; left: number } | null>(null);
  const [previewVariant, setPreviewVariant] = useState<ComponentVariant>('Default');
  const previewCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const previewCtx: ViewCtx = {
    radius: RADII.rounded,
    accent,
    isDark: false,
    interactive: false,
    balance: INITIAL_BALANCE,
    income: INITIAL_INCOME,
    outcome: INITIAL_OUTCOME,
    savings: INITIAL_SAVINGS,
    transactions: INITIAL_TRANSACTIONS,
    faceId: true,
    isCardFrozen: false,
    actions: noopActions,
  };

  const handleShowPreview = (id: ModuleId, event: React.MouseEvent) => {
    if (previewCloseTimerRef.current) clearTimeout(previewCloseTimerRef.current);
    const rect = event.currentTarget.getBoundingClientRect();
    setPreviewVariant('Default');
    setPreviewInfo({
      id,
      top: Math.max(16, Math.min(rect.top, window.innerHeight - 600)), 
      left: rect.right + 16,
    });
  };

  const closePreview = () => {
    if (previewCloseTimerRef.current) clearTimeout(previewCloseTimerRef.current);
    setPreviewInfo(null);
  };
  const schedulePreviewClose = () => {
    if (previewCloseTimerRef.current) clearTimeout(previewCloseTimerRef.current);
    previewCloseTimerRef.current = setTimeout(() => setPreviewInfo(null), 250);
  };
  const keepPreviewOpen = () => {
    if (previewCloseTimerRef.current) clearTimeout(previewCloseTimerRef.current);
  };

  const allMods = allModulesFor();
  const filteredMods = allMods.filter(
    (m) =>
      query === '' ||
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.subtitle.toLowerCase().includes(query.toLowerCase())
  );
  
  const compsInLibrary = compLibrary
    ? filteredMods.filter((m) => libraryForModule(m) === compLibrary)
    : [];

  const groupedComps = COMP_SUBGROUPS
    .map((group) => ({
      ...group,
      mods: compsInLibrary.filter((m) => subgroupForModule(m) === group.id),
    }))
    .filter((group) => group.mods.length > 0);

  const activeGroup = groupedComps.find((g) => g.id === activeCompSubgroup);

  const renderCompModule = (mod: ModuleMeta) => {
    const isDragging = drag?.id === mod.id && drag.from === 'library';

    return (
      <div
        key={mod.id}
        draggable
        title={mod.title}
        aria-label={mod.title}
        onMouseEnter={(event) => handleShowPreview(mod.id, event)}
        onMouseLeave={schedulePreviewClose}
        onClick={() => onAddModule(mod.id)}
        onDragStart={(e) => onStartDrag(e, mod.id, 'library')}
        onDragEnd={onEndDrag}
        className={`relative h-[120px] cursor-grab overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition hover:border-[#0040DF]/40 hover:shadow-md active:cursor-grabbing ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <ComponentThumbnail id={mod.id} ctx={previewCtx} />
      </div>
    );
  };

  return (
    <aside className="relative flex w-full min-w-0 flex-col border-r border-slate-200 bg-[#EDEFFC] scrollbar-thin-blue">
      <div className="flex items-center border-b border-slate-200 px-2 pt-2">
        <button
          onClick={() => setTab('navigator')}
          className={`flex flex-1 items-center justify-center gap-1 rounded-t-md px-1 py-1.5 text-[12px] font-bold uppercase tracking-wider transition-colors ${
            tab === 'navigator' ? 'border border-b-0 border-slate-200 bg-white text-[#0040DF]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="h-3 w-3" /> Navigator
        </button>
        <button
          onClick={() => setTab('comps')}
          className={`flex flex-1 items-center justify-center gap-1 rounded-t-md px-1 py-1.5 text-[12px] font-bold uppercase tracking-wider transition-colors ${
            tab === 'comps' ? 'border border-b-0 border-slate-200 bg-white text-[#0040DF]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Box className="h-3 w-3" /> Comps
        </button>
        <button
          onClick={() => setTab('assets')}
          className={`flex flex-1 items-center justify-center gap-1 rounded-t-md px-1 py-1.5 text-[12px] font-bold uppercase tracking-wider transition-colors ${
            tab === 'assets' ? 'border border-b-0 border-slate-200 bg-white text-[#0040DF]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette className="h-3 w-3" /> Assets
        </button>
        <button
          type="button"
          title="Collapse left panel"
          aria-label="Collapse left panel"
          onClick={onCollapse}
          className="ml-1 grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-white hover:text-[#0040DF]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 pt-2 pb-1">
        <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5">
          <Search className="h-3 w-3 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search layers, props…"
            className="w-full bg-transparent text-[10px] outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {tab === 'navigator' && (
        <>
          <div className="space-y-3 px-4 pb-2 pt-2">
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                App Flow · Consumer DDA
              </span>
            </div>
          </div>
          <ul className="m-0 min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 pb-3 scrollbar-thin-blue [scrollbar-width:thin] [scrollbar-color:#0040DF_transparent] [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#0040DF] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#002db3]">
            {PAGES.map((p) => (
              <PageMenuItem
                key={p.id}
                pageId={p.id}
                label={p.label}
                count={pageModulesFor(p.id, appKind).length}
                active={activePage === p.id}
                expanded={expandedPage === p.id}
                accent={accent}
                singleSlot={!!SINGLE_SLOT[p.id]}
                canvasModules={pageModules[p.id] ?? []}
                appKind={appKind}
                onSelect={() => onSelectPage(p.id)}
                onToggleExpand={() => onToggleExpand(p.id)}
                onAddModule={onAddModule}
                onRemoveModule={onRemoveModule}
                onStartDrag={onStartDrag}
                onEndDrag={onEndDrag}
                drag={drag}
                selectedId={selectedId}
                onSelectModule={onSelectModule}
                onSelectTextSlot={onSelectTextSlot}
                onShowPreview={handleShowPreview}
              />
            ))}
            <CreatedComponentsMenuItem
              sections={layerSections}
              selectedKey={selectedLayerKey}
              onSelectLayer={onSelectLayer}
              onAddToPhone={onAddCreatedToPhone}
              onDragChange={onCreatedDragChange}
              query={query}
            />
          </ul>
          <div className="border-t border-slate-200 p-2">
            <button className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-slate-300 py-1.5 text-[10px] font-semibold text-slate-600 hover:border-[#0040DF] hover:text-[#0040DF]">
              <PlusCircle className="h-3 w-3" /> Add New Screen
            </button>
          </div>
        </>
      )}

      {tab === 'comps' && (
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-3 pt-2 scrollbar-thin-blue [scrollbar-width:thin] [scrollbar-color:#0040DF_transparent] [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#0040DF] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#002db3]">
          {query.trim() !== '' ? (
            <>
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Search results</span>
                <span className="text-[10px] text-slate-400">{filteredMods.length} items</span>
              </div>
              {filteredMods.length === 0 && <p className="py-6 text-center text-[10px] text-slate-400">No components found.</p>}
              <div className="grid grid-cols-2 gap-2">
                {filteredMods.map(renderCompModule)}
              </div>
            </>
          ) : compLibrary === null ? (
            <>
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Design Kits &amp; Libraries</span>
                <span className="text-[10px] text-slate-400">3 active</span>
              </div>
              {COMP_LIBRARY_ORDER.map((id) => {
                const meta = COMP_LIBRARY_META[id];
                const count = allMods.filter((m) => libraryForModule(m) === id).length;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setCompLibrary(id); setActiveCompSubgroup(null); }}
                    className="group w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition hover:border-[#0040DF]/40 hover:shadow-sm"
                  >
                    <div className={`flex h-24 items-center justify-center overflow-hidden ${meta.bg}`}>
                      <img src={meta.img} alt={meta.label} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-bold text-slate-800">{meta.label}</p>
                        <p className="text-[10px] text-slate-500">{count} components</p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-[#0040DF]" />
                    </div>
                  </button>
                );
              })}
              <button type="button" className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0040DF] py-2 text-[11px] font-semibold text-white hover:bg-[#0036BF]">
                <PlusCircle className="h-3.5 w-3.5" /> Explore More Components
              </button>
            </>
          ) : activeCompSubgroup === null ? (
            <>
              <div className="mb-1 flex items-center gap-2 px-1">
                <button type="button" onClick={() => { setCompLibrary(null); setActiveCompSubgroup(null); }} className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 hover:text-[#0040DF]">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold text-slate-800">{COMP_LIBRARY_META[compLibrary].label}</p>
                  <p className="text-[9px] text-slate-500">{compsInLibrary.length} components</p>
                </div>
              </div>
              <div className="-mx-3 divide-y divide-slate-200 border-y border-slate-200 bg-white">
                {groupedComps.map((group) => (
                  <button key={group.id} type="button" onClick={() => setActiveCompSubgroup(group.id)} className="group flex w-full items-center gap-3.5 px-3 py-3 text-left transition hover:bg-[#F7F8FF]">
                    <span className="flex h-[52px] w-[52px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 transition group-hover:border-[#0040DF]/30">
                      <span className={`grid h-6 w-6 place-items-center rounded-md ${group.bg} ${group.text}`}>
                        <group.Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="h-1 w-7 rounded-full bg-slate-200" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-semibold text-slate-900">{group.label}</p>
                      <p className="mt-0.5 text-[10.5px] text-slate-400">{group.mods.length} template{group.mods.length === 1 ? '' : 's'}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-[#0040DF]" />
                  </button>
                ))}
              </div>
              {groupedComps.length === 0 && <p className="py-6 text-center text-[10px] text-slate-400">No components found.</p>}
            </>
          ) : (
            <>
              <div className="mb-1 flex items-center gap-2 px-1">
                <button type="button" onClick={() => setActiveCompSubgroup(null)} className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 hover:text-[#0040DF]">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold text-slate-800">{activeGroup?.label}</p>
                  <p className="text-[9px] text-slate-500">{activeGroup?.mods.length} components</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {activeGroup?.mods.map(renderCompModule)}
              </div>
              {!activeGroup?.mods.length && <p className="py-6 text-center text-[10px] text-slate-400">No components found.</p>}
            </>
          )}
        </div>
      )}

      {tab === 'assets' && (
        <AssetTab
          accent={accent}
          onAssetDragStart={onAssetClick}
          onAssetClick={onAssetClick}
          onAssetApply={onAssetApply}
        />
      )}

            {/* Component Preview Portal */}
      {previewInfo && typeof document !== 'undefined' && (() => {
        const mod = moduleFor(previewInfo.id);
        const dims = measured[previewInfo.id] || { w: 361, h: 168 };
        
        return createPortal(
          <div
            className="fixed z-[100] w-[320px] overflow-hidden rounded-xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-1 ring-slate-900/5 animate-in fade-in zoom-in-95 duration-200 flex flex-col"
            style={{ top: previewInfo.top, left: previewInfo.left }}
            onMouseEnter={keepPreviewOpen}
            onMouseLeave={schedulePreviewClose}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-3 py-2">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-800">
                Fintech Connect Core Library <span className="text-slate-300">·</span>
                <Layers className="h-3 w-3 text-slate-400 ml-1" />
              </div>
              <button onClick={closePreview} className="text-slate-400 hover:text-slate-600">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Live Render Area */}
            <div className="bg-[#F4F6FF] p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-1xl bg-[#E2E8F0]" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#0040DF]">Live Render</span>
              </div>
              <div className="flex w-full items-center justify-center">
                 <div className="w-full max-w-[320px] rounded-1lg bg-white p-1 shadow-sm ring-1 ring-slate-900/5">
                   <ModuleView id={previewInfo.id} ctx={{ ...previewCtx, variant: previewVariant }} passive isolated />
                 </div>
              </div>
            </div>

            {/* Details Area */}
            <div className="flex flex-col gap-3 p-3">
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">{mod?.title ?? 'Component'}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-[#6941C6] text-[8px] font-bold text-white">A</span>
                  <span>Apex Design System · Updated 3d ago</span>
                </div>
              </div>

              {/* Variant State */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Variant</span>
                <div className="flex rounded-lg p-0.5 border border-slate-100 bg-slate-50">
                  {(['Default', 'Masked', 'Negative'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={previewVariant === v}
                      onClick={() => setPreviewVariant(v)}
                      className={`flex-1 rounded-md py-1 text-[11px] font-semibold transition ${previewVariant === v ? 'bg-white text-[#0040DF] shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Insert Button */}
              <button
                onClick={() => { onAddModule(previewInfo.id, previewVariant); closePreview(); }}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0040DF] py-2 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#0036BF]"
              >
                 Insert Component
              </button>

              {/* Schema Box */}
              <div className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-500">BOUND SCHEMA</span>
                  <span className="text-[#0040DF]">CoreBanking.account.balance</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-500">DIMENSIONS</span>
                  <span className="text-slate-700">{dims.w} × {dims.h} pt (Responsive Fill)</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-500">ACTION TRIGGERS</span>
                  <span className="text-slate-700">OnTap → /wallet/details</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        );
      })()}
    </aside>
  );
}

/* ═══════════════════════════ Phone Canvas ═══════════════════════════ */

function BottomDockTabBar({ activePage, isDark, onNavTab }: { activePage: PageId; isDark: boolean; onNavTab: (tab: TabId) => void; }) {
  const tabs = [
    { id: 'home' as TabId, label: 'Home', Icon: Home },
    { id: 'cards' as TabId, label: 'Cards', Icon: CreditCard },
    { id: 'activity' as TabId, label: 'Insights', Icon: BarChart3 },
    { id: 'settings' as TabId, label: 'Profile', Icon: User },
  ];

  return (
    <div className={`absolute inset-x-3 bottom-2.5 z-10 flex items-center justify-around rounded-[18px] px-3 py-2 shadow-[0_8px_24px_rgba(20,20,40,0.12)] ring-1 ${isDark ? 'bg-slate-900 ring-slate-800' : 'bg-white ring-slate-100'}`}>
      {tabs.map(({ id, label, Icon }) => {
        const active = PAGE_TO_TAB[activePage] === id;
        return (
          <button key={id} aria-label={label} onClick={() => onNavTab(id)}
            className={`relative flex flex-col items-center gap-0.5 rounded-lg px-2 py-0.5 ${active ? 'text-[#0040DF]' : 'text-slate-400'}`}>
            <Icon className="h-3.5 w-3.5" />
            <span className="text-[7px] font-semibold">{label}</span>
            {active && <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-[#0040DF]" />}
          </button>
        );
      })}
    </div>
  );
}

function DropLine({ side, accent }: { side: 'top' | 'bottom'; accent: string }) {
  return (
    <span aria-hidden className={`pointer-events-none absolute inset-x-0 z-30 flex items-center ${side === 'top' ? '-top-3' : '-bottom-3'}`}>
      <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
      <span className="h-0.5 flex-1 rounded-full" style={{ background: accent }} />
      <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
    </span>
  );
}

function radiusForBox(box: ModuleBox): string | undefined {
  if (box.shapeType === 'rounded') return '16px';
  if (box.shapeType === 'sharp') return '0px';
  if (box.shapeType === 'pill') return '9999px';
  if (box.shapeType === 'squircle') return '28%';
  if (box.cornerRadius) {
    const { topLeft, topRight, bottomRight, bottomLeft } = box.cornerRadius;
    return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
  }
  return undefined;
}

function canvasObjectTitle(id: ModuleId | null, box?: ModuleBox): string | null {
  if (id?.startsWith('asset-')) return box?.assetName ?? 'Image Asset';
  if (id?.startsWith('frame-')) return box?.name ?? 'Frame';
  if (id?.startsWith('element-')) return 'Copied layer';
  if (id?.startsWith('component-')) return 'Component instance';
  if (!id?.startsWith('shape-')) return null;
  const type = id.slice('shape-'.length).split('-')[0];
  const labels: Record<string, string> = {
    rect: 'Rectangle',
    circle: 'Ellipse',
    triangle: 'Triangle',
    star: 'Star',
    line: 'Line',
    arrow: 'Arrow',
    scribble: 'Freehand',
    text: 'Text',
    comment: 'Comment',
  };
  return labels[type] ?? 'Shape';
}

/**
 * An image/icon asset on the canvas. Like a Figma image layer it takes the right panel's
 * properties: a fill (color, gradient or image) behind the asset, stroke, corner radius
 * and padding.
 */
function CanvasAssetObject({ box }: { box: ModuleBox }) {
  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{
        ...backgroundForBox(box),
        border: box.strokeWidth
          ? `${box.strokeWidth}px ${box.strokeStyle ?? 'solid'} ${box.strokeColor ?? '#0040DF'}`
          : undefined,
        borderRadius: radiusForBox(box),
        boxSizing: 'border-box',
        padding: box.padding
          ? `${box.padding.top}px ${box.padding.right}px ${box.padding.bottom}px ${box.padding.left}px`
          : undefined,
      }}
    >
      <div
        role="img"
        aria-label={box.assetName ?? 'Canvas asset'}
        className="h-full w-full"
        style={box.iconColor && box.assetUrl
          ? {
              // A recolourable icon: its shape cut out of a block of the chosen colour.
              backgroundColor: box.iconColor,
              maskImage: `url("${box.assetUrl}")`,
              WebkitMaskImage: `url("${box.assetUrl}")`,
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
            }
          : {
              backgroundImage: box.assetUrl ? `url("${box.assetUrl}")` : undefined,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
            }}
      />
    </div>
  );
}

function backgroundForBox(box: ModuleBox): React.CSSProperties | undefined {
  if (box.fillType === 'color' && (box.fillColor || box.fillGradient)) {
    return box.fillGradient
      ? {
          backgroundImage: box.fillGradient.type === 'Linear'
            ? `linear-gradient(${box.fillGradient.angle}deg, ${box.fillGradient.startColor}, ${box.fillGradient.endColor})`
            : `radial-gradient(circle, ${box.fillGradient.startColor}, ${box.fillGradient.endColor})`,
        }
      : { backgroundColor: box.fillColor };
  }
  if (box.fillType === 'image' && box.imageFill?.url && box.imageFill.visible !== false) {
    const { url, fit } = box.imageFill;
    return {
      backgroundImage: `url(${url})`,
      backgroundSize: fit === 'fill' ? '100% 100%' : fit === 'fit' ? 'contain' : fit === 'crop' ? 'cover' : 'auto',
      backgroundRepeat: fit === 'tile' ? 'repeat' : 'no-repeat',
      backgroundPosition: 'center',
    };
  }
  return undefined;
}

/** Apply a component's box styling (fill, stroke, radius, stretch…) to its render context. */
function ctxForBox(ctx: ViewCtx, box: ModuleBox): ViewCtx {
  const background = backgroundForBox(box);
  return {
    ...ctx,
    customRadius: radiusForBox(box),
    customPadding: box.padding,
    variant: box.variant ?? 'Default',
    customStroke: box.strokeWidth ? {
      border: `${box.strokeWidth}px ${box.strokeStyle ?? 'solid'} ${box.strokeColor ?? '#6941C6'}`,
      boxSizing: 'border-box' as const,
    } : undefined,
    customBackground: box.fillType === 'color' ? background : undefined,
    customBackgroundImage: box.fillType === 'image' ? background : undefined,
    stretchHeight: box.h !== undefined || box.heightMode === 'fill',
  };
}

/** A flattened copy of a component part. The markup is a clone of the studio's own rendered DOM. */
function CanvasElementSnapshot({ box }: { box: ModuleBox }) {
  return (
    <div
      aria-hidden="true"
      className={`${outfit.className} pointer-events-none h-full w-full`}
      style={{
        color: box.textColor,
        fontFamily: box.fontFamily,
        fontSize: box.fontSize,
        fontWeight: box.fontWeight,
        lineHeight: box.lineHeight,
      }}
      dangerouslySetInnerHTML={{ __html: box.html ?? '' }}
    />
  );
}

/**
 * A live, read-only copy of a library component placed on the workspace. It shows only
 * its own edits, so editing the component in the phone (or the library template) leaves it alone.
 */
function CanvasComponentInstance({ box, componentId, ctx, edits }: {
  box: ModuleBox; componentId?: ModuleId; ctx: ViewCtx; edits?: ModuleEdits;
}) {
  if (!componentId) return <CanvasElementSnapshot box={box} />;
  return (
    <div className={`${outfit.className} pointer-events-none h-full w-full text-slate-900`}>
      <ModuleView id={componentId} ctx={ctxForBox({ ...ctx, interactive: false }, box)} passive isolated edits={edits} />
    </div>
  );
}

function CanvasObjectContent({
  type, shapeId, box, componentId, edits, ctx, objectId, onBoxChange, onEmpty,
}: {
  type: CanvasInsertType; shapeId: string; box: ModuleBox; componentId?: ModuleId; ctx: ViewCtx;
  edits?: ModuleEdits;
  objectId?: string;
  onBoxChange?: (patch: ModuleBox) => void;
  onEmpty?: () => void;
}) {
  if (type === 'asset') return <CanvasAssetObject box={box} />;
  if (type === 'element') return <CanvasElementSnapshot box={box} />;
  if (type === 'component') return <CanvasComponentInstance box={box} componentId={componentId} ctx={ctx} edits={edits} />;
  return (
    <GenericShape
      id={shapeId}
      box={box}
      onBoxChange={onBoxChange ?? (() => {})}
      objectId={objectId}
      onEmpty={onEmpty}
    />
  );
}

const SNAPSHOT_STRIPPED_ATTRIBUTES = [
  'id', 'data-studio-element', 'data-text-slot', 'data-text-slot-selected', 'data-tap-root',
  'data-studio-tinker-host', 'data-module-id', 'tabindex', 'contenteditable', 'draggable', 'title',
];

/** Clone a rendered part of a component into standalone markup for an `element` copy. */
function snapshotHtml(source: Element): string {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('[data-studio-overlay], [data-overlay-control], [data-corner-handle]').forEach((node) => node.remove());
  clone.querySelectorAll('style').forEach((node) => {
    if (node.textContent?.includes('studio-tinker-active')) node.remove();
  });
  [clone, ...Array.from(clone.querySelectorAll<HTMLElement>('*'))].forEach((node) => {
    node.classList?.remove('studio-tinker-active');
    SNAPSHOT_STRIPPED_ATTRIBUTES.forEach((attribute) => node.removeAttribute(attribute));
  });
  // The copy is positioned by its own canvas box, so drop in-component offsets.
  clone.style.transform = '';
  clone.style.left = '';
  clone.style.top = '';
  clone.style.zIndex = '';
  clone.style.margin = '0';
  if (clone.style.position === 'absolute') clone.style.position = 'relative';
  // Fill the box: stretching the copy resizes its container, not the content inside.
  clone.style.width = '100%';
  clone.style.height = '100%';
  clone.style.boxSizing = 'border-box';
  return clone.outerHTML;
}

/** Ratio between an element's on-screen size and its layout size (canvas zoom). */
function renderScale(element: HTMLElement): number {
  return element.getBoundingClientRect().width / (element.offsetWidth || 1) || 1;
}

function CanvasContextMenu({
  menu, clipboard, onCopy, onPaste, onClose,
}: {
  menu: ContextMenuState;
  clipboard: StudioClipboard | null;
  onCopy: (build: () => StudioClipboard | null) => void;
  onPaste: (target: PasteTarget) => void;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: menu.x, top: menu.y });

  React.useLayoutEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setPosition({
      left: Math.max(8, Math.min(menu.x, window.innerWidth - width - 8)),
      top: Math.max(8, Math.min(menu.y, window.innerHeight - height - 8)),
    });
  }, [menu.x, menu.y]);

  useEffect(() => {
    const closeOnOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose();
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('mousedown', closeOnOutside, true);
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('wheel', onClose, { passive: true });
    window.addEventListener('resize', onClose);
    window.addEventListener('blur', onClose);
    return () => {
      window.removeEventListener('mousedown', closeOnOutside, true);
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('wheel', onClose);
      window.removeEventListener('resize', onClose);
      window.removeEventListener('blur', onClose);
    };
  }, [onClose]);

  const itemClass = 'flex w-full items-center justify-between gap-6 rounded-md px-2.5 py-1.5 text-left text-[11px] font-medium text-slate-700 hover:bg-[#0040DF] hover:text-white disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent';
  const shortcut = 'text-[10px] opacity-60';
  const renameTarget = menu.targets.find((item) => item.rename);
  const [renameDraft, setRenameDraft] = useState<string | null>(null);
  const saveRename = () => {
    const name = renameDraft?.trim();
    if (name && renameTarget?.rename) renameTarget.rename.apply(name);
    onClose();
  };

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      onContextMenu={(event) => event.preventDefault()}
      className={`${urbanist.className} fixed z-[200] min-w-[200px] rounded-lg bg-white p-1 shadow-[0_12px_32px_rgba(15,23,42,0.18)] ring-1 ring-slate-200`}
      style={position}
    >
      {renameTarget?.rename && (
        renameDraft === null ? (
          <button type="button" role="menuitem" className={itemClass}
            onClick={() => setRenameDraft(renameTarget.rename!.value)}>
            <span className="flex items-center gap-2"><Pencil className="h-3 w-3 shrink-0" /> Rename frame</span>
          </button>
        ) : (
          <form
            className="flex items-center gap-1 px-1 py-1"
            onSubmit={(event) => { event.preventDefault(); saveRename(); }}
          >
            <input
              autoFocus
              aria-label="Frame name"
              value={renameDraft}
              onChange={(event) => setRenameDraft(event.target.value)}
              onFocus={(event) => event.currentTarget.select()}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key === 'Escape') onClose();
              }}
              className="h-7 min-w-0 flex-1 rounded-md border border-[#0040DF] px-2 text-[11px] text-slate-800 outline-none"
            />
            <button type="submit" className="h-7 rounded-md bg-[#0040DF] px-2 text-[11px] font-semibold text-white hover:bg-[#0036BF]">
              Save
            </button>
          </form>
        )
      )}
      {menu.actions?.map((action) => (
        <button key={action.label} type="button" role="menuitem" className={itemClass}
          disabled={action.disabled}
          onClick={() => { action.run(); onClose(); }}>
          <span>{action.label}</span>
          {action.label === 'Group items' && <span className={shortcut}>Ctrl+G</span>}
        </button>
      ))}
      {(renameTarget?.rename || !!menu.actions?.length) && <div className="my-1 h-px bg-slate-100" />}
      {menu.targets.map((item, index) => (
        <button key={`copy-${index}`} type="button" role="menuitem" className={itemClass}
          onClick={() => { onCopy(item.copy); onClose(); }}>
          <span className="max-w-[180px] truncate">Copy {item.name}</span>
          {index === 0 && <span className={shortcut}>Ctrl+C</span>}
        </button>
      ))}
      {menu.targets.length > 0 && <div className="my-1 h-px bg-slate-100" />}
      <button type="button" role="menuitem" className={itemClass}
        disabled={!clipboard || !menu.paste}
        onClick={() => { if (menu.paste) onPaste(menu.paste); onClose(); }}>
        <span className="flex min-w-0 flex-col">
          <span>Paste here</span>
          {clipboard && (
            <span className="max-w-[160px] truncate text-[9px] font-normal opacity-60">{clipboard.label}</span>
          )}
        </span>
        <span className={shortcut}>Ctrl+V</span>
      </button>
      {menu.targets.length > 0 && <div className="my-1 h-px bg-slate-100" />}
      {menu.targets.map((item, index) => (
        <button key={`delete-${index}`} type="button" role="menuitem"
          className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[11px] font-medium text-rose-600 hover:bg-rose-600 hover:text-white"
          onClick={() => { item.remove(); onClose(); }}>
          <Trash2 className="h-3 w-3 shrink-0" />
          <span className="max-w-[180px] truncate">Delete {item.name}</span>
        </button>
      ))}
    </div>,
    document.body,
  );
}

/** A text layer's current font size in px (its set size, or what it renders at). */
function textFontSize(box: ModuleBox, container: HTMLElement | null): number {
  const set = Number.parseFloat(String(box.fontSize ?? ''));
  if (Number.isFinite(set) && set > 0) return set;
  const field = container?.querySelector<HTMLElement>('[role="textbox"]');
  return (field && Number.parseFloat(window.getComputedStyle(field).fontSize)) || 16;
}

/** Scale a text layer's font with its box when it is resized from a corner. */
function scaledFontSize(startFontSize: number, startW: number, startH: number, next: ModuleBox): number {
  const ratio = Math.sqrt(((next.w ?? startW) / (startW || 1)) * ((next.h ?? startH) / (startH || 1)));
  return Math.max(4, Math.round(startFontSize * ratio * 10) / 10);
}

/** Text-panel fields that a text layer stores directly on its box (the rest go in `box.textStyle`). */
const TEXT_LAYER_BOX_KEYS = ['fontSize', 'fontWeight', 'fontFamily', 'fontStyle', 'textAlign', 'lineHeight'] as const;
const TEXT_LAYER_DEFAULT_COLOR = '#111827';
/** Fired when a text layer is clicked, so the right panel shows its text formatting. */
const TEXT_LAYER_CLICK_EVENT = 'studio:text-layer-click';

/** A text layer's formatting in the shape the text formatting panel edits. */
function textLayerStyle(box: ModuleBox): EditableTextStyle {
  return {
    ...box.textStyle,
    color: box.textColor ?? TEXT_LAYER_DEFAULT_COLOR,
    fontSize: box.fontSize ?? 16,
    fontWeight: box.fontWeight as EditableTextStyle['fontWeight'],
    fontFamily: box.fontFamily,
    fontStyle: box.fontStyle as EditableTextStyle['fontStyle'],
    textAlign: box.textAlign as EditableTextStyle['textAlign'],
    lineHeight: box.lineHeight,
    width: box.w,
    height: box.h,
  };
}

/** Turn a text formatting panel change (null = reset) into a patch for the text layer's box. */
function textLayerPatch(box: ModuleBox, patch: Partial<EditableTextStyle> | null): ModuleBox {
  if (patch === null) {
    return {
      textColor: undefined, fontSize: undefined, fontWeight: undefined, fontFamily: undefined,
      fontStyle: undefined, textAlign: undefined, lineHeight: undefined, textStyle: undefined,
    };
  }
  const next: ModuleBox = {};
  const extra: Record<string, unknown> = { ...box.textStyle };
  Object.entries(patch).forEach(([key, value]) => {
    if (key === 'color') next.textColor = value as string | undefined;
    else if (key === 'width') next.w = value === undefined ? undefined : Number.parseFloat(String(value)) || undefined;
    else if (key === 'height') next.h = value === undefined ? undefined : Number.parseFloat(String(value)) || undefined;
    else if ((TEXT_LAYER_BOX_KEYS as readonly string[]).includes(key)) (next as Record<string, unknown>)[key] = value;
    else if (value === undefined) delete extra[key];
    else extra[key] = value;
  });
  next.textStyle = extra as EditableTextStyle;
  return next;
}

/** The text layer that should receive the typing cursor as soon as it mounts (set by the Text tool). */
const textFocusRequest: { id: string | null } = { id: null };

/**
 * A canvas text layer. Like Figma, it is a plain object until double-clicked (or just
 * placed with the Text tool), when it becomes editable with a typing cursor. A layer
 * left empty is removed when editing ends.
 */
function CanvasTextField({
  objectId, box, onTextChange, onEmpty,
}: {
  objectId?: string;
  box: ModuleBox;
  onTextChange: (text: string) => void;
  onEmpty?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [editing, setEditing] = useState(false);
  const text = box.text ?? '';
  // The layer box sizes the text container, so drop width/height from the text styling.
  const fontStyle: React.CSSProperties = { ...textLayerStyle(box), width: undefined, height: undefined };

  // The span is uncontrolled while typing; sync it only when the text changes elsewhere.
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && el.innerText !== text && document.activeElement !== el) el.innerText = text;
  }, [text]);

  const focusAtEnd = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, []);

  useEffect(() => {
    if (!objectId || textFocusRequest.id !== objectId) return;
    textFocusRequest.id = null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off entry into edit mode for a just-placed layer
    setEditing(true);
  }, [objectId]);

  useEffect(() => {
    if (editing) focusAtEnd();
  }, [editing, focusAtEnd]);

  return (
    <span
      ref={ref}
      contentEditable={editing}
      suppressContentEditableWarning
      onInput={(event) => onTextChange(event.currentTarget.innerText)}
      onClick={() => window.dispatchEvent(new Event(TEXT_LAYER_CLICK_EVENT))}
      onDoubleClick={(event) => {
        event.stopPropagation();
        setEditing(true);
      }}
      onMouseDown={(event) => {
        if (!editing || event.button !== 0) return;
        // While editing, a click places the caret; dragging past a few pixels leaves
        // edit mode and moves the whole text box instead.
        event.stopPropagation();
        const start = { x: event.clientX, y: event.clientY };
        const field = event.currentTarget;
        const handleMove = (moveEvent: MouseEvent) => {
          if (Math.hypot(moveEvent.clientX - start.x, moveEvent.clientY - start.y) < 4) return;
          cleanup();
          const layer = field.closest<HTMLElement>('[data-module-id], [data-workspace-shape-id]');
          window.getSelection()?.removeAllRanges();
          field.blur();
          // Start the layer's own drag from where the press began.
          layer?.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true, cancelable: true, button: 0, clientX: start.x, clientY: start.y,
          }));
          window.dispatchEvent(new MouseEvent('mousemove', { clientX: moveEvent.clientX, clientY: moveEvent.clientY }));
        };
        const cleanup = () => {
          window.removeEventListener('mousemove', handleMove);
          window.removeEventListener('mouseup', cleanup);
        };
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', cleanup);
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === 'Escape') event.currentTarget.blur();
      }}
      onBlur={(event) => {
        setEditing(false);
        if (!event.currentTarget.innerText.trim()) onEmpty?.();
      }}
      role="textbox"
      aria-label="Edit text"
      className="inline-block whitespace-pre-wrap outline-none"
      style={{
        // Hovering a text box shows the move cursor (as over other objects), even while typing.
        cursor: 'move',
        minWidth: 2,
        minHeight: '1.2em',
        ...fontStyle,
      }}
    />
  );
}

function GenericShape({
  id,
  box,
  onBoxChange,
  objectId,
  onEmpty,
}: {
  id: string;
  box: ModuleBox;
  onBoxChange: (patch: ModuleBox) => void;
  /** The object's own id (`id` may just be its type), used to focus a just-placed text layer. */
  objectId?: string;
  /** Called when a text layer is left empty. */
  onEmpty?: () => void;
}) {
  const isCircle = id.includes('circle');
  const isText = id.includes('text');
  const isComment = id.includes('comment');
  const isLine = id.includes('line');
  const isTriangle = id.includes('triangle');
  const isStar = id.includes('star');
  const isArrow = id.includes('arrow');
  const isScribble = id.includes('scribble');
  const fill = box.fillType === 'color' ? box.fillColor ?? '#ffffff' : 'transparent';
  const strokeWidth = box.strokeWidth ?? 2;
  const stroke = box.strokeColor ?? '#0040DF';
  const borderRadius = isCircle ? '50%' : radiusForBox(box);
  const arrowMarkerId = `canvas-arrowhead-${id}`;
  const style: React.CSSProperties = {
    width: '100%',
    height: '100%',
    // Color, gradient or image fill (so media backgrounds work on frames and shapes too).
    ...(isComment ? { backgroundColor: '#ffffff' } : backgroundForBox(box) ?? { backgroundColor: fill }),
    border: isLine || isText || isComment ? undefined : `${strokeWidth}px ${box.strokeStyle ?? 'solid'} ${stroke}`,
    boxSizing: 'border-box',
    borderRadius,
    padding: box.padding
      ? `${box.padding.top}px ${box.padding.right}px ${box.padding.bottom}px ${box.padding.left}px`
      : undefined,
  };

  if (isTriangle || isStar || isArrow || isScribble || isLine) {
    const points = isTriangle
      ? '50,4 96,96 4,96'
      : isStar
        ? '50,3 61,36 96,36 68,56 79,91 50,70 21,91 32,56 4,36 39,36'
        : '4,32 63,32 63,12 96,50 63,88 63,68 4,68';
    const defaultPath = 'M8 62 C25 25 36 77 52 42 S78 61 92 28';
    return (
      <div className="flex h-full w-full items-center justify-center">
        <svg className="h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {isScribble ? (
            <path d={box.freehandPath ?? defaultPath} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          ) : isLine ? (
            <line
              x1={box.flipX ? 100 : 0}
              y1={box.flipY ? 100 : 0}
              x2={box.flipX ? 0 : 100}
              y2={box.flipY ? 0 : 100}
              stroke={stroke}
              strokeWidth={strokeWidth}
              vectorEffect="non-scaling-stroke"
            />
          ) : isArrow ? (
            <line
              x1={box.flipX ? 100 : 0}
              y1={box.flipY ? 100 : 0}
              x2={box.flipX ? 0 : 100}
              y2={box.flipY ? 0 : 100}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              markerEnd={`url(#${arrowMarkerId})`}
              vectorEffect="non-scaling-stroke"
            />
          ) : (
            <polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          )}
          {isArrow && (
            <defs>
              <marker id={arrowMarkerId} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0 0L8 4L0 8z" fill={stroke} />
              </marker>
            </defs>
          )}
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex h-full w-full ${isText ? 'items-start justify-start' : 'items-center justify-center'}`} style={style}>
      {isText && (
        <CanvasTextField
          objectId={objectId}
          box={box}
          onTextChange={(text) => onBoxChange({ text })}
          onEmpty={onEmpty}
        />
      )}
      {isComment && <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-700 shadow-sm">Comment</span>}
    </div>
  );
}

function ModuleWrapper({
  id, index, total, selected, drag, dropIndex, accent, isDark, radius, ctx,
  box, onSelect, onStartDrag, onEndDrag, onItemDragOver, onDrop, onRemove,
  onMeasure, onBoxChange, onShapeMove, onShapeMoveEnd, isDrawing, isShapeDragSource, stackLevel,
  hideSelectionChrome = false, onSnapStart,
}: {
  /** Alignment guides: snaps the object to others while it is moved or resized. */
  onSnapStart?: PhoneSnapStart;
  id: ModuleId; index: number; total: number;
  /** Selected as a group's main shape: the group border marks the selection instead. */
  hideSelectionChrome?: boolean;
  /** Draw-order level from `stackLevels`: later objects sit above earlier ones. */
  stackLevel: number;
  selected: boolean; drag: DragState; dropIndex: number | null;
  isDrawing: boolean; isShapeDragSource: boolean;
  accent: string; isDark: boolean; radius: Radius; ctx: ViewCtx;
  box: ModuleBox;
  onSelect: (id: ModuleId) => void;
  onStartDrag: (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => void;
  onEndDrag: () => void;
  onItemDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (
    e: React.DragEvent,
    targetId?: ModuleId,
    position?: { x: number; y: number },
  ) => void;
  onRemove: (id: ModuleId) => void;
  onMeasure: (id: ModuleId, size: { w: number; h: number }) => void;
  onBoxChange: (id: ModuleId, patch: ModuleBox) => void;
  onShapeMove: ShapeMoveUpdate;
  onShapeMoveEnd: ShapeMoveEnd;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  // The selection handles are drawn in the wrapper's container, above every object.
  const [chromeHost, setChromeHost] = useState<HTMLElement | null>(null);
  const setWrapper = React.useCallback((element: HTMLDivElement | null) => {
    wrapperRef.current = element;
    setChromeHost(element?.parentElement ?? null);
  }, []);
  const contentRef = useRef<HTMLDivElement>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const isSource = drag?.from === 'canvas' && drag.id === id;
  const isFrame = id.startsWith('frame-');
  const isAsset = id.startsWith('asset-');
  const isElement = id.startsWith('element-');
  const isShape = isFrame || isAsset || isElement || id.startsWith('shape-');
  const isTextShape = id.startsWith('shape-text-');

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const bb = entry.borderBoxSize?.[0];
      const w = Math.round(bb ? bb.inlineSize : entry.contentRect.width);
      const h = Math.round(bb ? bb.blockSize : entry.contentRect.height);
      if (w <= 0 || h <= 0) return;
      setNatural((prev) =>
        prev && Math.abs(prev.w - w) < 1 && Math.abs(prev.h - h) < 1 ? prev : { w, h }
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (natural) onMeasure(id, natural);
  }, [id, natural, onMeasure]);

  // Text layers size to their text unless given a size (their size is only a minimum).
  const targetW = isTextShape ? box.w : box.w ?? natural?.w ?? (isShape ? 100 : undefined);
  const targetH = isTextShape ? box.h : box.h ?? natural?.h ?? (isShape ? 100 : undefined);

  const startResize = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!wrapperRef.current) return;

    const startW = targetW ?? wrapperRef.current.offsetWidth;
    const startH = targetH ?? wrapperRef.current.offsetHeight;
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const baseX = box.x ?? 0;
    const baseY = box.y ?? 0;
    const parent = wrapperRef.current.parentElement;
    const bounds = parent?.getBoundingClientRect();
    const scaleX = bounds && parent ? bounds.width / parent.offsetWidth || 1 : 1;
    const scaleY = bounds && parent ? bounds.height / parent.offsetHeight || 1 : 1;
    const startFontSize = isTextShape ? textFontSize(box, wrapperRef.current) : 0;
    const snap = onSnapStart?.(id, 'resize') ?? null;

    const onMouseMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - startClientX) / scaleX;
      const dy = (ev.clientY - startClientY) / scaleY;
      const patch: ModuleBox = {};
      if (handle.includes('e')) patch.w = Math.max(20, Math.round(startW + dx));
      if (handle.includes('w')) {
        patch.w = Math.max(20, Math.round(startW - dx));
        patch.x = Math.round(baseX + dx);
      }
      if (handle.includes('s')) patch.h = Math.max(20, Math.round(startH + dy));
      if (handle.includes('n')) {
        patch.h = Math.max(20, Math.round(startH - dy));
        patch.y = Math.round(baseY + dy);
      }
      if (snap) snapResizePatch(snap, patch, { x: baseX, y: baseY, w: startW, h: startH }, handle, ev, true);
      if (isTextShape && handle.length === 2) patch.fontSize = scaledFontSize(startFontSize, startW, startH, patch);
      onBoxChange(id, patch);
    };
    const onMouseUp = () => {
      snap?.end();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const startShapeMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isShape || event.button !== 0 || !wrapperRef.current) return;
    if (event.target instanceof Element && event.target.closest('button, [contenteditable="true"]')) return;
    event.preventDefault();
    event.stopPropagation();
    onSelect(id);

    const parent = wrapperRef.current.parentElement;
    const bounds = parent?.getBoundingClientRect();
    const scaleX = bounds && parent ? bounds.width / parent.offsetWidth || 1 : 1;
    const scaleY = bounds && parent ? bounds.height / parent.offsetHeight || 1 : 1;
    const startX = event.clientX;
    const startY = event.clientY;
    const baseX = box.x ?? 0;
    const baseY = box.y ?? 0;
    const shapeBounds = wrapperRef.current.getBoundingClientRect();
    const grabRatio = {
      x: (event.clientX - shapeBounds.left) / (shapeBounds.width || 1),
      y: (event.clientY - shapeBounds.top) / (shapeBounds.height || 1),
    };
    // The drag preview needs the real rendered size; text layers that grow with their
    // text have no stored width/height (falling back to 100×100 made the drag drift).
    const dragBox: ModuleBox = {
      ...box,
      w: Math.round(shapeBounds.width / scaleX),
      h: Math.round(shapeBounds.height / scaleY),
    };
    onShapeMove(id, dragBox, { x: event.clientX, y: event.clientY }, grabRatio);
    const snap = onSnapStart?.(id, 'move') ?? null;

    const handleMove = (moveEvent: MouseEvent) => {
      const raw = { dx: (moveEvent.clientX - startX) / scaleX, dy: (moveEvent.clientY - startY) / scaleY };
      // Lined up with another object: snap to it (the guides show what it lines up with).
      const { dx, dy } = snap ? snap.move(raw.dx, raw.dy, moveEvent) : raw;
      const nextBox = { x: baseX + dx, y: baseY + dy };
      onBoxChange(id, nextBox);
      onShapeMove(
        id,
        { ...dragBox, ...nextBox },
        // The drag preview follows the snapped position, not the raw pointer.
        { x: startX + dx * scaleX, y: startY + dy * scaleY },
        grabRatio,
      );
    };
    const handleUp = (upEvent: MouseEvent) => {
      snap?.end();
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      onShapeMoveEnd(
        id,
        { x: upEvent.clientX, y: upEvent.clientY },
        grabRatio,
      );
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  let customEffect: React.CSSProperties = {};
  if (box.effectType === 'glassmorphism') {
    customEffect = {
      backdropFilter: `blur(${box.glassBlur ?? 10}px) saturate(${box.glassSaturation ?? 150}%)`,
      WebkitBackdropFilter: `blur(${box.glassBlur ?? 10}px) saturate(${box.glassSaturation ?? 150}%)`,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    };
  } else if (box.effectType === 'shadow') {
    customEffect = {
      boxShadow: `${box.shadowX ?? 0}px ${box.shadowY ?? 4}px ${box.shadowBlur ?? 8}px ${box.shadowColor ?? 'rgba(0,0,0,0.2)'}`,
    };
  } else if (box.effectType === 'blur') {
    customEffect = {
      filter: `blur(${box.layerBlur ?? 4}px)`,
    };
  }

  const ctxWithBox = ctxForBox(ctx, box);

  // Layout tab: Fill / Hug sizing, pinning and absolute positioning.
  const pinned = !!box.pinLeftRight;
  const fillW = pinned || box.widthMode === 'fill';
  const fillH = box.heightMode === 'fill';
  const isAbsolute = isShape || box.position === 'absolute';
  const autoLayoutStyle = isShape ? null : autoLayoutCss(id, box);

  const wrapperStyle: React.CSSProperties = {
    // Text layers treat their size as a minimum so the box grows with the text.
    ...(isTextShape
      ? { minWidth: targetW, minHeight: targetH }
      : { width: layoutSize(box.widthMode, pinned, targetW), height: layoutSize(box.heightMode, false, targetH) }),
    position: isAbsolute ? 'absolute' : undefined,
    left: isAbsolute ? (pinned ? 0 : box.x ?? 0) : undefined,
    top: isAbsolute ? box.y ?? 0 : undefined,
    transform:
      (!isAbsolute && (box.x !== undefined || box.y !== undefined)) || box.rotation !== undefined
        ? `${!isAbsolute ? `translate(${box.x ?? 0}px, ${box.y ?? 0}px) ` : ''}rotate(${box.rotation ?? 0}deg)`
        : undefined,
    opacity: box.opacity === undefined ? undefined : box.opacity / 100,
    // Frames sit under everything; other objects stack in the order they were drawn
    // (grouped layers just above their shape), and selecting one doesn't raise it.
    zIndex: isFrame ? 10 : isShape ? 20 + stackLevel : undefined,
    ...layoutWrapperStyle(box),
    ...customEffect,
  };

  const contentStyle: React.CSSProperties = isTextShape
    ? { display: 'flex', minWidth: targetW, minHeight: targetH }
    : {
        width: fillW ? '100%' : isShape ? targetW : box.w !== undefined ? '100%' : undefined,
        height: fillH ? '100%' : isShape ? targetH : box.h !== undefined ? '100%' : undefined,
      };

  return (
    <div
      ref={setWrapper}
      data-module-id={id}
      draggable={!selected && !isShape && !isDrawing}
      onDragStart={(e) => {
        if (isShape) { e.preventDefault(); return; }
        if (selected) { e.preventDefault(); return; }
        onStartDrag(e, id, 'canvas');
      }}
      onDragEnd={onEndDrag}
      onDragOver={(e) => onItemDragOver(e, index)}
      onDrop={(e) => {
        const content = contentRef.current;
        const target = content?.querySelector<HTMLElement>('[data-studio-tinker-host]') ?? content;
        const rect = target?.getBoundingClientRect();
        const scaleX = rect && target ? rect.width / target.offsetWidth || 1 : 1;
        const scaleY = rect && target ? rect.height / target.offsetHeight || 1 : 1;
        onDrop(e, id, rect && target ? {
          x: (e.clientX - rect.left) / scaleX,
          y: (e.clientY - rect.top) / scaleY,
        } : undefined);
      }}
      onMouseDown={startShapeMove}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
      style={{
        ...wrapperStyle,
        cursor: isDrawing ? 'crosshair' : undefined,
        opacity: isShapeDragSource ? 0 : wrapperStyle.opacity,
      }}
      className={`group relative cursor-move ${
        isDark ? 'ring-offset-slate-950' : 'ring-offset-[#F7F8FF]'
      } ${
        // Figma-style hover highlight (the selection outline takes over once selected).
        !selected && !isDrawing && !drag ? 'hover:outline hover:outline-1 hover:outline-[#0040DF]' : ''
      } ${isSource ? 'opacity-40' : ''}`}
    >
      {drag && dropIndex === index && <DropLine side="top" accent={accent} />}
      {drag && dropIndex === total && index === total - 1 && (
        <DropLine side="bottom" accent={accent} />
      )}

      {isFrame && <FrameLabel name={box.name ?? 'Frame'} selected={selected} />}
      {autoLayoutStyle && <style>{autoLayoutStyle}</style>}

      <div
        ref={contentRef}
        data-module-content-root
        className={drag ? 'pointer-events-none' : ''}
        style={contentStyle}
      >
        {isAsset
          ? <CanvasAssetObject box={box} />
          : isElement
            ? <CanvasElementSnapshot box={box} />
          : isShape
            ? (
              <GenericShape
                id={id}
                box={box}
                onBoxChange={(patch) => onBoxChange(id, patch)}
                objectId={id}
                onEmpty={() => onRemove(id)}
              />
            )
          : <ModuleView id={id} ctx={ctxWithBox} />}
      </div>

      {selected && !hideSelectionChrome && !drag && !isShapeDragSource && chromeHost && createPortal(
        <SelectionChrome attr="data-module-id" id={id} inset={4} onResizeStart={startResize} />,
        chromeHost,
      )}
    </div>
  );
}

function PageCanvas({
  page, pageLabel, modules, ctx, drag, dropIndex, accent, isDark, radius,
  onStartDrag, onEndDrag, onItemDragOver, onDrop, onRemove, onQuickAdd,
  selectedId, onSelect, boxes, onMeasure, onBoxChange, onShapeMove, onShapeMoveEnd,
  isDrawing, shapeDragPreviewIds, showGroups, panMode, selectedGroupId, onSelectGroup, onSnapStart,
}: {
  onSnapStart?: PhoneSnapStart;
  /** Outline grouped objects (design mode only). */
  showGroups: boolean;
  /** Hand tool active: the space between grouped layers is not clickable. */
  panMode: boolean;
  /** The main shape of the group picked as a whole, if any. */
  selectedGroupId: string | null;
  /** Pick the whole group whose main shape is `rootId`. */
  onSelectGroup: (rootId: string) => void;
  page: PageId; pageLabel: string; modules: ModuleId[];
  ctx: ViewCtx; drag: DragState; dropIndex: number | null; accent: string;
  isDark: boolean; radius: Radius;
  onStartDrag: (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => void;
  onEndDrag: () => void;
  onItemDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (
    e: React.DragEvent,
    targetId?: ModuleId,
    position?: { x: number; y: number },
  ) => void;
  onRemove: (id: ModuleId) => void;
  onQuickAdd: (id: ModuleId) => void;
  selectedId: ModuleId | null;
  onSelect: (id: ModuleId | null) => void;
  boxes: Record<string, ModuleBox>;
  onMeasure: (id: ModuleId, size: { w: number; h: number }) => void;
  onBoxChange: (id: ModuleId, patch: ModuleBox) => void;
  onShapeMove: ShapeMoveUpdate;
  onShapeMoveEnd: ShapeMoveEnd;
  isDrawing: boolean;
  shapeDragPreviewIds: string[];
}) {
  const empty = modules.length === 0;

  if (empty) {
    return (
      <div
        onDragOver={(e) => { if (!drag) return; e.preventDefault(); e.stopPropagation(); }}
        onDrop={onDrop}
        style={drag ? { borderColor: accent, background: `${accent}14` } : undefined}
        className={`my-auto flex flex-col items-center justify-center space-y-3 border-2 border-dashed p-6 text-center transition-colors ${radius.card} ${
          drag ? 'border-solid' : isDark ? 'border-slate-700 bg-slate-900/50' : 'border-blue-300/60 bg-blue-50/20'
        }`}
      >
        <div className={`grid h-12 w-12 place-items-center text-white shadow-sm ${radius.icon}`} style={{ background: accent }}>
          <Plus className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold">{drag ? 'Drop to add it here' : `Build the ${pageLabel} page`}</h4>
          <p className="text-[11px] text-slate-500">Drag tiles from the left panel.</p>
        </div>
      </div>
    );
  }

  const parentOf = (id: string) => boxes[id]?.frameId;
  const isFrameId = (id: string) => id.startsWith('frame-');
  const levels = stackLevels(modules, parentOf, isFrameId);
  const groups = showGroups ? canvasGroups(modules, parentOf, isFrameId) : [];

  return (
    // `isolate` keeps the objects' draw-order z-indexes inside the page.
    <div className="relative isolate min-h-full space-y-3 pb-20">
      {groups.map((ids) => (
        <GroupOutline
          key={ids[0]}
          ids={ids}
          attr="data-module-id"
          active={!!selectedId && ids.includes(selectedId)}
          selected={selectedGroupId === ids[0]}
          onSelectGroup={() => onSelectGroup(ids[0])}
          hidden={!!drag || ids.some((id) => shapeDragPreviewIds.includes(id))}
          interactive={!drag && !isDrawing && !panMode}
          // Phone frames sit at z 10 and other objects from z 20.
          hitZIndex={15}
        />
      ))}
      {modules.map((id, i) => (
        <ModuleWrapper
          key={id}
          id={id}
          index={i}
          total={modules.length}
          selected={selectedId === id}
          hideSelectionChrome={selectedGroupId === id}
          isDrawing={isDrawing}
          isShapeDragSource={shapeDragPreviewIds.includes(id)}
          stackLevel={levels.get(id) ?? 0}
          drag={drag}
          dropIndex={dropIndex}
          accent={accent}
          isDark={isDark}
          radius={radius}
          ctx={ctx}
          box={boxes[id] ?? {}}
          onSelect={onSelect}
          onStartDrag={onStartDrag}
          onEndDrag={onEndDrag}
          onItemDragOver={onItemDragOver}
          onDrop={onDrop}
          onRemove={onRemove}
          onMeasure={onMeasure}
          onBoxChange={onBoxChange}
          onShapeMove={onShapeMove}
          onShapeMoveEnd={onShapeMoveEnd}
          onSnapStart={onSnapStart}
        />
      ))}
    </div>
  );
}

/**
 * Snap the dragged edges of a resize `patch` to the alignment guides. `start` is the box
 * before the resize (for the edges the patch leaves alone).
 */
function snapResizePatch(
  snap: SnapSession,
  patch: ModuleBox,
  start: SnapRect,
  handle: string,
  pointer: SnapPointer,
  round: boolean,
) {
  const rect: SnapRect = {
    x: patch.x ?? start.x,
    y: patch.y ?? start.y,
    w: patch.w ?? start.w,
    h: patch.h ?? start.h,
  };
  const snapped = snap.resize(rect, handle, pointer);
  const value = (n: number) => (round ? Math.round(n) : n);
  if (snapped.w >= 20 && snapped.h >= 20) {
    if (patch.w !== undefined) patch.w = value(snapped.w);
    if (patch.h !== undefined) patch.h = value(snapped.h);
    if (patch.x !== undefined) patch.x = value(snapped.x);
    if (patch.y !== undefined) patch.y = value(snapped.y);
  }
}

function CanvasToolbar({
  onSelectTool,
  onSelect,
  panMode,
  onPanModeChange,
  drawTool,
}: {
  onSelectTool: (type: CanvasInsertType | null) => void;
  onSelect: (id: ModuleId | null) => void;
  panMode: boolean;
  onPanModeChange: (enabled: boolean) => void;
  drawTool: CanvasInsertType | null;
}) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const shapes: { id: CanvasShapeType; icon: IconType; label: string }[] = [
    { id: 'shape-rect', icon: Square, label: 'Rectangle' },
    { id: 'shape-circle', icon: Circle, label: 'Ellipse' },
    { id: 'shape-triangle', icon: Move, label: 'Triangle' },
    { id: 'shape-star', icon: Star, label: 'Star' },
    { id: 'shape-line', icon: Minus, label: 'Line' },
    { id: 'shape-arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'shape-scribble', icon: Spline, label: 'Freehand' },
  ];
  const chooseTool = (type: CanvasInsertType) => {
    onSelectTool(type);
    onPanModeChange(false);
    setPaletteOpen(false);
  };
  return (
    <div className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2">
      {paletteOpen && (
        <div className="absolute bottom-full left-1/2 mb-3 w-max max-w-[calc(100vw-24px)] -translate-x-1/2 rounded-xl bg-white px-3 pb-2.5 pt-2 shadow-[0_8px_24px_rgba(0,0,0,0.1)] ring-1 ring-slate-100">
          <div className="mb-1.5 flex items-center justify-between gap-5">
            <span className="text-[9px] font-medium uppercase tracking-wide text-slate-500">Lines &amp; Shapes</span>
            <span className="text-[9px] text-slate-400">Choose a tool, then drag to draw</span>
          </div>
          <div className="flex items-center gap-1.5">
            {shapes.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                aria-label={`Select ${label} tool`}
                title={label}
                onClick={() => chooseTool(id)}
                className="grid h-10 w-10 place-items-center rounded-xl bg-[#F0F2FF] text-slate-800 transition hover:bg-[#E3E8FF] active:scale-95"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center gap-0.5 rounded-xl bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.1)] ring-1 ring-slate-200">
        <button type="button" aria-label="Select tool" title="Select" onClick={() => { onSelectTool(null); onPanModeChange(false); onSelect(null); }}
          className={`grid h-8 w-8 place-items-center rounded-lg transition ${!panMode && !drawTool ? 'bg-[#0040DF] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
          <MousePointer2 className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Hand tool" title="Hand tool" onClick={() => { onSelectTool(null); onPanModeChange(true); onSelect(null); }}
          className={`grid h-8 w-8 place-items-center rounded-lg transition ${panMode ? 'bg-[#0040DF] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
          <Hand className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Frame tool" title="Frame" onClick={() => chooseTool('frame')}
          className={`grid h-8 w-8 place-items-center rounded-lg transition ${drawTool === 'frame' ? 'bg-[#E8EDFF] text-[#0040DF]' : 'text-slate-500 hover:bg-slate-100'}`}>
          <Frame className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Open shape palette" title="Lines & Shapes" aria-expanded={paletteOpen} onClick={() => setPaletteOpen((open) => !open)}
          className={`grid h-8 w-8 place-items-center rounded-lg transition ${paletteOpen ? 'text-[#0040DF]' : 'text-slate-500 hover:bg-slate-100'}`}>
          <Plus className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Text tool" title="Text" onClick={() => chooseTool('shape-text')}
          className={`grid h-8 w-8 place-items-center rounded-lg transition ${drawTool === 'shape-text' ? 'bg-[#E8EDFF] text-[#0040DF]' : 'text-slate-500 hover:bg-slate-100'}`}>
          <Type className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Freehand tool" title="Freehand" onClick={() => chooseTool('shape-scribble')}
          className={`grid h-8 w-8 place-items-center rounded-lg transition ${drawTool === 'shape-scribble' ? 'bg-[#E8EDFF] text-[#0040DF]' : 'text-slate-500 hover:bg-slate-100'}`}>
          <Spline className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Comment tool" title="Comment" onClick={() => chooseTool('shape-comment')}
          className={`grid h-8 w-8 place-items-center rounded-lg transition ${drawTool === 'shape-comment' ? 'bg-[#E8EDFF] text-[#0040DF]' : 'text-slate-500 hover:bg-slate-100'}`}>
          <MessageCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Canvas({
  device, zoom, onZoom, pageModules, activePage, pageLabel, drag, dropIndex,
  ctx, accent, isDark, radius, selectedId, onSelect,
  onStartDrag, onEndDrag, onItemDragOver, onDrop, onRemove, onQuickAdd,
  onNavTab, boxes, onMeasure, onBoxChange, onAddShape, onAddWorkspaceShapes, onAssignFrames, onRemoveMany,
  workspaceShapes, setWorkspaceShapes, selectedWorkspaceShapeId, setSelectedWorkspaceShapeId, selectedGroupKey, onSelectGroup,
  onAddPhoneAsset, onAddWorkspaceAsset, onAddWorkspaceComponent, onClearDropIndex, placeCreatedRef, createdDragId,
  comments, setComments, activeCommentId, onActivateComment, onCommentModeChange, leftPanelSpace,
}: {
  /** Width taken by the left panel (or its collapsed rail); changes to it must not move the canvas. */
  leftPanelSpace: number;
  comments: CanvasComment[];
  setComments: React.Dispatch<React.SetStateAction<CanvasComment[]>>;
  activeCommentId: string | null;
  onActivateComment: (id: string | null) => void;
  /** Told when the comment tool is picked or put away, so the page can swap the right panel. */
  onCommentModeChange: (active: boolean) => void;
  device: DeviceType; zoom: number; onZoom: (z: number) => void;
  pageModules: Record<PageId, ModuleId[]>;
  activePage: PageId; pageLabel: string;
  drag: DragState; dropIndex: number | null;
  ctx: ViewCtx; accent: string; isDark: boolean; radius: Radius;
  selectedId: ModuleId | null; onSelect: (id: ModuleId | null) => void;
  onStartDrag: (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => void;
  onEndDrag: () => void;
  onItemDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (
    e: React.DragEvent,
    targetId?: ModuleId,
    position?: { x: number; y: number },
  ) => void;
  onRemove: (id: ModuleId) => void;
  onQuickAdd: (id: ModuleId) => void;
  onNavTab: (tab: TabId) => void;
  boxes: Record<string, ModuleBox>;
  onMeasure: (id: ModuleId, size: { w: number; h: number }) => void;
  onBoxChange: (id: ModuleId, patch: ModuleBox) => void;
  onAddShape: (type: CanvasInsertType, box: DrawBox) => ModuleId;
  onAddWorkspaceShapes: (shapes: WorkspaceShape[], insertBefore?: ModuleId | null) => void;
  onAssignFrames: (ids: ModuleId[]) => void;
  onRemoveMany: (ids: ModuleId[]) => void;
  workspaceShapes: WorkspaceShape[];
  setWorkspaceShapes: React.Dispatch<React.SetStateAction<WorkspaceShape[]>>;
  selectedWorkspaceShapeId: string | null;
  setSelectedWorkspaceShapeId: (id: string | null) => void;
  /** The whole group picked, as its main shape's key ('p:<id>' or 'w:<id>'). */
  selectedGroupKey: string | null;
  /** Pick a whole group by its main shape's key, or end the group pick (null). */
  onSelectGroup: (key: string | null) => void;
  onAddPhoneAsset: (assetId: string, position: { x: number; y: number }) => void;
  onAddWorkspaceComponent: (id: ModuleId, position: { x: number; y: number }) => void;
  onClearDropIndex: () => void;
  /** Filled in by the canvas: places a saved component into the phone. */
  placeCreatedRef: React.MutableRefObject<((id: string) => void) | null>;
  /** The saved component being dragged from the left panel, if any. */
  createdDragId: string | null;
  onAddWorkspaceAsset: (assetId: string, position: { x: number; y: number }, frameId?: string) => void;
}) {
  const dims = deviceDimensions(device);
  const frameRadius  = device === 'iphone' ? 'rounded-[42px]' : device === 'pixel' ? 'rounded-[32px]' : 'rounded-[24px]';
  const screenRadius = device === 'iphone' ? 'rounded-[32px]' : device === 'pixel' ? 'rounded-[24px]' : 'rounded-[18px]';

  const bodyRef = React.useRef<HTMLDivElement>(null);
  const mainRef = React.useRef<HTMLElement>(null);
  const workspaceRef = React.useRef<HTMLDivElement>(null);
  const drawAreaRef = React.useRef<HTMLDivElement>(null);
  const suppressCanvasClickRef = React.useRef(false);
  const workspaceShapeIdRef = React.useRef(0);
  const edit = useEdit();

  /*
   * Figma-style viewport: the phone and every workspace object live in one
   * "world" layer that is translated by viewportOffset and scaled by zoom.
   * World coordinates equal workspace pixels at 100% zoom with no offset.
   */
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const phoneRef = React.useRef<HTMLDivElement>(null);
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  const viewportScale = zoom / 100;
  /** Alignment guide lines being shown while an object is dragged, in canvas coordinates. */
  const [alignmentGuides, setAlignmentGuides] = useState<Guide[]>([]);

  /*
   * Resizing (or collapsing) the side panels must not move anything on the canvas; the
   * panels just cover or reveal more of it:
   * - The world keeps the width the canvas had when it appeared, so the phone (centred
   *   in that width) no longer slides when the canvas area gets wider or narrower.
   * - When the left panel changes width the canvas area's left edge moves; that change
   *   (`panelShift`) is cancelled out in the view offset so objects stay put on screen.
   */
  const [initialLeftPanelSpace] = useState(leftPanelSpace);
  const panelShift = initialLeftPanelSpace - leftPanelSpace;
  const panelShiftRef = React.useRef(panelShift);
  React.useLayoutEffect(() => { panelShiftRef.current = panelShift; });
  /** `world`: the width the world was laid out at (fixed); `workspace`: the canvas area's current width. */
  const [canvasWidths, setCanvasWidths] = useState<{ world: number; workspace: number } | null>(null);
  React.useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const observer = new ResizeObserver(() => {
      const width = workspace.clientWidth;
      if (width <= 0) return;
      setCanvasWidths((previous) => previous?.workspace === width
        ? previous
        : { world: previous?.world ?? width, workspace: width });
    });
    observer.observe(workspace);
    return () => observer.disconnect();
  }, []);
  /** The on-screen view offset (stored offset plus the left-panel correction). */
  const viewX = viewportOffset.x + panelShift;
  /** The stored offset that centres the phone in the canvas area at 100%. */
  const homeOffsetX = canvasWidths ? (canvasWidths.workspace - canvasWidths.world) / 2 - panelShift : 0;
  const zoomRef = React.useRef(zoom);
  const renderedZoomRef = React.useRef(zoom);
  const zoomAnchorRef = React.useRef<{ x: number; y: number } | null>(null);
  const skipZoomAnchorRef = React.useRef(false);
  const onZoomRef = React.useRef(onZoom);
  React.useLayoutEffect(() => { onZoomRef.current = onZoom; }, [onZoom]);

  const [panMode, setPanMode] = useState(false);
  const [drawTool, setDrawTool] = useState<CanvasInsertType | null>(null);
  const [drawPreview, setDrawPreview] = useState<DrawPreview | null>(null);
  const [commentDraft, setCommentDraft] = useState<CommentDraft | null>(null);
  const commentIdRef = useRef(0);
  const postComment = (text: string) => {
    if (!commentDraft) return;
    const { x, y, target } = commentDraft;
    const id = `comment-${Date.now()}-${++commentIdRef.current}`;
    setComments((list) => [...list, {
      id, x, y, text, target, author: COMMENT_AUTHOR, createdAt: Date.now(),
      resolved: false, hidden: false, replies: [], reactions: {},
    }]);
    onActivateComment(id);
    setCommentDraft(null);
  };
  const commentMode = drawTool === 'shape-comment';
  React.useEffect(() => { onCommentModeChange(commentMode); }, [commentMode, onCommentModeChange]);
  /** Name of the topmost component (or frame/shape) under a screen point, for a new comment. */
  const commentTargetAt = (clientX: number, clientY: number) => {
    for (const element of document.elementsFromPoint(clientX, clientY)) {
      if (!(element instanceof HTMLElement) || element.closest(`[${COMMENT_UI_ATTR}]`)) continue;
      const moduleId = element.closest<HTMLElement>('[data-module-id]')?.dataset.moduleId;
      if (moduleId) {
        const type = canvasInsertTypeForId(moduleId);
        return type ? layerName(type, boxes[moduleId] ?? {}) : moduleFor(moduleId as ModuleId)?.title ?? 'Component';
      }
      const shapeId = element.closest<HTMLElement>('[data-workspace-shape-id]')?.dataset.workspaceShapeId;
      const shape = shapeId ? workspaceShapes.find((item) => item.id === shapeId) : undefined;
      if (shape) return layerName(shape.type, shape.box, shape.componentId);
      if (phoneRef.current?.contains(element)) return pageLabel;
    }
    return 'Canvas';
  };
  const [drawPreviewTarget, setDrawPreviewTarget] = useState<'phone' | 'workspace' | null>(null);
  const [shapeDragPreview, setShapeDragPreview] = useState<ShapeDragPreview | null>(null);
  const [clipboard, setClipboard] = useState<StudioClipboard | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  /** A short message shown over the canvas (e.g. after saving a frame). */
  const [canvasNotice, setCanvasNotice] = useState<string | null>(null);
  const canvasNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Objects picked with Ctrl/Cmd+click, as `p:<phone id>` or `w:<workspace id>` keys. */
  const [multiSelection, setMultiSelection] = useState<string[]>([]);
  const lastPointerRef = React.useRef<{ x: number; y: number } | null>(null);

  /** Convert a screen position to world (workspace) coordinates. */
  const clientToWorld = (clientX: number, clientY: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return { x: clientX, y: clientY };
    const rect = viewport.getBoundingClientRect();
    const scale = rect.width / (viewport.offsetWidth || 1) || 1;
    return { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale };
  };

  // Whenever zoom changes, keep the point under the anchor (cursor for wheel zoom,
  // centre of the canvas for the toolbar buttons) fixed on screen.
  React.useLayoutEffect(() => {
    const previous = renderedZoomRef.current;
    renderedZoomRef.current = zoom;
    zoomRef.current = zoom;
    const anchor = zoomAnchorRef.current;
    zoomAnchorRef.current = null;
    if (skipZoomAnchorRef.current) {
      skipZoomAnchorRef.current = false;
      return;
    }
    if (previous === zoom) return;
    const workspace = workspaceRef.current;
    const point = anchor ?? (workspace
      ? { x: workspace.clientWidth / 2, y: workspace.clientHeight / 2 }
      : { x: 0, y: 0 });
    const ratio = zoom / previous;
    // The anchor maths works on the on-screen offset, which includes the panel correction.
    const shift = panelShiftRef.current;
    setViewportOffset((current) => ({
      x: point.x - (point.x - (current.x + shift)) * ratio - shift,
      y: point.y - (point.y - current.y) * ratio,
    }));
  }, [zoom]);

  /** Back to 100% with the phone centred in the canvas area (whatever the panel widths). */
  const resetView = () => {
    skipZoomAnchorRef.current = zoom !== 100;
    setViewportOffset({ x: homeOffsetX, y: 0 });
    onZoom(100);
  };

  const updateShapeDragPreview = (
    anchor: WorkspaceShape,
    group: WorkspaceShape[],
    pointer: { x: number; y: number },
    grabRatio: { x: number; y: number },
  ) => {
    if (!workspaceRef.current) return;
    const world = clientToWorld(pointer.x, pointer.y);
    const anchorLeft = world.x - (anchor.box.w ?? 100) * grabRatio.x;
    const anchorTop = world.y - (anchor.box.h ?? 100) * grabRatio.y;
    setShapeDragPreview({
      items: group.map((shape) => {
        return {
          ...shape,
          left: anchorLeft + (shape.box.x ?? 0) - (anchor.box.x ?? 0),
          top: anchorTop + (shape.box.y ?? 0) - (anchor.box.y ?? 0),
          scale: 1,
        };
      }),
    });
  };

  // Ctrl/Cmd + wheel (or trackpad pinch) zooms towards the cursor.
  // A plain wheel pans the canvas, except over the phone screen, which scrolls normally.
  React.useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      const workspace = workspaceRef.current;
      if (!workspace) return;
      const rect = workspace.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const current = zoomRef.current;
        const delta = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
        const next = Math.max(25, Math.min(400, current * Math.exp(-delta * 0.002)));
        if (Math.abs(next - current) < 0.01) return;
        const inside = e.clientX >= rect.left && e.clientX <= rect.right
          && e.clientY >= rect.top && e.clientY <= rect.bottom;
        zoomAnchorRef.current = inside
          ? { x: e.clientX - rect.left, y: e.clientY - rect.top }
          : null;
        zoomRef.current = next;
        onZoomRef.current(next);
        return;
      }
      if (!workspace.contains(e.target as Node)) return;
      if (!e.shiftKey && bodyRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      const horizontal = e.shiftKey && !e.deltaX;
      const dx = horizontal ? e.deltaY : e.deltaX;
      const dy = horizontal ? 0 : e.deltaY;
      setViewportOffset((current) => ({ x: current.x - dx, y: current.y - dy }));
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const autoScroll = (clientY: number) => {
    const el = bodyRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (clientY < r.top + 48) el.scrollBy({ top: -14 });
    else if (clientY > r.bottom - 48) el.scrollBy({ top: 14 });
  };

  /** Hand tool (or middle mouse button) drag pans the whole canvas. */
  const startViewportPan = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;
    const base = viewportOffset;
    const handleMove = (moveEvent: MouseEvent) => {
      setViewportOffset({
        x: base.x + moveEvent.clientX - startX,
        y: base.y + moveEvent.clientY - startY,
      });
    };
    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const startCanvasDrawing = (event: React.MouseEvent<HTMLDivElement>, target: 'phone' | 'workspace') => {
    const area = target === 'phone' ? drawAreaRef.current : workspaceRef.current;
    if (!drawTool || panMode || event.button !== 0 || !area || (target === 'phone' && !bodyRef.current)) return;
    // Comment tool: a click drops a comment pin (on the canvas or over the phone) and opens
    // its comment box. Clicks on an existing comment are left to the comment itself.
    if (drawTool === 'shape-comment') {
      if ((event.target as HTMLElement).closest(`[${COMMENT_UI_ATTR}]`)) return;
      event.preventDefault();
      event.stopPropagation();
      if (target === 'phone') suppressCanvasClickRef.current = true;
      setCommentDraft({
        ...clientToWorld(event.clientX, event.clientY),
        target: commentTargetAt(event.clientX, event.clientY),
      });
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (target === 'phone') suppressCanvasClickRef.current = true;

    const body = bodyRef.current;
    const getPoint = (clientX: number, clientY: number) => {
      if (target === 'workspace') return clientToWorld(clientX, clientY);
      const rect = area.getBoundingClientRect();
      const scaleX = rect.width / (area.offsetWidth || 1) || 1;
      const scaleY = rect.height / (area.offsetHeight || 1) || 1;
      return {
        x: (clientX - rect.left) / scaleX,
        y: (clientY - rect.top) / scaleY + (body?.scrollTop ?? 0),
      };
    };

    const start = getPoint(event.clientX, event.clientY);
    let points = [start];
    const updatePreview = (point: { x: number; y: number }) => {
      const minX = Math.min(start.x, point.x);
      const minY = Math.min(start.y, point.y);
      const width = Math.max(1, Math.abs(point.x - start.x));
      const height = Math.max(1, Math.abs(point.y - start.y));
      const box: DrawBox = {
        x: minX,
        y: minY,
        w: width,
        h: height,
        flipX: point.x < start.x,
        flipY: point.y < start.y,
      };
      if (drawTool === 'shape-scribble') {
        points = [...points, point];
        const pathWidth = Math.max(width, 1);
        const pathHeight = Math.max(height, 1);
        box.freehandPath = points
          .map(({ x, y }, index) => {
            const pathX = ((x - minX) / pathWidth) * 100;
            const pathY = ((y - minY) / pathHeight) * 100;
            return `${index === 0 ? 'M' : 'L'}${pathX} ${pathY}`;
          })
          .join(' ');
      }
      setDrawPreview({ type: drawTool, box });
      setDrawPreviewTarget(target);
      return box;
    };

    updatePreview(start);
    const handleMove = (moveEvent: MouseEvent) => {
      const point = getPoint(moveEvent.clientX, moveEvent.clientY);
      updatePreview(point);
    };
    const handleUp = (upEvent: MouseEvent) => {
      const point = getPoint(upEvent.clientX, upEvent.clientY);
      const box = updatePreview(point);
      if (drawTool === 'shape-scribble' && points.length < 2) {
        box.freehandPath = 'M5 50 L95 50';
      }
      const width = box.w ?? 1;
      const height = box.h ?? 1;
      if (drawTool === 'shape-text') {
        // A click places a typing cursor and the layer grows with the text (Figma-style);
        // dragging out a box gives the text layer that size instead.
        if (width < 8 || height < 8) {
          delete box.w;
          delete box.h;
        }
        delete box.flipX;
        delete box.flipY;
      } else {
        box.w = Math.max(8, width);
        box.h = Math.max(8, height);
      }
      if (target === 'workspace') {
        const id = `workspace-shape-${uniqueIdPart()}-${++workspaceShapeIdRef.current}`;
        if (drawTool === 'shape-text') textFocusRequest.id = id;
        onSelect(null);
        setSelectedWorkspaceShapeId(id);
        setWorkspaceShapes((shapes) => {
          const centerX = (box.x ?? 0) + (box.w ?? 0) / 2;
          const centerY = (box.y ?? 0) + (box.h ?? 0) / 2;
          const frameId = drawTool === 'frame' ? undefined : shapes
            .filter((shape) => shape.type === 'frame')
            .filter((shape) => {
              const frameX = shape.box.x ?? 0;
              const frameY = shape.box.y ?? 0;
              const containsCenter = centerX >= frameX && centerX <= frameX + (shape.box.w ?? 0)
                && centerY >= frameY && centerY <= frameY + (shape.box.h ?? 0);
              const containsStart = start.x >= frameX && start.x <= frameX + (shape.box.w ?? 0)
                && start.y >= frameY && start.y <= frameY + (shape.box.h ?? 0);
              return containsCenter || containsStart;
            })
            .sort((a, b) => (a.box.w ?? 0) * (a.box.h ?? 0) - (b.box.w ?? 0) * (b.box.h ?? 0))[0]?.id;
          const drawn: WorkspaceShape = {
            id,
            type: drawTool,
            box: {
              ...createShapeBox(drawTool, box),
              frameId,
              ...(drawTool === 'frame'
                ? { name: nextFrameName([...Object.values(boxes), ...shapes.map((shape) => shape.box)]) }
                : {}),
            },
            frameId,
          };
          // A frame drawn around loose objects groups them, like Figma.
          const adopted = drawTool === 'frame'
            ? shapes.map((shape) => shape.type !== 'frame' && !shape.frameId && boxEncloses(drawn.box, shape.box)
              ? { ...shape, frameId: id, box: { ...shape.box, frameId: id } }
              : shape)
            : shapes;
          return [...adopted, drawn];
        });
      } else {
        const id = onAddShape(drawTool, box);
        if (drawTool === 'shape-text') textFocusRequest.id = id;
      }
      setDrawPreview(null);
      setDrawPreviewTarget(null);
      setDrawTool(null);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  /** An object plus everything nested in it (frame children, grouped layers), parents first. */
  const getWorkspaceGroup = (shape: WorkspaceShape, shapes: WorkspaceShape[]) => {
    const byId = new Map(shapes.map((item) => [item.id, item]));
    const nested = descendantIds(shape.id, shapes.map((item) => item.id), (id) => byId.get(id)?.frameId);
    return [shape, ...nested.flatMap((id) => byId.get(id) ?? [])];
  };

  /** Phone objects nested in this one (frame children, grouped layers), parents first. */
  const phoneDescendants = (id: ModuleId) => descendantIds(
    id,
    pageModules[activePage] ?? [],
    (moduleId) => boxes[moduleId]?.frameId,
  ) as ModuleId[];

  /** Re-check which frame each of these workspace objects sits in (after a move or paste). */
  const assignWorkspaceFrames = (ids: string[]) => {
    const targets = new Set(ids);
    setWorkspaceShapes((shapes) => {
      const frames = shapes.filter((shape) => shape.type === 'frame');
      let changed = false;
      const next = shapes.map((shape) => {
        if (!targets.has(shape.id) || shape.type === 'frame') return shape;
        // A grouped layer stays in its group wherever it is moved (the group's area grows
        // to include it); only "Ungroup" releases it.
        const groupParent = shapes.find((item) => item.id === shape.frameId && item.type !== 'frame');
        if (groupParent) return shape;
        const frameId = frameContaining(frames, shape.box);
        if (frameId === shape.frameId) return shape;
        changed = true;
        return { ...shape, frameId, box: { ...shape.box, frameId } };
      });
      return changed ? next : shapes;
    });
  };

  const removeWorkspaceShape = (id: string) => {
    const target = workspaceShapes.find((shape) => shape.id === id);
    if (!target) return;
    const ids = new Set(getWorkspaceGroup(target, workspaceShapes).map((shape) => shape.id));
    if (selectedWorkspaceShapeId && ids.has(selectedWorkspaceShapeId)) {
      setSelectedWorkspaceShapeId(null);
    }
    setWorkspaceShapes((shapes) => shapes.filter((shape) => !ids.has(shape.id)));
  };

  /* ─────────── Alignment guides (see alignment-guides.tsx) ─────────── */

  /** Whether the pointer is over the phone screen (where objects are dropped into the phone). */
  const isOverPhoneScreen = (pointer: SnapPointer) => {
    const rect = bodyRef.current?.getBoundingClientRect();
    return !!rect && pointer.clientX >= rect.left && pointer.clientX <= rect.right
      && pointer.clientY >= rect.top && pointer.clientY <= rect.bottom;
  };

  /**
   * Snapping for a phone object: it lines up with the other objects and components on the
   * page and with the phone screen's edges and centre (while the pointer is over the phone).
   * Works in the phone's own coordinates; the guides are drawn on the canvas above it.
   */
  const startPhoneSnap: PhoneSnapStart = (id, mode) => {
    const area = drawAreaRef.current;
    const body = bodyRef.current;
    const viewport = viewportRef.current;
    if (!area || !body || !viewport) return null;
    const areaRect = area.getBoundingClientRect();
    const scale = renderScale(area);
    const toArea = (clientX: number, clientY: number) => ({
      x: (clientX - areaRect.left) / scale,
      y: (clientY - areaRect.top) / scale,
    });
    // A moved frame or group carries its layers along; a resized one can line up with them.
    const own = new Set<string>([id, ...(mode === 'move' ? phoneDescendants(id) : [])]);
    const ownRects: SnapRect[] = [];
    const targets: SnapRect[] = [];
    area.querySelectorAll<HTMLElement>('[data-module-id]').forEach((element) => {
      // Only the page's objects, not anything rendered inside a component.
      if (element.parentElement?.parentElement !== area) return;
      const rect = elementRect(element, toArea);
      if (!rect) return;
      (own.has(element.dataset.moduleId ?? '') ? ownRects : targets).push(rect);
    });
    const screen = elementRect(body, toArea);
    if (screen) targets.push(screen);
    const moving = unionRect(ownRects);
    if (!moving) return null;

    // Phone coordinates → canvas coordinates, for drawing the guides.
    const origin = clientToWorld(areaRect.left, areaRect.top);
    const k = scale / renderScale(viewport);
    const toWorld = (guide: Guide): Guide => {
      const along = guide.axis === 'x' ? origin.y : origin.x;
      const across = guide.axis === 'x' ? origin.x : origin.y;
      return {
        ...guide,
        pos: across + guide.pos * k,
        from: along + guide.from * k,
        to: along + guide.to * k,
        marks: guide.marks.map((m) => along + m * k),
      };
    };
    return createSnapSession({
      moving,
      targets,
      threshold: SNAP_DISTANCE_PX / scale,
      onGuides: (guides) => setAlignmentGuides(guides.map(toWorld)),
      // Dragged out of the phone, it no longer lines up with things in it.
      isActive: mode === 'move' ? isOverPhoneScreen : undefined,
    });
  };

  /**
   * Snapping for objects on the canvas around the phone: they line up with each other and
   * with the phone (not while the pointer is over the phone screen, where they drop in).
   */
  const startWorkspaceSnap = (ids: Set<string>, mode: 'move' | 'resize'): SnapSession | null => {
    const workspace = workspaceRef.current;
    if (!workspace) return null;
    const ownRects: SnapRect[] = [];
    const targets: SnapRect[] = [];
    workspace.querySelectorAll<HTMLElement>('[data-workspace-shape-id]').forEach((element) => {
      const rect = elementRect(element, clientToWorld);
      if (!rect) return;
      (ids.has(element.dataset.workspaceShapeId ?? '') ? ownRects : targets).push(rect);
    });
    const phone = phoneRef.current ? elementRect(phoneRef.current, clientToWorld) : null;
    if (phone) targets.push(phone);
    const moving = unionRect(ownRects);
    if (!moving) return null;
    return createSnapSession({
      moving,
      targets,
      threshold: SNAP_DISTANCE_PX / viewportScale,
      onGuides: setAlignmentGuides,
      isActive: mode === 'move' ? (pointer) => !isOverPhoneScreen(pointer) : undefined,
    });
  };

  const startWorkspaceShapeResize = (
    event: React.MouseEvent<HTMLSpanElement>,
    shape: WorkspaceShape,
    handle: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!workspaceRef.current) return;

    const scaleX = viewportScale;
    const scaleY = viewportScale;
    const startX = event.clientX;
    const startY = event.clientY;
    const isText = shape.type === 'shape-text';
    const shapeEl = event.currentTarget.closest<HTMLElement>('[data-workspace-shape-id]');
    const startW = shape.box.w ?? (isText && shapeEl ? shapeEl.offsetWidth : 100);
    const startH = shape.box.h ?? (isText && shapeEl ? shapeEl.offsetHeight : 100);
    const startFontSize = isText ? textFontSize(shape.box, shapeEl) : 0;
    const baseX = shape.box.x ?? 0;
    const baseY = shape.box.y ?? 0;
    const snap = startWorkspaceSnap(new Set([shape.id]), 'resize');

    const handleMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - startX) / scaleX;
      const dy = (moveEvent.clientY - startY) / scaleY;
      const patch: ModuleBox = {};
      if (handle.includes('e')) patch.w = Math.max(20, startW + dx);
      if (handle.includes('w')) {
        patch.w = Math.max(20, startW - dx);
        patch.x = baseX + dx;
      }
      if (handle.includes('s')) patch.h = Math.max(20, startH + dy);
      if (handle.includes('n')) {
        patch.h = Math.max(20, startH - dy);
        patch.y = baseY + dy;
      }
      if (snap) snapResizePatch(snap, patch, { x: baseX, y: baseY, w: startW, h: startH }, handle, moveEvent, false);
      // Resizing a text layer from a corner scales the text with it; edges only resize the box.
      if (isText && handle.length === 2) patch.fontSize = scaledFontSize(startFontSize, startW, startH, patch);
      setWorkspaceShapes((shapes) => shapes.map((item) => item.id === shape.id
        ? { ...item, box: { ...item.box, ...patch } }
        : item));
    };
    const handleUp = () => {
      snap?.end();
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const startWorkspaceShapeMove = (event: React.MouseEvent<HTMLDivElement>, shape: WorkspaceShape) => {
    if (drawTool || event.button !== 0 || !workspaceRef.current) return;
    if (event.target instanceof Element && event.target.closest('button, [contenteditable="true"]')) return;
    event.preventDefault();
    event.stopPropagation();
    onSelect(null);
    setSelectedWorkspaceShapeId(shape.id);

    const scaleX = viewportScale;
    const scaleY = viewportScale;
    const startX = event.clientX;
    const startY = event.clientY;
    const group = getWorkspaceGroup(shape, workspaceShapes);
    const groupIds = new Set(group.map((item) => item.id));
    // Drag previews use each object's rendered size: text layers that grow with their text
    // have no stored width/height, and the old 100×100 fallback made the drag drift.
    const sizedGroup = group.map((item) => {
      if (item.box.w !== undefined && item.box.h !== undefined) return item;
      const el = workspaceRef.current?.querySelector<HTMLElement>(`[data-workspace-shape-id="${CSS.escape(item.id)}"]`);
      return el ? { ...item, box: { ...item.box, w: item.box.w ?? el.offsetWidth, h: item.box.h ?? el.offsetHeight } } : item;
    });
    const sizedShape = sizedGroup.find((item) => item.id === shape.id) ?? shape;
    const bounds = event.currentTarget.getBoundingClientRect();
    const grabRatio = {
      x: (event.clientX - bounds.left) / (bounds.width || 1),
      y: (event.clientY - bounds.top) / (bounds.height || 1),
    };
    updateShapeDragPreview(
      sizedShape,
      sizedGroup,
      { x: event.clientX, y: event.clientY },
      grabRatio,
    );

    const snap = startWorkspaceSnap(groupIds, 'move');
    const getDelta = (pointer: SnapPointer) => {
      const raw = { dx: (pointer.clientX - startX) / scaleX, dy: (pointer.clientY - startY) / scaleY };
      // Lined up with another object: snap to it (the guides show what it lines up with).
      const { dx, dy } = snap ? snap.move(raw.dx, raw.dy, pointer) : raw;
      return { x: dx, y: dy };
    };
    const updateWorkspacePositions = (pointer: SnapPointer) => {
      const delta = getDelta(pointer);
      // The drag preview follows the snapped position, not the raw pointer.
      const clientX = startX + delta.x * scaleX;
      const clientY = startY + delta.y * scaleY;
      setWorkspaceShapes((shapes) => shapes.map((item) => {
        if (!groupIds.has(item.id)) return item;
        const original = group.find((member) => member.id === item.id);
        if (!original) return item;
        return {
          ...item,
          box: {
            ...item.box,
            x: (original.box.x ?? 0) + delta.x,
            y: (original.box.y ?? 0) + delta.y,
          },
        };
      }));
      const movedGroup = sizedGroup.map((item) => ({
        ...item,
        box: {
          ...item.box,
          x: (item.box.x ?? 0) + delta.x,
          y: (item.box.y ?? 0) + delta.y,
        },
      }));
      const movedAnchor = movedGroup.find((item) => item.id === shape.id) ?? shape;
      updateShapeDragPreview(
        movedAnchor,
        movedGroup,
        { x: clientX, y: clientY },
        grabRatio,
      );
      return delta;
    };

    const handleMove = (moveEvent: MouseEvent) => updateWorkspacePositions(moveEvent);
    const handleUp = (upEvent: MouseEvent) => {
      const delta = updateWorkspacePositions(upEvent);
      snap?.end();
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      setShapeDragPreview(null);

      const body = bodyRef.current;
      const area = drawAreaRef.current;
      const bodyRect = body?.getBoundingClientRect();
      const isDroppedInPhone = !!bodyRect
        && upEvent.clientX >= bodyRect.left && upEvent.clientX <= bodyRect.right
        && upEvent.clientY >= bodyRect.top && upEvent.clientY <= bodyRect.bottom;
      if (!isDroppedInPhone || !body || !area) {
        // Dropped on the workspace: the object joins (or leaves) whichever frame it now sits in.
        if (shape.type !== 'frame') assignWorkspaceFrames([shape.id]);
        return;
      }

      const areaRect = area.getBoundingClientRect();
      const phoneScaleX = areaRect.width / (area.offsetWidth || 1) || 1;
      const phoneScaleY = areaRect.height / (area.offsetHeight || 1) || 1;
      const pointerX = (upEvent.clientX - areaRect.left) / phoneScaleX;
      const pointerY = (upEvent.clientY - areaRect.top) / phoneScaleY + body.scrollTop;
      const anchor = sizedShape;
      const anchorX = pointerX - (anchor.box.w ?? 100) * grabRatio.x;
      const anchorY = pointerY - (anchor.box.h ?? 100) * grabRatio.y;
      const transferred = group.map((item) => ({
        ...item,
        box: {
          ...item.box,
          x: anchorX + (item.box.x ?? 0) - (anchor.box.x ?? 0),
          y: anchorY + (item.box.y ?? 0) - (anchor.box.y ?? 0),
        },
      }));
      onAddWorkspaceShapes(transferred);
      setSelectedWorkspaceShapeId(null);
      setWorkspaceShapes((shapes) => shapes.filter((item) => !groupIds.has(item.id)));
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const handleShapeBoxChange = (id: ModuleId, patch: ModuleBox) => {
    onBoxChange(id, patch);
    // Frames and grouped shapes carry their children (and their children's children) along.
    const frameBox = boxes[id] ?? {};
    const deltaX = (patch.x ?? frameBox.x ?? 0) - (frameBox.x ?? 0);
    const deltaY = (patch.y ?? frameBox.y ?? 0) - (frameBox.y ?? 0);
    if (!deltaX && !deltaY) return;
    phoneDescendants(id).forEach((moduleId) => {
      const box = boxes[moduleId] ?? {};
      onBoxChange(moduleId, {
        x: (box.x ?? 0) + deltaX,
        y: (box.y ?? 0) + deltaY,
      });
    });
  };

  /**
   * Fill in a phone object's width/height from its rendered size when it has none stored
   * (text layers grow with their text), so drag previews and drops line up with the cursor.
   */
  const withRenderedSize = (moduleId: ModuleId, box: ModuleBox): ModuleBox => {
    if (box.w !== undefined && box.h !== undefined) return box;
    const el = bodyRef.current?.querySelector<HTMLElement>(`[data-module-id="${CSS.escape(moduleId)}"]`);
    if (!el) return box;
    return { ...box, w: box.w ?? el.offsetWidth, h: box.h ?? el.offsetHeight };
  };

  const handlePhoneShapeMoveEnd: ShapeMoveEnd = (id, pointer, grabRatio) => {
    setShapeDragPreview(null);
    const body = bodyRef.current;
    const workspace = workspaceRef.current;
    if (!body || !workspace) return;

    const bodyRect = body.getBoundingClientRect();
    const isDroppedInPhone = pointer.x >= bodyRect.left && pointer.x <= bodyRect.right
      && pointer.y >= bodyRect.top && pointer.y <= bodyRect.bottom;
    if (isDroppedInPhone) {
      // The object joins (or leaves) whichever frame it was dropped in.
      if (!id.startsWith('frame-')) onAssignFrames([id]);
      return;
    }

    const workspaceRect = workspace.getBoundingClientRect();
    const isDroppedInWorkspace = pointer.x >= workspaceRect.left && pointer.x <= workspaceRect.right
      && pointer.y >= workspaceRect.top && pointer.y <= workspaceRect.bottom;
    const ids = [id, ...phoneDescendants(id)];

    if (!isDroppedInWorkspace) {
      ids.forEach((moduleId) => {
        const box = boxes[moduleId] ?? {};
        onBoxChange(moduleId, { x: box.x ?? 0, y: box.y ?? 0 });
      });
      return;
    }

    const { x: pointerX, y: pointerY } = clientToWorld(pointer.x, pointer.y);
    const sourceBox = boxes[id] ?? {};
    const sourceSize = withRenderedSize(id, sourceBox);
    const width = sourceSize.w ?? 100;
    const height = sourceSize.h ?? 100;
    const x = pointerX - width * grabRatio.x;
    const y = pointerY - height * grabRatio.y;
    // New workspace ids, so nested objects keep pointing at their (moved) parent.
    const newIds = new Map(ids.map((moduleId) => [moduleId, `workspace-shape-${uniqueIdPart()}-${++workspaceShapeIdRef.current}`]));
    const movedShapes = ids.flatMap((moduleId): WorkspaceShape[] => {
      const type = canvasInsertTypeForId(moduleId);
      if (!type) return [];
      const box = boxes[moduleId] ?? {};
      const isRoot = moduleId === id;
      const frameId = isRoot || !box.frameId ? undefined : newIds.get(box.frameId as ModuleId);
      return [{
        id: newIds.get(moduleId)!,
        type,
        box: {
          ...box,
          x: isRoot ? x : x + (box.x ?? 0) - (sourceBox.x ?? 0),
          y: isRoot ? y : y + (box.y ?? 0) - (sourceBox.y ?? 0),
          frameId,
        },
        frameId,
      }];
    });
    onRemoveMany(ids);
    setWorkspaceShapes((shapes) => [...shapes, ...movedShapes]);
    // A loose object (or group) dropped on a workspace frame joins it.
    if (!id.startsWith('frame-')) assignWorkspaceFrames([newIds.get(id)!]);
  };

  const handlePhoneShapeMove: ShapeMoveUpdate = (id, box, pointer, grabRatio) => {
    const type = canvasInsertTypeForId(id);
    if (!type) return;
    const originalBox = boxes[id] ?? {};
    const deltaX = (box.x ?? originalBox.x ?? 0) - (originalBox.x ?? 0);
    const deltaY = (box.y ?? originalBox.y ?? 0) - (originalBox.y ?? 0);
    const group: WorkspaceShape[] = [{
      id,
      type,
      box,
    }];
    phoneDescendants(id).forEach((moduleId) => {
      const childType = canvasInsertTypeForId(moduleId);
      if (!childType) return;
      const childBox = withRenderedSize(moduleId, boxes[moduleId] ?? {});
      group.push({
        id: moduleId,
        type: childType,
        box: {
          ...childBox,
          x: (childBox.x ?? 0) + deltaX,
          y: (childBox.y ?? 0) + deltaY,
        },
        frameId: childBox.frameId,
      });
    });
    updateShapeDragPreview(group[0], group, pointer, grabRatio);
  };

  const handleCanvasDrop = (
    event: React.DragEvent,
    targetId?: ModuleId,
    position?: { x: number; y: number },
  ) => {
    const assetId = draggedAssetId(event.dataTransfer);
    if (assetId && !targetId) {
      const area = drawAreaRef.current;
      const body = bodyRef.current;
      if (!area || !body) return;
      event.preventDefault();
      event.stopPropagation();
      const rect = area.getBoundingClientRect();
      const scaleX = rect.width / (area.offsetWidth || 1) || 1;
      const scaleY = rect.height / (area.offsetHeight || 1) || 1;
      onAddPhoneAsset(assetId, {
        x: (event.clientX - rect.left) / scaleX,
        y: (event.clientY - rect.top) / scaleY + body.scrollTop,
      });
      onEndDrag();
      return;
    }
    onDrop(event, targetId, position);
  };

  const handleWorkspaceAssetDrop = (event: React.DragEvent, targetShapeId?: string) => {
    const assetId = draggedAssetId(event.dataTransfer);
    if (!assetId || !workspaceRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    const position = clientToWorld(event.clientX, event.clientY);
    const targetShape = workspaceShapes.find((shape) => shape.id === targetShapeId);
    const frameId = targetShape?.type === 'frame'
      ? targetShape.id
      : targetShape?.frameId ?? workspaceShapes
        .filter((shape) => shape.type === 'frame')
        .filter((shape) => {
          const x = shape.box.x ?? 0;
          const y = shape.box.y ?? 0;
          return position.x >= x && position.x <= x + (shape.box.w ?? 0)
            && position.y >= y && position.y <= y + (shape.box.h ?? 0);
        })
        .sort((a, b) => (a.box.w ?? 0) * (a.box.h ?? 0) - (b.box.w ?? 0) * (b.box.h ?? 0))[0]?.id;
    onAddWorkspaceAsset(assetId, position, frameId);
    onEndDrag();
  };

  /* ─────────── Clipboard: copy a component, part or asset; paste it anywhere ─────────── */

  const findPhoneObject = (id: ModuleId) =>
    drawAreaRef.current?.querySelector<HTMLElement>(`[data-module-id="${CSS.escape(id)}"]`) ?? null;

  const withoutFrame = ({ frameId: _frameId, ...box }: ModuleBox): ModuleBox => box;

  const workspaceShapeTitle = (shape: WorkspaceShape) => shape.type === 'component'
    ? (shape.componentId && moduleFor(shape.componentId)?.title) || 'Component'
    : canvasObjectTitle(`${shape.type}-${shape.id}` as ModuleId, shape.box) ?? 'Shape';

  /** Copy a component, shape, frame (with its children) or asset that sits in the phone. */
  const copyPhoneObject = (id: ModuleId): StudioClipboard | null => {
    const box = boxes[id] ?? {};
    const type = canvasInsertTypeForId(id);
    if (type) {
      const tree = [id, ...phoneDescendants(id)].map((moduleId) => ({
        id: moduleId as string,
        parent: moduleId === id ? undefined : boxes[moduleId]?.frameId,
      }));
      return {
        label: canvasObjectTitle(id, box) ?? 'Shape',
        items: clipboardTree(tree, (item) => {
          const itemType = canvasInsertTypeForId(item.id as ModuleId);
          return itemType ? { type: itemType, box: withoutFrame(boxes[item.id] ?? {}) } : null;
        }),
      };
    }
    const content = findPhoneObject(id)?.querySelector<HTMLElement>(':scope > [data-module-content-root]');
    const root = content?.firstElementChild;
    if (!content || !root) return null;
    const style = window.getComputedStyle(root);
    const { x: _x, y: _y, ...componentBox } = withoutFrame(box);
    return {
      label: moduleFor(id)?.title ?? 'Component',
      items: [{
        type: 'component',
        componentId: id,
        edits: moduleEditsOf(edit, id),
        size: { w: content.offsetWidth, h: content.offsetHeight },
        // The snapshot is used when the component can't be placed live (e.g. it is already on that page).
        box: { ...componentBox, html: snapshotHtml(root), textColor: style.color, fontFamily: style.fontFamily },
      }],
    };
  };

  /** Copy an object (and, for frames, its children) from the workspace around the phone. */
  const copyWorkspaceShape = (id: string): StudioClipboard | null => {
    const shape = workspaceShapes.find((item) => item.id === id);
    if (!shape) return null;
    const tree = getWorkspaceGroup(shape, workspaceShapes).map((item) => ({
      ...item,
      parent: item.id === id ? undefined : item.frameId,
    }));
    return {
      label: workspaceShapeTitle(shape),
      items: clipboardTree(tree, (item) => ({
        type: item.type, box: withoutFrame(item.box), componentId: item.componentId, edits: item.edits,
      })),
    };
  };

  /** Copy a part of a component: text becomes an editable text layer, assets stay assets, anything else is flattened. */
  const copyElement = (moduleId: ModuleId, element: HTMLElement, elementId: string): StudioClipboard | null => {
    if (!element.isConnected) return null;
    const host = element.closest<HTMLElement>('[data-studio-tinker-host]');
    const scale = host ? renderScale(host) : viewportScale;
    const rect = element.getBoundingClientRect();
    const w = Math.max(8, Math.round(rect.width / scale));
    const h = Math.max(8, Math.round(rect.height / scale));
    const label = getElementDisplayName(elementId, element);

    if (elementId.startsWith('asset-')) {
      const asset = edit?.placedAssets[moduleId]?.find((item) => item.id === elementId);
      if (asset) {
        return { label: asset.name, items: [{ type: 'asset', box: { w, h, assetUrl: asset.url, assetName: asset.name } }] };
      }
    }

    const style = window.getComputedStyle(element);
    if (element.dataset.textSlot) {
      return {
        label,
        items: [{
          type: 'shape-text',
          box: {
            ...createShapeBox('shape-text', { w: w + 8, h }),
            text: element.textContent ?? '',
            textColor: style.color,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            fontFamily: style.fontFamily,
            fontStyle: style.fontStyle,
            lineHeight: style.lineHeight,
            textAlign: style.textAlign,
          },
        }],
      };
    }

    return {
      label,
      items: [{
        type: 'element',
        box: {
          w,
          h,
          html: snapshotHtml(element),
          textColor: style.color,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
        },
      }],
    };
  };

  /** The copy target for whatever is currently selected (used by Ctrl/Cmd+C). */
  const copySelection = (): StudioClipboard | null => {
    if (selectedWorkspaceShapeId) return copyWorkspaceShape(selectedWorkspaceShapeId);
    if (!selectedId) return null;
    const activeElementId = edit?.activeElementId;
    if (activeElementId && !canvasInsertTypeForId(selectedId)) {
      const host = findPhoneObject(selectedId)?.querySelector<HTMLElement>('[data-studio-tinker-host]');
      const element = host ? findElementById(host, activeElementId) : null;
      if (element) return copyElement(selectedId, element, activeElementId);
    }
    return copyPhoneObject(selectedId);
  };

  /** Where a paste at this screen position lands: inside the phone screen or on the workspace. */
  const resolvePasteTarget = (clientX: number, clientY: number): PasteTarget | null => {
    const within = (rect: DOMRect) => clientX >= rect.left && clientX <= rect.right
      && clientY >= rect.top && clientY <= rect.bottom;
    const body = bodyRef.current;
    const area = drawAreaRef.current;
    if (body && area && within(body.getBoundingClientRect())) {
      const rect = area.getBoundingClientRect();
      const scale = renderScale(area);
      return {
        target: 'phone',
        point: { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale },
        clientY,
      };
    }
    // The phone bezel, status bar and tab bar aren't pasteable.
    if (phoneRef.current && within(phoneRef.current.getBoundingClientRect())) return null;
    const workspace = workspaceRef.current;
    if (workspace && within(workspace.getBoundingClientRect())) {
      return { target: 'workspace', point: clientToWorld(clientX, clientY), clientY };
    }
    return null;
  };

  /** Components in the phone are stacked, so a pasted component is inserted at the cursor's slot. */
  const flowInsertBefore = (clientY: number): ModuleId | null => {
    for (const id of pageModules[activePage] ?? []) {
      if (canvasInsertTypeForId(id)) continue;
      const element = findPhoneObject(id);
      if (!element) continue;
      const rect = element.getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) return id;
    }
    return null;
  };

  const pasteClipboard = (paste: PasteTarget, source: StudioClipboard | null = clipboard) => {
    if (!source || source.items.length === 0) return;
    const anchor = source.items[0].box;
    const placeBox = (box: ModuleBox): ModuleBox => ({
      ...box,
      x: Math.round(paste.point.x + (box.x ?? 0) - (anchor.x ?? 0)),
      y: Math.round(paste.point.y + (box.y ?? 0) - (anchor.y ?? 0)),
    });
    const sized = (item: ClipboardItem): ModuleBox => item.type === 'component'
      ? { ...item.box, w: item.box.w ?? item.size?.w, h: item.box.h ?? item.size?.h }
      : item.box;

    if (paste.target === 'workspace') {
      const ids = source.items.map(() => `workspace-shape-${uniqueIdPart()}-${++workspaceShapeIdRef.current}`);
      const pasted = source.items.map((item, index): WorkspaceShape => {
        const frameId = item.parent !== undefined ? ids[item.parent] : undefined;
        return {
          id: ids[index],
          type: item.type,
          componentId: item.componentId,
          edits: item.edits,
          frameId,
          box: { ...placeBox(sized(item)), frameId },
        };
      });
      onSelect(null);
      setSelectedWorkspaceShapeId(ids[0]);
      setWorkspaceShapes((shapes) => [...shapes, ...pasted]);
      // Loose objects pasted inside a frame become part of it.
      assignWorkspaceFrames(pasted.filter((shape) => !shape.frameId).map((shape) => shape.id));
      return;
    }

    // Into the phone. A page can hold each library component once, so a component that is
    // already on this page is pasted as a flattened copy instead.
    const onPage = new Set(pageModules[activePage] ?? []);
    const pasted = source.items.flatMap((item, index): WorkspaceShape[] => {
      const frameId = item.parent !== undefined ? `clipboard-${item.parent}` : undefined;
      if (item.type === 'component') {
        if (item.componentId && !onPage.has(item.componentId)) {
          return [{
            id: `clipboard-${index}`, type: 'component', componentId: item.componentId, edits: item.edits, frameId, box: placeBox(item.box),
          }];
        }
        if (!item.box.html) return [];
        return [{ id: `clipboard-${index}`, type: 'element', frameId, box: placeBox(sized(item)) }];
      }
      return [{ id: `clipboard-${index}`, type: item.type, frameId, box: placeBox(item.box) }];
    });
    onAddWorkspaceShapes(pasted, flowInsertBefore(paste.clientY));
  };

  const pasteAtPointer = () => {
    if (!clipboard) return false;
    const pointer = lastPointerRef.current;
    let target = pointer ? resolvePasteTarget(pointer.x, pointer.y) : null;
    if (!target && workspaceRef.current) {
      const rect = workspaceRef.current.getBoundingClientRect();
      const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      target = { target: 'workspace', point: clientToWorld(center.x, center.y), clientY: center.y };
    }
    if (!target) return false;
    pasteClipboard(target);
    return true;
  };

  /* ─────────── Multi-select (Ctrl/Cmd+click) and grouping ─────────── */

  /** The groupable canvas object under an element: a workspace object or a shape/text/asset in the phone. */
  const groupableKey = (element: HTMLElement): string | null => {
    const workspaceElement = element.closest<HTMLElement>('[data-workspace-shape-id]');
    if (workspaceElement) return `w:${workspaceElement.dataset.workspaceShapeId}`;
    const moduleId = element.closest<HTMLElement>('[data-module-id]')?.dataset.moduleId;
    return moduleId && canvasInsertTypeForId(moduleId) ? `p:${moduleId}` : null;
  };

  const currentSelectionKey = (): string | null => {
    if (selectedWorkspaceShapeId) return `w:${selectedWorkspaceShapeId}`;
    return selectedId && canvasInsertTypeForId(selectedId) ? `p:${selectedId}` : null;
  };

  /** Ctrl/Cmd+click adds or removes an object from the multi-selection. */
  const toggleMultiSelection = (key: string) => {
    const current = currentSelectionKey();
    setMultiSelection((previous) => {
      const base = previous.length ? previous : current && current !== key ? [current] : [];
      return base.includes(key) ? base.filter((item) => item !== key) : [...base, key];
    });
    const id = key.slice(2);
    if (key.startsWith('w:')) {
      onSelect(null);
      setSelectedWorkspaceShapeId(id);
    } else {
      setSelectedWorkspaceShapeId(null);
      onSelect(id as ModuleId);
    }
  };

  type GroupEntry = { id: string; type: string; box: ModuleBox; parent?: string };

  const groupEntries = (keys: string[]): { space: 'p' | 'w'; entries: GroupEntry[] } | null => {
    const space = keys[0]?.[0];
    if (keys.length < 2 || (space !== 'p' && space !== 'w') || keys.some((key) => key[0] !== space)) return null;
    const ids = keys.map((key) => key.slice(2));
    const entries = space === 'w'
      ? ids.flatMap((id): GroupEntry[] => {
          const shape = workspaceShapes.find((item) => item.id === id);
          return shape ? [{ id, type: shape.type, box: shape.box, parent: shape.frameId }] : [];
        })
      : ids.flatMap((id): GroupEntry[] => {
          const type = canvasInsertTypeForId(id);
          return type ? [{ id, type, box: withRenderedSize(id as ModuleId, boxes[id] ?? {}), parent: boxes[id]?.frameId }] : [];
        });
    return entries.length >= 2 ? { space, entries } : null;
  };

  /** Objects in the phone and on the workspace can't be grouped together. */
  const canGroup = (keys: string[]) => groupEntries(keys) !== null;

  /**
   * Group the selected objects: the frame (or else the largest shape) becomes the group's
   * parent and the other objects (e.g. text) become part of it, moving, copying and
   * deleting with it.
   */
  const groupObjects = (keys: string[]) => {
    const group = groupEntries(keys);
    if (!group) return;
    const area = (box: ModuleBox) => (box.w ?? 0) * (box.h ?? 0);
    const rank = (entry: GroupEntry) => entry.type === 'frame' ? 2 : NON_CONTAINER_TYPES.has(entry.type) ? 0 : 1;
    const parent = [...group.entries].sort((a, b) => rank(b) - rank(a) || area(b.box) - area(a.box))[0];
    // Objects above the parent in its own hierarchy can't become its children.
    const ancestors = new Set<string>();
    const parentOf = (id: string) => group.space === 'w'
      ? workspaceShapes.find((item) => item.id === id)?.frameId
      : boxes[id]?.frameId;
    for (let id = parentOf(parent.id); id && !ancestors.has(id); id = parentOf(id)) ancestors.add(id);
    const children = group.entries.filter((entry) => entry.id !== parent.id && !ancestors.has(entry.id));

    if (group.space === 'w') {
      const childIds = new Set(children.map((entry) => entry.id));
      setWorkspaceShapes((shapes) => shapes.map((shape) => childIds.has(shape.id)
        ? { ...shape, frameId: parent.id, box: { ...shape.box, frameId: parent.id } }
        : shape));
      onSelect(null);
      setSelectedWorkspaceShapeId(parent.id);
    } else {
      children.forEach((entry) => onBoxChange(entry.id as ModuleId, { frameId: parent.id }));
      setSelectedWorkspaceShapeId(null);
      onSelect(parent.id as ModuleId);
    }
    setMultiSelection([]);
  };

  /** The group (a non-frame object with layers grouped into it) that this object belongs to, if any. */
  const groupRootOf = (key: string): string | null => {
    const id = key.slice(2);
    const isWorkspace = key.startsWith('w:');
    const hasChildren = (parentId: string) => isWorkspace
      ? workspaceShapes.some((shape) => shape.frameId === parentId)
      : (pageModules[activePage] ?? []).some((moduleId) => boxes[moduleId]?.frameId === parentId);
    const isFrameId = (objectId: string) => isWorkspace
      ? workspaceShapes.find((shape) => shape.id === objectId)?.type === 'frame'
      : objectId.startsWith('frame-');
    if (!isFrameId(id) && hasChildren(id)) return id;
    const parentId = isWorkspace ? workspaceShapes.find((shape) => shape.id === id)?.frameId : boxes[id]?.frameId;
    return parentId && !isFrameId(parentId) ? parentId : null;
  };

  /** Release a group's layers; they rejoin whatever frame the group sits in. */
  const ungroupObjects = (key: string) => {
    const rootId = groupRootOf(key);
    if (!rootId) return;
    if (key.startsWith('w:')) {
      setWorkspaceShapes((shapes) => {
        const parentFrame = shapes.find((shape) => shape.id === rootId)?.frameId;
        return shapes.map((shape) => shape.frameId === rootId
          ? { ...shape, frameId: parentFrame, box: { ...shape.box, frameId: parentFrame } }
          : shape);
      });
    } else {
      const parentFrame = boxes[rootId]?.frameId;
      (pageModules[activePage] ?? []).forEach((moduleId) => {
        if (boxes[moduleId]?.frameId === rootId) onBoxChange(moduleId, { frameId: parentFrame });
      });
    }
  };

  /** Menu actions for a right-clicked canvas object: group the multi-selection, or ungroup. */
  const groupActions = (key: string): ContextMenuState['actions'] => {
    const actions: NonNullable<ContextMenuState['actions']> = [];
    const keys = multiSelection.includes(key) ? multiSelection : [];
    if (keys.length >= 2) {
      actions.push({ label: 'Group items', run: () => groupObjects(keys), disabled: !canGroup(keys) });
    }
    if (groupRootOf(key)) actions.push({ label: 'Ungroup', run: () => ungroupObjects(key) });
    return actions;
  };

  /* ─────────── Created components: save a frame, place a saved one ─────────── */

  const showCanvasNotice = (message: string) => {
    if (canvasNoticeTimerRef.current) clearTimeout(canvasNoticeTimerRef.current);
    setCanvasNotice(message);
    canvasNoticeTimerRef.current = setTimeout(() => setCanvasNotice(null), 2600);
  };

  /** "Save as component" for a right-clicked frame: it is stored in the browser and listed in the left panel. */
  const saveFrameAction = (
    name: string,
    build: () => StudioClipboard | null,
  ): NonNullable<ContextMenuState['actions']>[number] => ({
    label: 'Save as component',
    run: () => {
      const clip = build();
      if (!clip) return;
      const saved = saveCreatedComponent(name, { ...clip, label: name }, clip.items.length);
      showCanvasNotice(saved
        ? `Saved “${name}” to Created Components`
        : 'Couldn’t save: browser storage is full. Try removing large images from the frame.');
    },
  });

  /** Drop a saved component from the left panel: it is placed like a paste, at the drop point. */
  /** A saved component is being dragged: known from the left panel, or (as a backup) from the drag data. */
  const isCreatedDrag = (event: React.DragEvent) =>
    !!createdDragId || event.dataTransfer.types.includes(CREATED_DRAG_TYPE);

  const handleCreatedDrop = (event: React.DragEvent) => {
    if (!isCreatedDrag(event)) return;
    event.preventDefault();
    event.stopPropagation();
    const saved = findCreatedComponent(createdDragId ?? event.dataTransfer.getData(CREATED_DRAG_TYPE));
    if (!saved) return;
    // Anywhere that isn't the phone screen (including its bezel) builds on the canvas around it.
    const target = resolvePasteTarget(event.clientX, event.clientY) ?? {
      target: 'workspace' as const,
      point: clientToWorld(event.clientX, event.clientY),
      clientY: event.clientY,
    };
    pasteClipboard(target, saved.clip as StudioClipboard);
  };

  /** Library components dragged onto the canvas around the phone become free-floating components there. */
  const isLibraryDragOutsidePhone = (event: React.DragEvent) =>
    event.dataTransfer.types.includes(LIBRARY_DRAG_TYPE)
    && !phoneRef.current?.contains(event.target as Node);

  const openContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    const target = event.target as HTMLElement;
    const paste = resolvePasteTarget(clientX, clientY);
    const menuAt = (targets: ContextMenuState['targets'], actions?: ContextMenuState['actions']) =>
      setContextMenu({ x: clientX, y: clientY, paste, targets, actions });
    const key = groupableKey(target);
    // Rename is offered when a frame alone is right-clicked (not a multi-selection).
    const isMulti = !!key && multiSelection.length >= 2 && multiSelection.includes(key);
    // Right-clicking outside the multi-selection drops it.
    if (!isMulti && multiSelection.length) setMultiSelection([]);

    const workspaceShapeElement = target.closest<HTMLElement>('[data-workspace-shape-id]');
    if (workspaceShapeElement) {
      const id = workspaceShapeElement.dataset.workspaceShapeId ?? '';
      const shape = workspaceShapes.find((item) => item.id === id);
      if (!isMulti) {
        onSelect(null);
        setSelectedWorkspaceShapeId(id);
      }
      menuAt(shape ? [{
        name: workspaceShapeTitle(shape),
        copy: () => copyWorkspaceShape(id),
        remove: () => removeWorkspaceShape(id),
        rename: shape.type === 'frame' && !isMulti ? {
          value: shape.box.name ?? 'Frame',
          apply: (name) => setWorkspaceShapes((shapes) => shapes.map((item) => item.id === id
            ? { ...item, box: { ...item.box, name } }
            : item)),
        } : undefined,
      }] : [], [
        ...(shape?.type === 'frame' && !isMulti
          ? [saveFrameAction(shape.box.name ?? 'Frame', () => copyWorkspaceShape(id))]
          : []),
        ...((key && groupActions(key)) || []),
      ]);
      return;
    }

    const moduleElement = target.closest<HTMLElement>('[data-module-id]');
    if (!moduleElement) {
      menuAt([]);
      return;
    }
    const moduleId = moduleElement.dataset.moduleId as ModuleId;
    const isCanvasObject = !!canvasInsertTypeForId(moduleId);
    const wholeObject = {
      name: isCanvasObject
        ? canvasObjectTitle(moduleId, boxes[moduleId]) ?? 'shape'
        : moduleFor(moduleId)?.title ?? 'component',
      copy: () => copyPhoneObject(moduleId),
      remove: () => onRemove(moduleId),
      rename: moduleId.startsWith('frame-') && !isMulti ? {
        value: boxes[moduleId]?.name ?? 'Frame',
        apply: (name: string) => onBoxChange(moduleId, { name }),
      } : undefined,
    };
    if (selectedId !== moduleId && !isMulti) onSelect(moduleId);
    if (isCanvasObject) {
      menuAt([wholeObject], [
        ...(moduleId.startsWith('frame-') && !isMulti
          ? [saveFrameAction(boxes[moduleId]?.name ?? 'Frame', () => copyPhoneObject(moduleId))]
          : []),
        ...((key && groupActions(key)) || []),
      ]);
      return;
    }

    // A component's parts only become addressable once it is selected, so look up
    // the part under the cursor after the selection has rendered.
    requestAnimationFrame(() => {
      const host = findPhoneObject(moduleId)?.querySelector<HTMLElement>('[data-studio-tinker-host]');
      const hit = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
      const candidate = hit?.closest<HTMLElement>('[data-studio-element], button, [data-text-slot], [role="button"]');
      const targets: ContextMenuState['targets'] = [];
      if (host && candidate && host.contains(candidate)) {
        const elementId = getTinkerElementId(candidate, host);
        const element = findElementById(host, elementId) ?? candidate;
        edit?.setActiveElementId(elementId);
        if (element.dataset.textSlot) edit?.setActiveTextSlot(element.dataset.textSlot);
        targets.push({
          name: getElementDisplayName(elementId, element),
          copy: () => copyElement(moduleId, element, elementId),
          remove: () => edit?.deleteElement(moduleId, elementId),
        });
      }
      targets.push(wholeObject);
      menuAt(targets);
    });
  };

  const closeContextMenu = React.useCallback(() => setContextMenu(null), []);

  // Ctrl/Cmd+C copies the selection; Ctrl/Cmd+V pastes it under the cursor.
  const groupSelection = () => {
    if (!canGroup(multiSelection)) return false;
    groupObjects(multiSelection);
    return true;
  };
  /** The left panel's "+" on a saved component: place it in the phone, centred near the top of the visible screen. */
  const placeCreatedInPhone = (id: string) => {
    const saved = findCreatedComponent(id);
    const area = drawAreaRef.current;
    const body = bodyRef.current;
    if (!saved || !area || !body) return;
    const clip = saved.clip as StudioClipboard;
    const scale = renderScale(area);
    const areaRect = area.getBoundingClientRect();
    const bodyRect = body.getBoundingClientRect();
    const width = clip.items[0]?.box.w ?? 0;
    pasteClipboard({
      target: 'phone',
      point: {
        x: Math.max(0, Math.round((area.offsetWidth - width) / 2)),
        y: Math.max(0, Math.round((bodyRect.top - areaRect.top) / scale)) + 16,
      },
      // Any library components in it go after the page's existing ones.
      clientY: bodyRect.bottom,
    }, clip);
  };
  React.useLayoutEffect(() => {
    placeCreatedRef.current = placeCreatedInPhone;
  });

  const shortcutsRef = React.useRef({ copySelection, pasteAtPointer, groupSelection });
  React.useLayoutEffect(() => {
    shortcutsRef.current = { copySelection, pasteAtPointer, groupSelection };
  });
  const workspaceParentOf = (id: string) => workspaceShapes.find((shape) => shape.id === id)?.frameId;
  const isWorkspaceFrame = (id: string) => workspaceShapes.find((shape) => shape.id === id)?.type === 'frame';
  const workspaceShapeIds = workspaceShapes.map((shape) => shape.id);
  const workspaceLevels = stackLevels(workspaceShapeIds, workspaceParentOf, isWorkspaceFrame);
  const workspaceGroups = edit?.mode === 'edit' ? canvasGroups(workspaceShapeIds, workspaceParentOf, isWorkspaceFrame) : [];

  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey) return;
      const key = event.key.toLowerCase();
      if (key !== 'c' && key !== 'v' && key !== 'g') return;
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable || target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (key === 'g') {
        // Ctrl/Cmd+G groups the Ctrl+clicked objects.
        if (shortcutsRef.current.groupSelection()) event.preventDefault();
        return;
      }
      if (key === 'c') {
        if (window.getSelection()?.toString()) return;
        const next = shortcutsRef.current.copySelection();
        if (!next) return;
        event.preventDefault();
        setClipboard(next);
      } else if (shortcutsRef.current.pasteAtPointer()) {
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <main
      ref={mainRef}
      onMouseMove={(event) => { lastPointerRef.current = { x: event.clientX, y: event.clientY }; }}
      onMouseLeave={() => { lastPointerRef.current = null; }}
      // Saved components dragged from the left panel are handled here, before any inner drop target.
      onDragOverCapture={(event) => {
        if (!isCreatedDrag(event)) return;
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
      }}
      onDragEnterCapture={(event) => {
        if (!isCreatedDrag(event)) return;
        event.preventDefault();
        event.stopPropagation();
      }}
      onDropCapture={handleCreatedDrop}
      className="relative flex min-w-0 flex-1 flex-col items-center overflow-hidden bg-gradient-to-b from-[#EEF0FB] via-[#F6F7FE] to-[#EEF0FB] pb-4"
    >
      {/* A fixed-height single line: if it wrapped when the canvas gets narrow, or grew when
          the "Reset view" button appears, it would push the whole canvas down. */}
      <p className="flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap text-[10px] font-medium text-slate-500">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live Sandbox · {Math.round(zoom)}%
        <span className="text-slate-400">· Ctrl+Scroll to zoom · Scroll to pan</span>
        {(zoom !== 100 || Math.abs(viewportOffset.x - homeOffsetX) > 0.5 || viewportOffset.y !== 0) && (
          <button
            type="button"
            onClick={resetView}
            className="ml-1 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#0040DF] shadow-sm ring-1 ring-slate-200 hover:bg-[#E8EDFF]"
          >
            Reset view
          </button>
        )}
      </p>

      <div
        ref={workspaceRef}
        onDragOver={(event) => {
          if (!isAssetDrag(event.dataTransfer) && !isLibraryDragOutsidePhone(event)) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }}
        onDrop={(event) => {
          if (isLibraryDragOutsidePhone(event)) {
            const id = event.dataTransfer.getData('application/x-pf-module-id') as ModuleId;
            event.preventDefault();
            event.stopPropagation();
            if (id && moduleFor(id)) onAddWorkspaceComponent(id, clientToWorld(event.clientX, event.clientY));
            onEndDrag();
            return;
          }
          handleWorkspaceAssetDrop(event);
        }}
        onMouseDownCapture={(event) => {
          // Any press on the canvas ends a whole-group pick; a press in the space between a
          // group's items picks that group again (see GroupOutline).
          if (selectedGroupKey) onSelectGroup(null);
          // Ctrl/Cmd+click builds a multi-selection (e.g. a shape and a text to group);
          // any other click clears it.
          if (event.button === 0 && !panMode && !drawTool) {
            const key = groupableKey(event.target as HTMLElement);
            if ((event.ctrlKey || event.metaKey) && key) {
              event.preventDefault();
              event.stopPropagation();
              toggleMultiSelection(key);
              return;
            }
            if (multiSelection.length) setMultiSelection([]);
          }
          if ((panMode && event.button === 0) || event.button === 1) {
            startViewportPan(event);
            return;
          }
          if (drawTool && !phoneRef.current?.contains(event.target as Node)) {
            startCanvasDrawing(event, 'workspace');
          }
        }}
        onMouseDown={(event) => {
          // Background clicks land on the workspace itself (the world layer ignores the pointer).
          if (event.target === event.currentTarget) {
            setSelectedWorkspaceShapeId(null);
            onSelect(null);
          }
        }}
        onContextMenu={openContextMenu}
        data-canvas-drawing={drawTool ? 'true' : undefined}
        className={`relative min-h-0 w-full flex-1 overflow-hidden ${
          panMode ? 'cursor-grab active:cursor-grabbing' : drawTool === 'shape-text' ? 'cursor-text' : drawTool ? 'cursor-crosshair' : ''
        }`}
      >
        {/* Inside components and canvas objects the cursor is the move cursor (as over frames),
            except on resize handles and inputs. */}
        <style>{`
          [data-module-content-root] *:not(input):not(textarea):not([contenteditable="true"]):not([class*="-resize"]),
          [data-workspace-shape-id] *:not(input):not(textarea):not([contenteditable="true"]):not([class*="-resize"]) {
            cursor: inherit;
          }
        `}</style>
        {multiSelection.length > 0 && (
          <style>{`${multiSelection.map((key) => key.startsWith('w:')
            ? `[data-workspace-shape-id="${CSS.escape(key.slice(2))}"]`
            : `[data-module-id="${CSS.escape(key.slice(2))}"]`).join(',\n')} {
            outline: 1px solid #0040DF !important;
            outline-offset: 4px !important;
          }`}</style>
        )}
        {drawTool && (() => {
          const cursor = drawTool === 'shape-text' ? 'text' : drawTool === 'shape-comment' ? COMMENT_CURSOR : 'crosshair';
          return (
            <style>{`
              div[data-canvas-drawing],
              div[data-canvas-drawing] * {
                cursor: ${cursor} !important;
              }
              div[data-canvas-drawing] .studio-tinker-active button,
              div[data-canvas-drawing] .studio-tinker-active [data-text-slot],
              div[data-canvas-drawing] .studio-tinker-active [data-studio-element],
              div[data-canvas-drawing] .studio-tinker-active [data-tap-root],
              div[data-canvas-drawing] .studio-tinker-active [role="button"] {
                cursor: ${cursor} !important;
              }
              /* Comments keep normal cursors: text in the comment box, pointer on buttons. */
              div[data-canvas-drawing] [${COMMENT_UI_ATTR}] * { cursor: default !important; }
              div[data-canvas-drawing] [${COMMENT_UI_ATTR}] textarea { cursor: text !important; }
              div[data-canvas-drawing] [${COMMENT_UI_ATTR}] button:not(:disabled) { cursor: pointer !important; }
            `}</style>
          );
        })()}
        {panMode && (
          <style>{`
            div[data-canvas-panning] * { cursor: inherit !important; }
          `}</style>
        )}
        <div
          ref={viewportRef}
          data-canvas-panning={panMode ? 'true' : undefined}
          className="pointer-events-none absolute inset-y-0 left-0"
          // No `will-change: transform`: it makes the browser rasterise the canvas once at
          // 100% and stretch that bitmap when zoomed, which blurs every frame and component.
          // Without it the content is repainted sharply at each zoom level. The offset is
          // snapped to whole device pixels so panning never leaves text on a half pixel.
          style={{
            // A fixed world width, so resizing the side panels doesn't re-centre the phone.
            width: canvasWidths?.world ?? '100%',
            transform: `translate(${snapToDevicePixel(viewX)}px, ${snapToDevicePixel(viewportOffset.y)}px) scale(${viewportScale})`,
            transformOrigin: '0 0',
          }}
        >
        <div className="absolute inset-0 z-0">
          {workspaceGroups.map((ids) => (
            <GroupOutline
              key={ids[0]}
              ids={ids}
              attr="data-workspace-shape-id"
              active={!!selectedWorkspaceShapeId && ids.includes(selectedWorkspaceShapeId)}
              selected={selectedGroupKey === `w:${ids[0]}`}
              onSelectGroup={() => onSelectGroup(`w:${ids[0]}`)}
              hidden={!!shapeDragPreview?.items.some((item) => ids.includes(item.id))}
              interactive={!drawTool && !panMode}
              // Workspace frames sit at z 1 and other objects from z 3.
              hitZIndex={2}
            />
          ))}
          {workspaceShapes.map((shape) => {
            const isSelected = selectedWorkspaceShapeId === shape.id;
            // Frames sit under everything; other objects stack in the order they were drawn
            // (grouped layers just above their shape). Selecting or hovering doesn't raise them.
            const restingZ = shape.type === 'frame' ? 1 : 3 + (workspaceLevels.get(shape.id) ?? 0);
            return (
              <div
              key={shape.id}
              data-workspace-shape-id={shape.id}
              data-theme-keep
              onDragOver={(event) => {
                if (!isAssetDrag(event.dataTransfer)) return;
                event.preventDefault();
                event.stopPropagation();
                event.dataTransfer.dropEffect = 'copy';
              }}
              onDrop={(event) => handleWorkspaceAssetDrop(event, shape.id)}
              onMouseDown={(event) => startWorkspaceShapeMove(event, shape)}
              style={{
                position: 'absolute',
                left: shape.box.x ?? 0,
                top: shape.box.y ?? 0,
                // Text layers treat their size as a minimum so the box grows with the text.
                ...(shape.type === 'shape-text'
                  ? { display: 'flex', minWidth: shape.box.w, minHeight: shape.box.h }
                  : { width: shape.box.w ?? 100, height: shape.box.h ?? 100 }),
                zIndex: restingZ,
                opacity: shapeDragPreview?.items.some((item) => item.id === shape.id) ? 0 : undefined,
              }}
              className={`group pointer-events-auto cursor-move ${
                !isSelected && !drawTool && !shapeDragPreview ? 'hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-[#0040DF]' : ''
              }`}
              title="Drag into the phone canvas or reposition"
            >
              {shape.type === 'frame' && <FrameLabel name={shape.box.name ?? 'Frame'} selected={isSelected} />}
              <CanvasObjectContent
                type={shape.type}
                shapeId={shape.type}
                box={shape.box}
                componentId={shape.componentId}
                edits={shape.edits}
                ctx={ctx}
                objectId={shape.id}
                onBoxChange={(patch) => setWorkspaceShapes((shapes) => shapes.map((item) => item.id === shape.id
                  ? { ...item, box: { ...item.box, ...patch } }
                  : item))}
                onEmpty={() => removeWorkspaceShape(shape.id)}
              />
              </div>
            );
          })}
          {(() => {
            const selectedShape = workspaceShapes.find((shape) => shape.id === selectedWorkspaceShapeId);
            if (!selectedShape || drawTool || shapeDragPreview?.items.some((item) => item.id === selectedShape.id)) return null;
            // A picked group is marked by its group border instead of its main shape's handles.
            if (selectedGroupKey === `w:${selectedShape.id}`) return null;
            return (
              <SelectionChrome
                key={selectedShape.id}
                attr="data-workspace-shape-id"
                id={selectedShape.id}
                inset={4}
                onResizeStart={(event, handle) => startWorkspaceShapeResize(event, selectedShape, handle)}
              />
            );
          })()}
          {drawPreview && drawPreviewTarget === 'workspace' && (
            <div
              data-theme-keep
              className="pointer-events-none absolute z-[9500]"
              style={{
                left: drawPreview.box.x,
                top: drawPreview.box.y,
                width: Math.max(1, drawPreview.box.w ?? 1),
                height: Math.max(1, drawPreview.box.h ?? 1),
              }}
            >
              <GenericShape
                id={drawPreview.type}
                box={createShapeBox(drawPreview.type, drawPreview.box)}
                onBoxChange={() => {}}
              />
            </div>
          )}
        </div>
        {shapeDragPreview?.items.map((item) => (
          <div
            key={item.id}
            data-theme-keep
            className="pointer-events-none absolute"
            style={{
              left: item.left,
              top: item.top,
              width: item.box.w ?? 100,
              height: item.box.h ?? 100,
              transform: `scale(${item.scale})`,
              transformOrigin: 'top left',
              zIndex: item.type === 'frame' ? 20 : 21,
            }}
          >
            <CanvasObjectContent
              type={item.type}
              shapeId={`${item.type}-${item.id}-drag-preview`}
              box={item.box}
              componentId={item.componentId}
              edits={item.edits}
              ctx={ctx}
            />
          </div>
        ))}
        <AlignmentGuides guides={alignmentGuides} scale={viewportScale} />
        <CommentLayer
          comments={comments}
          draft={drawTool === 'shape-comment' ? commentDraft : null}
          scale={viewportScale}
          activeId={activeCommentId}
          onPost={postComment}
          onCancelDraft={() => setCommentDraft(null)}
          onResolve={(id) => setComments((list) => list.map((comment) =>
            comment.id === id ? { ...comment, resolved: true } : comment))}
          onHide={(id) => setComments((list) => list.map((comment) =>
            comment.id === id ? { ...comment, hidden: true } : comment))}
          onActivate={onActivateComment}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center">
        {/* data-theme-keep: the phone shows the app's own colours, even in the studio's dark mode. */}
        <div ref={phoneRef} data-theme-keep className="pointer-events-auto relative shrink-0">
        <div className={`relative border-[3px] border-[#1d2b52] bg-[#101c3a] p-[9px] shadow-2xl ring-1 ring-white/10 ${frameRadius}`} style={{ width: dims.w + 18 }}>
          {device === 'iphone' ? (
            <div className="absolute left-1/2 top-[16px] z-30 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
          ) : device === 'pixel' ? (
            <div className="absolute left-1/2 top-[16px] z-30 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-black" />
          ) : null}

          <div className={`${outfit.className} relative flex w-full flex-col overflow-hidden transition-colors duration-300 ${screenRadius} ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F7F8FF] text-slate-900'}`}
            style={{ height: dims.h }}>

            <div className={`flex h-8 shrink-0 items-end justify-between px-6 pb-1 text-[8px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              <span>09:41</span>
              <span className="flex items-center gap-0.5">
                <span className={`h-2 w-2 rounded-sm border ${isDark ? 'border-slate-300' : 'border-slate-700'}`} />
                <span className={`h-2 w-2 rounded-sm border ${isDark ? 'border-slate-300' : 'border-slate-700'}`} />
                <span className={`h-2 w-3 rounded-sm border ${isDark ? 'border-slate-300' : 'border-slate-700'}`} />
              </span>
            </div>

            <div
              ref={bodyRef}
              onDragOver={(e) => {
                const hasDrag = e.dataTransfer.types.includes('application/x-pf-module-id')
                  || isAssetDrag(e.dataTransfer);
                if (!drag && !hasDrag) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = drag?.from === 'canvas' ? 'move' : 'copy';
                if (drag) autoScroll(e.clientY);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onClearDropIndex(); // keep the drag itself going (it may end on the canvas around the phone)
              }}
              onDrop={handleCanvasDrop}
              onClick={(e) => { if (e.target === e.currentTarget) onSelect(null); }}
              className="flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-3 pb-20 pt-1">
              <div
                ref={drawAreaRef}
                onMouseDownCapture={(event) => startCanvasDrawing(event, 'phone')}
                onClick={(e) => {
                  if (suppressCanvasClickRef.current) {
                    suppressCanvasClickRef.current = false;
                    e.stopPropagation();
                    return;
                  }
                  if (e.target === e.currentTarget) onSelect(null);
                }}
                className={`relative min-h-full ${drawTool === 'shape-text' ? 'cursor-text' : drawTool ? 'cursor-crosshair' : ''}`}
              >
                <PageCanvas
                  page={activePage} pageLabel={pageLabel}
                  modules={pageModules[activePage] ?? []}
                  ctx={ctx} drag={drag} dropIndex={dropIndex} accent={accent}
                  isDark={isDark} radius={radius}
                  onStartDrag={onStartDrag} onEndDrag={onEndDrag}
                  onItemDragOver={onItemDragOver} onDrop={handleCanvasDrop}
                  onRemove={onRemove} onQuickAdd={onQuickAdd}
                  selectedId={selectedId} onSelect={onSelect}
                  boxes={boxes} onMeasure={onMeasure}
                  onBoxChange={handleShapeBoxChange}
                  onShapeMove={handlePhoneShapeMove}
                  onShapeMoveEnd={handlePhoneShapeMoveEnd}
                  onSnapStart={startPhoneSnap}
                  isDrawing={!!drawTool}
                  shapeDragPreviewIds={shapeDragPreview?.items.map((item) => item.id) ?? []}
                  showGroups={edit?.mode === 'edit'}
                  panMode={panMode}
                  selectedGroupId={selectedGroupKey?.startsWith('p:') ? selectedGroupKey.slice(2) : null}
                  onSelectGroup={(rootId) => onSelectGroup(`p:${rootId}`)}
                />
                {drawPreview && drawPreviewTarget === 'phone' && (
                  <div
                    className="pointer-events-none absolute z-40"
                    style={{
                      left: drawPreview.box.x,
                      top: drawPreview.box.y,
                      width: Math.max(1, drawPreview.box.w ?? 1),
                      height: Math.max(1, drawPreview.box.h ?? 1),
                    }}
                  >
                    <GenericShape
                      id={drawPreview.type}
                      box={createShapeBox(drawPreview.type, drawPreview.box)}
                      onBoxChange={() => {}}
                    />
                  </div>
                )}
              </div>
            </div>

            <BottomDockTabBar activePage={activePage} isDark={isDark} onNavTab={onNavTab} />
          </div>
        </div>
        </div>
        </div>
        </div>
      </div>

      {/* Figma-like Toolbar */}
      <CanvasToolbar
        onSelectTool={(tool) => { setCommentDraft(null); setDrawTool(tool); }}
        onSelect={onSelect}
        panMode={panMode}
        onPanModeChange={setPanMode}
        drawTool={drawTool}
      />

      {contextMenu && (
        <CanvasContextMenu
          key={`${contextMenu.x}-${contextMenu.y}`}
          menu={contextMenu}
          clipboard={clipboard}
          onCopy={(build) => {
            const next = build();
            if (next) setClipboard(next);
          }}
          onPaste={pasteClipboard}
          onClose={closeContextMenu}
        />
      )}
      {canvasNotice && (
        <div
          role="status"
          className="pointer-events-none absolute bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-[11px] font-semibold text-white shadow-lg"
        >
          {canvasNotice}
        </div>
      )}
    </main>
  );
}

/* ═══════════════════════════ RightPanel ═══════════════════════════ */

const CornerIcon = ({ type }: { type: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const paths = {
    tl: 'M2 10V2H10',
    tr: 'M10 10V2H2',
    bl: 'M2 2V10H10',
    br: 'M10 2V10H2',
  };
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 shrink-0">
      <path d={paths[type]} />
    </svg>
  );
};

const HexagonLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

type PickerPosition = { top: number; left: number };

/** `#RRGGBB` → hue (0–360), saturation and value (0–1). */
function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return { h: 0, s: 0, v: 0 };
  const [r, g, b] = match.slice(1).map((part) => parseInt(part, 16) / 255);
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  let h = 0;
  if (delta) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = (h * 60 + 360) % 360;
  }
  return { h, s: max ? delta / max : 0, v: max };
}

/** Hue (0–360), saturation and value (0–1) → `#RRGGBB`. */
function hsvToHex(h: number, s: number, v: number): string {
  const channel = (n: number) => {
    const k = (n + h / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255);
  };
  return `#${[channel(5), channel(3), channel(1)].map((x) => x.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

function AdvancedColorPicker({
  color, gradient, onChange, onGradientChange, position, title, onClose,
}: {
  color: string;
  gradient?: FillGradient;
  onChange: (hex: string) => void;
  onGradientChange?: (gradient: FillGradient | null) => void;
  position: PickerPosition;
  title: string;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<'Solid' | 'Linear' | 'Radial'>(gradient?.type ?? 'Solid');
  // Which gradient stop the picker edits; solid fills always edit the main color.
  const [activeStop, setActiveStop] = useState<'start' | 'end'>('start');
  const validColor = /^#[\da-f]{6}$/i.test(color) ? color : '#000000';
  const endColor = gradient?.endColor ?? '#2563EB';
  const editingEnd = mode !== 'Solid' && activeStop === 'end';
  const editedColor = editingEnd ? (/^#[\da-f]{6}$/i.test(endColor) ? endColor : '#000000') : validColor;

  const [hexDraftState, setHexDraftState] = useState({ color: editedColor, value: editedColor.replace(/^#/, '').toUpperCase() });
  const hexDraft = hexDraftState.color === editedColor
    ? hexDraftState.value
    : editedColor.replace(/^#/, '').toUpperCase();

  // Hue is kept separately so it survives greys/black/white, which have no hue of their own.
  const hsv = hexToHsv(editedColor);
  const [hueState, setHueState] = useState({ color: editedColor, hue: hsv.h });
  const hue = hueState.color === editedColor ? hueState.hue : hsv.h;

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#000000');
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  const rgb = hexToRgb(editedColor);
  const rgbToHex = (r: number, g: number, b: number) =>
    ("#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')).toUpperCase();

  const brandPalette = ['#6D28D9', '#2563EB', '#1E293B', '#64748B', '#C7D2FE', '#FFFFFF'];
  const recentColors = ['#F8FAFC', '#8B5CF6', '#7C3AED', '#3B82F6', '#E0E7FF', '#1E293B'];
  const selectMode = (nextMode: 'Solid' | 'Linear' | 'Radial') => {
    setMode(nextMode);
    if (nextMode === 'Solid') {
      onGradientChange?.(null);
      return;
    }
    onGradientChange?.({
      type: nextMode,
      startColor: color,
      endColor: gradient?.endColor ?? '#2563EB',
      angle: gradient?.angle ?? 135,
    });
  };
  const updateGradient = (patch: Partial<FillGradient>) => {
    if (mode === 'Solid') return;
    onGradientChange?.({
      type: mode,
      startColor: color,
      endColor: gradient?.endColor ?? '#2563EB',
      angle: gradient?.angle ?? 135,
      ...patch,
    });
  };

  /** Apply a color to whichever stop is being edited. */
  const setEditedColor = (hex: string, nextHue?: number) => {
    const next = hex.toUpperCase();
    if (nextHue !== undefined) setHueState({ color: next, hue: nextHue });
    if (editingEnd) updateGradient({ endColor: next });
    else onChange(next);
  };

  /** Drag inside a picker track, reporting the pointer position as 0–1 fractions. */
  const startTrackDrag = (
    event: React.PointerEvent<HTMLDivElement>,
    apply: (fx: number, fy: number) => void,
  ) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const track = event.currentTarget;
    track.focus();
    track.setPointerCapture(event.pointerId);
    const update = (clientX: number, clientY: number) => {
      const rect = track.getBoundingClientRect();
      apply(
        Math.min(1, Math.max(0, (clientX - rect.left) / (rect.width || 1))),
        Math.min(1, Math.max(0, (clientY - rect.top) / (rect.height || 1))),
      );
    };
    update(event.clientX, event.clientY);
    const handleMove = (moveEvent: PointerEvent) => update(moveEvent.clientX, moveEvent.clientY);
    const handleUp = () => {
      track.removeEventListener('pointermove', handleMove);
      track.removeEventListener('pointerup', handleUp);
      track.removeEventListener('pointercancel', handleUp);
    };
    track.addEventListener('pointermove', handleMove);
    track.addEventListener('pointerup', handleUp);
    track.addEventListener('pointercancel', handleUp);
  };

  const setSaturationValue = (saturation: number, value: number) =>
    setEditedColor(hsvToHex(hue, saturation, value), hue);
  const setHue = (nextHue: number) =>
    setEditedColor(hsvToHex(nextHue, hsv.s, hsv.v), nextHue);

  const picker = (
    <div
      role="dialog"
      aria-label={title}
      className="fixed z-[100] max-h-[calc(100vh-16px)] w-[288px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-2xl"
      style={{ top: position.top, left: position.left }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-800">{title}</span>
        <button type="button" onClick={onClose} aria-label="Close color picker" className="text-slate-400 hover:text-slate-600">
          <X className="h-3 w-3" />
        </button>
      </div>
      <div className="space-y-3 p-1 w-full">
        {onGradientChange && (
          <div className="flex rounded-md bg-slate-100 p-0.5">
            {(['Solid', 'Linear', 'Radial'] as const).map((nextMode) => (
              <button
                key={nextMode}
                onClick={() => selectMode(nextMode)}
                type="button"
                aria-pressed={mode === nextMode}
                className={`flex-1 rounded py-1 text-[10px] font-semibold ${mode === nextMode ? 'bg-white shadow-sm text-[#0040DF]' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {nextMode}
              </button>
            ))}
          </div>
        )}

        {mode !== 'Solid' && onGradientChange && (
          <div className="space-y-1.5">
            <div
              className="h-4 w-full rounded border border-slate-200"
              style={{
                background: mode === 'Linear'
                  ? `linear-gradient(${gradient?.angle ?? 135}deg, ${validColor}, ${endColor})`
                  : `radial-gradient(circle, ${validColor}, ${endColor})`,
              }}
            />
            <div className="flex gap-1.5">
              {([
                { stop: 'start', label: 'Start', swatch: validColor },
                { stop: 'end', label: 'End', swatch: endColor },
              ] as const).map(({ stop, label, swatch }) => (
                <button
                  key={stop}
                  type="button"
                  aria-pressed={activeStop === stop}
                  onClick={() => setActiveStop(stop)}
                  className={`flex flex-1 items-center gap-1.5 rounded border px-1.5 py-1 text-[10px] font-medium ${
                    activeStop === stop ? 'border-[#0040DF] bg-[#EEF2FF] text-[#0040DF]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="h-3.5 w-3.5 rounded-sm border border-slate-300" style={{ background: swatch }} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Saturation (x) / brightness (y) area for the current hue. */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Saturation and brightness"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(hsv.s * 100)}
          aria-valuetext={`Saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
          onPointerDown={(event) => startTrackDrag(event, (fx, fy) => setSaturationValue(fx, 1 - fy))}
          onKeyDown={(event) => {
            const step = event.shiftKey ? 0.1 : 0.01;
            const moves: Record<string, [number, number]> = {
              ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step],
            };
            const move = moves[event.key];
            if (!move) return;
            event.preventDefault();
            setSaturationValue(
              Math.min(1, Math.max(0, hsv.s + move[0])),
              Math.min(1, Math.max(0, hsv.v + move[1])),
            );
          }}
          className="relative h-32 w-full cursor-crosshair touch-none select-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#0040DF]"
          style={{
            backgroundColor: `hsl(${hue}, 100%, 50%)`,
            backgroundImage: 'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)',
          }}
        >
          <span
            className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
            style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, backgroundColor: editedColor }}
          />
        </div>

        {/* Hue strip. */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Hue"
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={Math.round(hue)}
          onPointerDown={(event) => startTrackDrag(event, (fx) => setHue(Math.min(359.9, fx * 360)))}
          onKeyDown={(event) => {
            const step = event.shiftKey ? 10 : 1;
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            setHue((hue + (event.key === 'ArrowRight' ? step : -step) + 360) % 360);
          }}
          className="relative h-3 w-full cursor-pointer touch-none select-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#0040DF]"
          style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}
        >
          <span
            className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
            style={{ left: `${(hue / 360) * 100}%`, backgroundColor: `hsl(${hue}, 100%, 50%)` }}
          />
        </div>

        {mode === 'Linear' && onGradientChange && (
          <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-2">
            {mode === 'Linear' && (
              <label className="flex items-center gap-2 text-[10px] font-medium text-slate-600">
                <span>Angle</span>
                <input
                  type="range"
                  aria-label="Gradient angle"
                  min="0"
                  max="360"
                  value={gradient?.angle ?? 135}
                  onChange={(event) => updateGradient({ angle: Number(event.target.value) })}
                  className="flex-1 accent-[#0040DF]"
                />
                <span className="w-8 text-right">{gradient?.angle ?? 135}°</span>
              </label>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <select className="h-7 rounded border border-slate-200 bg-slate-50 px-1 text-[10px] text-slate-600 outline-none">
            <option>HEX</option>
          </select>
          <div className="flex flex-1 items-center rounded bg-slate-50 px-2 py-1 border border-slate-200">
            <span className="text-[10px] text-slate-400 mr-1">#</span>
            <input
              type="text"
              aria-label="Hex color"
              value={hexDraft}
              maxLength={6}
              onChange={(e) => {
                const next = e.target.value.replace(/[^0-9a-f]/gi, '').slice(0, 6).toUpperCase();
                setHexDraftState({ color: editedColor, value: next });
                if (/^[\da-f]{6}$/i.test(next)) setEditedColor(`#${next}`);
              }}
              onBlur={() => {
                if (!/^[\da-f]{6}$/i.test(hexDraft)) {
                  setHexDraftState({ color: editedColor, value: editedColor.replace(/^#/, '').toUpperCase() });
                }
              }}
              className="w-full bg-transparent text-[11px] font-mono text-slate-800 outline-none uppercase"
            />
          </div>
          <div className="flex w-16 items-center rounded bg-slate-50 px-2 py-1 border border-slate-200">
            <input type="text" defaultValue="90%" className="w-full bg-transparent text-[11px] text-slate-800 outline-none text-right" />
          </div>
        </div>

        <div className="flex gap-2">
          {[
            { label: 'R', value: rgb.r, key: 'r' },
            { label: 'G', value: rgb.g, key: 'g' },
            { label: 'B', value: rgb.b, key: 'b' }
          ].map(({ label, value, key }) => (
            <div key={key} className="flex flex-1 items-center rounded bg-slate-50 px-2 py-1 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 mr-2">{label}</span>
              <input
                type="number"
                value={value}
                onChange={(e) => {
                  const num = parseInt(e.target.value) || 0;
                  const newRgb = { ...rgb, [key]: Math.min(255, Math.max(0, num)) };
                  setEditedColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                }}
                className="w-full bg-transparent text-[11px] text-slate-800 outline-none text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          ))}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Brand Palette</span>
            <Settings className="h-3 w-3 text-slate-400" />
          </div>
          <div className="flex gap-1.5">
            {brandPalette.map(c => (
              <button key={c} type="button" onClick={() => setEditedColor(c)} className="h-6 w-6 rounded border border-slate-200" style={{ background: c }} />
            ))}
          </div>
        </div>

        <div>
          <span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-500">Recent Colors</span>
          <div className="flex gap-1.5">
            {recentColors.map(c => (
              <button key={c} type="button" onClick={() => setEditedColor(c)} className="h-6 w-6 rounded-full border border-slate-200" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document === 'undefined' ? null : createPortal(picker, document.body);
}

/**
 * A swatch button that opens the same color picker the Fills section uses, placed beside
 * the panel (or popover) it sits in.
 */
function ColorPickerButton({
  color, onChange, title, className, style, children,
}: {
  color: string;
  onChange: (hex: string) => void;
  title: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const [position, setPosition] = useState<PickerPosition | null>(null);
  return (
    <>
      <button
        type="button"
        title={title}
        aria-label={title}
        aria-expanded={!!position}
        onClick={(event) => {
          if (position) {
            setPosition(null);
            return;
          }
          const anchor = event.currentTarget.getBoundingClientRect();
          const panel = event.currentTarget.closest('aside, [data-picker-panel]')?.getBoundingClientRect();
          const pickerWidth = 288;
          const gap = 8;
          setPosition({
            top: Math.max(8, Math.min(anchor.top, window.innerHeight - 500)),
            left: Math.max(8, (panel?.left ?? anchor.left) - pickerWidth - gap),
          });
        }}
        className={className}
        style={style}
      >
        {children}
      </button>
      {position && (
        <AdvancedColorPicker
          color={color}
          onChange={onChange}
          position={position}
          title={title}
          onClose={() => setPosition(null)}
        />
      )}
    </>
  );
}

function EffectsPanel({
  box, onBoxChange, onClose, position,
}: {
  box: ModuleBox;
  onBoxChange: (patch: ModuleBox) => void;
  onClose: () => void;
  position: PickerPosition;
}) {
  const [effectType, setEffectType] = useState<EffectType>(box.effectType ?? 'none');

  const handleChange = (patch: Partial<ModuleBox>) => {
    onBoxChange({ ...patch, effectType });
  };

  const content = (
    <div
      data-picker-panel
      className="fixed z-[100] w-[320px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-2xl"
      style={{ top: position.top, left: position.left }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudIcon />
          <span className="text-[14px] font-bold text-slate-800">Effect Settings</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-50 p-2">
        <span className="text-[11px] font-semibold text-slate-600">Effect</span>
        <select
          value={effectType}
          onChange={(e) => {
            const val = e.target.value as EffectType;
            setEffectType(val);
            onBoxChange({ effectType: val });
          }}
          className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 outline-none"
        >
          <option value="none">None</option>
          <option value="glassmorphism">Glassmorphism</option>
          <option value="shadow">Drop Shadow</option>
          <option value="blur">Layer Blur</option>
        </select>
      </div>

      {effectType === 'glassmorphism' && (
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500">Blur Radius</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-[#0040DF]">{box.glassBlur ?? 10} px</span>
            </div>
            <input
              type="range" min="0" max="50" value={box.glassBlur ?? 10}
              onChange={(e) => handleChange({ glassBlur: Number(e.target.value) })}
              className="w-full accent-[#0040DF]"
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500">Backdrop Saturation</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-[#0040DF]">{box.glassSaturation ?? 150} %</span>
            </div>
            <input
              type="range" min="0" max="300" value={box.glassSaturation ?? 150}
              onChange={(e) => handleChange({ glassSaturation: Number(e.target.value) })}
              className="w-full accent-[#0040DF]"
            />
          </div>
        </div>
      )}

      {effectType === 'shadow' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="mb-1 block text-[10px] font-semibold text-slate-500">X Offset</span>
              <input
                type="number" value={box.shadowX ?? 0}
                onChange={(e) => handleChange({ shadowX: Number(e.target.value) })}
                className="w-full rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] outline-none"
              />
            </div>
            <div>
              <span className="mb-1 block text-[10px] font-semibold text-slate-500">Y Offset</span>
              <input
                type="number" value={box.shadowY ?? 4}
                onChange={(e) => handleChange({ shadowY: Number(e.target.value) })}
                className="w-full rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] outline-none"
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500">Blur Radius</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-[#0040DF]">{box.shadowBlur ?? 8} px</span>
            </div>
            <input
              type="range" min="0" max="100" value={box.shadowBlur ?? 8}
              onChange={(e) => handleChange({ shadowBlur: Number(e.target.value) })}
              className="w-full accent-[#0040DF]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-500">Color</span>
            <ColorPickerButton
              title="Shadow color"
              color={box.shadowColor ?? '#000000'}
              onChange={(hex) => handleChange({ shadowColor: hex })}
              className="h-6 w-6 rounded border border-slate-200"
              style={{ background: box.shadowColor ?? '#000000' }}
            />
            <span className="font-mono text-[10px] uppercase text-slate-500">{box.shadowColor ?? '#000000'}</span>
          </div>
        </div>
      )}

      {effectType === 'blur' && (
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500">Blur Amount</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-[#0040DF]">{box.layerBlur ?? 4} px</span>
          </div>
          <input
            type="range" min="0" max="100" value={box.layerBlur ?? 4}
            onChange={(e) => handleChange({ layerBlur: Number(e.target.value) })}
            className="w-full accent-[#0040DF]"
          />
        </div>
      )}
    </div>
  );

  return typeof document === 'undefined' ? null : createPortal(content, document.body);
}

const CloudIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0040DF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);

function TextFormattingPanel({
  textLabel,
  textValue,
  textStyle,
  onTextChange,
  onStyleChange,
  onClose,
}: { 
  textLabel: string;
  textValue: string;
  textStyle: EditableTextStyle;
  onTextChange: (value: string) => void;
  onStyleChange: (patch: Partial<EditableTextStyle> | null) => void;
  onClose: () => void;
}) {
  const [textEditorOpen, setTextEditorOpen] = useState(false);
  const alignments = [
    { icon: AlignLeft, value: 'left', label: 'Align left' },
    { icon: AlignCenter, value: 'center', label: 'Align center' },
    { icon: AlignRight, value: 'right', label: 'Align right' },
    { icon: AlignJustify, value: 'justify', label: 'Justify' },
  ] as const;
  const fontSize = Number.parseFloat(String(textStyle.fontSize ?? 14)) || 14;
  const lineHeight = Number.parseFloat(String(textStyle.lineHeight ?? 20)) || 20;
  const lineHeightPercent = textStyle.lineHeight === undefined
    ? 140
    : Math.round((lineHeight / fontSize) * 100);
  const textColor = textStyle.color ?? '#FFFFFF';
  const textWidth = Number.parseFloat(String(textStyle.width ?? 184)) || 184;
  const textHeight = Number.parseFloat(String(textStyle.height ?? 20)) || 20;
  const textOpacity = Math.round(Number(textStyle.opacity ?? 1) * 100);
  const colorSwatches = ['#FFFFFF', '#003FE0', '#0757D8', '#151C2D', '#777482', '#C7BFD6'];
  const sizeInputClass = 'min-w-0 flex-1 bg-transparent text-[10px] text-slate-700 outline-none';

  return (
    <div className="flex h-full flex-col bg-white text-slate-800">
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-3">
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#111827]">Font &amp; Formatting</h2>
            <div className="flex items-center gap-1">
              <span className="rounded bg-[#f0efff] px-1.5 py-0.5 text-[8px] font-medium text-[#7167a8]">Global Sync</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close text formatting"
                className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#0040DF]"
              ><X className="h-3 w-3" /></button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] text-slate-600" htmlFor="text-font-family">Font Family</label>
            <select
              id="text-font-family"
              aria-label="Font Family"
              value={textStyle.fontFamily ?? 'inherit'}
              onChange={(event) => onStyleChange({
                fontFamily: event.target.value === 'inherit' ? undefined : event.target.value,
              })}
              className="h-7 w-full rounded-md border-0 bg-[#f1f3ff] px-2 text-[10px] text-slate-700 outline-none focus:ring-1 focus:ring-[#0040DF]"
            >
              <option value="inherit">Inter (Institutional Fintech Default)</option>
              <option value={urbanist.style.fontFamily}>Urbanist</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="system-ui, sans-serif">System UI</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="min-w-0 space-y-1">
              <label className="block text-[9px] text-slate-600" htmlFor="text-font-weight">Weight</label>
              <select
                id="text-font-weight"
                aria-label="Font Weight"
                value={textStyle.fontWeight ?? 600}
                onChange={(event) => onStyleChange({ fontWeight: Number(event.target.value) })}
                className="h-7 w-full rounded-md border border-[#d9dce6] bg-white px-2 text-[10px] text-slate-700 outline-none focus:border-[#0040DF]"
              >
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">SemiBold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>
            <div className="min-w-0 space-y-1">
              <label className="block text-[9px] text-slate-600">Size</label>
              <div className="flex h-7 items-center rounded-md border border-[#d9dce6] bg-white px-1">
                <button
                  type="button"
                  aria-label="Decrease font size"
                  onClick={() => onStyleChange({ fontSize: Math.max(1, fontSize - 1) })}
                  className="grid h-5 w-5 shrink-0 place-items-center text-[12px] text-slate-500 hover:text-[#0040DF]"
                >−</button>
                <input
                  type="number"
                  aria-label="Font Size"
                  min="1"
                  value={fontSize}
                  onChange={(event) => onStyleChange({
                    fontSize: event.target.value ? Math.max(1, Number(event.target.value)) : undefined,
                  })}
                  className="min-w-0 w-full bg-transparent text-center text-[10px] text-slate-700 outline-none"
                />
                <span className="shrink-0 text-[8px] text-slate-500">px</span>
                <button
                  type="button"
                  aria-label="Increase font size"
                  onClick={() => onStyleChange({ fontSize: fontSize + 1 })}
                  className="grid h-5 w-5 shrink-0 place-items-center text-[12px] text-slate-500 hover:text-[#0040DF]"
                >+</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[9px] text-slate-600">Line Height</label>
                <span className="text-[8px] text-[#0040DF]">{lineHeightPercent}%</span>
              </div>
              <div className="flex h-7 items-center gap-1 rounded-md border border-[#d9dce6] bg-white px-1.5">
                <span className="text-[9px] text-slate-500">↕</span>
                <input
                  type="number"
                  aria-label="Line Height"
                  min="1"
                  value={lineHeight}
                  onChange={(event) => onStyleChange({
                    lineHeight: event.target.value ? `${Math.max(1, Number(event.target.value))}px` : undefined,
                  })}
                  className={sizeInputClass}
                />
                <span className="text-[8px] text-slate-500">px</span>
              </div>
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[9px] text-slate-600">Letter Spacing</label>
                <button
                  type="button"
                  onClick={() => onStyleChange({ letterSpacing: undefined })}
                  className="text-[8px] text-slate-500 hover:text-[#0040DF]"
                >Auto</button>
              </div>
              <div className="flex h-7 items-center gap-1 rounded-md border border-[#d9dce6] bg-white px-1.5">
                <span className="text-[9px] text-slate-500">|A|</span>
                <input
                  type="number"
                  aria-label="Letter Spacing"
                  step="0.01"
                  value={textStyle.letterSpacing === undefined
                    ? '0.00'
                    : Number.parseFloat(String(textStyle.letterSpacing)).toFixed(2)}
                  onChange={(event) => onStyleChange({
                    letterSpacing: event.target.value ? `${Number(event.target.value)}em` : undefined,
                  })}
                  className={`${sizeInputClass} text-right`}
                />
                <span className="text-[8px] text-slate-500">em</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-[9px] text-slate-600">Alignment</h3>
            <div className="flex h-7 items-center rounded-md border border-[#e1e4ee] bg-[#f7f8fc] p-0.5">
              {alignments.map(({ icon: Icon, value, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-label={label}
                  aria-pressed={(textStyle.textAlign ?? 'left') === value}
                  onClick={() => onStyleChange({ textAlign: value })}
                  className={`flex h-full flex-1 items-center justify-center rounded ${
                    (textStyle.textAlign ?? 'left') === value
                      ? 'bg-white text-[#0040DF] shadow-sm ring-1 ring-[#e2e7fa]'
                      : 'text-slate-500 hover:bg-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-[9px] text-slate-600">Case &amp; Decoration</h3>
            <div className="flex h-7 items-center rounded-md border border-[#e1e4ee] bg-[#f7f8fc] p-0.5">
              <button
                type="button"
                aria-label="Normal case"
                aria-pressed={!textStyle.textTransform}
                onClick={() => onStyleChange({ textTransform: undefined })}
                className={`flex h-full flex-1 items-center justify-center rounded text-[9px] ${
                  !textStyle.textTransform ? 'bg-white text-[#0040DF] shadow-sm' : 'text-slate-600 hover:bg-white'
                }`}
              >None</button>
              <button
                type="button"
                aria-label="Uppercase"
                aria-pressed={textStyle.textTransform === 'uppercase'}
                onClick={() => onStyleChange({ textTransform: 'uppercase' })}
                className={`flex h-full flex-1 items-center justify-center rounded text-[9px] ${
                  textStyle.textTransform === 'uppercase' ? 'bg-white text-[#0040DF] shadow-sm' : 'text-slate-600 hover:bg-white'
                }`}
              >AA</button>
              <button
                type="button"
                aria-label="Lowercase"
                aria-pressed={textStyle.textTransform === 'lowercase'}
                onClick={() => onStyleChange({ textTransform: 'lowercase' })}
                className={`flex h-full flex-1 items-center justify-center rounded text-[9px] ${
                  textStyle.textTransform === 'lowercase' ? 'bg-white text-[#0040DF] shadow-sm' : 'text-slate-600 hover:bg-white'
                }`}
              >aa</button>
              <button
                type="button"
                aria-label="Italic"
                aria-pressed={textStyle.fontStyle === 'italic'}
                onClick={() => onStyleChange({ fontStyle: textStyle.fontStyle === 'italic' ? undefined : 'italic' })}
                className={`flex h-full flex-1 items-center justify-center rounded text-[10px] italic ${
                  textStyle.fontStyle === 'italic' ? 'bg-white text-[#0040DF] shadow-sm' : 'text-slate-600 hover:bg-white'
                }`}
              >I</button>
            </div>
          </div>
        </section>

        <section className="mt-3 space-y-2.5 border-t border-slate-100 pt-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#111827]">Geometry &amp; Constraints</h3>
            <span className="text-[8px] font-medium text-[#0040DF]">Flex Row</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex h-7 min-w-0 items-center gap-1 rounded-md border border-[#e1e4ee] bg-white px-1.5 text-[9px] text-slate-600">
              W
              <input
                type="number"
                aria-label="Text width"
                min="1"
                value={textStyle.width === undefined ? textWidth : Number.parseFloat(String(textStyle.width))}
                onChange={(event) => onStyleChange({
                  width: event.target.value ? Math.max(1, Number(event.target.value)) : undefined,
                })}
                className="min-w-0 flex-1 bg-transparent text-[10px] text-slate-700 outline-none"
              />
              <span className="text-[8px] text-slate-500">px</span>
            </label>
            <label className="flex h-7 min-w-0 items-center gap-1 rounded-md border border-[#e1e4ee] bg-white px-1.5 text-[9px] text-slate-600">
              H
              <input
                type="number"
                aria-label="Text height"
                min="1"
                value={textStyle.height === undefined ? textHeight : Number.parseFloat(String(textStyle.height))}
                onChange={(event) => onStyleChange({
                  height: event.target.value ? Math.max(1, Number(event.target.value)) : undefined,
                })}
                className="min-w-0 flex-1 bg-transparent text-[10px] text-slate-700 outline-none"
              />
              <span className="text-[8px] text-slate-500">px</span>
            </label>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              aria-label="Auto width"
              aria-pressed={textStyle.width === undefined}
              onClick={() => onStyleChange({ width: undefined })}
              className={`flex h-6 items-center justify-center gap-1 rounded text-[8px] ${
                textStyle.width === undefined ? 'bg-[#eee4ff] text-[#6036a8]' : 'bg-[#f7f8fc] text-slate-500'
              }`}
            ><Move className="h-2.5 w-2.5" />Auto Width</button>
            <button
              type="button"
              aria-label="Auto height"
              aria-pressed={textStyle.height === undefined}
              onClick={() => onStyleChange({ height: undefined })}
              className={`flex h-6 items-center justify-center gap-1 rounded text-[8px] ${
                textStyle.height === undefined ? 'bg-[#eee4ff] text-[#6036a8]' : 'bg-[#f7f8fc] text-slate-500'
              }`}
            ><Move className="h-2.5 w-2.5" />Auto Height</button>
            <button
              type="button"
              aria-label="Fixed width and height"
              aria-pressed={textStyle.width !== undefined && textStyle.height !== undefined}
              onClick={() => onStyleChange({ width: textWidth, height: textHeight })}
              className={`flex h-6 items-center justify-center gap-1 rounded text-[8px] ${
                textStyle.width !== undefined && textStyle.height !== undefined
                  ? 'bg-[#eee4ff] text-[#6036a8]' : 'bg-[#f7f8fc] text-slate-500'
              }`}
            ><Square className="h-2.5 w-2.5" />Fixed</button>
          </div>
        </section>

        <section className="mt-3 space-y-2 border-t border-slate-100 pt-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#111827]">Color &amp; Fill</h3>
            <span className="text-[8px] text-slate-500">Primary Contrast OK</span>
          </div>
          <div className="flex h-8 items-center gap-1.5">
            <ColorPickerButton
              title="Text color"
              color={textColor}
              onChange={(hex) => onStyleChange({ color: hex })}
              className="h-7 w-7 shrink-0 cursor-pointer rounded-md border border-[#c8b7ee] bg-white p-0.5"
            >
              <span className="block h-full w-full rounded" style={{ background: textColor }} />
            </ColorPickerButton>
            <div className="flex h-7 min-w-0 flex-1 items-center rounded-md bg-[#f1f3ff] px-2">
              <span className="mr-1 text-[9px] text-slate-600">#</span>
              <input
                type="text"
                aria-label="Text color hex"
                value={textColor.replace('#', '').toUpperCase()}
                onChange={(event) => {
                  const value = event.target.value.replace(/[^0-9a-f]/gi, '').slice(0, 6);
                  if (value.length === 6) onStyleChange({ color: `#${value}` });
                }}
                className="min-w-0 flex-1 bg-transparent font-mono text-[9px] text-slate-700 outline-none"
              />
            </div>
            <div className="flex h-7 w-[58px] shrink-0 items-center rounded-md bg-[#f1f3ff] px-1.5">
              <input
                type="number"
                aria-label="Text opacity"
                min="0"
                max="100"
                value={textOpacity}
                onChange={(event) => onStyleChange({
                  opacity: Math.min(100, Math.max(0, Number(event.target.value))) / 100,
                })}
                className="min-w-0 flex-1 bg-transparent text-right text-[9px] text-slate-700 outline-none"
              />
              <span className="ml-1 text-[9px] text-slate-500">%</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[8px] text-slate-600">Apex Base Palette Swatches</span>
              <span className="text-[8px] text-slate-500">1-Click Apply</span>
            </div>
            <div className="flex items-center gap-1.5">
              {colorSwatches.map((swatch, index) => (
                <button
                  key={swatch}
                  type="button"
                  aria-label={`Apply ${swatch} text color`}
                  aria-pressed={textColor.toLowerCase() === swatch.toLowerCase()}
                  onClick={() => onStyleChange({ color: swatch })}
                  className={`relative h-[22px] w-[22px] shrink-0 rounded-full border border-white ${
                    index === 0 ? 'ring-1 ring-[#c6b5ec]' : ''
                  }`}
                  style={{ backgroundColor: swatch }}
                >
                  {textColor.toLowerCase() === swatch.toLowerCase() && (
                    <Check className={`absolute inset-0 m-auto h-3 w-3 ${index === 0 ? 'text-[#0040DF]' : 'text-white'}`} />
                  )}
                </button>
              ))}
              <ColorPickerButton
                title="Choose another text color"
                color={textColor}
                onChange={(hex) => onStyleChange({ color: hex })}
                className="grid h-[22px] w-[22px] shrink-0 cursor-pointer place-items-center rounded-full border border-slate-200 bg-white text-[13px] text-slate-500 hover:border-[#0040DF]"
              >
                +
              </ColorPickerButton>
            </div>
          </div>

          <button
            type="button"
            aria-pressed={!!textStyle.WebkitTextStroke}
            onClick={() => onStyleChange({
              WebkitTextStroke: textStyle.WebkitTextStroke ? undefined : '1px #0f172a',
            })}
            className="flex h-7 w-full items-center justify-between rounded-md bg-[#f7f8fc] px-2 text-left text-[9px] text-slate-700"
          >
            <span className="flex items-center gap-1.5"><Underline className="h-3 w-3" />Text Stroke</span>
            <span className={`flex h-3 w-6 items-center rounded-full p-0.5 ${textStyle.WebkitTextStroke ? 'bg-[#0040DF]' : 'bg-[#d0c8d8]'}`}>
              <span className={`h-2 w-2 rounded-full bg-white transition-transform ${textStyle.WebkitTextStroke ? 'translate-x-3' : ''}`} />
            </span>
          </button>
          <button
            type="button"
            aria-pressed={!!textStyle.textShadow}
            onClick={() => onStyleChange({
              textShadow: textStyle.textShadow ? undefined : '0 2px 6px rgba(15, 23, 42, 0.18)',
            })}
            className="flex h-7 w-full items-center justify-between rounded-md bg-[#f7f8fc] px-2 text-left text-[9px] text-slate-700"
          >
            <span className="flex items-center gap-1.5"><Layers className="h-3 w-3" />Drop Shadow</span>
            <span className={`flex h-3 w-6 items-center rounded-full p-0.5 ${textStyle.textShadow ? 'bg-[#0040DF]' : 'bg-[#d0c8d8]'}`}>
              <span className={`h-2 w-2 rounded-full bg-white transition-transform ${textStyle.textShadow ? 'translate-x-3' : ''}`} />
            </span>
          </button>
        </section>

        <details
          open={textEditorOpen}
          onToggle={(event) => setTextEditorOpen((event.target as HTMLDetailsElement).open)}
          className="mt-3 border-t border-slate-100 pt-2.5"
        >
          <summary className="cursor-pointer text-[9px] font-medium text-slate-500">Edit {textLabel}</summary>
          <textarea
            aria-label={`Edit ${textLabel}`}
            value={textValue}
            onChange={(event) => onTextChange(event.target.value)}
            rows={2}
            className="mt-2 w-full resize-y rounded-md border border-slate-200 bg-[#f7f8fc] px-2 py-1.5 text-[10px] outline-none focus:border-[#0040DF] focus:bg-white"
          />
          <button
            type="button"
            onClick={() => onStyleChange(null)}
            className="mt-2 text-[9px] font-medium text-slate-500 hover:text-rose-500"
          >Reset formatting</button>
        </details>
      </div>
    </div>
  );
}

function RightPanel({
  tab, onTab, selectedId: moduleSelectedId, accent, wsStatus, workflowOpen, onToggleWorkflow,
  box: moduleBox, measured, onBoxChange: onModuleBoxChange, onResetBox,
  workspaceShape, onWorkspaceShapeBoxChange,
  onSelectVariant,
  overrides, textStyles, setText, setColor, setTextStyle, onResetModuleOverrides,
  activeTextSlot, setActiveTextSlot,
  elementBoxes, hiddenElements, activeElementId, setActiveElementId, setElementBox,
  resetElementBoxes, deleteElement,
  onCollapse, codeSources, codeScreenName,
  logic, setLogic, logicState, appScheme, pageId, onPreview,
}: {
  codeSources: CodeSource[];
  codeScreenName: string;
  logic: LogicMap;
  setLogic: React.Dispatch<React.SetStateAction<LogicMap>>;
  logicState: LogicState;
  appScheme: string;
  pageId: PageId;
  onPreview: () => void;
  tab: RightTab; onTab: (t: RightTab) => void;
  selectedId: ModuleId | null; accent: string;
  wsStatus: 'active' | 'connecting' | 'disconnected';
  workflowOpen: boolean; onToggleWorkflow: () => void;
  box: ModuleBox;
  measured: { w: number; h: number } | null;
  onBoxChange: (id: ModuleId, patch: ModuleBox) => void;
  onResetBox: (id: ModuleId) => void;
  workspaceShape: WorkspaceShape | null;
  onWorkspaceShapeBoxChange: (id: string, patch: ModuleBox) => void;
  onSelectVariant: (variant: ComponentVariant) => void;
  overrides: Record<string, { text: Record<string, string>; colors: Record<string, string> }>;
  textStyles: Record<string, Record<string, EditableTextStyle>>;
  setText: (moduleId: ModuleId, slot: string, value: string | null) => void;
  setColor: (moduleId: ModuleId, slot: string, value: string | null) => void;
  setTextStyle: (moduleId: ModuleId, slot: string, patch: Partial<EditableTextStyle> | null) => void;
  onResetModuleOverrides: (moduleId: ModuleId) => void;
  activeTextSlot: string | null;
  setActiveTextSlot: (slot: string | null) => void;
  elementBoxes: Record<string, Record<string, ElementBox>>;
  hiddenElements: Record<string, string[]>;
  activeElementId: string | null;
  setActiveElementId: (id: string | null) => void;
  setElementBox: (moduleId: string, elementId: string, patch: Partial<ElementBox> | null) => void;
  resetElementBoxes: (moduleId: string) => void;
  deleteElement: (moduleId: string, elementId: string) => void;
  onCollapse: () => void;
}) {
  const [showCornerRadius, setShowCornerRadius] = useState(false);
  const [showFillColorPicker, setShowFillColorPicker] = useState(false);
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const [showSchemaColorPicker, setShowSchemaColorPicker] = useState<string | null>(null);
  const [showEffects, setShowEffects] = useState(false);
  const [colorPickerPosition, setColorPickerPosition] = useState<PickerPosition | null>(null);
  const [effectsPosition, setEffectsPosition] = useState<PickerPosition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: { id: RightTab; label: string }[] = [
    { id: 'design', label: 'Design' }, { id: 'layout', label: 'Layout' },
    { id: 'logic', label: 'Logic' }, { id: 'data', label: 'Data' }, { id: 'code', label: 'Code' },
  ];
  const selectedId = workspaceShape
    ? `${workspaceShape.type === 'frame' ? 'frame' : workspaceShape.type}-${workspaceShape.id}` as ModuleId
    : moduleSelectedId;
  const box = workspaceShape?.box ?? moduleBox;
  const onBoxChange = workspaceShape
    ? (_id: ModuleId, patch: ModuleBox) => onWorkspaceShapeBoxChange(workspaceShape.id, patch)
    : onModuleBoxChange;
  const mod = selectedId ? moduleFor(selectedId) : null;
  const selectedShapeTitle = canvasObjectTitle(selectedId, box);
  const selectedTitle = mod?.title ?? selectedShapeTitle;
  const selectedSubtitle = mod?.subtitle ?? (selectedShapeTitle ? 'Canvas shape' : null);
  const schema = selectedId ? EDITABLE_SCHEMA[selectedId] : undefined;
  const mOver = selectedId ? overrides[selectedId] : undefined;
  const activeTextField = schema?.text?.find((field) => field.slot === activeTextSlot);
  const activeTextValue = activeTextSlot && selectedId
    ? mOver?.text[activeTextSlot] ?? activeTextField?.defaultValue ?? ''
    : '';
  const activeTextStyle = activeTextSlot && selectedId
    ? textStyles[selectedId]?.[activeTextSlot] ?? {}
    : {};
  const hasOverrides = !!mOver && (Object.keys(mOver.text).length > 0 || Object.keys(mOver.colors).length > 0)
    || !!selectedId && Object.keys(textStyles[selectedId] ?? {}).length > 0;

  const cornerRadii: CornerRadii = box.cornerRadius ?? {
    topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0,
  };
  const corners: { key: keyof CornerRadii; label: string }[] = [
    { key: 'topLeft', label: 'TL' },
    { key: 'topRight', label: 'TR' },
    { key: 'bottomLeft', label: 'BL' },
    { key: 'bottomRight', label: 'BR' },
  ];
  const cornerRadiusLinked = box.cornerRadiusLinked !== false;

  const suggestedParts = React.useMemo(() => {
    if (!selectedId || selectedId.startsWith('shape-')) return [];
    const list: { id: string; label: string }[] = [];
    const s = EDITABLE_SCHEMA[selectedId as keyof typeof EDITABLE_SCHEMA];
    if (s?.text) {
      for (const t of (s.text as { slot: string; label: string }[])) {
        list.push({ id: t.slot, label: t.label });
      }
    }
    // Additional named elements for well-known modules
    const heroSuggestions: Record<string, { id: string; label: string }[]> = {
      homeHeroBalance: [
        { id: 'transfer', label: 'Transfer Button' },
        { id: 'receive', label: 'Receive Button' },
        { id: 'cards', label: 'Cards Button' },
      ],
      accounts: [
        { id: 'cta', label: 'CTA Button' },
      ],
      transfers: [
        { id: 'sendLabel', label: 'Send Icon' },
        { id: 'paymentsLabel', label: 'Payments Icon' },
        { id: 'payBillLabel', label: 'Pay Bill Icon' },
        { id: 'topUpLabel', label: 'Top Up Icon' },
      ],
      homeBlueHero: [
        { id: 'deposit', label: 'Deposit Button' },
        { id: 'transfer', label: 'Transfer Button' },
      ],
    };
    const extras = heroSuggestions[selectedId] ?? [];
    for (const e of extras) {
      if (!list.find((x) => x.id === e.id)) list.unshift(e);
    }
    const seen = new Set<string>();
    return list.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [selectedId]);

  const toggleColorPicker = (
    event: React.MouseEvent<HTMLButtonElement>,
    kind: 'fill' | string,
  ) => {
    if ((kind === 'fill' && showFillColorPicker) || showSchemaColorPicker === kind) {
      setShowFillColorPicker(false);
      setShowSchemaColorPicker(null);
      setColorPickerPosition(null);
      return;
    }

    const anchor = event.currentTarget.getBoundingClientRect();
    const panel = event.currentTarget.closest('aside')?.getBoundingClientRect();
    const pickerWidth = 288;
    const gap = 8;
    setColorPickerPosition({
      top: Math.max(8, Math.min(anchor.top, window.innerHeight - 500)),
      left: Math.max(8, (panel?.left ?? anchor.left) - pickerWidth - gap),
    });
    setShowFillColorPicker(kind === 'fill');
    setShowSchemaColorPicker(kind === 'fill' ? null : kind);
  };

  const closeColorPicker = () => {
    setShowFillColorPicker(false);
    setShowSchemaColorPicker(null);
    setColorPickerPosition(null);
  };

  const toggleEffects = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (showEffects) {
      setShowEffects(false);
      setEffectsPosition(null);
      return;
    }
    const anchor = event.currentTarget.getBoundingClientRect();
    const panel = event.currentTarget.closest('aside')?.getBoundingClientRect();
    const pickerWidth = 320;
    const gap = 8;
    setEffectsPosition({
      top: Math.max(8, Math.min(anchor.top, window.innerHeight - 500)),
      left: Math.max(8, (panel?.left ?? anchor.left) - pickerWidth - gap),
    });
    setShowEffects(true);
  };

  const updateCornerRadius = (corner: keyof CornerRadii, value: number) => {
    const cornerRadius = cornerRadiusLinked
      ? { topLeft: value, topRight: value, bottomRight: value, bottomLeft: value }
      : { ...cornerRadii, [corner]: value };
    onBoxChange(selectedId!, { cornerRadius, shapeType: undefined });
  };

  const updatePadding = (side: keyof Insets, value: string) => {
    onBoxChange(selectedId!, {
      padding: {
        top: box.padding?.top ?? 0,
        right: box.padding?.right ?? 0,
        bottom: box.padding?.bottom ?? 0,
        left: box.padding?.left ?? 0,
        [side]: Math.max(0, Number(value) || 0),
      },
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        onBoxChange(selectedId!, {
          fillType: 'image',
          imageFill: {
            url,
            name: file.name,
            fit: 'fill',
            opacity: 100,
            visible: true
          }
        });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Text layers (Text tool) open the text formatting panel when selected or clicked.
  // Closing it shows the layer's regular properties until its text is clicked again.
  const isTextLayer = !!selectedId?.startsWith('shape-text-');
  const [textPanelClosed, setTextPanelClosed] = useState(false);
  const [textPanelFor, setTextPanelFor] = useState(selectedId);
  if (textPanelFor !== selectedId) {
    setTextPanelFor(selectedId);
    setTextPanelClosed(false);
  }
  useEffect(() => {
    const reopen = () => setTextPanelClosed(false);
    window.addEventListener(TEXT_LAYER_CLICK_EVENT, reopen);
    return () => window.removeEventListener(TEXT_LAYER_CLICK_EVENT, reopen);
  }, []);

  // On the Logic tab, clicking text inside a button targets the button's logic instead.
  if (isTextLayer && !textPanelClosed && !activeTextSlot && selectedId && tab !== 'logic') {
    return (
      <aside className="flex w-full min-w-0 flex-col border-l border-slate-200 bg-white">
        <div className="flex h-10 shrink-0 items-center justify-end border-b border-slate-100 px-2">
          <button
            type="button"
            title="Collapse right panel"
            aria-label="Collapse right panel"
            onClick={onCollapse}
            className="grid h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-[#0040DF]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <TextFormattingPanel
          textLabel={box.name ?? 'Text layer'}
          textValue={box.text ?? ''}
          textStyle={textLayerStyle(box)}
          onTextChange={(value) => onBoxChange(selectedId, { text: value })}
          onStyleChange={(patch) => onBoxChange(selectedId, textLayerPatch(box, patch))}
          onClose={() => setTextPanelClosed(true)}
        />
      </aside>
    );
  }

  // Conditional Render for Text Formatting Panel
  if (activeTextSlot && tab !== 'logic') {
    return (
      <aside className="flex w-full min-w-0 flex-col border-l border-slate-200 bg-white">
        <div className="flex h-10 shrink-0 items-center justify-end border-b border-slate-100 px-2">
          <button
            type="button"
            title="Collapse right panel"
            aria-label="Collapse right panel"
            onClick={onCollapse}
            className="grid h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-[#0040DF]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <TextFormattingPanel 
          textLabel={activeTextField?.label ?? activeTextSlot}
          textValue={activeTextValue}
          textStyle={activeTextStyle}
          onTextChange={(value) => {
            if (selectedId) setText(selectedId, activeTextSlot, value);
          }}
          onStyleChange={(patch) => {
            if (selectedId) setTextStyle(selectedId, activeTextSlot, patch);
          }}
          onClose={() => setActiveTextSlot(null)} 
        />
      </aside>
    );
  }

  // Standard Right Panel Render
  return (
    <aside className="flex w-full min-w-0 flex-col border-l border-slate-200 bg-white">
      <div className="flex border-b border-slate-200">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => onTab(t.id)}
              className={`relative flex-1 py-2.5 text-[9px] font-bold uppercase tracking-wider ${active ? 'text-[#0040DF]' : 'text-slate-400 hover:text-slate-700'}`}>
              {t.label}
              {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#0040DF]" />}
            </button>
          );
        })}
        <button
          type="button"
          title="Collapse right panel"
          aria-label="Collapse right panel"
          onClick={onCollapse}
          className="grid h-8 w-8 shrink-0 place-items-center self-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-[#0040DF]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {tab === 'code' ? (
          <CodeTab
            sources={codeSources}
            overrides={overrides}
            screenName={codeScreenName}
            selectedId={moduleSelectedId}
          />
        ) : !selectedTitle || !selectedSubtitle ? (
          <div className="flex flex-col items-center justify-center gap-2.5 px-4 py-16 text-center">
            <Diamond className="h-6 w-6 text-slate-300" />
            <p className="text-[12px] text-slate-400">
              {tab === 'logic'
                ? <>Select a component, or a button inside it,<br />to add events, triggers and rules</>
                : <>Select a component on the phone<br />to edit its properties</>}
            </p>
          </div>
        ) : tab === 'logic' ? (
          <LogicTab
            key={logicKey(selectedId!, workspaceShape ? null : activeElementId)}
            moduleId={selectedId!}
            componentTitle={selectedTitle}
            elementId={workspaceShape ? null : activeElementId}
            pageId={pageId}
            logic={logic}
            setLogic={setLogic}
            state={logicState}
            scheme={appScheme}
            onSelectElement={(id) => {
              setActiveElementId(id);
              setActiveTextSlot(null);
            }}
          />
        ) : tab === 'layout' ? (
          <LayoutTab
            box={box}
            measured={measured}
            supportsAutoLayout={!!mod && !workspaceShape}
            onChange={(patch) => onBoxChange(selectedId!, patch)}
          />
        ) : (
          <>
            <div className="border-b border-slate-200 px-3 py-2.5">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <Diamond className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                    <p className="truncate text-[11px] font-bold">{selectedTitle}</p>
                  </div>
                  {mod && (
                    <span className="ml-2 rounded bg-indigo-100 px-1.5 py-0.5 text-[11px] font-bold text-indigo-700">Master</span>
                  )}
                </div>
                <p className="mt-1 truncate text-[9px] text-slate-500">{selectedSubtitle}</p>
                {/* Variants only exist for library components, not frames, shapes, text or assets. */}
                {mod && (
                <div className="mt-2 border-t border-slate-200 pt-2">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Variant State</span>
                    <span className="text-[11px] font-semibold text-[#0040DF]">3 variants</span>
                  </div>
                  <div className="flex gap-1 rounded-md border border-slate-200 bg-white p-0.5">
                    {(['Default', 'Masked', 'Negative'] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={(box.variant ?? 'Default') === v}
                        onClick={() => onSelectVariant(v)}
                        className={`flex-1 rounded py-1 text-[11px] font-semibold transition ${
                          (box.variant ?? 'Default') === v ? 'bg-[#0040DF] text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                        }`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Layout & Box Model */}
            <section className="border-b border-slate-200 px-3 py-3">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Layout &amp; Box Model</span>
                <span className="text-[8px] font-semibold text-[#0040DF]">Flex Col</span>
              </div>
              <div className="mb-3 grid grid-cols-2 gap-1">
                {([
                  { key: 'x' as const, label: 'X', value: box.x ?? 0 },
                  { key: 'y' as const, label: 'Y', value: box.y ?? 0 },
                  { key: 'w' as const, label: 'W', value: box.w ?? measured?.w ?? '' },
                  { key: 'h' as const, label: 'H', value: box.h ?? measured?.h ?? '' },
                ]).map(({ key, label, value }) => (
                  <label key={key} className="flex h-7 items-center gap-2 rounded-md border border-slate-100 bg-[#F3F4FF] px-2">
                    <span className="text-[8px] font-semibold text-slate-400">{label}</span>
                    <input type="number" value={value}
                      onChange={(e) => onBoxChange(selectedId!, { [key]: e.target.value === '' ? undefined : Number(e.target.value) } as ModuleBox)}
                      className="w-full bg-transparent text-right text-[9px] font-semibold text-slate-700 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                    <span className="text-[8px] text-slate-400">px</span>
                  </label>
                ))}
              </div>
              <div className="mb-3 grid grid-cols-2 gap-1">
                {([
                  { key: 'rotation' as const, label: 'Rotation', value: box.rotation ?? 0, suffix: '°' },
                  { key: 'opacity' as const, label: 'Opacity', value: box.opacity ?? 100, suffix: '%' },
                ]).map(({ key, label, value, suffix }) => (
                  <label key={key} className="flex h-7 items-center gap-2 rounded-md border border-slate-100 bg-[#F3F4FF] px-2">
                    <span className="text-[8px] font-semibold text-slate-400">{label}</span>
                    <input type="number" min={key === 'opacity' ? 0 : undefined} max={key === 'opacity' ? 100 : undefined} value={value}
                      onChange={(e) => onBoxChange(selectedId!, {
                        [key]: key === 'opacity' ? Math.max(0, Math.min(100, Number(e.target.value) || 0)) : Number(e.target.value) || 0,
                      })}
                      className="w-full bg-transparent text-right text-[9px] font-semibold text-slate-700 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                    <span className="text-[8px] text-slate-400">{suffix}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Padding / Gap */}
            <section className="border-b border-slate-200 px-3 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Padding / Gap</span>
                <span className="text-[8px] font-semibold text-[#0040DF]">Fill container</span>
              </div>
              <div className="rounded-lg border border-dashed border-slate-200 p-2">
                <label className="mb-1 flex items-center justify-between">
                  <span className="text-[8px] font-semibold text-slate-400">Top</span>
                  <input
                    type="number"
                    min="0"
                    aria-label="Top padding"
                    value={box.padding?.top ?? 0}
                    onChange={(event) => updatePadding('top', event.target.value)}
                    className="h-6 w-9 rounded border border-slate-200 bg-white px-1 text-center text-[9px] font-semibold text-slate-700 outline-none focus:border-[#0040DF]"
                  />
                  <span className="text-[8px] text-slate-400">px</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-1 rounded border border-slate-100 bg-[#F3F4FF] px-2 py-1">
                    <span className="text-[8px] text-slate-400">L</span>
                    <input
                      type="number"
                      min="0"
                      aria-label="Left padding"
                      value={box.padding?.left ?? 0}
                      onChange={(event) => updatePadding('left', event.target.value)}
                      className="h-5 w-8 rounded border border-slate-200 bg-white text-center text-[9px] font-semibold text-slate-700 outline-none focus:border-[#0040DF]"
                    />
                    <span className="text-[8px] text-slate-400">px</span>
                  </div>
                  <div className="flex flex-[2] items-center justify-center rounded border border-blue-200 bg-blue-50 px-2 py-1 text-[9px] font-semibold text-[#0040DF]">
                    {box.w ?? measured?.w ?? 361} × {box.h ?? measured?.h ?? 168} (Fill Container)
                  </div>
                  <div className="flex flex-1 items-center gap-1 rounded border border-slate-100 bg-[#F3F4FF] px-2 py-1">
                    <span className="text-[8px] text-slate-400">R</span>
                    <input
                      type="number"
                      min="0"
                      aria-label="Right padding"
                      value={box.padding?.right ?? 0}
                      onChange={(event) => updatePadding('right', event.target.value)}
                      className="h-5 w-8 rounded border border-slate-200 bg-white text-center text-[9px] font-semibold text-slate-700 outline-none focus:border-[#0040DF]"
                    />
                    <span className="text-[8px] text-slate-400">px</span>
                  </div>
                </div>
                <label className="mt-1 flex items-center justify-center gap-1">
                  <span className="text-[8px] font-semibold text-slate-400">Bottom</span>
                  <input
                    type="number"
                    min="0"
                    aria-label="Bottom padding"
                    value={box.padding?.bottom ?? 0}
                    onChange={(event) => updatePadding('bottom', event.target.value)}
                    className="h-6 w-9 rounded border border-slate-200 bg-white px-1 text-center text-[9px] font-semibold text-slate-700 outline-none focus:border-[#0040DF]"
                  />
                  <span className="text-[8px] text-slate-400">px</span>
                </label>
              </div>
            </section>

            {/* Corner Radius */}
            <section className="border-b border-slate-200 px-3 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-semibold text-slate-700">Corner Radius</span>
                <button
                  type="button"
                  onClick={() => setShowCornerRadius((v) => !v)}
                  className="flex items-center gap-1 rounded px-1.5 py-1 text-[8px] font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {showCornerRadius ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  4 Corners
                </button>
              </div>

              <div className="flex gap-2 relative">
                <div className="flex h-7 w-full items-center gap-2 rounded-md border border-slate-100 bg-[#F3F4FF] px-2">
                  <CornerIcon type="tl" />
                  <input
                    type="number"
                    value={cornerRadii.topLeft}
                    onChange={(e) => updateCornerRadius('topLeft', Math.max(0, Number(e.target.value) || 0))}
                    className="w-full bg-transparent text-right text-[9px] font-semibold text-slate-700 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-[8px] text-slate-400">px</span>
                </div>
                
                {/* Shape Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowShapeDropdown(!showShapeDropdown)}
                    className="flex h-7 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[9px] font-semibold text-[#0040DF] hover:bg-slate-50 capitalize"
                  >
                    {box.shapeType === 'sharp' ? <Square className="h-3 w-3" /> :
                     box.shapeType === 'pill' ? <Minus className="h-3 w-3" /> :
                     box.shapeType === 'squircle' ? <Diamond className="h-3 w-3" /> :
                     <Square className="h-3 w-3 rounded-[2px]" />}
                    <span>{box.shapeType ?? 'rounded'}</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </button>

                  {showShapeDropdown && (
                    <div className="absolute right-0 top-full z-50 mt-1 w-24 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                      {COMPONENT_SHAPES.map((shape) => (
                        <button
                          key={shape}
                          type="button"
                          onClick={() => {
                            onBoxChange(selectedId!, { shapeType: shape });
                            setShowShapeDropdown(false);
                          }}
                          className="flex w-full items-center gap-2 px-2 py-1 text-left text-[9px] font-medium text-slate-700 hover:bg-slate-100 capitalize"
                        >
                          {shape === 'sharp' ? <Square className="h-3 w-3" /> :
                           shape === 'pill' ? <Minus className="h-3 w-3" /> :
                           shape === 'squircle' ? <Diamond className="h-3 w-3" /> :
                           <Square className="h-3 w-3 rounded-[2px]" />}
                          {shape}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {showCornerRadius && (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                  {corners.map(({ key }) => {
                    const isBottomRight = key === 'bottomRight';
                    return (
                      <label key={key} className="flex h-[38px] items-center gap-2 rounded-lg bg-[#F4F5F8] px-3">
                        <CornerIcon type={key === 'topLeft' ? 'tl' : key === 'topRight' ? 'tr' : key === 'bottomLeft' ? 'bl' : 'br'} />
                        <input type="number" min={0} value={cornerRadii[key]}
                          onChange={(e) => updateCornerRadius(key, Math.max(0, Number(e.target.value) || 0))}
                          className="w-full bg-transparent text-[12px] font-medium text-slate-700 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                        {isBottomRight && (
                          <button type="button" onClick={() => onBoxChange(selectedId!, { cornerRadiusLinked: !cornerRadiusLinked })}
                            className={`ml-auto rounded p-1 transition hover:bg-slate-200 ${cornerRadiusLinked ? 'text-[#0040DF]' : 'text-slate-400'}`}>
                            <HexagonLinkIcon />
                          </button>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Fills */}
            <section className="relative border-b border-slate-200 bg-[#F6F7FF] px-3 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Fills</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onBoxChange(selectedId!, { fillType: 'color', fillColor: box.fillColor || '#6D28D9', fillGradient: undefined })}
                    className="flex items-center gap-1 text-[10px] font-semibold text-[#0040DF] hover:underline"
                  >
                    <Plus className="h-3 w-3" /> Fill
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-[10px] font-semibold text-[#0040DF] hover:underline"
                  >
                    <ImageIcon className="h-3 w-3" /> Image
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                </div>
              </div>

              <div className="space-y-2">
                {/* 0. A recolourable icon's own colour (the fills below sit behind it) */}
                {box.iconColor && (
                  <div className="relative flex items-center gap-2 rounded-lg border border-white bg-white p-2 shadow-sm">
                    <button
                      type="button"
                      aria-label="Choose icon color"
                      onClick={(e) => toggleColorPicker(e, ICON_COLOR_PICKER)}
                      className="h-7 w-7 shrink-0 rounded border border-slate-300 shadow-sm"
                      style={{ background: box.iconColor }}
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-[11px] font-semibold text-slate-700">Icon color</span>
                      <input
                        key={box.iconColor}
                        type="text"
                        defaultValue={box.iconColor}
                        aria-label="Icon color hex code"
                        spellCheck={false}
                        onBlur={(e) => {
                          const value = e.target.value.trim();
                          if (CSS_HEX_COLOR.test(value)) onBoxChange(selectedId!, { iconColor: value });
                          else e.target.value = box.iconColor ?? '';
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') e.currentTarget.blur();
                        }}
                        className="bg-transparent font-mono text-[9px] uppercase text-slate-500 outline-none"
                      />
                    </div>
                    {showSchemaColorPicker === ICON_COLOR_PICKER && colorPickerPosition && (
                      <AdvancedColorPicker
                        color={box.iconColor}
                        position={colorPickerPosition}
                        title="Icon color"
                        onClose={closeColorPicker}
                        onChange={(hex) => onBoxChange(selectedId!, { iconColor: hex })}
                      />
                    )}
                  </div>
                )}

                {/* 1. Generic Color Fill */}
                {box.fillType === 'color' && (
                  <div className="relative flex items-center gap-2 rounded-lg border border-white bg-white p-2 shadow-sm">
                    <button
                      type="button"
                      aria-label="Choose fill color"
                      onClick={(e) => toggleColorPicker(e, 'fill')}
                      className="h-7 w-7 shrink-0 rounded border border-slate-300 shadow-sm"
                      style={{
                        background: box.fillGradient
                          ? box.fillGradient.type === 'Linear'
                            ? `linear-gradient(${box.fillGradient.angle}deg, ${box.fillGradient.startColor}, ${box.fillGradient.endColor})`
                            : `radial-gradient(circle, ${box.fillGradient.startColor}, ${box.fillGradient.endColor})`
                          : box.fillColor || '#6D28D9',
                      }}
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-[11px] font-semibold text-slate-700">
                        {box.fillGradient ? `${box.fillGradient.type} Gradient` : 'Solid Color'}
                      </span>
                      <span className="font-mono text-[9px] uppercase text-slate-500">{box.fillColor || '#6D28D9'}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600">100%</span>
                    <button className="text-slate-400 hover:text-slate-600"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => onBoxChange(selectedId!, { fillType: 'none' })} className="text-slate-400 hover:text-rose-500">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border border-current"><div className="h-px w-2 rotate-45 bg-current" /></div>
                    </button>

                    {showFillColorPicker && colorPickerPosition && (
                      <AdvancedColorPicker
                        color={box.fillColor || '#6D28D9'}
                        gradient={box.fillGradient}
                        position={colorPickerPosition}
                        title="Fill color"
                        onClose={closeColorPicker}
                        onChange={(c) => onBoxChange(selectedId!, {
                          fillColor: c,
                          fillGradient: box.fillGradient ? { ...box.fillGradient, startColor: c } : undefined,
                        })}
                        onGradientChange={(fillGradient) => onBoxChange(selectedId!, {
                          fillGradient: fillGradient ?? undefined,
                          fillColor: fillGradient?.startColor ?? box.fillColor,
                        })}
                      />
                    )}
                  </div>
                )}

                {/* 2. Generic Image Fill */}
                {box.fillType === 'image' && box.imageFill && (
                  <div className="relative mb-2 space-y-2 rounded-lg border border-white bg-white p-2 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-100">
                        <img src={box.imageFill.url} alt="fill" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-[11px] font-semibold text-slate-800">Image Fill</span>
                          <span className="rounded bg-blue-50 px-1 py-0.5 text-[7px] font-bold tracking-wide text-blue-600">PATTERN</span>
                        </div>
                        <span className="truncate text-[9px] text-slate-500">{box.imageFill.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{box.imageFill.opacity}%</span>
                      <button onClick={() => onBoxChange(selectedId!, { imageFill: { ...box.imageFill!, visible: !box.imageFill!.visible } })} className="text-slate-400 hover:text-slate-600">
                        {box.imageFill.visible !== false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => onBoxChange(selectedId!, { fillType: 'none' })} className="text-slate-400 hover:text-rose-500">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full border border-current"><div className="h-px w-2 rotate-45 bg-current" /></div>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => fileInputRef.current?.click()} className="flex flex-1 items-center justify-between rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-700 hover:bg-slate-50">
                        <span className="flex items-center gap-1"><ImageIcon className="h-3 w-3 text-blue-500" /> Choose...</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      <div className="flex flex-1 items-center justify-between rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-700">
                        <span className="capitalize">{box.imageFill.fit}</span>
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                    <div className="flex rounded-md border border-slate-100 bg-white p-0.5">
                      {(['fill', 'fit', 'crop', 'tile'] as const).map((f) => (
                        <button key={f} onClick={() => onBoxChange(selectedId!, { imageFill: { ...box.imageFill!, fit: f } })}
                          className={`flex-1 rounded-md py-1 text-[9px] font-semibold capitalize transition ${box.imageFill!.fit === f ? 'bg-[#F0E9FF] text-[#6941C6]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Component Specific Colors (Schema) */}
                {schema?.colors && schema.colors.length > 0 && (
                  <div className="space-y-2">
                    {schema.colors.map((c) => {
                      const current = mOver?.colors[c.slot] ?? c.defaultValue;
                      const overridden = !!mOver?.colors[c.slot];
                      return (
                        <div key={c.slot} className="relative flex items-center gap-2 rounded-lg border border-white bg-white p-2 shadow-sm">
                          <button
                            type="button"
                            aria-label={`Choose ${c.label}`}
                            onClick={(e) => toggleColorPicker(e, c.slot)}
                            className="h-7 w-7 shrink-0 rounded border border-slate-300 shadow-sm"
                            style={{ background: current }}
                          />
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="text-[11px] font-semibold text-slate-700">{c.label}</span>
                            <input
                              type="text"
                              value={current}
                              onChange={(e) => setColor(selectedId!, c.slot, e.target.value)}
                              className="bg-transparent font-mono text-[9px] uppercase text-slate-500 outline-none focus:border-[#0040DF]"
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-600">100%</span>
                          <button className="text-slate-400 hover:text-slate-600"><Eye className="h-4 w-4" /></button>
                          {overridden && (
                            <button onClick={() => setColor(selectedId!, c.slot, null)} className="text-slate-400 hover:text-rose-500">
                              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-current"><div className="h-px w-2 rotate-45 bg-current" /></div>
                            </button>
                          )}

                          {showSchemaColorPicker === c.slot && colorPickerPosition && (
                            <AdvancedColorPicker
                              color={current}
                              position={colorPickerPosition}
                              title={`Edit ${c.label}`}
                              onClose={closeColorPicker}
                              onChange={(hex) => setColor(selectedId!, c.slot, hex)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tokens */}
              <div className="mt-3 border-t border-slate-200/70 pt-2">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[8px] font-medium uppercase tracking-wide text-slate-400">Tokens</span>
                  <span className="text-[8px] text-slate-400">Brand colors</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[
                    { name: 'Royal blue', color: '#0647E8' },
                    { name: 'Blue', color: '#0864D9' },
                    { name: 'Sky blue', color: '#1763C6' },
                    { name: 'Teal', color: '#079B73' },
                    { name: 'Ink', color: '#293344' },
                    { name: 'White', color: '#FFFFFF' },
                  ].map(({ name, color }) => (
                    <button
                      key={name}
                      type="button"
                      aria-label={`Apply ${name} ${box.iconColor ? 'icon color' : 'fill'}`}
                      title={`${name} ${color}`}
                      onClick={() => onBoxChange(selectedId!, box.iconColor
                        ? { iconColor: color }
                        : { fillType: 'color', fillColor: color })}
                      className="h-5 w-5 rounded-full border border-slate-300 shadow-sm transition hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Strokes & Borders */}
            <section className="border-b border-slate-200 px-3 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-semibold text-slate-700">Strokes &amp; Borders</span>
                <span className="text-[8px] text-slate-400">Selected component</span>
              </div>
              <div className="mb-2 flex items-center gap-2 rounded-md border border-slate-100 bg-[#F3F4FF] px-2 py-1.5">
                <ColorPickerButton
                  title="Stroke color"
                  color={box.strokeColor ?? '#6941C6'}
                  onChange={(hex) => onBoxChange(selectedId!, { strokeColor: hex })}
                  className="relative h-5 w-5 shrink-0 cursor-pointer overflow-hidden rounded border border-slate-300"
                  style={{ background: box.strokeColor ?? '#6941C6' }}
                />
                <span className="flex-1 font-mono text-[9px] uppercase text-slate-600">{box.strokeColor ?? '#6941C6'}</span>
                <label className="flex items-center gap-1 text-[8px] text-slate-400">
                  W
                  <input type="number" min={0} max={20} value={box.strokeWidth ?? 0}
                    onChange={(e) => onBoxChange(selectedId!, { strokeWidth: Math.max(0, Math.min(20, Number(e.target.value) || 0)) })}
                    className="w-8 rounded border border-slate-200 bg-white px-1 py-0.5 text-center text-[9px] text-slate-700 outline-none" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <label className="flex h-7 items-center rounded-md border border-slate-200 bg-white px-2">
                  <select aria-label="Stroke alignment" value={box.strokeAlign ?? 'inside'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'inside' || val === 'center' || val === 'outside') onBoxChange(selectedId!, { strokeAlign: val });
                    }}
                    className="w-full bg-transparent text-[9px] text-slate-600 outline-none">
                    <option value="inside">Inside</option>
                    <option value="center">Center</option>
                    <option value="outside">Outside</option>
                  </select>
                </label>
                <label className="flex h-7 items-center rounded-md border border-slate-200 bg-white px-2">
                  <select aria-label="Stroke style" value={box.strokeStyle ?? 'solid'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'solid' || val === 'dashed' || val === 'dotted') onBoxChange(selectedId!, { strokeStyle: val });
                    }}
                    className="w-full bg-transparent text-[9px] text-slate-600 outline-none">
                    <option value="solid">Solid Line</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </select>
                </label>
              </div>
            </section>

            {/* Effects & Shadows */}
            <section className="border-b border-slate-200 px-3 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-semibold text-slate-700">Effects &amp; Shadows</span>
                <button
                  type="button"
                  onClick={toggleEffects}
                  className="text-[9px] font-semibold text-[#0040DF] hover:underline"
                >
                  + Effect
                </button>
              </div>
              <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-2 py-1.5">
                <div className="flex items-center gap-1.5">
                  <Box className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-[10px] font-semibold text-slate-700 capitalize">{box.effectType === 'none' || !box.effectType ? 'No Effect' : box.effectType}</span>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </div>

              {showEffects && effectsPosition && (
                <EffectsPanel
                  box={box}
                  position={effectsPosition}
                  onClose={() => { setShowEffects(false); setEffectsPosition(null); }}
                  onBoxChange={(patch) => onBoxChange(selectedId!, patch)}
                />
              )}
            </section>

            {/* Component Parts — Sub-Element Tinkering */}
            {selectedId && !workspaceShape && !selectedId.startsWith('shape-') && !selectedId.startsWith('asset-') && (
              <section className="border-b border-slate-200 bg-blue-50/25 px-3 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Move className="h-3.5 w-3.5 text-[#0040DF]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700">
                      Component Parts{activeElementId ? ` · ${getElementDisplayName(activeElementId)}` : ''}
                    </span>
                  </div>
                  {activeElementId && (
                    <button
                      type="button"
                      onClick={() => setActiveElementId(null)}
                      className="text-[9px] font-semibold text-slate-400 hover:text-slate-600"
                    >
                      Deselect
                    </button>
                  )}
                </div>

                {activeElementId ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-md border border-blue-200 bg-white p-2 shadow-sm">
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-bold text-slate-800">
                          {getElementDisplayName(activeElementId)}
                        </p>
                        <p className="truncate font-mono text-[8px] text-slate-400">ID: {activeElementId}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Reset component part"
                          title="Reset position and size"
                          onClick={() => setElementBox(selectedId!, activeElementId, null)}
                          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold text-blue-600 hover:bg-blue-50"
                        >
                          <Undo2 className="h-2.5 w-2.5" />
                          Reset
                        </button>
                        <button
                          type="button"
                          aria-label="Delete component part"
                          title="Delete component part"
                          onClick={() => deleteElement(selectedId!, activeElementId)}
                          className="grid h-6 w-6 place-items-center rounded text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {([
                        { key: 'x' as const, label: 'X Offset', value: (elementBoxes[selectedId!]?.[activeElementId]?.x ?? 0) as number | '' },
                        { key: 'y' as const, label: 'Y Offset', value: (elementBoxes[selectedId!]?.[activeElementId]?.y ?? 0) as number | '' },
                        { key: 'w' as const, label: 'Width', value: (elementBoxes[selectedId!]?.[activeElementId]?.w ?? '') as number | '' },
                        { key: 'h' as const, label: 'Height', value: (elementBoxes[selectedId!]?.[activeElementId]?.h ?? '') as number | '' },
                      ]).map(({ key, label, value }) => (
                        <label key={key} className="flex h-7 items-center gap-2 rounded-md border border-slate-200 bg-white px-2">
                          <span className="text-[8px] font-semibold text-slate-400">{label}</span>
                          <input
                            type="number"
                            placeholder={key === 'w' || key === 'h' ? 'Auto' : '0'}
                            value={value}
                            onChange={(e) => setElementBox(selectedId!, activeElementId, {
                              [key]: e.target.value === '' ? undefined : (key === 'w' || key === 'h' ? Math.max(16, Number(e.target.value)) : Number(e.target.value)),
                            })}
                            className="w-full bg-transparent text-right text-[9px] font-semibold text-slate-700 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="text-[8px] text-slate-400">px</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-[9px] text-slate-500">
                      Click any element inside the card to drag &amp; resize it with 4 corner handles.
                    </p>
                    {suggestedParts.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {suggestedParts.map((part) => (
                          <button
                            key={part.id}
                            type="button"
                            onClick={() => setActiveElementId(part.id)}
                            className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-medium text-slate-600 shadow-sm transition hover:border-[#0040DF] hover:text-[#0040DF]"
                          >
                            <Move className="h-2 w-2 opacity-50" />
                            <span>{part.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {selectedId && ((elementBoxes[selectedId] && Object.keys(elementBoxes[selectedId]).length > 0)
                  || (hiddenElements[selectedId]?.length ?? 0) > 0) && (
                  <div className="mt-2 flex justify-end border-t border-slate-200/60 pt-2">
                    <button
                      type="button"
                      onClick={() => resetElementBoxes(selectedId!)}
                      className="flex items-center gap-1 text-[9px] font-semibold text-slate-500 hover:text-rose-600"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                      Reset All Parts
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Content */}
            {schema?.text && schema.text.length > 0 && (
              <section className="border-b border-slate-200 px-4 py-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Content</span>
                  {hasOverrides && (
                    <button onClick={() => onResetModuleOverrides(selectedId!)} className="text-[11px] font-semibold text-slate-400 hover:text-rose-500">
                      Reset all
                    </button>
                  )}
                </div>
                <div className="space-y-2.5">
                  {schema.text.map((s) => (
                    <label key={s.slot} className="block">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">{s.label}</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          value={mOver?.text[s.slot] ?? ''}
                          placeholder={s.defaultValue}
                          onChange={(e) => setText(selectedId!, s.slot, e.target.value || null)}
                          className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] outline-none focus:border-[#0040DF] focus:bg-white"
                        />
                        {mOver?.text[s.slot] && (
                          <button onClick={() => setText(selectedId!, s.slot, null)} className="grid h-7 w-7 place-items-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-500">
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {/* Workflow Triggers */}
            <LogicSummary
              moduleId={selectedId!}
              componentTitle={selectedTitle}
              elementId={workspaceShape ? null : activeElementId}
              logic={logic}
              state={logicState}
              open={workflowOpen}
              onToggle={onToggleWorkflow}
              onOpenLogic={() => onTab('logic')}
              onSelectElement={(id) => {
                setActiveElementId(id);
                setActiveTextSlot(null);
              }}
            />

            {/* Live Core Data Binding */}
            <section className="px-4 py-4">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Core Data Binding</span>
                <span className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold ${wsStatus === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  <span className={`h-2 w-2 rounded-full ${wsStatus === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {wsStatus === 'active' ? 'WS Active' : 'Disconnected'}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                <Braces className="h-4 w-4 text-slate-400" />
                <span className="font-mono text-[11px] text-[#0040DF]">{'{{account.available_balance}}'}</span>
              </div>
            </section>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-slate-200 p-3">
        <button type="button" onClick={onPreview} title="Try the app, with its logic, in Prototype mode"
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#0040DF] py-2.5 text-[12px] font-bold text-white hover:bg-[#0036BF]">
          <Play className="h-4 w-4" /> Preview
        </button>
        <button className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50">
          <Code2 className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

/* ═══════════════════════════ Panel resizing ═══════════════════════════ */

const PANEL_DEFAULT_WIDTH = 340;
const PANEL_MIN_WIDTH = 260;
const PANEL_MAX_WIDTH = 560;

/**
 * A side panel with a draggable inner edge: hovering the edge shows the resize cursor,
 * dragging changes the width, double-clicking resets it.
 */
function ResizablePanel({
  side, width, onWidth, children,
}: {
  side: 'left' | 'right';
  width: number;
  onWidth: (width: number) => void;
  children: React.ReactNode;
}) {
  const [resizing, setResizing] = useState(false);

  const startResize = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    const startX = event.clientX;
    const startWidth = width;
    setResizing(true);
    const previousCursor = document.body.style.cursor;
    const previousSelect = document.body.style.userSelect;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    const move = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX;
      const next = startWidth + (side === 'left' ? delta : -delta);
      onWidth(Math.round(Math.min(PANEL_MAX_WIDTH, Math.max(PANEL_MIN_WIDTH, next))));
    };
    const end = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousSelect;
      setResizing(false);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  };

  return (
    <div className="relative flex shrink-0" style={{ width }}>
      {children}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={`Resize ${side} panel`}
        aria-valuemin={PANEL_MIN_WIDTH}
        aria-valuemax={PANEL_MAX_WIDTH}
        aria-valuenow={width}
        tabIndex={0}
        title="Drag to resize · double-click to reset"
        onPointerDown={startResize}
        onDoubleClick={() => onWidth(PANEL_DEFAULT_WIDTH)}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          event.preventDefault();
          const step = (event.key === 'ArrowRight' ? 16 : -16) * (side === 'left' ? 1 : -1);
          onWidth(Math.min(PANEL_MAX_WIDTH, Math.max(PANEL_MIN_WIDTH, width + step)));
        }}
        className={`group absolute inset-y-0 z-40 w-2 cursor-col-resize touch-none outline-none ${
          side === 'left' ? '-right-1' : '-left-1'
        }`}
      >
        <span
          className={`pointer-events-none absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 transition-colors ${
            resizing ? 'bg-[#0040DF]' : 'bg-transparent group-hover:bg-[#0040DF]/60 group-focus-visible:bg-[#0040DF]'
          }`}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════ StudioClient ═══════════════════════════ */

export default function StudioClient() {
  const [mode, setMode] = useState<StudioMode>('design');
  const [device, setDevice] = useState<DeviceType>('iphone');
  const [zoom, setZoom] = useState(100);
  const [rightTab, setRightTab] = useState<RightTab>('design');
  const [workflowOpen, setWorkflowOpen] = useState(true);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  // Comments live on the page so the right panel can list them while the comment tool is on.
  const [comments, setComments] = useState<CanvasComment[]>([]);
  const [commentMode, setCommentMode] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(PANEL_DEFAULT_WIDTH);
  const [rightPanelWidth, setRightPanelWidth] = useState(PANEL_DEFAULT_WIDTH);
  const [createdDragId, setCreatedDragId] = useState<string | null>(null);
  const placeCreatedRef = useRef<((id: string) => void) | null>(null);
  // Whatever happens to the dragged row, a finished drag always clears the saved-component drag.
  useEffect(() => {
    if (!createdDragId) return;
    const clear = () => setTimeout(() => setCreatedDragId(null), 0);
    window.addEventListener('dragend', clear, true);
    window.addEventListener('drop', clear, true);
    return () => {
      window.removeEventListener('dragend', clear, true);
      window.removeEventListener('drop', clear, true);
    };
  }, [createdDragId]);

  const [appKind, setAppKind] = useState<AppKind>('banking');
  const [activePage, setActivePage] = useState<PageId>('home');
  // Every page starts collapsed in the left panel.
  const [expandedPage, setExpandedPage] = useState<PageId | null>(null);
  const [pageModules, setPageModules] = useState<Record<PageId, ModuleId[]>>(buildInitialPages);
  const [histories, setHistories] = useState<Record<PageId, ModuleId[][]>>(() => {
    const out = {} as Record<PageId, ModuleId[][]>;
    for (const p of PAGES) out[p.id] = [];
    return out;
  });

  const [selectedId, setSelectedId] = useState<ModuleId | null>(null);
  const [drag, setDrag] = useState<DragState>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [allAssetsForLookup, setAllAssetsForLookup] = useState<AssetItem[]>([]);
  /** Icons and photos being dragged in from plugins (a ref, so a drop sees them straight away). */
  const pluginAssetsRef = useRef(new Map<string, AssetItem>());
  const findAsset = (assetId: string) =>
    pluginAssetsRef.current.get(assetId) ?? allAssetsForLookup.find((item) => item.id === assetId);

  // Add state for active text slot
  const [activeTextSlot, setActiveTextSlot] = useState<string | null>(null);

  const [boxes, setBoxes] = useState<Record<string, ModuleBox>>({});
  const [measured, setMeasured] = useState<Record<string, { w: number; h: number }>>({});
  const [workspaceShapes, setWorkspaceShapes] = useState<WorkspaceShape[]>([]);
  const [selectedWorkspaceShapeId, setSelectedWorkspaceShapeId] = useState<string | null>(null);
  /**
   * A whole group picked (from its Layers row or the space between its items), as the
   * key of the group's main shape: 'p:<id>' in the phone, 'w:<id>' on the canvas. The
   * main shape is also the selection, so moving, copying and deleting act on the group.
   */
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);
  const canvasObjectIdRef = useRef(0);

  const {
    restore: restoreEdits,
    replaceModuleEdits,
    overrides,
    textStyles,
    setText,
    setColor,
    setTextStyle,
    reset: resetOverrides,
    elementBoxes,
    placedAssets,
    hiddenElements,
    addPlacedAsset,
    deleteElement,
    activeElementId,
    setActiveElementId,
    setElementBox,
    resetElementBoxes,
  } = useEditOverrides();

  const editState = {
    mode: (mode === 'design' ? 'edit' : 'view') as 'view' | 'edit',
    selectedId,
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
    reset: resetOverrides,
    activeTextSlot,
    setActiveTextSlot,
  };

  const onBoxChange = React.useCallback((id: ModuleId, patch: ModuleBox) => {
    setBoxes((prev) => ({ ...prev, [id]: { ...(prev[id] ?? {}), ...patch } }));
  }, []);

  const onResetBox = React.useCallback((id: ModuleId) => {
    setBoxes((prev) => {
      if (!prev[id]) return prev;
      const { [id]: _drop, ...rest } = prev;
      return rest;
    });
  }, []);

  const onWorkspaceShapeBoxChange = React.useCallback((id: string, patch: ModuleBox) => {
    setWorkspaceShapes((previous) => previous.map((shape) => shape.id === id
      ? { ...shape, box: { ...shape.box, ...patch } }
      : shape));
  }, []);

  const onMeasure = React.useCallback((id: ModuleId, size: { w: number; h: number }) => {
    setMeasured((prev) => {
      const cur = prev[id];
      if (cur && cur.w === size.w && cur.h === size.h) return prev;
      return { ...prev, [id]: size };
    });
  }, []);

  // The project's look from the Product Builder guide (if any) is applied when it loads.
  const [accentColor, setAccentColor] = useState('#0040DF');
  const [buttonRadius, setButtonRadius] = useState<RadiusMode>('rounded');
  const [isDark, setIsDark] = useState(false);
  const radius = RADII[buttonRadius];

  const [balance] = useState(INITIAL_BALANCE);
  const [income] = useState(INITIAL_INCOME);
  const [outcome] = useState(INITIAL_OUTCOME);
  const [savings] = useState(INITIAL_SAVINGS);
  const [transactions] = useState(INITIAL_TRANSACTIONS);
  const [faceId, setFaceId] = useState(true);
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  const [wsStatus] = useState<'active' | 'connecting' | 'disconnected'>('active');

  useEffect(() => {
    setDropIndex(null);
  }, [activePage]);

  const currentModules = pageModules[activePage] ?? [];
  const currentPageLabel = PAGES.find((p) => p.id === activePage)?.label ?? 'Home';

  /* ── Project, Save progress and undo/redo ── */

  const [project, setProject] = useState<StudioProjectInfo | null>(null);
  const [buildLoaded, setBuildLoaded] = useState(false);
  const [lastSave, setLastSave] = useState<{ at: number | null; failed: boolean }>({ at: null, failed: false });
  /** The build as it was when loaded or last saved; anything else is an unsaved change. */
  const [baselineJson, setBaselineJson] = useState<string | null>(null);
  const [studioNotice, setStudioNotice] = useState<string | null>(null);
  const [leftView, setLeftView] = useState<LeftView>('navigator');
  // Logic tab: triggers, rules and routing per component / sub-component.
  const [logic, setLogic] = useState<LogicMap>({});

  // The app design: what Save progress stores and what undo/redo steps through.
  const design: StudioDesign = {
    appKind, pageModules, boxes, workspaceShapes, logic,
    overrides, textStyles, elementBoxes, placedAssets, hiddenElements,
  };
  const designJson = JSON.stringify(design);
  // Comments are saved too, but undo/redo leaves them alone.
  const buildJson = `${designJson}|${JSON.stringify(comments)}`;
  const hasUnsavedChanges = baselineJson !== null && buildJson !== baselineJson;
  const saveStatus: SaveStatus = {
    // Unsaved changes are auto-saved as soon as editing pauses, so they show as "Saving…".
    state: lastSave.failed ? 'error' : hasUnsavedChanges ? 'saving' : lastSave.at ? 'saved' : 'never',
    savedAt: lastSave.at,
  };

  const applyDesign = (saved: Partial<StudioDesign>) => {
    if (saved.appKind) setAppKind(saved.appKind);
    setPageModules({ ...buildInitialPages(), ...(saved.pageModules ?? {}) });
    setBoxes(saved.boxes ?? {});
    setWorkspaceShapes(Array.isArray(saved.workspaceShapes) ? saved.workspaceShapes : []);
    setLogic(saved.logic && typeof saved.logic === 'object' ? saved.logic : {});
    restoreEdits(saved);
    setSelectedId(null);
    setSelectedWorkspaceShapeId(null);
  };

  // Open the project from the URL (or the last one opened) and reload its saved build.
  useEffect(() => {
    const active = resolveActiveProject();
    const saved = loadStudioBuild(active?.id ?? null);
    /* eslint-disable react-hooks/set-state-in-effect -- one-time load from browser storage */
    setProject(active);
    if (active?.look) {
      setAccentColor(active.look.primary);
      setButtonRadius(active.look.shape);
      // "Dual" apps open in light mode.
      setIsDark(active.look.appearance === 'dark');
    }
    const data = saved?.data as SavedBuildData | undefined;
    if (data && typeof data === 'object') {
      if (data.design && typeof data.design === 'object') applyDesign(data.design);
      if (Array.isArray(data.comments)) setComments(data.comments);
      const at = Date.parse(saved?.savedAt ?? '');
      setLastSave({ at: Number.isNaN(at) ? null : at, failed: false });
    }
    setBuildLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const historyRef = useRef<{ past: string[]; future: string[]; current: string | null }>({ past: [], future: [], current: null });
  const [historyCounts, setHistoryCounts] = useState({ undo: 0, redo: 0 });
  const syncHistoryCounts = () => {
    const history = historyRef.current;
    setHistoryCounts({ undo: history.past.length, redo: history.future.length });
  };

  // Once the saved build is on screen, it is the starting point for "unsaved" and for undo.
  useEffect(() => {
    if (!buildLoaded) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBaselineJson(buildJson);
    historyRef.current = { past: [], future: [], current: designJson };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildLoaded]);

  // Record a single undo step once edits pause (so a drag is one step, not hundreds).
  useEffect(() => {
    if (!buildLoaded) return;
    const timer = window.setTimeout(() => {
      const history = historyRef.current;
      if (history.current === null || history.current === designJson) return;
      history.past = [...history.past, history.current].slice(-UNDO_LIMIT);
      history.future = [];
      history.current = designJson;
      syncHistoryCounts();
    }, 350);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designJson, buildLoaded]);

  const stepHistory = (direction: 'undo' | 'redo') => {
    const history = historyRef.current;
    if (history.current === null) return;
    // An edit made in the last moment counts as a step of its own.
    if (designJson !== history.current) {
      history.past = [...history.past, history.current].slice(-UNDO_LIMIT);
      history.future = [];
      history.current = designJson;
    }
    const from = direction === 'undo' ? history.past : history.future;
    const to = direction === 'undo' ? history.future : history.past;
    const target = from.pop();
    if (target === undefined) { syncHistoryCounts(); return; }
    to.push(history.current);
    history.current = target;
    applyDesign(JSON.parse(target) as StudioDesign);
    syncHistoryCounts();
  };

  const showStudioNotice = (message: string) => {
    setStudioNotice(message);
    window.setTimeout(() => setStudioNotice((current) => (current === message ? null : current)), 3200);
  };

  /** Store the build in the project. `announce` is for Save progress; auto-saves are silent unless they fail. */
  const writeBuild = (announce: boolean) => {
    if (!buildLoaded) return;
    try {
      const data: SavedBuildData = { design, comments };
      const savedAt = Date.parse(saveStudioBuild(project?.id ?? null, data));
      setBaselineJson(buildJson);
      setLastSave({ at: savedAt, failed: false });
      if (announce) {
        showStudioNotice(project
          ? `Progress saved to “${project.name}” in Projects & Deployments.`
          : 'Progress saved in this browser. Open the Studio from a project in My Products to list it there.');
      }
    } catch {
      // Tell the user once, not on every auto-save attempt that fails the same way.
      if (announce || !lastSave.failed) {
        showStudioNotice(announce
          ? 'Progress could not be saved. The browser storage may be full.'
          : 'Auto-save failed. The browser storage may be full. Try Save progress again later.');
      }
      setLastSave((previous) => ({ ...previous, failed: true }));
    }
  };
  const saveProgress = () => writeBuild(true);

  // Auto-save: changes are saved to the project once editing pauses, and before the tab
  // is hidden or closed, so nothing depends on clicking Save progress.
  const autoSaveRef = useRef({ writeBuild, hasUnsavedChanges });
  useLayoutEffect(() => {
    autoSaveRef.current = { writeBuild, hasUnsavedChanges };
  });
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const timer = window.setTimeout(() => autoSaveRef.current.writeBuild(false), AUTO_SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [buildJson, hasUnsavedChanges]);
  useEffect(() => {
    const flush = () => {
      if (autoSaveRef.current.hasUnsavedChanges) autoSaveRef.current.writeBuild(false);
    };
    const onVisibility = () => { if (document.visibilityState === 'hidden') flush(); };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      flush();
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // Ctrl/Cmd+S saves; Ctrl/Cmd+Z undoes; Ctrl/Cmd+Shift+Z or Ctrl+Y redoes.
  const studioShortcutsRef = useRef({ saveProgress, stepHistory });
  useLayoutEffect(() => {
    studioShortcutsRef.current = { saveProgress, stepHistory };
  });
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === 's') {
        event.preventDefault();
        studioShortcutsRef.current.saveProgress();
        return;
      }
      if (key !== 'z' && key !== 'y') return;
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable || target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      event.preventDefault();
      studioShortcutsRef.current.stepHistory(key === 'y' || event.shiftKey ? 'redo' : 'undo');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsavedChanges]);

  const goToPage = (p: PageId) => { setActivePage(p); setSelectedId(null); };
  const actions: ViewActions = {
    send: () => goToPage('send'), payments: () => goToPage('payments'),
    payBill: () => {}, topUp: () => {}, openWallet: () => goToPage('cards'),
    openFx: () => {}, openHistory: () => goToPage('history'),
    seeAllSavings: () => {}, deposit: () => {}, toggleFaceId: () => setFaceId((v) => !v),
    openAlerts: () => goToPage('notifications'), signIn: () => goToPage('home'),
    skipSignIn: () => goToPage('home'), quickSignIn: () => goToPage('home'),
    toggleFreeze: () => setIsCardFrozen((v) => !v),
  };

  const liveCtx: ViewCtx = {
    radius, accent: accentColor, isDark, interactive: true,
    balance, income, outcome, savings, transactions, faceId, isCardFrozen, actions,
  };

  // The banking values Logic rules test, from the prototype's own state where it has one.
  const logicState: LogicState = {
    ...DEFAULT_LOGIC_STATE,
    'account.balance': balance,
    'account.availableBalance': balance,
    'card.status': isCardFrozen ? 'FROZEN' : 'ACTIVE',
    'session.biometricEnabled': faceId,
  };
  const appScheme = appSchemeFor(project?.name);

  /** A Logic trigger's effect on the prototype (the rest is shown as a notice). */
  const runLogicTrigger = (trigger: LogicTrigger) => {
    if (trigger.action === 'navigate' && PAGES.some((page) => page.id === trigger.target)) {
      goToPage(trigger.target as PageId);
    } else if (trigger.action === 'startTransfer') {
      goToPage('send');
    } else if (trigger.action === 'toggleFreeze') {
      setIsCardFrozen((value) => !value);
    }
  };

  const commit = (next: ModuleId[]) => {
    if (next.length === currentModules.length && next.every((m, i) => m === currentModules[i])) return;
    setHistories((h) => ({ ...h, [activePage]: [...(h[activePage] ?? []).slice(-(HISTORY_LIMIT - 1)), currentModules] }));
    setPageModules((p) => ({ ...p, [activePage]: next }));
  };

  const startDrag = (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.setData('application/x-pf-module-id', id);
    e.dataTransfer.effectAllowed = from === 'library' ? 'copyMove' : 'move';
    if (from === 'library') {
      e.dataTransfer.setData(LIBRARY_DRAG_TYPE, id);
      const source = e.currentTarget as HTMLElement;
      // A library tile renders the component at preview width; keep that size for a canvas drop.
      const content = source.querySelector<HTMLElement>('[data-thumb-content]');
      libraryDragSizeRef.current = content?.offsetHeight
        ? { w: COMPONENT_PREVIEW_WIDTH, h: content.offsetHeight }
        : null;
      hideNativeDragImage(e);
    }
    setDrag({ id, from });
  };

  const libraryDragSizeRef = useRef<{ w: number; h: number } | null>(null);

  /** A library component dropped on the canvas around the phone, centred on the drop point. */
  const addWorkspaceComponent = (id: ModuleId, position: { x: number; y: number }) => {
    const size = measured[id] ?? libraryDragSizeRef.current ?? { w: COMPONENT_PREVIEW_WIDTH, h: 168 };
    const shapeId = `workspace-component-${Date.now()}-${++canvasObjectIdRef.current}`;
    setWorkspaceShapes((shapes) => [...shapes, {
      id: shapeId,
      type: 'component',
      componentId: id,
      box: {
        x: Math.round(position.x - size.w / 2),
        y: Math.round(position.y - size.h / 2),
        w: size.w,
        h: size.h,
      },
    }]);
    setSelectedId(null);
    setSelectedWorkspaceShapeId(shapeId);
    setActiveTextSlot(null);
  };
  const endDrag = () => { setDrag(null); setDropIndex(null); };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    const types = Array.from(e.dataTransfer.types);
    const isOurDrag = types.includes('application/x-pf-module-id');
    const assetDrag = isAssetDrag(e.dataTransfer);
    if (assetDrag) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      return;
    }
    if (!drag && !isOurDrag) return;
    e.preventDefault(); e.stopPropagation();
    if (drag) {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropIndex(e.clientY < rect.top + rect.height / 2 ? index : index + 1);
    }
  };

  const handleAssetDrop = (assetId: string, moduleId: ModuleId | null) => {
    if (!moduleId) return;
    const asset = findAsset(assetId);
    if (!asset?.dataUrl) return;
    onBoxChange(moduleId, {
      fillType: 'image',
      imageFill: {
        url: asset.dataUrl,
        name: asset.name,
        fit: 'crop',
        opacity: 100,
        visible: true,
      },
    });
  };

  /**
   * Apply a clicked asset to the selected component/object: a media asset becomes its
   * background (image fill), a color token its fill color. With a text field of a
   * component selected, a token colors that text instead.
   */
  const applyAssetToSelection = (asset: AssetItem) => {
    if (asset.kind === 'token' && asset.color && selectedId && activeTextSlot && !selectedWorkspaceShapeId) {
      setTextStyle(selectedId, activeTextSlot, { color: asset.color });
      return;
    }
    const workspaceShape = selectedWorkspaceShapeId
      ? workspaceShapes.find((shape) => shape.id === selectedWorkspaceShapeId)
      : undefined;
    const targetId = workspaceShape ? null : selectedId;
    if (!workspaceShape && !targetId) return;
    const type = workspaceShape?.type ?? (targetId ? canvasInsertTypeForId(targetId) : null);

    let patch: ModuleBox | null = null;
    if (asset.kind === 'media' && asset.dataUrl) {
      if (type === 'shape-text' || (type && STROKE_ONLY_TYPES.includes(type))) return;
      patch = {
        fillType: 'image',
        fillGradient: undefined,
        imageFill: { url: asset.dataUrl, name: asset.name, fit: 'crop', opacity: 100, visible: true },
      };
    } else if (asset.kind === 'token' && asset.color) {
      patch = type === 'shape-text'
        ? { textColor: asset.color }
        : type && STROKE_ONLY_TYPES.includes(type)
          ? { strokeColor: asset.color }
          : { fillType: 'color', fillColor: asset.color, fillGradient: undefined };
    }
    if (!patch) return;
    const applied = patch;
    if (workspaceShape) {
      setWorkspaceShapes((shapes) => shapes.map((shape) => shape.id === workspaceShape.id
        ? { ...shape, box: { ...shape.box, ...applied } }
        : shape));
    } else if (targetId) {
      onBoxChange(targetId, applied);
    }
  };

  const addPhoneAsset = (
    assetId: string,
    position: { x: number; y: number },
    frameId?: string,
  ) => {
    const asset = findAsset(assetId);
    if (!asset?.dataUrl) return;
    const dimensions = assetDimensions(asset);
    const id = `asset-${asset.id}-${Date.now()}-${++canvasObjectIdRef.current}` as ModuleId;
    commit([...currentModules, id]);
    onBoxChange(id, {
      x: Math.round(position.x - dimensions.w / 2),
      y: Math.round(position.y - dimensions.h / 2),
      ...dimensions,
      frameId,
      assetUrl: asset.dataUrl,
      assetName: asset.name,
      iconColor: asset.iconColor,
    });
    setSelectedId(id);
    setSelectedWorkspaceShapeId(null);
    setActiveTextSlot(null);
  };

  /** Adds an image from a plugin (e.g. an Iconify icon) to the middle of the current page. */
  const insertPluginImage = (image: PluginImage) => {
    const screen = deviceDimensions(device);
    const id = `asset-plugin-${uniqueIdPart()}-${++canvasObjectIdRef.current}` as ModuleId;
    const box: ModuleBox = {
      x: Math.round(screen.w / 2 - image.w / 2),
      y: Math.round((screen.h - STATUS_BAR_HEIGHT) / 2 - image.h / 2),
      w: image.w,
      h: image.h,
      assetUrl: image.url,
      assetName: image.name,
      iconColor: image.iconColor,
    };
    commit([...currentModules, id]);
    onBoxChange(id, { ...box, frameId: frameContaining(pageFrames(boxes), box) });
    setSelectedId(id);
    setSelectedWorkspaceShapeId(null);
    setActiveTextSlot(null);
  };

  /**
   * Makes a plugin's icon or photo available to the canvas's asset drop handlers, so it can be
   * dragged from the plugin panel like an asset. Returns the id to drag it by.
   */
  const registerPluginAsset = (image: PluginImage) => {
    const id = `plugin-${uniqueIdPart()}-${++canvasObjectIdRef.current}`;
    const asset: AssetItem = {
      id,
      name: image.name,
      kind: image.iconColor ? 'icon' : 'media',
      filters: [],
      format: 'SVG',
      dataUrl: image.url,
      w: image.w,
      h: image.h,
      iconColor: image.iconColor,
      preview: null,
    };
    // Keep only the last few plugin drags: each holds its image.
    const assets = pluginAssetsRef.current;
    assets.set(id, asset);
    if (assets.size > 10) assets.delete(assets.keys().next().value!);
    return id;
  };

  const handleDrop = (
    e: React.DragEvent,
    targetId?: ModuleId,
    position?: { x: number; y: number },
  ) => {
    e.preventDefault(); e.stopPropagation();
    const assetId = draggedAssetId(e.dataTransfer);
    if (assetId) {
      const targetIsComponent = !!targetId && allModulesFor().some((module) => module.id === targetId);
      const asset = findAsset(assetId);
      if (targetIsComponent && position && asset?.dataUrl) {
        const dimensions = assetDimensions(asset);
        const instance = {
          id: `asset-${asset.id}-${uniqueIdPart()}-${++canvasObjectIdRef.current}`,
          name: asset.name,
          url: asset.dataUrl,
        };
        addPlacedAsset(targetId, instance);
        setElementBox(targetId, instance.id, {
          x: Math.round(position.x - dimensions.w / 2),
          y: Math.round(position.y - dimensions.h / 2),
          ...dimensions,
        });
        setSelectedId(targetId);
        setActiveTextSlot(null);
        setActiveElementId(instance.id);
      } else if (targetId && position && asset?.dataUrl) {
        const targetBox = boxes[targetId] ?? {};
        const frameId = targetId.startsWith('frame-') ? targetId : targetBox.frameId;
        addPhoneAsset(assetId, {
          x: (targetBox.x ?? 0) + position.x,
          y: (targetBox.y ?? 0) + position.y,
        }, frameId);
      } else {
        handleAssetDrop(assetId, selectedId);
      }
      endDrag();
      return;
    }
    const id = (drag?.id ?? e.dataTransfer.getData('application/x-pf-module-id')) as ModuleId | '';
    if (!id) { endDrag(); return; }
    if (!allModulesFor().some((m) => m.id === id) && !id.startsWith('shape-')) { endDrag(); return; }
    if (drag?.from === 'library' || e.dataTransfer.types.includes(LIBRARY_DRAG_TYPE)) startFromTemplate(id);

    if (SINGLE_SLOT[activePage]) {
      commit([id]);
      setSelectedId(id);
      endDrag();
      return;
    }

    const from = currentModules.indexOf(id);
    const next = currentModules.filter((m) => m !== id);
    let at = dropIndex ?? next.length;
    if (from !== -1 && from < at) at -= 1;
    next.splice(Math.max(0, Math.min(at, next.length)), 0, id);
    commit(next);
    setSelectedId(id);
    endDrag();
  };

  /** Whether a component is in use on any page of the app. */
  const isOnAnyPage = (id: ModuleId) => Object.values(pageModules).some((ids) => ids?.includes(id));

  /**
   * A component taken from the library arrives as the library template. Edits left from
   * an earlier copy that has since been removed are dropped, so they never carry over.
   * (A component still in use on another page is the same component, so it keeps them.)
   */
  const startFromTemplate = (id: ModuleId) => {
    if (isOnAnyPage(id)) return;
    replaceModuleEdits(id, null);
    onResetBox(id);
  };

  const addModule = (id: ModuleId) => {
    if (SINGLE_SLOT[activePage]) { startFromTemplate(id); commit([id]); setSelectedId(id); return; }
    if (currentModules.includes(id)) return;
    startFromTemplate(id);
    commit([...currentModules, id]);
    setSelectedId(id);
  };
  const removeModules = (ids: ModuleId[]) => {
    const removed = new Set(ids);
    commit(currentModules.filter((moduleId) => !removed.has(moduleId)));
    setBoxes((previous) => {
      const next = { ...previous };
      removed.forEach((moduleId) => { delete next[moduleId]; });
      return next;
    });
    if (selectedId && removed.has(selectedId)) setSelectedId(null);
  };
  const removeModule = (id: ModuleId) => {
    // Frames and groups are removed with everything nested in them.
    const ids = [id, ...descendantIds(id, currentModules, (moduleId) => boxes[moduleId]?.frameId)] as ModuleId[];
    removeModules(ids);
  };
  const quickAdd = (id: ModuleId) => addModule(id);

  const handleNavTab = (tab: TabId) => {
    setActivePage(TAB_TO_PAGE[tab]);
    setSelectedId(null);
    setSelectedWorkspaceShapeId(null);
  };

  const createCanvasObjectId = (type: CanvasInsertType) =>
    `${type}-${Date.now()}-${++canvasObjectIdRef.current}` as ModuleId;

  const addWorkspaceAsset = (
    assetId: string,
    position: { x: number; y: number },
    frameId?: string,
  ) => {
    const asset = findAsset(assetId);
    if (!asset?.dataUrl) return;
    const dimensions = assetDimensions(asset);
    const id = `workspace-asset-${uniqueIdPart()}-${++canvasObjectIdRef.current}`;
    const box: ModuleBox = {
      x: Math.round(position.x - dimensions.w / 2),
      y: Math.round(position.y - dimensions.h / 2),
      ...dimensions,
      frameId,
      assetUrl: asset.dataUrl,
      assetName: asset.name,
      iconColor: asset.iconColor,
    };
    setWorkspaceShapes((shapes) => [...shapes, { id, type: 'asset', box, frameId }]);
    setSelectedId(null);
    setSelectedWorkspaceShapeId(id);
    setActiveTextSlot(null);
  };

  /** Frames on the current page, as read from a given boxes snapshot. */
  const pageFrames = (source: Record<string, ModuleBox>): FrameCandidate[] => currentModules
    .filter((moduleId) => moduleId.startsWith('frame-'))
    .map((moduleId) => ({ id: moduleId, box: source[moduleId] ?? {} }));

  /** Re-check which frame each of these phone objects sits in (after it is dropped). */
  const assignPhoneFrames = (ids: ModuleId[]) => {
    setBoxes((previous) => {
      const frames = pageFrames(previous);
      let next: Record<string, ModuleBox> | null = null;
      ids.forEach((id) => {
        if (id.startsWith('frame-') || !canvasInsertTypeForId(id) || !previous[id]) return;
        // A grouped layer stays in its group wherever it is moved (the group's area grows
        // to include it); only "Ungroup" releases it.
        const parentId = previous[id].frameId;
        if (parentId && !parentId.startsWith('frame-') && previous[parentId] && currentModules.includes(parentId as ModuleId)) return;
        const frameId = frameContaining(frames, previous[id]);
        if (frameId === previous[id].frameId) return;
        next ??= { ...previous };
        next[id] = { ...previous[id], frameId };
      });
      return next ?? previous;
    });
  };

  const handleAddShape = (type: CanvasInsertType, geometry: DrawBox) => {
    const newId = createCanvasObjectId(type);
    const shapeBox = createShapeBox(type, geometry);
    commit([...currentModules, newId]);
    setSelectedId(newId);
    setBoxes((previous) => {
      const next = { ...previous };
      if (type === 'frame') {
        // A frame drawn around loose objects groups them, like Figma.
        currentModules.forEach((moduleId) => {
          const box = previous[moduleId];
          if (!box || moduleId.startsWith('frame-') || !canvasInsertTypeForId(moduleId) || box.frameId) return;
          if (boxEncloses(shapeBox, box)) next[moduleId] = { ...box, frameId: newId };
        });
        next[newId] = {
          ...shapeBox,
          name: nextFrameName([...Object.values(previous), ...workspaceShapes.map((shape) => shape.box)]),
        };
      } else {
        next[newId] = { ...shapeBox, frameId: frameContaining(pageFrames(previous), shapeBox) };
      }
      return next;
    });
    return newId;
  };

  /**
   * Bring free-floating objects into the phone (dragged in from the workspace or pasted).
   * Component instances join the page's component stack, before `insertBefore` when given;
   * one that is already on the page falls back to its flattened copy.
   */
  const handleAddWorkspaceShapes = (shapes: WorkspaceShape[], insertBefore?: ModuleId | null) => {
    if (shapes.length === 0) return;
    const singleSlot = !!SINGLE_SLOT[activePage];
    const components: { id: ModuleId; box: ModuleBox }[] = [];
    const objects: WorkspaceShape[] = [];
    shapes.forEach((shape) => {
      if (shape.type !== 'component') {
        objects.push(shape);
        return;
      }
      const componentId = shape.componentId;
      const canPlaceLive = !!componentId
        && !!moduleFor(componentId)
        && !currentModules.includes(componentId)
        && !components.some((component) => component.id === componentId)
        && !(singleSlot && components.length > 0);
      if (canPlaceLive) {
        const { x: _x, y: _y, frameId: _frameId, html: _html, ...box } = shape.box;
        components.push({ id: componentId, box });
        // The placed copy looks like the one that was copied (or the template, if that was unchanged).
        if (!isOnAnyPage(componentId)) replaceModuleEdits(componentId, shape.edits ?? null);
      } else if (shape.box.html) {
        objects.push({ ...shape, type: 'element', componentId: undefined });
      }
    });
    if (components.length === 0 && objects.length === 0) return;

    const ids = objects.map((shape) => createCanvasObjectId(shape.type));
    const idByWorkspaceId = new Map(objects.map((shape, index) => [shape.id, ids[index]]));
    // A single-slot page keeps one component: a pasted one replaces it (canvas objects stay).
    const stack = singleSlot && components.length > 0
      ? currentModules.filter((moduleId) => canvasInsertTypeForId(moduleId))
      : [...currentModules];
    const insertAt = insertBefore ? stack.indexOf(insertBefore) : -1;
    stack.splice(insertAt >= 0 ? insertAt : stack.length, 0, ...components.map((component) => component.id));
    commit([...stack, ...ids]);
    setBoxes((previous) => {
      const next = { ...previous };
      const frames = pageFrames(previous);
      components.forEach((component) => { next[component.id] = component.box; });
      objects.forEach((shape, index) => {
        // Objects keep their own frame; loose ones join the frame they land in.
        const frameId = shape.frameId
          ? idByWorkspaceId.get(shape.frameId)
          : shape.type === 'frame' ? undefined : frameContaining(frames, shape.box);
        next[ids[index]] = { ...shape.box, frameId };
      });
      return next;
    });
    const frameIndex = objects.findIndex((shape) => shape.type === 'frame');
    setSelectedId(frameIndex >= 0
      ? ids[frameIndex]
      : ids[ids.length - 1] ?? components[components.length - 1].id);
    setSelectedWorkspaceShapeId(null);
  };

  // Wrapper to reset text slot on new selection
  const handleSelectModule = (id: ModuleId | null) => {
    // A part selected inside another component no longer applies.
    if (id !== selectedId) setActiveElementId(null);
    setSelectedId(id);
    setSelectedWorkspaceShapeId(null);
    setActiveTextSlot(null);
  };

  const workspaceShapeSelection = workspaceShapes.find((shape) => shape.id === selectedWorkspaceShapeId) ?? null;

  // Layers tree for the left panel: frames, groups and objects in the phone and on the canvas.
  const layerSections: LayerSection[] = [
    {
      title: `Phone · ${currentPageLabel}`,
      nodes: buildLayerNodes(currentModules.flatMap((id): LayerSource[] => {
        const type = canvasInsertTypeForId(id);
        if (!type) return [];
        const box = boxes[id] ?? {};
        return [{ id, key: `p:${id}`, type, name: layerName(type, box), parent: box.frameId }];
      })),
    },
    {
      title: 'Canvas',
      nodes: buildLayerNodes(workspaceShapes.map((shape) => ({
        id: shape.id,
        key: `w:${shape.id}`,
        type: shape.type,
        name: layerName(shape.type, shape.box, shape.componentId),
        parent: shape.frameId,
      }))),
    },
  ];
  // What the Code tab generates code from: every object in the phone, in stacking order.
  const codeSources: CodeSource[] = currentModules.map((id) => ({
    id, type: canvasInsertTypeForId(id), box: boxes[id] ?? {},
  }));
  const selectionKey = selectedWorkspaceShapeId
    ? `w:${selectedWorkspaceShapeId}`
    : selectedId ? `p:${selectedId}` : null;
  // The group pick only counts while its main shape is still selected and still has layers
  // grouped into it (selecting something else, or ungrouping, ends it).
  const activeGroupKey = (() => {
    if (!selectedGroupKey || selectedGroupKey !== selectionKey) return null;
    const rootId = selectedGroupKey.slice(2);
    const stillGrouped = selectedGroupKey.startsWith('w:')
      ? workspaceShapes.find((shape) => shape.id === rootId)?.type !== 'frame'
        && workspaceShapes.some((shape) => shape.frameId === rootId)
      : !rootId.startsWith('frame-') && currentModules.some((moduleId) => boxes[moduleId]?.frameId === rootId);
    return stillGrouped ? selectedGroupKey : null;
  })();
  const selectedLayerKey = activeGroupKey ? `g:${activeGroupKey}` : selectionKey;
  const selectLayer = (key: string) => {
    // A group row ('g:<main shape key>') selects the whole group.
    const isGroup = key.startsWith('g:');
    const objectKey = isGroup ? key.slice(2) : key;
    const id = objectKey.slice(2);
    if (objectKey.startsWith('w:')) {
      setSelectedId(null);
      setSelectedWorkspaceShapeId(id);
      setActiveTextSlot(null);
    } else {
      handleSelectModule(id as ModuleId);
    }
    setSelectedGroupKey(isGroup ? objectKey : null);
  };

  return (
    <EditProvider value={editState}>
      <div className={`${urbanist.className} flex h-screen w-full flex-col overflow-hidden bg-[#F3F4F8] text-slate-900`}>
        {createdDragId && (
          <CreatedDragPreview key={createdDragId} id={createdDragId} ctx={{ ...liveCtx, interactive: false, actions: noopActions }} />
        )}
        {drag?.from === 'library' && (
          <LibraryDragPreview
            key={drag.id}
            id={drag.id}
            ctx={{ ...liveCtx, interactive: false, actions: noopActions }}
            onMeasure={(size) => { libraryDragSizeRef.current = size; }}
          />
        )}
        <TopBar
          project={project}
          mode={mode} onMode={setMode} device={device} onDevice={setDevice}
          zoom={zoom} onZoom={setZoom}
          saveStatus={saveStatus} onSave={saveProgress}
          canUndo={historyCounts.undo > 0} canRedo={historyCounts.redo > 0}
          onUndo={() => stepHistory('undo')} onRedo={() => stepHistory('redo')}
          onPublish={() => {}}
        />
        {studioNotice && (
          <div role="status" className="pointer-events-none fixed bottom-6 left-1/2 z-[300] -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2.5 text-[12.5px] font-medium text-white shadow-lg">
            {studioNotice}
          </div>
        )}
        <div className="flex min-h-0 flex-1">
          <IconRail
            view={leftView}
            onView={(view) => {
              setLeftView(view);
              setLeftPanelCollapsed(false);
            }}
          />
          {leftPanelCollapsed ? (
            <div className="flex w-9 shrink-0 justify-center border-r border-slate-200 bg-white pt-3">
              <button
                type="button"
                title="Expand left panel"
                aria-label="Expand left panel"
                onClick={() => setLeftPanelCollapsed(false)}
                className="grid h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-[#0040DF]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : <ResizablePanel side="left" width={leftPanelWidth} onWidth={setLeftPanelWidth}>{leftView === 'plugins' ? (
            <PluginsPanel
              accent={accentColor}
              onInsertImage={insertPluginImage}
              onDragImageStart={registerPluginAsset}
              onNotice={showStudioNotice}
              onCollapse={() => setLeftPanelCollapsed(true)}
              modalClassName={urbanist.className}
            />
          ) : <LeftPanel
            appKind={appKind} onAppKind={setAppKind}
            activePage={activePage} onSelectPage={(p) => {
              setActivePage(p);
              setSelectedId(null);
              setSelectedWorkspaceShapeId(null);
            }}
            expandedPage={expandedPage} onToggleExpand={(p) => setExpandedPage((v) => (v === p ? null : p))}
            pageModules={pageModules} accent={accentColor}
            onStartDrag={startDrag} onEndDrag={endDrag} drag={drag}
            onAddModule={(id, variant) => {
              addModule(id);
              if (variant) onBoxChange(id, { variant });
            }}
            onRemoveModule={removeModule}
            selectedId={selectedId}
            onSelectModule={handleSelectModule}
            onSelectTextSlot={(id, slot) => {
              setSelectedId(id);
              setActiveTextSlot(slot);
              setActiveElementId(slot);
            }}
            measured={measured} 
            onAssetClick={(asset) => setAllAssetsForLookup((assets) => [
              ...assets.filter((item) => item.id !== asset.id),
              asset,
            ])}
            onAssetApply={applyAssetToSelection}
            onCollapse={() => setLeftPanelCollapsed(true)}
            layerSections={layerSections}
            selectedLayerKey={selectedLayerKey}
            onSelectLayer={selectLayer}
            onAddCreatedToPhone={(id) => placeCreatedRef.current?.(id)}
            onCreatedDragChange={setCreatedDragId}
          />}</ResizablePanel>}
          <Canvas
            leftPanelSpace={leftPanelCollapsed ? 36 : leftPanelWidth}
            device={device} zoom={zoom} onZoom={setZoom}
            pageModules={pageModules} activePage={activePage} pageLabel={currentPageLabel}
            drag={drag} dropIndex={dropIndex}
            ctx={liveCtx} accent={accentColor} isDark={isDark} radius={radius}
            selectedId={selectedId} onSelect={handleSelectModule}
            onStartDrag={startDrag} onEndDrag={endDrag}
            onItemDragOver={handleItemDragOver} onDrop={handleDrop}
            onRemove={removeModule} onQuickAdd={quickAdd}
            onNavTab={handleNavTab}
            boxes={boxes}
            onMeasure={onMeasure}
            onBoxChange={onBoxChange}
            onAddShape={handleAddShape}
            onAddWorkspaceShapes={handleAddWorkspaceShapes}
            onAssignFrames={assignPhoneFrames}
            onRemoveMany={removeModules}
            workspaceShapes={workspaceShapes}
            setWorkspaceShapes={setWorkspaceShapes}
            selectedWorkspaceShapeId={selectedWorkspaceShapeId}
            setSelectedWorkspaceShapeId={setSelectedWorkspaceShapeId}
            selectedGroupKey={activeGroupKey}
            onSelectGroup={(key) => (key ? selectLayer(`g:${key}`) : setSelectedGroupKey(null))}
            onAddPhoneAsset={addPhoneAsset}
            onAddWorkspaceAsset={addWorkspaceAsset}
            onAddWorkspaceComponent={addWorkspaceComponent}
            onClearDropIndex={() => setDropIndex(null)}
            placeCreatedRef={placeCreatedRef}
            createdDragId={createdDragId}
            comments={comments}
            setComments={setComments}
            activeCommentId={activeCommentId}
            onActivateComment={setActiveCommentId}
            onCommentModeChange={setCommentMode}
          />
          {commentMode ? (
            <ResizablePanel side="right" width={rightPanelWidth} onWidth={setRightPanelWidth}>
              <CommentsPanel
                comments={comments}
                setComments={setComments}
                activeId={activeCommentId}
                onActivate={setActiveCommentId}
              />
            </ResizablePanel>
          ) : rightPanelCollapsed ? (
            <div className="flex w-9 shrink-0 justify-center border-l border-slate-200 bg-white pt-3">
              <button
                type="button"
                title="Expand right panel"
                aria-label="Expand right panel"
                onClick={() => setRightPanelCollapsed(false)}
                className="grid h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-[#0040DF]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          ) : <ResizablePanel side="right" width={rightPanelWidth} onWidth={setRightPanelWidth}><RightPanel
            tab={rightTab} onTab={setRightTab}
            selectedId={selectedId} accent={accentColor} wsStatus={wsStatus}
            workflowOpen={workflowOpen} onToggleWorkflow={() => setWorkflowOpen((v) => !v)}
            box={selectedId ? boxes[selectedId] ?? {} : {}}
            measured={selectedId ? measured[selectedId] ?? null : null}
            onBoxChange={onBoxChange}
            onResetBox={onResetBox}
            workspaceShape={workspaceShapeSelection}
            onWorkspaceShapeBoxChange={onWorkspaceShapeBoxChange}
            onSelectVariant={(variant) => {
              if (selectedId) onBoxChange(selectedId, { variant });
            }}
            overrides={overrides}
            textStyles={textStyles}
            setText={setText}
            setColor={setColor}
            setTextStyle={setTextStyle}
            onResetModuleOverrides={resetOverrides}
            activeTextSlot={activeTextSlot}
            setActiveTextSlot={setActiveTextSlot}
            elementBoxes={elementBoxes}
            hiddenElements={hiddenElements}
            activeElementId={activeElementId}
            setActiveElementId={setActiveElementId}
            setElementBox={setElementBox}
            resetElementBoxes={resetElementBoxes}
            deleteElement={deleteElement}
            onCollapse={() => setRightPanelCollapsed(true)}
            codeSources={codeSources}
            codeScreenName={currentPageLabel}
            logic={logic}
            setLogic={setLogic}
            logicState={logicState}
            appScheme={appScheme}
            pageId={activePage}
            onPreview={() => setMode('prototype')}
          /></ResizablePanel>}
          <LogicRuntime
            enabled={mode === 'prototype'}
            logic={logic}
            state={logicState}
            pageId={activePage}
            onTrigger={runLogicTrigger}
            onNotice={(message) => showStudioNotice(`Prototype · ${message}`)}
          />
        </div>
      </div>
    </EditProvider>
  );
}