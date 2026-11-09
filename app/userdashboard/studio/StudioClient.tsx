// /client/app/userdashboard/studio/StudioClient.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Urbanist, Outfit } from 'next/font/google';
import {
  ChevronDown, ChevronUp, ChevronsUpDown, GripVertical,
  Layers, Box, Workflow, Palette, ShieldCheck, Settings, Plus, PlusCircle,
  Trash2, Undo2, Home, Wallet,
  BarChart3, User, Play, Code2, Check, Braces, X, Diamond, CreditCard,
  Search,
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

import { EditProvider, useEditOverrides } from './edit-context';
import { EDITABLE_SCHEMA } from './editable-schema';

const urbanist = Urbanist({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });
const RESIZE_HANDLES = [
  { k: 'nw', cls: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize' },
  { k: 'n',  cls: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize' },
  { k: 'ne', cls: 'top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize' },
  { k: 'w',  cls: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
  { k: 'e',  cls: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
  { k: 'sw', cls: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize' },
  { k: 's',  cls: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize' },
  { k: 'se', cls: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize' },
] as const;

type DeviceType = 'iphone' | 'pixel' | 'tablet';
type StudioMode = 'design' | 'prototype' | 'workflows' | 'code';
type RightTab = 'design' | 'layout' | 'logic' | 'data' | 'code';
type SaveState = 'saving' | 'saved' | 'unsaved';
type DragState = { id: ModuleId; from: 'library' | 'canvas' } | null;
type ModuleBox = { w?: number; h?: number; x?: number; y?: number };

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
        <svg
              width="100"
              height="50"
              viewBox="100 0 150 201"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
  onStartDrag, onEndDrag, drag,
}: {
  pageId: PageId; label: string; count: number; active: boolean; expanded: boolean;
  accent: string; singleSlot: boolean; canvasModules: ModuleId[]; appKind: AppKind;
  onSelect: () => void; onToggleExpand: () => void;
  onAddModule: (id: ModuleId) => void; onRemoveModule: (id: ModuleId) => void;
  onStartDrag: (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => void;
  onEndDrag: () => void; drag: DragState;
}) {
  const pageComponents = allModulesFor().filter((m) => pageModulesFor(pageId, appKind).includes(m.id));

  return (
    <li className="relative list-none">
      <div className="flex items-center gap-2 rounded-lg border border-transparent px-2.5 py-1.5"
        style={active ? { background: `${accent}12`, borderColor: `${accent}38` } : undefined}>
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <button type="button" onClick={onSelect}
            style={active ? { color: accent } : undefined}
            className={`min-w-0 flex-1 cursor-pointer truncate text-left text-[12px] ${active ? 'font-semibold' : 'font-medium text-slate-700'}`}>
            {label}
          </button>
        </div>
        <span style={active ? { background: accent } : undefined}
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${active ? 'font-semibold text-white' : 'bg-[#E3E6F7] font-medium text-slate-500'}`}>
          {count} comps
        </span>
        <button type="button" onClick={onToggleExpand}
          aria-label={expanded ? `Hide ${label}` : `Show ${label}`}
          style={active ? { color: accent } : undefined}
          className={`grid h-5 w-5 place-items-center rounded-full ${active ? '' : 'text-slate-400 hover:text-slate-700'}`}>
          {expanded ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="my-1 ml-2 pl-2 border-l border-slate-200 space-y-0.5">
          {singleSlot && (
            <p className="mb-1 rounded-md bg-blue-50 px-2 py-1 text-[9px] font-medium text-blue-700">
              Single slot page — adding replaces current.
            </p>
          )}
          {pageComponents.map((mod) => {
            const isAdded = canvasModules.includes(mod.id);
            const isDragging = drag?.id === mod.id && drag.from === 'library';
            return (
              <div key={mod.id} draggable
                onDragStart={(e) => onStartDrag(e, mod.id, 'library')}
                onDragEnd={onEndDrag}
                className={`flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-100/80 cursor-grab active:cursor-grabbing group ${isDragging ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <GripVertical className="h-3 w-3 text-slate-300 shrink-0" />
                  <span className="text-[11px] font-medium text-slate-700 truncate">{mod.title}</span>
                </div>
                <button type="button" onClick={() => (isAdded ? onRemoveModule(mod.id) : onAddModule(mod.id))}
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded hover:bg-slate-200 ${isAdded ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {isAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </li>
  );
}

function LeftPanel({
  appKind, onAppKind, activePage, onSelectPage, expandedPage, onToggleExpand,
  pageModules, accent, onStartDrag, onEndDrag, drag, onAddModule, onRemoveModule,
}: {
  appKind: AppKind; onAppKind: (k: AppKind) => void;
  activePage: PageId; onSelectPage: (p: PageId) => void;
  expandedPage: PageId | null; onToggleExpand: (p: PageId) => void;
  pageModules: Record<PageId, ModuleId[]>;
  accent: string; drag: DragState;
  onStartDrag: (e: React.DragEvent, id: ModuleId, from: 'library' | 'canvas') => void;
  onEndDrag: () => void;
  onAddModule: (id: ModuleId) => void; onRemoveModule: (id: ModuleId) => void;
}) {
  const [tab, setTab] = useState<'navigator' | 'comps' | 'assets'>('navigator');
  const [query, setQuery] = useState('');

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

  const allMods = allModulesFor();
  const filteredMods = allMods.filter(
    (m) =>
      query === '' ||
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside className="flex w-[340px] shrink-0 flex-col border-r border-slate-200 bg-[#EDEFFC] scrollbar-thin-blue">
      {/* Tab bar */}
      <div className="flex items-center border-b border-slate-200 px-2 pt-2">
        <button
          onClick={() => setTab('navigator')}
          className={`flex flex-1 items-center justify-center gap-1 rounded-t-md px-1 py-1.5 text-[12px] font-bold uppercase tracking-wider transition-colors ${
            tab === 'navigator'
              ? 'border border-b-0 border-slate-200 bg-white text-[#0040DF]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="h-3 w-3" /> Navigator
        </button>
        <button
          onClick={() => setTab('comps')}
          className={`flex flex-1 items-center justify-center gap-1 rounded-t-md px-1 py-1.5 text-[12px] font-bold uppercase tracking-wider transition-colors ${
            tab === 'comps'
              ? 'border border-b-0 border-slate-200 bg-white text-[#0040DF]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Box className="h-3 w-3" /> Comps
        </button>
        <button
          onClick={() => setTab('assets')}
          className={`flex flex-1 items-center justify-center gap-1 rounded-t-md px-1 py-1.5 text-[12px] font-bold uppercase tracking-wider transition-colors ${
            tab === 'assets'
              ? 'border border-b-0 border-slate-200 bg-white text-[#0040DF]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette className="h-3 w-3" /> Assets
        </button>
      </div>

      {/* Search */}
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

      {/* Navigator tab */}
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

      {/* Comps tab */}
      {tab === 'comps' && (
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-3 pt-2 scrollbar-thin-blue [scrollbar-width:thin] [scrollbar-color:#0040DF_transparent] [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#0040DF] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#002db3]">
          {filteredMods.length === 0 && (
            <p className="py-6 text-center text-[10px] text-slate-400">No components found.</p>
          )}
          {filteredMods.map((mod) => {
  const isAdded = (pageModules[activePage] ?? []).includes(mod.id);
  const isDragging = drag?.id === mod.id && drag.from === 'library';
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
          <GripVertical className="h-3 w-3 shrink-0 text-slate-300" />
          <span className="truncate text-[9px] font-bold text-slate-800">{mod.title}</span>
          <span className={`shrink-0 rounded px-1 py-0.5 text-[7px] font-bold ${mod.badgeColor}`}>
            {mod.badge}
          </span>
        </div>
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
      <div className="relative overflow-hidden bg-[#F7F8FF] p-2" style={{ height: 140 }}>
        <div className="pointer-events-none origin-top-left" style={{ transform: 'scale(0.75)', width: '133%' }}>
          <ModuleView id={mod.id} ctx={previewCtx} passive />
        </div>
      </div>
    </div>
  );
})}
        </div>
      )}

      {/* Assets tab */}
      {tab === 'assets' && (
        <div className="flex flex-1 items-center justify-center px-4 text-center">
          <p className="text-[10px] text-slate-400">Assets library coming soon.</p>
        </div>
      )}
    </aside>
  );
}

/* ═══════════════════════════ Phone Canvas ═══════════════════════════ */

function BottomDockTabBar({
  activePage, isDark, onNavTab,
}: {
  activePage: PageId; isDark: boolean; onNavTab: (tab: TabId) => void;
}) {
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

function ToolbarButton({
  label, onClick, disabled, danger, children,
}: {
  label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode;
}) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`grid h-6 w-6 place-items-center rounded-full transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 ${danger ? 'text-rose-500' : 'text-slate-600'}`}>
      {children}
    </button>
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
  const ref = useRef<HTMLDivElement>(null);
  const isSource = drag?.from === 'canvas' && drag.id === id;

  /* Report natural size to the right panel whenever it changes */
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      onMeasure(id, {
        w: Math.round(entry.contentRect.width),
        h: Math.round(entry.contentRect.height),
      });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [id, onMeasure]);

  /* Drag a handle → compute deltas and update w/h/x/y */
  const startResize = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const startW = rect.width;
    const startH = rect.height;
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const baseX = box.x ?? 0;
    const baseY = box.y ?? 0;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startClientX;
      const dy = ev.clientY - startClientY;
      const patch: ModuleBox = {};

      if (handle.includes('e')) patch.w = Math.max(40, Math.round(startW + dx));
      if (handle.includes('w')) {
        patch.w = Math.max(40, Math.round(startW - dx));
        patch.x = Math.round(baseX + dx);
      }
      if (handle.includes('s')) patch.h = Math.max(20, Math.round(startH + dy));
      if (handle.includes('n')) {
        patch.h = Math.max(20, Math.round(startH - dy));
        patch.y = Math.round(baseY + dy);
      }
      onBoxChange(id, patch);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const wrapperStyle: React.CSSProperties = {
    ['--tw-ring-color' as string]: accent,
    outline: selected ? '2px solid #0040DF' : undefined,
    outlineOffset: 4,
    borderRadius: 0,
    width: box.w !== undefined ? box.w : undefined,
    height: box.h !== undefined ? box.h : undefined,
    transform:
      box.x !== undefined || box.y !== undefined
        ? `translate(${box.x ?? 0}px, ${box.y ?? 0}px)`
        : undefined,
  };

  return (
    <div
      ref={ref}
      data-module-id={id}
      draggable
      onDragStart={(e) => onStartDrag(e, id, 'canvas')}
      onDragEnd={onEndDrag}
      onDragOver={(e) => onItemDragOver(e, index)}
      onDrop={onDrop}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      style={wrapperStyle}
      className={`group relative cursor-grab active:cursor-grabbing ${radius.card} ${
        isDark ? 'ring-offset-slate-950' : 'ring-offset-[#F7F8FF]'
      } ${isSource ? 'opacity-40' : ''}`}
    >
      {drag && dropIndex === index && <DropLine side="top" accent={accent} />}
      {drag && dropIndex === total && index === total - 1 && <DropLine side="bottom" accent={accent} />}

      {/* Hover toolbar */}
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

      <div className={drag ? 'pointer-events-none' : ''}>
        <ModuleView id={id} ctx={ctx} />
      </div>

      {/* 8 resize handles — shown only when selected & not dragging */}
      {selected && !drag && (
        <div className="pointer-events-none absolute z-30" style={{ inset: -4 }}>
          {RESIZE_HANDLES.map((h) => (
            <span
              key={h.k}
              onMouseDown={(e) => startResize(e, h.k)}
              className={`pointer-events-auto absolute h-2 w-2 rounded-full border-2 border-[#0040DF] bg-white shadow-sm ${h.cls}`}
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
        className={`my-auto flex flex-col items-center justify-center space-y-3 border-2 border-dashed p-6 text-center transition-colors ${radius.card} ${drag ? 'border-solid' : isDark ? 'border-slate-700 bg-slate-900/50' : 'border-blue-300/60 bg-blue-50/20'}`}>
        <div className={`grid h-12 w-12 place-items-center text-white shadow-sm ${radius.icon}`} style={{ background: accent }}><Plus className="h-6 w-6" /></div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold">{drag ? 'Drop to add it here' : `Build the ${pageLabel} page`}</h4>
          <p className="text-[11px] text-slate-500">Drag tiles from the left panel.</p>
        </div>
      </div>
    );
  }

   return (
    <div className="space-y-3">
      {modules.map((id, i) => {
        const isSource = drag?.from === 'canvas' && drag.id === id;
        const isSelected = selectedId === id;
        return (
          <div key={id} data-module-id={id} draggable={!isSelected}
            onDragStart={(e) => { if (isSelected) { e.preventDefault(); return; } onStartDrag(e, id, 'canvas'); }}
            onDragEnd={onEndDrag}
            onDragOver={(e) => onItemDragOver(e, i)}
            onDrop={onDrop}
            onClick={() => onSelect(id)}
            style={{
              ['--tw-ring-color' as string]: accent,
              outline: isSelected ? '2px solid #0040DF' : undefined,
              outlineOffset: 4,
              borderRadius: 0,
            } as React.CSSProperties}
            className={`group relative cursor-grab active:cursor-grabbing ${radius.card} ${isDark ? 'ring-offset-slate-950' : 'ring-offset-[#F7F8FF]'} ${isSource ? 'opacity-40' : ''}`}>
            {drag && dropIndex === i && <DropLine side="top" accent={accent} />}
            {drag && dropIndex === modules.length && i === modules.length - 1 && <DropLine side="bottom" accent={accent} />}

            <div className="absolute -top-3.5 right-2 z-20 flex items-center gap-0.5 rounded-full bg-white p-0.5 opacity-0 shadow-md ring-1 ring-slate-200 transition group-hover:opacity-100">
              <GripVertical className="h-3.5 w-3.5 text-slate-400" aria-hidden />
              <ToolbarButton label="Move up" disabled={i === 0} onClick={() => onMove(id, -1)}><ChevronUp className="h-3.5 w-3.5" /></ToolbarButton>
              <ToolbarButton label="Move down" disabled={i === modules.length - 1} onClick={() => onMove(id, 1)}><ChevronDown className="h-3.5 w-3.5" /></ToolbarButton>
              <ToolbarButton label="Remove" danger onClick={() => onRemove(id)}><Trash2 className="h-3.5 w-3.5" /></ToolbarButton>
            </div>

            <div className={drag ? 'pointer-events-none' : ''}>
              <ModuleView id={id} ctx={ctx} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Canvas({
  device, zoom, onZoom, pageModules, activePage, pageLabel, drag, dropIndex,
  ctx, accent, isDark, radius, selectedId, onSelect,
  onStartDrag, onEndDrag, onItemDragOver, onDrop, onMove, onRemove, onQuickAdd,
  onNavTab, boxes, onMeasure, onBoxChange,
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
}) {
  const dims = device === 'iphone' ? { w: 320, h: 640 }
    : device === 'pixel' ? { w: 340, h: 640 }
    : { w: 700, h: 680 };
  const frameRadius  = device === 'iphone' ? 'rounded-[42px]' : device === 'pixel' ? 'rounded-[32px]' : 'rounded-[24px]';
  const screenRadius = device === 'iphone' ? 'rounded-[32px]' : device === 'pixel' ? 'rounded-[24px]' : 'rounded-[18px]';

  const bodyRef = React.useRef<HTMLDivElement>(null);
  const mainRef = React.useRef<HTMLElement>(null);
  const zoomRef = React.useRef(zoom);
  zoomRef.current = zoom;

  /* Ctrl/⌘ + wheel → zoom only the phone canvas. React's onWheel is passive,
     so attach a native listener with `passive: false` to allow preventDefault. */
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

  return (
    <main ref={mainRef} className="relative flex min-w-0 flex-1 flex-col items-center overflow-hidden bg-gradient-to-b from-[#EEF0FB] via-[#F6F7FE] to-[#EEF0FB] pb-4">
      <p className="flex items-center gap-1.5 py-3 text-[10px] font-medium text-slate-500">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live Sandbox · {zoom}%
        <span className="text-slate-400">· Ctrl+Scroll to zoom</span>
      </p>

      {/* Wrapper applies the zoom only to the phone frame */}
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

            {/* Status bar */}
            <div className={`flex h-8 shrink-0 items-end justify-between px-6 pb-1 text-[8px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              <span>09:41</span>
              <span className="flex items-center gap-0.5">
                <span className={`h-2 w-2 rounded-sm border ${isDark ? 'border-slate-300' : 'border-slate-700'}`} />
                <span className={`h-2 w-2 rounded-sm border ${isDark ? 'border-slate-300' : 'border-slate-700'}`} />
                <span className={`h-2 w-3 rounded-sm border ${isDark ? 'border-slate-300' : 'border-slate-700'}`} />
              </span>
            </div>

            {/* Page canvas */}
            <div
              ref={bodyRef}
              onDragOver={(e) => {
                const hasDrag = e.dataTransfer.types.includes('application/x-pf-module-id');
                if (!drag && !hasDrag) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = drag?.from === 'library' ? 'copy' : 'move';
                if (drag) autoScroll(e.clientY);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onEndDrag();
              }}
              onDrop={onDrop}
              onClick={(e) => { if (e.target === e.currentTarget) onSelect(null); }}
              className="flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-3 pb-20 pt-1">
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
            </div>

            <BottomDockTabBar activePage={activePage} isDark={isDark} onNavTab={onNavTab} />
          </div>
        </div>
      </div>
    </main>
  );
}

/* ═══════════════════════════ RightPanel ═══════════════════════════ */

function RightPanel({
  tab, onTab, selectedId, accent, wsStatus, workflowOpen, onToggleWorkflow,
  box, measured, onBoxChange, onResetBox,
  overrides, setText, setColor, onResetModuleOverrides,
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
  setText: (moduleId: ModuleId, slot: string, value: string | null) => void;
  setColor: (moduleId: ModuleId, slot: string, value: string | null) => void;
  onResetModuleOverrides: (moduleId: ModuleId) => void;
}) {
  const tabs: { id: RightTab; label: string }[] = [
    { id: 'design', label: 'Design' }, { id: 'layout', label: 'Layout' },
    { id: 'logic', label: 'Logic' }, { id: 'data', label: 'Data' }, { id: 'code', label: 'Code' },
  ];
  const mod = selectedId ? moduleFor(selectedId) : null;
  const schema = selectedId ? EDITABLE_SCHEMA[selectedId] : undefined;
  const mOver = selectedId ? overrides[selectedId] : undefined;
  const hasOverrides = !!mOver && (Object.keys(mOver.text).length > 0 || Object.keys(mOver.colors).length > 0);

  return (
    <aside className="flex w-[340px] shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className="flex border-b border-slate-200">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => onTab(t.id)}
              className={`relative flex-1 py-3 text-[11px] font-bold uppercase tracking-wider ${active ? 'text-[#0040DF]' : 'text-slate-400 hover:text-slate-700'}`}>
              {t.label}
              {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#0040DF]" />}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!mod ? (
          <div className="flex flex-col items-center justify-center gap-2.5 px-4 py-16 text-center">
            <Diamond className="h-6 w-6 text-slate-300" />
            <p className="text-[12px] text-slate-400">Select a component on the phone<br />to edit its properties</p>
          </div>
        ) : (
          <>
            {/* Component header — matches reference: name + Master badge */}
            <div className="border-b border-slate-200 px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Diamond className="h-4 w-4 text-indigo-500" />
                  <p className="text-[13px] font-bold">{mod.title}</p>
                </div>
                <span className="rounded-md bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700">Master</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{mod.subtitle}</p>
            </div>

            {/* Content — schema-driven text slots */}
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
                          <button onClick={() => setText(selectedId!, s.slot, null)} className="grid h-7 w-7 place-items-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-500" aria-label={`Reset ${s.label}`}>
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {/* Colors — schema-driven color slots */}
            {schema?.colors && schema.colors.length > 0 && (
              <section className="border-b border-slate-200 px-4 py-4">
                <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Colors</span>
                <div className="space-y-2.5">
                  {schema.colors.map((c) => {
                    const current = mOver?.colors[c.slot] ?? c.defaultValue;
                    const overridden = !!mOver?.colors[c.slot];
                    return (
                      <div key={c.slot} className="flex items-center gap-2.5">
                        <span className="w-28 truncate text-[12px] text-slate-500">{c.label}</span>
                        <label className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-md ring-1 ring-slate-200">
                          <span className="absolute inset-0" style={{ background: current }} />
                          <input
                            type="color"
                            value={current}
                            onChange={(e) => setColor(selectedId!, c.slot, e.target.value)}
                            className="absolute inset-0 cursor-pointer opacity-0"
                          />
                        </label>
                        <input
                          type="text"
                          value={current}
                          onChange={(e) => setColor(selectedId!, c.slot, e.target.value)}
                          className="w-24 rounded border border-slate-200 px-2 py-1 font-mono text-[11px] outline-none focus:border-[#0040DF]"
                        />
                        {overridden && (
                          <button onClick={() => setColor(selectedId!, c.slot, null)} className="grid h-7 w-7 place-items-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-500" aria-label={`Reset ${c.label}`}>
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Variant State */}
            <section className="border-b border-slate-200 px-4 py-4">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Variant State</span>
                <span className="text-[10px] font-semibold text-slate-400">3 variants</span>
              </div>
              <div className="flex gap-2">
                {(['Default', 'Masked', 'Negative'] as const).map((v) => (
                  <button key={v}
                    className={`flex-1 rounded-md py-2 text-[11px] font-bold transition ${
                      v === 'Default'
                        ? 'bg-[#0040DF] text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'
                    }`}>
                    {v}
                  </button>
                ))}
              </div>
            </section>

            {/* Layout & Box Model — matches reference image */}
            <section className="border-b border-slate-200 px-4 py-4">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Layout &amp; Box Model</span>
                <span className="text-[11px] font-semibold text-[#0040DF]">Flex Col</span>
              </div>

              {/* W / H / X / Y inputs */}
              <div className="mb-4 grid grid-cols-2 gap-2">
                {([
                  { key: 'w' as const, label: 'W', value: box.w ?? measured?.w ?? '' },
                  { key: 'h' as const, label: 'H', value: box.h ?? measured?.h ?? '' },
                  { key: 'x' as const, label: 'X', value: box.x ?? 0 },
                  { key: 'y' as const, label: 'Y', value: box.y ?? 0 },
                ]).map(({ key, label, value }) => (
                  <label key={key} className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="text-[10px] font-bold text-slate-400">{label}</span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => onBoxChange(selectedId!, {
                        [key]: e.target.value === '' ? undefined : Number(e.target.value),
                      } as ModuleBox)}
                      className="w-full bg-transparent text-[12px] font-semibold text-slate-800 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </label>
                ))}
              </div>

              {/* Padding / Gap box-model diagram */}
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Padding / Gap</p>
              <div className="relative rounded-md border border-dashed border-slate-300 p-4">
                {/* Top */}
                <div className="mb-1.5 flex justify-center">
                  <div className="flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1">
                    <span className="text-[10px] text-slate-400">Top</span>
                    <input type="number" defaultValue={2} className="w-8 bg-transparent text-center text-[10px] font-semibold text-slate-700 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                    <span className="text-[9px] text-slate-400">px</span>
                  </div>
                </div>
                {/* Middle row: Left + center label + Right */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1">
                    <span className="text-[10px] font-semibold text-slate-500">L</span>
                    <input type="number" defaultValue={2} className="w-7 bg-transparent text-center text-[10px] font-semibold text-slate-700 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                  </div>
                  <div className="flex flex-1 items-center justify-center rounded-md border border-[#0040DF] bg-blue-50 py-3">
                    <span className="text-center font-mono text-[10px] font-semibold text-[#0040DF]">
                      {box.w ?? measured?.w ?? 361} × {box.h ?? measured?.h ?? 168}
                      <br />
                      <span className="text-[9px] font-normal text-slate-400">(Fill Container)</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1">
                    <input type="number" defaultValue={2} className="w-7 bg-transparent text-center text-[10px] font-semibold text-slate-700 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                    <span className="text-[10px] font-semibold text-slate-500">R</span>
                  </div>
                </div>
                {/* Bottom */}
                <div className="mt-1.5 flex justify-center">
                  <div className="flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1">
                    <span className="text-[10px] text-slate-400">Bottom</span>
                    <input type="number" defaultValue={2} className="w-8 bg-transparent text-center text-[10px] font-semibold text-slate-700 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
                    <span className="text-[9px] text-slate-400">px</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400">Flex col</span>
                <span className="font-mono text-[10px] text-slate-400">
                  {box.w ?? measured?.w ?? '—'} × {box.h ?? measured?.h ?? '—'}
                </span>
              </div>
            </section>

            {/* Workflow Triggers */}
            <section className="border-b border-slate-200 px-4 py-4">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Workflow Triggers</span>
                <button onClick={onToggleWorkflow} className="flex items-center gap-1 text-[11px] font-semibold text-[#0040DF]">
                  <Plus className="h-3 w-3" /> Add Action
                </button>
              </div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" />WHEN: On Tap
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
  /* chrome */
  const [mode, setMode] = useState<StudioMode>('design');
  const [device, setDevice] = useState<DeviceType>('iphone');
  const [zoom, setZoom] = useState(100);
  const [saveState] = useState<SaveState>('saved');
  const [rightTab, setRightTab] = useState<RightTab>('design');
  const [workflowOpen, setWorkflowOpen] = useState(true);

  /* product + pages (buildsection parity) */
  const [appKind, setAppKind] = useState<AppKind>('banking');
  const [activePage, setActivePage] = useState<PageId>('home');
  const [expandedPage, setExpandedPage] = useState<PageId | null>('home');
  const [pageModules, setPageModules] = useState<Record<PageId, ModuleId[]>>(buildInitialPages);
  const [histories, setHistories] = useState<Record<PageId, ModuleId[][]>>(() => {
    const out = {} as Record<PageId, ModuleId[][]>;
    for (const p of PAGES) out[p.id] = [];
    return out;
  });

  /* selection + drag */
  const [selectedId, setSelectedId] = useState<ModuleId | null>(null);
  const [drag, setDrag] = useState<DragState>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  /* per-module box overrides & measured natural sizes */
  const [boxes, setBoxes] = useState<Record<string, ModuleBox>>({});
  const [measured, setMeasured] = useState<Record<string, { w: number; h: number }>>({});

  /* edit store — text & color overrides per module */
  const { overrides, setText, setColor, reset: resetOverrides } = useEditOverrides();

  const editState = {
    mode: (mode === 'design' ? 'edit' : 'view') as 'view' | 'edit',
    selectedId,
    overrides,
    setText,
    setColor,
    reset: resetOverrides,
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

  const onMeasure = React.useCallback(
    (id: ModuleId, size: { w: number; h: number }) => {
      setMeasured((prev) => {
        const cur = prev[id];
        if (cur && cur.w === size.w && cur.h === size.h) return prev;
        return { ...prev, [id]: size };
      });
    },
    []
  );

  /* theme */
  const [accentColor] = useState('#0040DF');
  const [buttonRadius] = useState<RadiusMode>('rounded');
  const isDark = false;
  const radius = RADII[buttonRadius];

  /* demo state for ViewCtx */
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

  /* page-aware actions for module interactive demos */
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

  /* history helpers */
  const commit = (next: ModuleId[]) => {
    if (next.length === currentModules.length && next.every((m, i) => m === currentModules[i])) return;
    setHistories((h) => ({ ...h, [activePage]: [...(h[activePage] ?? []).slice(-(HISTORY_LIMIT - 1)), currentModules] }));
    setPageModules((p) => ({ ...p, [activePage]: next }));
  };

  /* drag/drop */
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    const id = (drag?.id ?? e.dataTransfer.getData('application/x-pf-module-id')) as ModuleId | '';
    if (!id) { endDrag(); return; }
    if (!allModulesFor().some((m) => m.id === id)) { endDrag(); return; }

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
          />
          <Canvas
            device={device} zoom={zoom} onZoom={setZoom}
            pageModules={pageModules} activePage={activePage} pageLabel={currentPageLabel}
            drag={drag} dropIndex={dropIndex}
            ctx={liveCtx} accent={accentColor} isDark={isDark} radius={radius}
            selectedId={selectedId} onSelect={setSelectedId}
            onStartDrag={startDrag} onEndDrag={endDrag}
            onItemDragOver={handleItemDragOver} onDrop={handleDrop}
            onMove={moveModule} onRemove={removeModule} onQuickAdd={quickAdd}
            onNavTab={handleNavTab}
            boxes={boxes}
            onMeasure={onMeasure}
            onBoxChange={onBoxChange}
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
            setText={setText}
            setColor={setColor}
            onResetModuleOverrides={resetOverrides}
          />
        </div>
      </div>
    </EditProvider>
  );
}