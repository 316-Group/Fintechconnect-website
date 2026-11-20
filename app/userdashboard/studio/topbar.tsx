'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown, Code2, Expand, Laptop, Landmark, Minimize, Minus, MonitorSmartphone,
  PenLine, PlayCircle, Plus, Redo2, Rocket, Save, Share2, Smartphone, Tablet, Undo2, Workflow,
  FolderOpen, Check,
} from 'lucide-react';
import { archetypes } from '../products/archetypeselectionform';
import { listStudioProjects, studioUrlFor, type StudioProjectInfo } from '../products/projectstorage';

export type DeviceType = 'iphone' | 'pixel' | 'tablet' | 'desktop';
export type StudioMode = 'design' | 'prototype' | 'workflows' | 'code';
/** `never` = nothing saved for this project yet. */
export type SaveStatus = { state: 'never' | 'saved' | 'unsaved' | 'saving' | 'error'; savedAt: number | null };

const BLUE = '#0040DF';

function savedAgo(savedAt: number, now: number) {
  const seconds = Math.max(0, Math.round((now - savedAt) / 1000));
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/** The current time, refreshed every few seconds so "Saved 12s ago" keeps counting. */
function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
}

/** "US Digital Banking · Sandbox", from the project's details. */
function projectSubtitle(project: StudioProjectInfo | null) {
  if (!project) return 'Not linked to a project';
  const archetype = archetypes.find((item) => item.id === project.archetypeId)?.title ?? 'Custom Platform';
  const region = project.jurisdiction ? `${project.jurisdiction.toUpperCase()} ` : '';
  return `${region}${archetype} · Sandbox`;
}

function Logo() {
  return (
    <svg width="96" height="46" aria-hidden="true" viewBox="100 0 150 201" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  );
}

/** The app name card: shows the open project and switches between projects. */
function ProjectSwitcher({ project }: { project: StudioProjectInfo | null }) {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<StudioProjectInfo[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('mousedown', close);
    window.addEventListener('keydown', escape);
    return () => {
      window.removeEventListener('mousedown', close);
      window.removeEventListener('keydown', escape);
    };
  }, [open]);

  const name = project?.name ?? 'Untitled Project';
  return (
    <div ref={ref} className="relative min-w-[120px] max-w-[230px] shrink">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          if (!open) setProjects(listStudioProjects());
          setOpen((value) => !value);
        }}
        className="flex w-full min-w-0 items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-2.5 pr-2 text-left shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition hover:border-slate-300 hover:bg-slate-50"
      >
        <Landmark className="h-4 w-4 shrink-0 text-slate-600" />
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[13px] font-semibold text-slate-900" title={name}>{name}</span>
          <span className="block truncate text-[10.5px] text-slate-500">{projectSubtitle(project)}</span>
        </span>
        <ChevronDown className={`ml-1 h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div role="menu" className="absolute left-0 top-full z-[120] mt-1.5 w-[260px] rounded-xl bg-white p-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
          <p className="px-2.5 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Your projects</p>
          {projects.length === 0 && (
            <p className="px-2.5 py-2 text-[12px] text-slate-500">No projects yet.</p>
          )}
          <div className="max-h-[260px] overflow-y-auto">
            {projects.map((item) => (
              <a
                key={item.id}
                role="menuitem"
                href={studioUrlFor(item.id)}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-slate-50"
              >
                <Landmark className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate text-[12.5px] font-semibold text-slate-800">{item.name}</span>
                  <span className="block truncate text-[10.5px] text-slate-500">{projectSubtitle(item)}</span>
                </span>
                {item.id === project?.id && <Check className="h-3.5 w-3.5 shrink-0" style={{ color: BLUE }} />}
              </a>
            ))}
          </div>
          <div className="my-1 h-px bg-slate-100" />
          <a
            role="menuitem"
            href="/userdashboard/products"
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50"
          >
            <FolderOpen className="h-3.5 w-3.5 text-slate-500" /> Projects &amp; Deployments
          </a>
        </div>
      )}
    </div>
  );
}

function IconButton({
  label, onClick, disabled, children, active,
}: { label: string; onClick?: () => void; disabled?: boolean; children: React.ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-7 w-7 place-items-center rounded-md transition disabled:cursor-default disabled:opacity-35 ${active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-white hover:text-slate-800 disabled:hover:bg-transparent'}`}
    >
      {children}
    </button>
  );
}

export function TopBar({
  project, mode, onMode, device, onDevice, zoom, onZoom,
  saveStatus, onSave, canUndo, canRedo, onUndo, onRedo, onPublish,
}: {
  project: StudioProjectInfo | null;
  mode: StudioMode; onMode: (mode: StudioMode) => void;
  device: DeviceType; onDevice: (device: DeviceType) => void;
  zoom: number; onZoom: (zoom: number) => void;
  saveStatus: SaveStatus; onSave: () => void;
  canUndo: boolean; canRedo: boolean; onUndo: () => void; onRedo: () => void;
  onPublish: () => void;
}) {
  const now = useNow(5_000);
  const [fullscreen, setFullscreen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const sync = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1600);
    } catch { /* clipboard blocked */ }
  };

  const modes: { id: StudioMode; label: string; Icon: React.ElementType }[] = [
    { id: 'design', label: 'Design', Icon: PenLine },
    { id: 'prototype', label: 'Prototype', Icon: PlayCircle },
    { id: 'workflows', label: 'Workflows', Icon: Workflow },
    { id: 'code', label: 'Code', Icon: Code2 },
  ];

  const { state, savedAt } = saveStatus;
  const status = state === 'saving' ? { text: 'Saving…', dot: 'bg-amber-400 animate-pulse', color: 'text-slate-500' }
    : state === 'error' ? { text: "Couldn't save", dot: 'bg-rose-500', color: 'text-rose-600' }
    : state === 'unsaved' ? { text: 'Unsaved changes', dot: 'bg-amber-500', color: 'text-amber-700' }
    : state === 'saved' && savedAt ? { text: `Saved ${savedAgo(savedAt, now)}`, dot: 'bg-[#0040DF]', color: 'text-[#0040DF]' }
    : { text: 'Not saved yet', dot: 'bg-slate-300', color: 'text-slate-500' };

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4">
      {/* Left: logo, app name, save status, undo/redo */}
      <div className="flex min-w-0 flex-[1_1_0] items-center gap-3">
        <a href="/userdashboard/products" aria-label="FintechConnect projects" className="shrink-0">
          <Logo />
        </a>
        <ProjectSwitcher project={project} />
        <span className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[12.5px] font-medium ${status.color}`} role="status" title={status.text}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} /><span className="hidden min-[1440px]:inline">{status.text}</span>
        </span>
        <div className="flex shrink-0 items-center">
          <IconButton label="Undo (Ctrl+Z)" onClick={onUndo} disabled={!canUndo}><Undo2 className="h-4 w-4" /></IconButton>
          <IconButton label="Redo (Ctrl+Shift+Z)" onClick={onRedo} disabled={!canRedo}><Redo2 className="h-4 w-4" /></IconButton>
        </div>
      </div>

      {/* Centre: studio modes */}
      <nav aria-label="Studio mode" className="flex shrink-0 items-center gap-0.5 rounded-xl border border-slate-200 bg-slate-50/70 p-1">
        {modes.map(({ id, label, Icon }) => {
          const active = mode === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              aria-label={label}
              title={label}
              onClick={() => onMode(id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${active ? 'bg-white shadow-[0_1px_3px_rgba(15,23,42,0.12)]' : 'text-slate-500 hover:text-slate-800'}`}
              style={active ? { color: BLUE } : undefined}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="hidden min-[1500px]:inline">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right: device, zoom, preview, share, save, publish */}
      <div className="flex flex-1 shrink-0 items-center justify-end gap-2">
        <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-slate-200 bg-slate-50/70 p-1">
          {([['iphone', 'iPhone 15 Pro'], ['pixel', 'Pixel 8']] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={device === id}
              aria-label={label}
              title={label}
              onClick={() => onDevice(id)}
              className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1.5 text-[12px] font-medium transition ${device === id ? 'bg-white text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.12)]' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Smartphone className="h-3.5 w-3.5" /><span className="hidden min-[1700px]:inline">{label}</span>
            </button>
          ))}
          <IconButton label="Tablet" active={device === 'tablet'} onClick={() => onDevice('tablet')}><Tablet className="h-4 w-4" /></IconButton>
          <IconButton label="Desktop" active={device === 'desktop'} onClick={() => onDevice('desktop')}><Laptop className="h-4 w-4" /></IconButton>
        </div>

        <div className="flex shrink-0 items-center rounded-xl border border-slate-200 bg-slate-50/70 p-1">
          <IconButton label="Zoom out" onClick={() => onZoom(Math.max(25, zoom - 10))}><Minus className="h-3.5 w-3.5" /></IconButton>
          <span className="w-10 text-center text-[12px] font-semibold text-slate-800">{Math.round(zoom)}%</span>
          <IconButton label="Zoom in" onClick={() => onZoom(Math.min(400, zoom + 10))}><Plus className="h-3.5 w-3.5" /></IconButton>
          <IconButton label={fullscreen ? 'Exit full screen' : 'Full screen'} onClick={toggleFullscreen}>
            {fullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Expand className="h-3.5 w-3.5" />}
          </IconButton>
        </div>

        <button
          type="button"
          aria-label="Preview"
          title="Preview"
          aria-pressed={mode === 'prototype'}
          onClick={() => onMode(mode === 'prototype' ? 'design' : 'prototype')}
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition ${mode === 'prototype' ? 'border-[#0040DF]/30 bg-[#0040DF]/5 text-[#0040DF]' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          <MonitorSmartphone className="h-4 w-4" />
        </button>
        <div className="relative shrink-0">
          <button
            type="button"
            aria-label="Copy link to share"
            title="Copy link to share"
            onClick={share}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            {linkCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
          </button>
          {linkCopied && (
            <span role="status" className="absolute right-0 top-full z-[120] mt-1.5 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white">
              Link copied
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onSave}
          title="Changes save automatically. Click (or Ctrl+S) to save now."
          className="flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border bg-white px-3 text-[13px] font-semibold transition hover:bg-[#0040DF]/5 disabled:opacity-70"
          style={{ borderColor: `${BLUE}55`, color: BLUE }}
        >
          <Save className="h-4 w-4" />
          Save progress
        </button>
        <button
          type="button"
          onClick={onPublish}
          className="flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-4 text-[13px] font-semibold text-white shadow-[0_2px_6px_rgba(0,64,223,0.3)] transition hover:brightness-110"
          style={{ background: BLUE }}
        >
          <Rocket className="h-4 w-4" />
          Publish App
        </button>
      </div>
    </header>
  );
}
