// /client/app/userdashboard/studio/StudioClient.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Urbanist, Outfit } from 'next/font/google';
import {
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsUpDown, GripVertical,
  Layers, Box, Workflow, Palette, ShieldCheck, Settings, Plus, PlusCircle,
  Trash2, Undo2, Home, Wallet,
  BarChart3, User, Play, Code2, Check, Braces, X, Diamond, CreditCard,
  Search, Upload, Eye, EyeOff, Image as ImageIcon, Pipette,
  Bell, List, ArrowRightLeft, Landmark, PiggyBank, Activity,
  CircleDollarSign, Coins, LayoutGrid, Type, Square, Circle, Minus,
  Sparkles, Sun, Droplet, SlidersHorizontal, Move, MousePointer2, Hand,
  Frame, Star, ArrowRight, Spline, MessageCircle,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Underline, Strikethrough,
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
  useEditOverrides,
  type EditableTextStyle,
} from './edit-context';
import { EDITABLE_SCHEMA } from './editable-schema';
import AssetTab, { type AssetItem } from './assettab';

const urbanist = Urbanist({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });

const CORNER_HANDLES = [
  { k: 'nw', cls: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize' },
  { k: 'ne', cls: 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize' },
  { k: 'sw', cls: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize' },
  { k: 'se', cls: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize' },
] as const;

type IconType = React.ComponentType<{ className?: string }>;
type IconMeta = { Icon: IconType; bg: string; text: string };
type ModuleMeta = ReturnType<typeof allModulesFor>[number];
type CompLibraryId = 'banking' | 'crypto' | 'general';

const COMP_LIBRARY_ORDER: CompLibraryId[] = ['banking', 'crypto', 'general'];

const COMP_LIBRARY_META: Record<
  CompLibraryId,
  { label: string; description: string; Icon: IconType; bg: string; text: string }
> = {
  banking: { label: 'Banking UIs', description: 'Accounts, cards, payments & money movement', Icon: Landmark, bg: 'bg-blue-50', text: 'text-blue-600' },
  crypto: { label: 'Crypto UIs', description: 'Wallets, tokens, swaps & on-chain activity', Icon: Coins, bg: 'bg-violet-50', text: 'text-violet-600' },
  general: { label: 'General UIs', description: 'Shared app chrome, alerts, settings & more', Icon: LayoutGrid, bg: 'bg-slate-100', text: 'text-slate-600' },
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

type DeviceType = 'iphone' | 'pixel' | 'tablet';
type StudioMode = 'design' | 'prototype' | 'workflows' | 'code';
type RightTab = 'design' | 'layout' | 'logic' | 'data' | 'code';
type SaveState = 'saving' | 'saved' | 'unsaved';
type DragState = { id: ModuleId; from: 'library' | 'canvas' } | null;
type CornerRadii = { topLeft: number; topRight: number; bottomRight: number; bottomLeft: number };
type ShapeType = NonNullable<ModuleBox['shapeType']>;
const COMPONENT_SHAPES: ShapeType[] = ['rounded', 'sharp', 'pill', 'squircle'];
type CanvasShapeType = 'shape-rect' | 'shape-circle' | 'shape-triangle' | 'shape-star' | 'shape-line' | 'shape-arrow' | 'shape-scribble';
type CanvasInsertType = CanvasShapeType | 'shape-text' | 'shape-comment';
type DrawBox = Pick<ModuleBox, 'x' | 'y' | 'w' | 'h' | 'flipX' | 'flipY' | 'freehandPath'>;
type DrawPreview = { type: CanvasInsertType; box: DrawBox };

type ImageFill = {
  url: string;
  name: string;
  fit: 'fill' | 'fit' | 'crop' | 'tile';
  opacity: number;
  visible: boolean;
};

type EffectType = 'none' | 'glassmorphism' | 'shadow' | 'blur';

type Insets = { top: number; right: number; bottom: number; left: number };

type ModuleBox = {
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  flipX?: boolean;
  flipY?: boolean;
  text?: string;
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
  imageFill?: ImageFill;
  effectType?: EffectType;
  glassBlur?: number;
  glassSaturation?: number;
  shadowX?: number;
  shadowY?: number;
  shadowBlur?: number;
  shadowColor?: string;
  layerBlur?: number;
};

/* ═══════════════════════════ TopBar ═══════════════════════════ */

function TopBar({
  mode, onMode, device, onDevice, zoom, onZoom, saveState, onPublish,
}: {
  mode: StudioMode; onMode: (m: StudioMode) => void;
  device: DeviceType; onDevice: (d: DeviceType) => void;
  zoom: number; onZoom: (z: number) => void;
  saveState: SaveState; onPublish: () => void;
}) {
  const modes: { id: StudioMode; label: string }[] = [
    { id: 'design', label: 'Design' }, { id: 'prototype', label: 'Prototype' },
    { id: 'workflows', label: 'Workflows' }, { id: 'code', label: 'Code' },
  ];
  const saveLabel = saveState === 'saving' ? 'Saving…' : saveState === 'unsaved' ? 'Unsaved changes' : 'Saved 12s ago';
  const saveDot = saveState === 'unsaved' ? 'bg-amber-500' : saveState === 'saving' ? 'bg-amber-400 animate-pulse' : 'bg-blue-500';

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-3">
      <div className="flex items-center gap-3">
        <svg width="100" height="50" viewBox="100 0 150 201" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.0129111 -0.999917 -0.999917 -0.0129111 353.906 103.367)" fill="#0A63F8" />
          <path d="M49.302 120.528C45.9887 120.528 42.8654 119.937 39.9321 118.755C36.9987 117.552 34.4874 115.928 32.3982 113.88C30.3089 111.833 28.6629 109.385 27.46 106.537C26.2571 103.666 25.6556 100.606 25.6556 97.3565C25.6556 94.1066 26.2571 91.0572 27.46 88.2082C28.6629 85.3382 30.3089 82.8796 32.3982 80.8326C34.4874 78.7856 36.9987 77.1712 39.9321 75.9894C42.8654 74.8076 45.9887 74.2167 49.302 74.2167C53.4593 74.2167 57.2579 75.1136 60.6978 76.9074C64.1587 78.68 66.9549 81.1386 69.0864 84.283L60.3812 89.6644C59.1572 87.8706 57.5745 86.4566 55.633 85.4226C53.6915 84.3885 51.5811 83.8715 49.302 83.8715C45.5034 83.8715 42.3273 85.1588 39.7738 87.7334C37.2203 90.2869 35.9435 93.4946 35.9435 97.3565C35.9435 101.218 37.2203 104.437 39.7738 107.011C42.3273 109.565 45.5034 110.842 49.302 110.842C51.6022 110.842 53.7126 110.335 55.633 109.322C57.5745 108.288 59.1572 106.874 60.3812 105.08L69.0864 110.462C66.9549 113.606 64.1587 116.075 60.6978 117.869C57.2579 119.642 53.4593 120.528 49.302 120.528ZM89.3773 120.528C84.2914 120.528 80.039 118.871 76.6203 115.558C73.2226 112.245 71.5238 108.13 71.5238 103.213C71.5238 98.2956 73.2226 94.1805 76.6203 90.8672C80.039 87.554 84.2914 85.8974 89.3773 85.8974C92.7327 85.8974 95.7716 86.6571 98.4939 88.1766C101.216 89.6749 103.348 91.7536 104.888 94.4126C106.429 97.0505 107.199 99.9839 107.199 103.213C107.199 106.442 106.429 109.385 104.888 112.044C103.348 114.682 101.216 116.761 98.4939 118.281C95.7716 119.779 92.7327 120.528 89.3773 120.528ZM83.5844 109.037C85.1249 110.599 87.0559 111.38 89.3773 111.38C91.6987 111.38 93.6296 110.599 95.1702 109.037C96.7107 107.476 97.481 105.534 97.481 103.213C97.481 100.891 96.7107 98.9498 95.1702 97.3882C93.6296 95.8265 91.6987 95.0457 89.3773 95.0457C87.0559 95.0457 85.1249 95.8265 83.5844 97.3882C82.0439 98.9498 81.2736 100.891 81.2736 103.213C81.2736 105.534 82.0439 107.476 83.5844 109.037ZM132.302 85.8974C136.1 85.8974 139.16 87.0475 141.482 89.3478C143.803 91.627 144.964 94.6659 144.964 98.4645V119.737H135.499V101.662C135.499 99.6568 134.908 98.0529 133.726 96.8501C132.565 95.6472 131.014 95.0457 129.073 95.0457C127.047 95.0457 125.401 95.6683 124.135 96.9134C122.889 98.1374 122.267 99.7623 122.267 101.788V119.737H112.802V86.6888H122.267V89.9809C124.926 87.2586 128.271 85.8974 132.302 85.8974ZM171.364 85.8974C175.162 85.8974 178.222 87.0475 180.544 89.3478C182.865 91.627 184.026 94.6659 184.026 98.4645V119.737H174.561V101.662C174.561 99.6568 173.97 98.0529 172.788 96.8501C171.628 95.6472 170.077 95.0457 168.135 95.0457C166.109 95.0457 164.463 95.6683 163.197 96.9134C161.952 98.1374 161.329 99.7623 161.329 101.788V119.737H151.864V86.6888H161.329V89.9809C163.988 87.2586 167.333 85.8974 171.364 85.8974ZM223.975 103.339C223.975 104.479 223.911 105.471 223.785 106.315H199.157C199.748 108.172 200.793 109.628 202.291 110.683C203.789 111.738 205.572 112.266 207.641 112.266C209.413 112.266 211.028 111.918 212.484 111.221C213.94 110.525 215.09 109.649 215.934 108.594L222.297 114.102C220.503 116.128 218.319 117.711 215.744 118.85C213.17 119.969 210.384 120.528 207.387 120.528C202.133 120.528 197.743 118.861 194.219 115.527C190.716 112.171 188.964 108.003 188.964 103.023C188.964 99.8362 189.724 96.9345 191.243 94.3176C192.784 91.7008 194.905 89.6433 197.606 88.1449C200.307 86.6466 203.304 85.8974 206.596 85.8974C211.555 85.8974 215.692 87.554 219.005 90.8672C222.318 94.1805 223.975 98.3378 223.975 103.339ZM206.469 94.0644C204.697 94.0644 203.146 94.6025 201.816 95.6788C200.487 96.734 199.579 98.1796 199.094 100.016H213.94C213.412 98.1585 212.484 96.7023 211.154 95.6472C209.825 94.592 208.263 94.0644 206.469 94.0644ZM245.31 120.528C240.224 120.528 235.972 118.871 232.553 115.558C229.155 112.245 227.457 108.13 227.457 103.213C227.457 98.2956 229.155 94.1805 232.553 90.8672C235.972 87.554 240.224 85.8974 245.31 85.8974C248.602 85.8974 251.588 86.636 254.268 88.1133C256.949 89.5694 259.059 91.5742 260.6 94.1277L252.369 99.1292C251.673 97.8841 250.702 96.8923 249.457 96.1536C248.212 95.415 246.83 95.0457 245.31 95.0457C242.989 95.0457 241.058 95.8265 239.517 97.3882C237.977 98.9498 237.206 100.891 237.206 103.213C237.206 105.534 237.977 107.476 239.517 109.037C241.058 110.599 242.989 111.38 245.31 111.38C246.83 111.38 248.212 111.01 249.457 110.272C250.702 109.533 251.673 108.541 252.369 107.296L260.6 112.266C259.059 114.841 256.949 116.867 254.268 118.344C251.588 119.8 248.602 120.528 245.31 120.528ZM285.987 95.299H277.503V107.423C277.503 110.061 278.886 111.38 281.65 111.38C283.022 111.38 284.467 110.989 285.987 110.208V119.104C284.109 120.053 281.998 120.528 279.656 120.528C275.773 120.528 272.861 119.494 270.919 117.426C268.999 115.337 268.038 112.519 268.038 108.974V95.299H263.037V86.6888H268.038V78.4901H277.503V86.6888H285.987V95.299Z" fill="black" />
          <path d="M3.88977 62.0001V16.6194H30.4375V21.1574H8.42784V35.4199H27.3257V39.958H8.42784V62.0001H3.88977ZM33.1391 29.5853H37.6771V62.0001H33.1391V29.5853ZM35.4405 23.9127C34.7058 23.9127 34.0791 23.675 33.5604 23.1996C33.0634 22.7025 32.8149 22.0867 32.8149 21.3519C32.8149 20.6172 33.0634 20.0121 33.5604 19.5367C34.0791 19.0397 34.7058 18.7912 35.4405 18.7912C36.1536 18.7912 36.7587 19.0397 37.2557 19.5367C37.7744 20.0121 38.0337 20.6172 38.0337 21.3519C38.0337 22.0867 37.7852 22.7025 37.2881 23.1996C36.7911 23.675 36.1752 23.9127 35.4405 23.9127ZM73.6236 41.9353V62.0001H69.0855V42.8429C69.0855 41.0709 68.6533 39.461 67.7889 38.0131C66.9245 36.5653 65.7684 35.4091 64.3206 34.5447C62.8727 33.6803 61.2628 33.2481 59.4908 33.2481C57.7404 33.2481 56.1304 33.6803 54.6609 34.5447C53.2131 35.4091 52.057 36.5653 51.1926 38.0131C50.3282 39.461 49.896 41.0709 49.896 42.8429V62.0001H45.3579V29.5853H49.896V34.0585C51.0413 32.4162 52.5324 31.1088 54.3692 30.1363C56.2061 29.1639 58.205 28.6777 60.366 28.6777C62.8079 28.6777 65.0337 29.2719 67.0434 30.4605C69.0531 31.649 70.6522 33.2481 71.8408 35.2579C73.0293 37.2676 73.6236 39.4934 73.6236 41.9353ZM96.6791 34.1233H88.932L88.8996 62.0001H84.3615L84.3939 34.1233H78.5268V29.5853H84.3939L84.3615 19.407H88.8996L88.932 29.5853H96.6791V34.1233ZM115.84 62.8428C112.858 62.8428 110.135 62.0757 107.671 60.5414C105.229 59.0071 103.274 56.9542 101.804 54.3826C100.356 51.7894 99.6324 48.9261 99.6324 45.7927C99.6324 43.4156 100.054 41.2006 100.897 39.1476C101.739 37.0731 102.895 35.2579 104.365 33.702C105.856 32.1244 107.585 30.8927 109.551 30.0067C111.518 29.1207 113.614 28.6777 115.84 28.6777C118.238 28.6777 120.443 29.1531 122.452 30.1039C124.484 31.0547 126.223 32.3838 127.671 34.0909C129.141 35.7981 130.243 37.797 130.978 40.0877C131.734 42.3783 132.047 44.8526 131.918 47.5107H104.43C104.689 49.5636 105.337 51.4004 106.375 53.0212C107.434 54.6419 108.773 55.9277 110.394 56.8785C112.036 57.8077 113.852 58.2832 115.84 58.3048C118.001 58.3048 119.946 57.7429 121.674 56.6192C123.425 55.4955 124.83 53.9504 125.888 51.9839L130.491 53.0536C129.195 55.9277 127.239 58.2832 124.624 60.12C122.009 61.9352 119.081 62.8428 115.84 62.8428ZM104.3 43.8478H127.347C127.196 41.8381 126.58 40.0012 125.499 38.3373C124.441 36.6517 123.068 35.3119 121.383 34.3178C119.697 33.3022 117.85 32.7943 115.84 32.7943C113.83 32.7943 111.993 33.2914 110.329 34.2854C108.665 35.2579 107.304 36.5869 106.245 38.2724C105.186 39.9364 104.538 41.7948 104.3 43.8478ZM160.302 53.8639L164.354 56.0682C162.884 58.1211 161.015 59.7634 158.746 60.9952C156.498 62.227 154.056 62.8428 151.42 62.8428C148.438 62.8428 145.715 62.0757 143.252 60.5414C140.81 59.0071 138.854 56.9542 137.384 54.3826C135.937 51.7894 135.213 48.9261 135.213 45.7927C135.213 43.4156 135.634 41.2006 136.477 39.1476C137.32 37.0731 138.476 35.2579 139.945 33.702C141.436 32.1244 143.165 30.8927 145.132 30.0067C147.098 29.1207 149.194 28.6777 151.42 28.6777C154.056 28.6777 156.498 29.2935 158.746 30.5253C161.015 31.7571 162.884 33.4102 164.354 35.4848L160.302 37.6566C159.178 36.2303 157.827 35.139 156.25 34.3827C154.672 33.6047 153.062 33.2157 151.42 33.2157C149.237 33.2157 147.26 33.7992 145.488 34.9661C143.716 36.1115 142.312 37.6349 141.274 39.5366C140.259 41.4383 139.751 43.5236 139.751 45.7927C139.751 48.0617 140.269 50.1471 141.307 52.0487C142.366 53.9504 143.781 55.4739 145.553 56.6192C147.325 57.7429 149.281 58.3048 151.42 58.3048C153.192 58.3048 154.856 57.8942 156.412 57.073C157.968 56.2518 159.264 55.1822 160.302 53.8639ZM198.028 41.9353V62.0001H193.49V42.8429C193.49 41.0709 193.058 39.461 192.193 38.0131C191.329 36.5653 190.173 35.4091 188.725 34.5447C187.277 33.6803 185.667 33.2481 183.895 33.2481C182.145 33.2481 180.535 33.6803 179.065 34.5447C177.617 35.4091 176.461 36.5653 175.597 38.0131C174.733 39.461 174.3 41.0709 174.3 42.8429V62.0001H169.762V13.3779H174.3V34.0585C175.446 32.4162 176.937 31.1088 178.774 30.1363C180.61 29.1639 182.609 28.6777 184.77 28.6777C187.212 28.6777 189.438 29.2719 191.448 30.4605C193.458 31.649 195.057 33.2481 196.245 35.2579C197.434 37.2676 198.028 39.4934 198.028 41.9353Z" fill="black" />
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.999793 -0.0203619 -0.0203619 0.999793 253.736 21.9693)" fill="#0A63F8" />
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.849868 -0.526995 -0.526995 0.849868 302.125 28.4821)" fill="#0A63F8" />
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(-0.480664 -0.876905 -0.876905 0.480664 337.863 59.1159)" fill="#0A63F8" />
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.503146 -0.864202 -0.864202 -0.503146 346.105 149.786)" fill="#0A63F8" />
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.721529 -0.692385 -0.692385 -0.721529 324.629 178.293)" fill="#0A63F8" />
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.900044 -0.435799 -0.435799 -0.900044 288.037 194.412)" fill="#0A63F8" />
          <rect width="7.24888" height="52.7191" rx="3.62444" transform="matrix(0.999533 -0.0305672 -0.0305672 -0.999533 248.223 200.014)" fill="#0A63F8" />
        </svg>
        <span className="h-5 w-px bg-slate-200" />
        <button className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-left hover:bg-slate-100">
          <div className="leading-tight">
            <p className="text-[11px] font-semibold">Apex Digital Bank</p>
            <p className="text-[9px] text-slate-500">US Core BaaS · Sandbox</p>
          </div>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
        <div className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[10px] text-slate-500">
          <span className={`h-1.5 w-1.5 rounded-full ${saveDot}`} />{saveLabel}
        </div>
        <div className="flex items-center gap-0.5">
          <button className="grid h-6 w-6 place-items-center rounded-md text-slate-500 hover:bg-slate-100"><Undo2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      <div className="mx-auto flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5">
        {modes.map((m) => {
          const active = mode === m.id;
          return (
            <button key={m.id} onClick={() => onMode(m.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-semibold ${active ? 'bg-white text-[#0040DF] shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              {active && <span className="h-1.5 w-1.5 rounded-full bg-[#0040DF]" />}
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5">
          <button onClick={() => onDevice('iphone')}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold ${device === 'iphone' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
            iPhone 15 Pro
          </button>
          <button onClick={() => onDevice('pixel')}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold ${device === 'pixel' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
            Pixel 8
          </button>
          <button onClick={() => onDevice('tablet')}
            className={`grid h-6 w-6 place-items-center rounded-md ${device === 'tablet' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
            Tablet
          </button>
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <button onClick={() => onZoom(Math.max(25, zoom - 10))} className="grid h-6 w-6 place-items-center rounded-md hover:bg-slate-100">−</button>
          <span className="w-9 text-center text-[10px] font-semibold">{zoom}%</span>
          <button onClick={() => onZoom(Math.min(400, zoom + 10))} className="grid h-6 w-6 place-items-center rounded-md hover:bg-slate-100">+</button>
        </div>
        <button onClick={onPublish} className="rounded-md bg-[#0040DF] px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-[#0036BF]">
          Publish App
        </button>
      </div>
    </header>
  );
}

/* ═══════════════════════════ IconRail ═══════════════════════════ */

function IconRail() {
  const items = [
    { Icon: Layers, label: 'Navigator', active: true },
    { Icon: Box, label: 'Components' },
    { Icon: Workflow, label: 'App flow' },
    { Icon: Palette, label: 'Theme' },
    { Icon: ShieldCheck, label: 'Compliance', badge: 2 },
  ];
  return (
    <aside className="flex w-14 shrink-0 flex-col items-center border-r border-slate-200 bg-white py-2">
      {items.map(({ Icon, label, active, badge }) => (
        <button key={label} title={label} aria-label={label}
          className={`relative mb-0.5 grid h-9 w-9 place-items-center rounded-lg ${active ? 'bg-[#E8EEFF] text-[#0040DF]' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}>
          <Icon className="h-4 w-4" />
          {badge ? (<span className="absolute -right-0.5 -top-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-rose-500 px-0.5 text-[8px] font-bold text-white">{badge}</span>) : null}
        </button>
      ))}
      <div className="mt-auto flex flex-col items-center gap-1">
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

function LeftPanel({
  appKind, onAppKind, activePage, onSelectPage, expandedPage, onToggleExpand,
  pageModules, accent, onStartDrag, onEndDrag, drag, onAddModule, onRemoveModule,
  selectedId, onSelectModule, onAssetClick, measured,
  onSelectTextSlot,
}: {
  appKind: AppKind; onAppKind: (k: AppKind) => void;
  activePage: PageId; onSelectPage: (p: PageId) => void;
  expandedPage: PageId | null; onToggleExpand: (p: PageId) => void;
  pageModules: Record<PageId, ModuleId[]>;
  accent: string; drag: DragState;
  onStartDrag: (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => void;
  onEndDrag: () => void;
  onAddModule: (id: ModuleId) => void; onRemoveModule: (id: ModuleId) => void;
  selectedId: ModuleId | null;
  onSelectModule: (id: ModuleId) => void;
  onSelectTextSlot: (id: ModuleId, slot: string | null) => void;
  onAssetClick: (asset: AssetItem) => void;
  measured: Record<string, { w: number; h: number }>;
}){
  const [tab, setTab] = useState<'navigator' | 'comps' | 'assets'>('navigator');
  const [query, setQuery] = useState('');
  const [compLibrary, setCompLibrary] = useState<CompLibraryId | null>(null);
  const [activeCompSubgroup, setActiveCompSubgroup] = useState<string | null>(null);
  const [previewInfo, setPreviewInfo] = useState<{ id: ModuleId; top: number; left: number } | null>(null);

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
    const rect = event.currentTarget.getBoundingClientRect();
    setPreviewInfo({
      id,
      top: Math.max(16, Math.min(rect.top, window.innerHeight - 600)), 
      left: rect.right + 16,
    });
  };

  const closePreview = () => setPreviewInfo(null);

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
    const isAdded = (pageModules[activePage] ?? []).includes(mod.id);
    const isDragging = drag?.id === mod.id && drag.from === 'library';
    const modMeta = moduleIconMeta(mod.id, mod.title);

    return (
      <div
        key={mod.id}
        draggable
        onDragStart={(e) => onStartDrag(e, mod.id, 'library')}
        onDragEnd={onEndDrag}
        className={`overflow-hidden rounded-lg border border-slate-200 bg-white cursor-grab active:cursor-grabbing ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-2 py-1.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md ${modMeta.bg} ${modMeta.text}`}>
              <modMeta.Icon className="h-3 w-3" />
            </span>
            <span className="truncate text-[9px] font-bold text-slate-800">{mod.title}</span>
            <span className={`shrink-0 rounded px-1 py-0.5 text-[7px] font-bold ${mod.badgeColor}`}>
              {mod.badge}
            </span>
          </div>

          <div className="flex items-center gap-1">
             <button
                type="button"
                title="Preview component"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectModule(mod.id);
                  handleShowPreview(mod.id, e);
                }}
                className="grid h-4 w-4 shrink-0 place-items-center rounded text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <Eye className="h-3 w-3" />
              </button>
            <button
              draggable={false}
              onDragStart={(e) => e.stopPropagation()}
              onClick={() => (isAdded ? onRemoveModule(mod.id) : onAddModule(mod.id))}
              className={`grid h-4 w-4 shrink-0 place-items-center rounded hover:bg-slate-200 ${
                isAdded ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {isAdded ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden bg-[#F7F8FF] p-2" style={{ height: 140 }}>
          <div className="pointer-events-none origin-top-left" style={{ transform: 'scale(0.75)', width: '133%' }}>
            <ModuleView id={mod.id} ctx={previewCtx} passive />
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside className="flex w-[340px] shrink-0 flex-col border-r border-slate-200 bg-[#EDEFFC] scrollbar-thin-blue relative">
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
              {filteredMods.map(renderCompModule)}
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
                    <div className={`flex h-24 items-center justify-center ${meta.bg}`}>
                      <meta.Icon className={`h-10 w-10 ${meta.text}`} />
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
              {groupedComps.map((group) => (
                <div key={group.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <button type="button" onClick={() => setActiveCompSubgroup(group.id)} className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50">
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${group.bg} ${group.text}`}>
                      <group.Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-slate-800">{group.label}</p>
                      <p className="text-[9px] text-slate-500">{group.mods.length} templates</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                  </button>
                </div>
              ))}
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
              {activeGroup?.mods.map(renderCompModule)}
              {!activeGroup?.mods.length && <p className="py-6 text-center text-[10px] text-slate-400">No components found.</p>}
            </>
          )}
        </div>
      )}

      {tab === 'assets' && (
        <AssetTab
          accent={accent}
          onAssetDragStart={() => {}}
          onAssetClick={onAssetClick}
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
            onMouseLeave={closePreview}
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
                <span className="h-1.5 w-1.5 rounded-full bg-[#0040DF]" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#0040DF]">Live Render</span>
              </div>
              <div className="flex w-full items-center justify-center">
                 <div className="w-full max-w-[320px] rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-900/5">
                   <ModuleView id={previewInfo.id} ctx={previewCtx} passive />
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
                    <button key={v} className={`flex-1 rounded-md py-1 text-[11px] font-semibold transition ${v === 'Default' ? 'bg-white text-[#0040DF] shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Insert Button */}
              <button
                onClick={() => { onAddModule(previewInfo.id); closePreview(); }}
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

function ToolbarButton({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode; }) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`grid h-6 w-6 place-items-center rounded-full transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 ${danger ? 'text-rose-500' : 'text-slate-600'}`}>
      {children}
    </button>
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

function canvasObjectTitle(id: ModuleId | null): string | null {
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

function GenericShape({
  id,
  box,
  onBoxChange,
}: {
  id: string;
  box: ModuleBox;
  onBoxChange: (patch: ModuleBox) => void;
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
    backgroundColor: isComment ? '#ffffff' : fill,
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

  const handleTextInput = (event: React.FormEvent<HTMLSpanElement>) => {
    onBoxChange({ text: event.currentTarget.innerText });
  };

  return (
    <div className="flex h-full w-full items-center justify-center" style={style}>
      {isText && (
        <span
          contentEditable
          suppressContentEditableWarning
          onInput={handleTextInput}
          role="textbox"
          aria-label="Edit text"
          className="min-w-[24px] whitespace-pre-wrap outline-none"
        >
          {box.text ?? 'Text'}
        </span>
      )}
      {isComment && <span className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-700 shadow-sm">Comment</span>}
    </div>
  );
}

function ModuleWrapper({
  id, index, total, selected, drag, dropIndex, accent, isDark, radius, ctx,
  box, onSelect, onStartDrag, onEndDrag, onItemDragOver, onDrop, onMove, onRemove,
  onMeasure, onBoxChange,
}: {
  id: ModuleId; index: number; total: number;
  selected: boolean; drag: DragState; dropIndex: number | null;
  accent: string; isDark: boolean; radius: Radius; ctx: ViewCtx;
  box: ModuleBox;
  onSelect: (id: ModuleId) => void;
  onStartDrag: (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => void;
  onEndDrag: () => void;
  onItemDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent) => void;
  onMove: (id: ModuleId, dir: -1 | 1) => void;
  onRemove: (id: ModuleId) => void;
  onMeasure: (id: ModuleId, size: { w: number; h: number }) => void;
  onBoxChange: (id: ModuleId, patch: ModuleBox) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const isSource = drag?.from === 'canvas' && drag.id === id;
  const isShape = id.startsWith('shape-');

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

  const targetW = box.w ?? natural?.w ?? (isShape ? 100 : undefined);
  const targetH = box.h ?? natural?.h ?? (isShape ? 100 : undefined);
  const sx = box.w && natural ? box.w / natural.w : 1;
  const sy = box.h && natural ? box.h / natural.h : 1;

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
      onBoxChange(id, patch);
    };
    const onMouseUp = () => {
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

    const handleMove = (moveEvent: MouseEvent) => {
      onBoxChange(id, {
        x: baseX + (moveEvent.clientX - startX) / scaleX,
        y: baseY + (moveEvent.clientY - startY) / scaleY,
      });
    };
    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const customRadiusString = radiusForBox(box);

  let customBackground: React.CSSProperties | undefined = undefined;
  if (box.fillType === 'color' && box.fillColor) {
    customBackground = { backgroundColor: box.fillColor };
  } else if (box.fillType === 'image' && box.imageFill?.url && box.imageFill.visible !== false) {
    const { url, fit } = box.imageFill;
    customBackground = {
      backgroundImage: `url(${url})`,
      backgroundSize: fit === 'fill' ? '100% 100%' : fit === 'fit' ? 'contain' : fit === 'crop' ? 'cover' : 'auto',
      backgroundRepeat: fit === 'tile' ? 'repeat' : 'no-repeat',
      backgroundPosition: 'center',
    };
  }

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

  const ctxWithBox = {
    ...ctx,
    customRadius: customRadiusString,
    customPadding: box.padding,
    customStroke: box.strokeWidth ? {
      border: `${box.strokeWidth}px ${box.strokeStyle ?? 'solid'} ${box.strokeColor ?? '#6941C6'}`,
      boxSizing: 'border-box' as const,
    } : undefined,
    customBackground: box.fillType === 'color' ? customBackground : undefined,
    customBackgroundImage: box.fillType === 'image' ? customBackground : undefined,
  };

  const wrapperStyle: React.CSSProperties = {
    width: targetW,
    height: targetH,
    position: isShape ? 'absolute' : undefined,
    left: isShape ? box.x ?? 0 : undefined,
    top: isShape ? box.y ?? 0 : undefined,
    transform:
      (!isShape && (box.x !== undefined || box.y !== undefined)) || box.rotation !== undefined
        ? `${!isShape ? `translate(${box.x ?? 0}px, ${box.y ?? 0}px) ` : ''}rotate(${box.rotation ?? 0}deg)`
        : undefined,
    opacity: box.opacity === undefined ? undefined : box.opacity / 100,
    outline: selected ? '2px solid #0040DF' : undefined,
    outlineOffset: 4,
    zIndex: isShape ? (selected ? 30 : 20) : undefined,
    ...customEffect,
  };

  const contentStyle: React.CSSProperties = {
    width: isShape ? targetW : box.w && natural ? natural.w : undefined,
    height: isShape ? targetH : box.h && natural ? natural.h : undefined,
    transform: !isShape && (sx !== 1 || sy !== 1) ? `scale(${sx}, ${sy})` : undefined,
    transformOrigin: 'top left',
  };

  return (
    <div
      ref={wrapperRef}
      data-module-id={id}
      draggable={!selected && !isShape}
      onDragStart={(e) => {
        if (isShape) { e.preventDefault(); return; }
        if (selected) { e.preventDefault(); return; }
        onStartDrag(e, id, 'canvas');
      }}
      onDragEnd={onEndDrag}
      onDragOver={(e) => onItemDragOver(e, index)}
      onDrop={onDrop}
      onMouseDown={startShapeMove}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
      style={wrapperStyle}
      className={`group relative cursor-grab active:cursor-grabbing ${
        isDark ? 'ring-offset-slate-950' : 'ring-offset-[#F7F8FF]'
      } ${isShape ? 'cursor-move' : ''} ${isSource ? 'opacity-40' : ''}`}
    >
      {drag && dropIndex === index && <DropLine side="top" accent={accent} />}
      {drag && dropIndex === total && index === total - 1 && (
        <DropLine side="bottom" accent={accent} />
      )}

      <div className="absolute -top-3.5 right-2 z-20 flex items-center gap-0.5 rounded-full bg-white p-0.5 opacity-0 shadow-md ring-1 ring-slate-200 transition group-hover:opacity-100">
        <GripVertical className="h-3.5 w-3.5 text-slate-400" aria-hidden />
        <ToolbarButton label="Move up" disabled={index === 0} onClick={() => onMove(id, -1)}>
          <ChevronUp className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Move down" disabled={index === total - 1} onClick={() => onMove(id, 1)}>
          <ChevronDown className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Remove" danger onClick={() => onRemove(id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      <div
        ref={contentRef}
        className={drag ? 'pointer-events-none' : ''}
        style={contentStyle}
      >
        {isShape
          ? <GenericShape id={id} box={box} onBoxChange={(patch) => onBoxChange(id, patch)} />
          : <ModuleView id={id} ctx={ctxWithBox} />}
      </div>

      {selected && !drag && (
        <div className="pointer-events-none absolute z-30" style={{ inset: -4 }}>
          {CORNER_HANDLES.map((h) => (
            <span
              key={h.k}
              onMouseDown={(e) => startResize(e, h.k)}
              className={`pointer-events-auto absolute h-2.5 w-2.5 rounded-full border-2 border-[#0040DF] bg-white shadow-sm ${h.cls}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PageCanvas({
  page, pageLabel, modules, ctx, drag, dropIndex, accent, isDark, radius,
  onStartDrag, onEndDrag, onItemDragOver, onDrop, onMove, onRemove, onQuickAdd,
  selectedId, onSelect, boxes, onMeasure, onBoxChange,
}: {
  page: PageId; pageLabel: string; modules: ModuleId[];
  ctx: ViewCtx; drag: DragState; dropIndex: number | null; accent: string;
  isDark: boolean; radius: Radius;
  onStartDrag: (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => void;
  onEndDrag: () => void;
  onItemDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent) => void;
  onMove: (id: ModuleId, dir: -1 | 1) => void;
  onRemove: (id: ModuleId) => void;
  onQuickAdd: (id: ModuleId) => void;
  selectedId: ModuleId | null;
  onSelect: (id: ModuleId | null) => void;
  boxes: Record<string, ModuleBox>;
  onMeasure: (id: ModuleId, size: { w: number; h: number }) => void;
  onBoxChange: (id: ModuleId, patch: ModuleBox) => void;
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

  return (
    <div className="relative min-h-full space-y-3 pb-20">
      {modules.map((id, i) => (
        <ModuleWrapper
          key={id}
          id={id}
          index={i}
          total={modules.length}
          selected={selectedId === id}
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
          onMove={onMove}
          onRemove={onRemove}
          onMeasure={onMeasure}
          onBoxChange={onBoxChange}
        />
      ))}
    </div>
  );
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
            <span className="text-[9px] text-slate-400">Choose a shape, then drag to draw</span>
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
        <button type="button" aria-label="Rectangle tool" title="Rectangle" onClick={() => chooseTool('shape-rect')}
          className={`grid h-8 w-8 place-items-center rounded-lg transition ${drawTool === 'shape-rect' ? 'bg-[#E8EDFF] text-[#0040DF]' : 'text-slate-500 hover:bg-slate-100'}`}>
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
  onStartDrag, onEndDrag, onItemDragOver, onDrop, onMove, onRemove, onQuickAdd,
  onNavTab, boxes, onMeasure, onBoxChange, onAddShape,
}: {
  device: DeviceType; zoom: number; onZoom: (z: number) => void;
  pageModules: Record<PageId, ModuleId[]>;
  activePage: PageId; pageLabel: string;
  drag: DragState; dropIndex: number | null;
  ctx: ViewCtx; accent: string; isDark: boolean; radius: Radius;
  selectedId: ModuleId | null; onSelect: (id: ModuleId | null) => void;
  onStartDrag: (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => void;
  onEndDrag: () => void;
  onItemDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent) => void;
  onMove: (id: ModuleId, dir: -1 | 1) => void;
  onRemove: (id: ModuleId) => void;
  onQuickAdd: (id: ModuleId) => void;
  onNavTab: (tab: TabId) => void;
  boxes: Record<string, ModuleBox>;
  onMeasure: (id: ModuleId, size: { w: number; h: number }) => void;
  onBoxChange: (id: ModuleId, patch: ModuleBox) => void;
  onAddShape: (type: CanvasInsertType, box: DrawBox) => void;
}) {
  const dims = device === 'iphone' ? { w: 320, h: 640 }
    : device === 'pixel' ? { w: 340, h: 640 }
    : { w: 700, h: 680 };
  const frameRadius  = device === 'iphone' ? 'rounded-[42px]' : device === 'pixel' ? 'rounded-[32px]' : 'rounded-[24px]';
  const screenRadius = device === 'iphone' ? 'rounded-[32px]' : device === 'pixel' ? 'rounded-[24px]' : 'rounded-[18px]';

  const bodyRef = React.useRef<HTMLDivElement>(null);
  const mainRef = React.useRef<HTMLElement>(null);
  const drawAreaRef = React.useRef<HTMLDivElement>(null);
  const suppressCanvasClickRef = React.useRef(false);
  const zoomRef = React.useRef(zoom);
  const [panMode, setPanMode] = useState(false);
  const [drawTool, setDrawTool] = useState<CanvasInsertType | null>(null);
  const [drawPreview, setDrawPreview] = useState<DrawPreview | null>(null);
  zoomRef.current = zoom;

  React.useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 10 : -10;
      onZoom(Math.max(25, Math.min(400, zoomRef.current + delta)));
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [onZoom]);

  const autoScroll = (clientY: number) => {
    const el = bodyRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (clientY < r.top + 48) el.scrollBy({ top: -14 });
    else if (clientY > r.bottom - 48) el.scrollBy({ top: 14 });
  };

  const startCanvasPan = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!panMode || !bodyRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    const body = bodyRef.current;
    const startY = event.clientY;
    const startScrollTop = body.scrollTop;
    const handleMove = (moveEvent: MouseEvent) => {
      body.scrollTop = startScrollTop - (moveEvent.clientY - startY);
    };
    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const startCanvasDrawing = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!drawTool || panMode || event.button !== 0 || !drawAreaRef.current || !bodyRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressCanvasClickRef.current = true;

    const area = drawAreaRef.current;
    const body = bodyRef.current;
    const getPoint = (clientX: number, clientY: number) => {
      const rect = area.getBoundingClientRect();
      const scaleX = rect.width / (area.offsetWidth || 1) || 1;
      const scaleY = rect.height / (area.offsetHeight || 1) || 1;
      return {
        x: (clientX - rect.left) / scaleX,
        y: (clientY - rect.top) / scaleY + body.scrollTop,
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
        if (width < 8) box.w = 140;
        if (height < 8) box.h = 36;
      } else if (drawTool === 'shape-comment') {
        if (width < 8) box.w = 140;
        if (height < 8) box.h = 72;
      } else {
        box.w = Math.max(8, width);
        box.h = Math.max(8, height);
      }
      onAddShape(drawTool, box);
      setDrawPreview(null);
      setDrawTool(null);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  return (
    <main ref={mainRef} className="relative flex min-w-0 flex-1 flex-col items-center overflow-hidden bg-gradient-to-b from-[#EEF0FB] via-[#F6F7FE] to-[#EEF0FB] pb-4">
      <p className="flex items-center gap-1.5 py-3 text-[10px] font-medium text-slate-500">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live Sandbox · {zoom}%
        <span className="text-slate-400">· Ctrl+Scroll to zoom</span>
      </p>

      <div
        className="relative mx-auto shrink-0"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          willChange: 'transform',
        }}
      >
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
                const hasDrag = e.dataTransfer.types.includes('application/x-pf-module-id') || e.dataTransfer.types.includes('application/x-pf-asset-id');
                if (!drag && !hasDrag) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = drag?.from === 'library' ? 'copy' : 'move';
                if (drag) autoScroll(e.clientY);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onEndDrag();
              }}
              onDrop={onDrop}
              onMouseDownCapture={startCanvasPan}
              onClick={(e) => { if (e.target === e.currentTarget) onSelect(null); }}
              className={`flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-3 pb-20 pt-1 ${panMode ? 'cursor-grab' : ''}`}>
              <div
                ref={drawAreaRef}
                onMouseDownCapture={startCanvasDrawing}
                onClick={(e) => {
                  if (suppressCanvasClickRef.current) {
                    suppressCanvasClickRef.current = false;
                    e.stopPropagation();
                    return;
                  }
                  if (e.target === e.currentTarget) onSelect(null);
                }}
                className={`relative min-h-full ${drawTool ? 'cursor-crosshair' : ''}`}
              >
                <PageCanvas
                  page={activePage} pageLabel={pageLabel}
                  modules={pageModules[activePage] ?? []}
                  ctx={ctx} drag={drag} dropIndex={dropIndex} accent={accent}
                  isDark={isDark} radius={radius}
                  onStartDrag={onStartDrag} onEndDrag={onEndDrag}
                  onItemDragOver={onItemDragOver} onDrop={onDrop}
                  onMove={onMove} onRemove={onRemove} onQuickAdd={onQuickAdd}
                  selectedId={selectedId} onSelect={onSelect}
                  boxes={boxes} onMeasure={onMeasure} onBoxChange={onBoxChange}
                />
                {drawPreview && (
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
                      box={{
                        ...drawPreview.box,
                        fillType: ['shape-text', 'shape-comment', 'shape-line', 'shape-scribble'].includes(drawPreview.type) ? 'none' : 'color',
                        fillColor: '#ffffff',
                        strokeWidth: 2,
                        strokeColor: '#0040DF',
                      }}
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
      
      {/* Figma-like Toolbar */}
      <CanvasToolbar
        onSelectTool={setDrawTool}
        onSelect={onSelect}
        panMode={panMode}
        onPanModeChange={setPanMode}
        drawTool={drawTool}
      />
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

function AdvancedColorPicker({
  color, onChange, position, title, onClose,
}: {
  color: string;
  onChange: (hex: string) => void;
  position: PickerPosition;
  title: string;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<'Solid' | 'Linear' | 'Radial'>('Solid');
  const [hexDraftState, setHexDraftState] = useState({ color, value: color.replace(/^#/, '').toUpperCase() });
  const hexDraft = hexDraftState.color === color
    ? hexDraftState.value
    : color.replace(/^#/, '').toUpperCase();

  const validColor = /^#[\da-f]{6}$/i.test(color) ? color : '#000000';
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#000000');
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  const rgb = hexToRgb(color);
  const rgbToHex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

  const brandPalette = ['#6D28D9', '#2563EB', '#1E293B', '#64748B', '#C7D2FE', '#FFFFFF'];
  const recentColors = ['#F8FAFC', '#8B5CF6', '#7C3AED', '#3B82F6', '#E0E7FF', '#1E293B'];

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
        <div className="flex rounded-md bg-slate-100 p-0.5">
          {(['Solid', 'Linear', 'Radial'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} type="button"
              className={`flex-1 rounded py-1 text-[10px] font-semibold ${mode === m ? 'bg-white shadow-sm text-[#0040DF]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="relative h-28 w-full overflow-hidden rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-black">
          <span className="pointer-events-none absolute left-2 top-2 h-5 w-5 rounded-full border-2 border-white ring-2 ring-[#0040DF]" style={{ backgroundColor: validColor }} />
          <input
            type="color"
            aria-label="Choose color"
            value={validColor}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>

        <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500">
          <input type="range" min="0" max="360" className="absolute inset-0 w-full opacity-0 cursor-pointer" />
          <div className="absolute right-1/4 top-0 h-3 w-2 rounded bg-white shadow" />
        </div>

        <div className="relative h-3 w-full rounded-full bg-slate-100 border border-slate-200">
          <input type="range" min="0" max="100" className="absolute inset-0 w-full opacity-0 cursor-pointer" />
          <div className="absolute right-1/2 top-0 h-3 w-2 rounded bg-white shadow" />
        </div>

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
                setHexDraftState({ color, value: next });
                if (/^[\da-f]{6}$/i.test(next)) onChange(`#${next}`);
              }}
              onBlur={() => {
                if (!/^[\da-f]{6}$/i.test(hexDraft)) {
                  setHexDraftState({ color, value: color.replace(/^#/, '').toUpperCase() });
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
                  onChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
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
              <button key={c} type="button" onClick={() => onChange(c)} className="h-6 w-6 rounded border border-slate-200" style={{ background: c }} />
            ))}
          </div>
        </div>

        <div>
          <span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-500">Recent Colors</span>
          <div className="flex gap-1.5">
            {recentColors.map(c => (
              <button key={c} type="button" onClick={() => onChange(c)} className="h-6 w-6 rounded-full border border-slate-200" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document === 'undefined' ? null : createPortal(picker, document.body);
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
            <input
              type="color" value={box.shadowColor ?? '#000000'}
              onChange={(e) => handleChange({ shadowColor: e.target.value })}
              className="h-6 w-6 rounded border border-slate-200"
            />
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
  const alignments = [
    { icon: AlignLeft, value: 'left', label: 'Align left' },
    { icon: AlignCenter, value: 'center', label: 'Align center' },
    { icon: AlignRight, value: 'right', label: 'Align right' },
    { icon: AlignJustify, value: 'justify', label: 'Justify' },
  ] as const;
  const decorations = (textStyle.textDecorationLine ?? '').split(' ').filter(Boolean);
  const toggleDecoration = (value: 'underline' | 'line-through') => {
    const next = decorations.includes(value)
      ? decorations.filter((item) => item !== value)
      : [...decorations, value];
    onStyleChange({ textDecorationLine: next.length ? next.join(' ') : undefined });
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-slate-500" />
          <span className="text-[12px] font-bold text-slate-800">Text & Formatting</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onStyleChange(null)}
            className="text-[11px] font-semibold text-slate-400 hover:text-rose-500"
          >
            Reset formatting
          </button>
          <button type="button" onClick={onClose} aria-label="Close text formatting" className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <section className="space-y-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{textLabel}</h3>
          <textarea
            aria-label={`Edit ${textLabel}`}
            value={textValue}
            onChange={(event) => onTextChange(event.target.value)}
            rows={3}
            className="w-full resize-y rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] outline-none focus:border-[#0040DF] focus:bg-white"
          />
        </section>

        {/* Typography Section */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Typography</h3>
          
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600">Font Family</label>
            <select 
              aria-label="Font Family"
              value={textStyle.fontFamily ?? 'inherit'}
              onChange={(event) => onStyleChange({
                fontFamily: event.target.value === 'inherit' ? undefined : event.target.value,
              })}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] outline-none focus:border-[#0040DF] focus:bg-white"
            >
              <option value="inherit">Current font</option>
              <option value={urbanist.style.fontFamily}>Urbanist</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Courier New', monospace">Courier New</option>
              <option value="system-ui, sans-serif">System UI</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600">Font Weight</label>
            <select 
              aria-label="Font Weight"
              value={textStyle.fontWeight ?? 'inherit'}
              onChange={(event) => onStyleChange({
                fontWeight: event.target.value === 'inherit' ? undefined : Number(event.target.value),
              })}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] outline-none focus:border-[#0040DF] focus:bg-white"
            >
              <option value="inherit">Current weight</option>
              <option value="400">Regular (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">Font Size</label>
              <div className="flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 focus-within:border-[#0040DF] focus-within:bg-white">
                <input 
                  type="number" 
                  aria-label="Font Size"
                  min="1"
                  value={textStyle.fontSize ? Number.parseFloat(String(textStyle.fontSize)) : ''}
                  onChange={(event) => onStyleChange({
                    fontSize: event.target.value ? Math.max(1, Number(event.target.value)) : undefined,
                  })}
                  className="w-full bg-transparent text-[12px] outline-none text-right" 
                />
                <span className="ml-1 text-[10px] text-slate-400">px</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-600">Line Height</label>
              <div className="flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 focus-within:border-[#0040DF] focus-within:bg-white">
                <input 
                  type="number" 
                  aria-label="Line Height"
                  min="1"
                  value={textStyle.lineHeight ? Number.parseFloat(String(textStyle.lineHeight)) : ''}
                  onChange={(event) => onStyleChange({
                    lineHeight: event.target.value ? `${Math.max(1, Number(event.target.value))}px` : undefined,
                  })}
                  className="w-full bg-transparent text-[12px] outline-none text-right" 
                />
                <span className="ml-1 text-[10px] text-slate-400">px</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-600">Letter Spacing</label>
            <div className="flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 focus-within:border-[#0040DF] focus-within:bg-white">
              <input 
                type="number" 
                aria-label="Letter Spacing"
                step="0.1"
                value={textStyle.letterSpacing === undefined
                  ? ''
                  : Number.parseFloat(String(textStyle.letterSpacing))}
                onChange={(event) => onStyleChange({
                  letterSpacing: event.target.value ? Number(event.target.value) : undefined,
                })}
                className="w-full bg-transparent text-[12px] outline-none text-right" 
              />
              <span className="ml-1 text-[10px] text-slate-400">px</span>
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Colors</h3>
          
          <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="Text Color"
                value={textStyle.color ?? '#0f172a'}
                onChange={(event) => onStyleChange({ color: event.target.value })}
                className="h-6 w-6 cursor-pointer rounded border border-slate-300"
              />
              <span className="text-[12px] font-medium text-slate-700">Text Color</span>
            </div>
            <button
              type="button"
              onClick={() => onStyleChange({ color: undefined })}
              className="font-mono text-[11px] uppercase text-slate-500 hover:text-[#0040DF]"
            >
              {textStyle.color ?? 'Inherited'}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="Text Background Color"
                value={textStyle.backgroundColor ?? '#ffffff'}
                onChange={(event) => onStyleChange({ backgroundColor: event.target.value })}
                className="h-6 w-6 cursor-pointer rounded border border-slate-300"
              />
              <span className="text-[12px] font-medium text-slate-700">Background</span>
            </div>
            <button
              type="button"
              onClick={() => onStyleChange({ backgroundColor: undefined })}
              className="font-mono text-[11px] uppercase text-slate-500 hover:text-[#0040DF]"
            >
              {textStyle.backgroundColor ?? 'None'}
            </button>
          </div>
        </section>

        {/* Alignment Section */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Alignment</h3>
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
            {alignments.map(({ icon: Icon, value, label }) => (
              <button
                key={value}
                type="button"
                aria-label={label}
                aria-pressed={(textStyle.textAlign ?? 'left') === value}
                onClick={() => onStyleChange({ textAlign: value })}
                className={`flex flex-1 items-center justify-center rounded-md py-1.5 ${
                  (textStyle.textAlign ?? 'left') === value
                    ? 'bg-white text-[#0040DF] shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </section>

        {/* Decoration Section */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Decoration</h3>
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              aria-label="Underline"
              aria-pressed={decorations.includes('underline')}
              onClick={() => toggleDecoration('underline')}
              className={`flex flex-1 items-center justify-center rounded-md py-1.5 ${
                decorations.includes('underline') ? 'bg-white text-[#0040DF] shadow-sm' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Underline className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Strikethrough"
              aria-pressed={decorations.includes('line-through')}
              onClick={() => toggleDecoration('line-through')}
              className={`flex flex-1 items-center justify-center rounded-md py-1.5 ${
                decorations.includes('line-through') ? 'bg-white text-[#0040DF] shadow-sm' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Strikethrough className="h-4 w-4" />
            </button>
          </div>
        </section>
        
        {/* Transform Section */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Case</h3>
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
            {([
              { label: 'AA', value: 'uppercase' },
              { label: 'Aa', value: 'capitalize' },
              { label: 'aa', value: 'lowercase' },
            ] as const).map(({ label, value }) => (
              <button
                key={value}
                type="button"
                aria-label={`${label} case`}
                aria-pressed={textStyle.textTransform === value}
                onClick={() => onStyleChange({ textTransform: value })}
                className={`flex flex-1 items-center justify-center rounded-md py-1.5 text-[11px] font-semibold ${
                  textStyle.textTransform === value
                    ? 'bg-white text-[#0040DF] shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

function RightPanel({
  tab, onTab, selectedId, accent, wsStatus, workflowOpen, onToggleWorkflow,
  box, measured, onBoxChange, onResetBox,
  overrides, textStyles, setText, setColor, setTextStyle, onResetModuleOverrides,
  activeTextSlot, setActiveTextSlot,
}: {
  tab: RightTab; onTab: (t: RightTab) => void;
  selectedId: ModuleId | null; accent: string;
  wsStatus: 'active' | 'connecting' | 'disconnected';
  workflowOpen: boolean; onToggleWorkflow: () => void;
  box: ModuleBox;
  measured: { w: number; h: number } | null;
  onBoxChange: (id: ModuleId, patch: ModuleBox) => void;
  onResetBox: (id: ModuleId) => void;
  overrides: Record<string, { text: Record<string, string>; colors: Record<string, string> }>;
  textStyles: Record<string, Record<string, EditableTextStyle>>;
  setText: (moduleId: ModuleId, slot: string, value: string | null) => void;
  setColor: (moduleId: ModuleId, slot: string, value: string | null) => void;
  setTextStyle: (moduleId: ModuleId, slot: string, patch: Partial<EditableTextStyle> | null) => void;
  onResetModuleOverrides: (moduleId: ModuleId) => void;
  activeTextSlot: string | null;
  setActiveTextSlot: (slot: string | null) => void;
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
  const mod = selectedId ? moduleFor(selectedId) : null;
  const selectedShapeTitle = canvasObjectTitle(selectedId);
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

  // Conditional Render for Text Formatting Panel
  if (activeTextSlot) {
    return (
      <aside className="flex w-[340px] shrink-0 flex-col border-l border-slate-200 bg-white">
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
    <aside className="flex w-[340px] shrink-0 flex-col border-l border-slate-200 bg-white">
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
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!selectedTitle || !selectedSubtitle ? (
          <div className="flex flex-col items-center justify-center gap-2.5 px-4 py-16 text-center">
            <Diamond className="h-6 w-6 text-slate-300" />
            <p className="text-[12px] text-slate-400">Select a component on the phone<br />to edit its properties</p>
          </div>
        ) : (
          <>
            <div className="border-b border-slate-200 px-3 py-2.5">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <Diamond className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                    <p className="truncate text-[11px] font-bold">{selectedTitle}</p>
                  </div>
                  <span className="ml-2 rounded bg-indigo-100 px-1.5 py-0.5 text-[11px] font-bold text-indigo-700">Master</span>
                </div>
                <p className="mt-1 truncate text-[9px] text-slate-500">{selectedSubtitle}</p>
                <div className="mt-2 border-t border-slate-200 pt-2">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Variant State</span>
                    <span className="text-[11px] font-semibold text-[#0040DF]">3 variants</span>
                  </div>
                  <div className="flex gap-1 rounded-md border border-slate-200 bg-white p-0.5">
                    {(['Default', 'Masked', 'Negative'] as const).map((v) => (
                      <button key={v}
                        className={`flex-1 rounded py-1 text-[11px] font-semibold transition ${
                          v === 'Default' ? 'bg-[#0040DF] text-white shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                        }`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
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
                    onClick={() => onBoxChange(selectedId!, { fillType: 'color', fillColor: box.fillColor || '#6D28D9' })}
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
                {/* 1. Generic Color Fill */}
                {box.fillType === 'color' && (
                  <div className="relative flex items-center gap-2 rounded-lg border border-white bg-white p-2 shadow-sm">
                    <button
                      type="button"
                      aria-label="Choose fill color"
                      onClick={(e) => toggleColorPicker(e, 'fill')}
                      className="h-7 w-7 shrink-0 rounded border border-slate-300 shadow-sm"
                      style={{ background: box.fillColor || '#6D28D9' }}
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-[11px] font-semibold text-slate-700">Solid Color</span>
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
                        position={colorPickerPosition}
                        title="Fill color"
                        onClose={closeColorPicker}
                        onChange={(c) => onBoxChange(selectedId!, { fillColor: c })}
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
                      aria-label={`Apply ${name} fill`}
                      title={`${name} ${color}`}
                      onClick={() => onBoxChange(selectedId!, { fillType: 'color', fillColor: color })}
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
                <label className="relative h-5 w-5 shrink-0 cursor-pointer overflow-hidden rounded border border-slate-300" title="Stroke color">
                  <span className="absolute inset-0" style={{ background: box.strokeColor ?? '#6941C6' }} />
                  <input type="color" value={box.strokeColor ?? '#6941C6'} onChange={(e) => onBoxChange(selectedId!, { strokeColor: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" />
                </label>
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
            <section className="border-b border-slate-200 px-4 py-4">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Workflow Triggers</span>
                <button onClick={onToggleWorkflow} className="flex items-center gap-1 text-[11px] font-semibold text-[#0040DF]">
                  <Plus className="h-3 w-3" /> Add Action
                </button>
              </div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> WHEN: On Tap
              </div>
              {workflowOpen && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 rounded-md bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">1</span>
                    <p className="flex-1 text-[11px] font-semibold">Validate KYC Status (Passkey)</p>
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-[#0040DF] ring-1 ring-blue-200">Rule</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-md bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">2</span>
                    <p className="flex-1 text-[11px] font-semibold">Open BottomSheet: /wallet/details</p>
                    <span className="rounded bg-purple-50 px-1.5 py-0.5 text-[9px] font-bold text-purple-700 ring-1 ring-purple-200">Spring</span>
                  </div>
                </div>
              )}
            </section>

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
        <button className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#0040DF] py-2.5 text-[12px] font-bold text-white hover:bg-[#0036BF]">
          <Play className="h-4 w-4" /> Preview
        </button>
        <button className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50">
          <Code2 className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

/* ═══════════════════════════ StudioClient ═══════════════════════════ */

export default function StudioClient() {
  const [mode, setMode] = useState<StudioMode>('design');
  const [device, setDevice] = useState<DeviceType>('iphone');
  const [zoom, setZoom] = useState(100);
  const [saveState] = useState<SaveState>('saved');
  const [rightTab, setRightTab] = useState<RightTab>('design');
  const [workflowOpen, setWorkflowOpen] = useState(true);

  const [appKind, setAppKind] = useState<AppKind>('banking');
  const [activePage, setActivePage] = useState<PageId>('home');
  const [expandedPage, setExpandedPage] = useState<PageId | null>('home');
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

  // Add state for active text slot
  const [activeTextSlot, setActiveTextSlot] = useState<string | null>(null);

  const [boxes, setBoxes] = useState<Record<string, ModuleBox>>({});
  const [measured, setMeasured] = useState<Record<string, { w: number; h: number }>>({});

  const {
    overrides,
    textStyles,
    setText,
    setColor,
    setTextStyle,
    reset: resetOverrides,
  } = useEditOverrides();

  const editState = {
    mode: (mode === 'design' ? 'edit' : 'view') as 'view' | 'edit',
    selectedId,
    overrides,
    textStyles,
    setText,
    setColor,
    setTextStyle,
    reset: resetOverrides,
    activeTextSlot,         // Pass to context
    setActiveTextSlot,      // Pass to context
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

  const onMeasure = React.useCallback((id: ModuleId, size: { w: number; h: number }) => {
    setMeasured((prev) => {
      const cur = prev[id];
      if (cur && cur.w === size.w && cur.h === size.h) return prev;
      return { ...prev, [id]: size };
    });
  }, []);

  const [accentColor] = useState('#0040DF');
  const [buttonRadius] = useState<RadiusMode>('rounded');
  const isDark = false;
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
    setDrag({ id, from });
  };
  const endDrag = () => { setDrag(null); setDropIndex(null); };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    const types = Array.from(e.dataTransfer.types);
    const isOurDrag = types.includes('application/x-pf-module-id');
    if (!drag && !isOurDrag) return;
    e.preventDefault(); e.stopPropagation();
    if (drag) {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropIndex(e.clientY < rect.top + rect.height / 2 ? index : index + 1);
    }
  };

  const handleAssetDrop = (assetId: string, moduleId: ModuleId | null) => {
    if (!moduleId) return;
    const asset = (allAssetsForLookup || []).find((a) => a.id === assetId);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    const assetId = e.dataTransfer.getData('application/x-pf-asset-id');
    if (assetId) {
      handleAssetDrop(assetId, selectedId);
      endDrag();
      return;
    }
    const id = (drag?.id ?? e.dataTransfer.getData('application/x-pf-module-id')) as ModuleId | '';
    if (!id) { endDrag(); return; }
    if (!allModulesFor().some((m) => m.id === id) && !id.startsWith('shape-')) { endDrag(); return; }

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

  const addModule = (id: ModuleId) => {
    if (SINGLE_SLOT[activePage]) { commit([id]); setSelectedId(id); return; }
    if (currentModules.includes(id)) return;
    commit([...currentModules, id]);
    setSelectedId(id);
  };
  const removeModule = (id: ModuleId) => {
    commit(currentModules.filter((m) => m !== id));
    if (selectedId === id) setSelectedId(null);
  };
  const moveModule = (id: ModuleId, dir: -1 | 1) => {
    const i = currentModules.indexOf(id);
    const j = i + dir;
    if (i === -1 || j < 0 || j >= currentModules.length) return;
    const next = [...currentModules];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next);
  };

  const quickAdd = (id: ModuleId) => addModule(id);

  const handleNavTab = (tab: TabId) => {
    setActivePage(TAB_TO_PAGE[tab]);
    setSelectedId(null);
  };

  const handleAddShape = (type: CanvasInsertType, geometry: DrawBox) => {
    const newId = `${type}-${Date.now()}` as ModuleId;
    commit([...currentModules, newId]);
    setSelectedId(newId);
    onBoxChange(newId, {
      ...geometry,
      fillType: type === 'shape-text' || type === 'shape-comment' || type === 'shape-line' || type === 'shape-scribble' ? 'none' : 'color',
      fillColor: '#ffffff',
      strokeWidth: 2,
      strokeColor: '#0040DF',
      text: type === 'shape-text' ? 'Text' : undefined,
    });
  };

  // Wrapper to reset text slot on new selection
  const handleSelectModule = (id: ModuleId | null) => {
    setSelectedId(id);
    setActiveTextSlot(null);
  };

  return (
    <EditProvider value={editState}>
      <div className={`${urbanist.className} flex h-screen w-full flex-col overflow-hidden bg-[#F3F4F8] text-slate-900`}>
        <TopBar mode={mode} onMode={setMode} device={device} onDevice={setDevice}
          zoom={zoom} onZoom={setZoom} saveState={saveState} onPublish={() => {}} />
        <div className="flex min-h-0 flex-1">
          <IconRail />
          <LeftPanel
            appKind={appKind} onAppKind={setAppKind}
            activePage={activePage} onSelectPage={(p) => { setActivePage(p); setSelectedId(null); }}
            expandedPage={expandedPage} onToggleExpand={(p) => setExpandedPage((v) => (v === p ? null : p))}
            pageModules={pageModules} accent={accentColor}
            onStartDrag={startDrag} onEndDrag={endDrag} drag={drag}
            onAddModule={addModule} onRemoveModule={removeModule}
            selectedId={selectedId}
            onSelectModule={handleSelectModule}
            onSelectTextSlot={(id, slot) => {
              setSelectedId(id);
              setActiveTextSlot(slot);
            }}
            measured={measured} 
            onAssetClick={(asset) => setAllAssetsForLookup((assets) => [
              ...assets.filter((item) => item.id !== asset.id),
              asset,
            ])}
          />
          <Canvas
            device={device} zoom={zoom} onZoom={setZoom}
            pageModules={pageModules} activePage={activePage} pageLabel={currentPageLabel}
            drag={drag} dropIndex={dropIndex}
            ctx={liveCtx} accent={accentColor} isDark={isDark} radius={radius}
            selectedId={selectedId} onSelect={handleSelectModule}
            onStartDrag={startDrag} onEndDrag={endDrag}
            onItemDragOver={handleItemDragOver} onDrop={handleDrop}
            onMove={moveModule} onRemove={removeModule} onQuickAdd={quickAdd}
            onNavTab={handleNavTab}
            boxes={boxes}
            onMeasure={onMeasure}
            onBoxChange={onBoxChange}
            onAddShape={handleAddShape}
          />
          <RightPanel
            tab={rightTab} onTab={setRightTab}
            selectedId={selectedId} accent={accentColor} wsStatus={wsStatus}
            workflowOpen={workflowOpen} onToggleWorkflow={() => setWorkflowOpen((v) => !v)}
            box={selectedId ? boxes[selectedId] ?? {} : {}}
            measured={selectedId ? measured[selectedId] ?? null : null}
            onBoxChange={onBoxChange}
            onResetBox={onResetBox}
            overrides={overrides}
            textStyles={textStyles}
            setText={setText}
            setColor={setColor}
            setTextStyle={setTextStyle}
            onResetModuleOverrides={resetOverrides}
            activeTextSlot={activeTextSlot}
            setActiveTextSlot={setActiveTextSlot}
          />
        </div>
      </div>
    </EditProvider>
  );
}