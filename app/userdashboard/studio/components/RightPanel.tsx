// /client/app/userdashboard/studio/components/RightPanel.tsx
'use client';

import React from 'react';
import {
  ChevronDown,
  Plus,
  X,
  Check,
  Play,
  Code2,
  Diamond,
  LayoutGrid,
  ArrowDownToLine,
  ArrowUpToLine,
  MoveHorizontal,
  Braces,
  Zap,
  ShieldCheck,
  Globe,
  Server,
} from 'lucide-react';
import type { RightTab, Variant, ActionCategory, TriggerEvent, WsStatus } from './types';
import { WORKFLOW_STEPS } from './seed';

interface Props {
  tab: RightTab;
  onTab: (t: RightTab) => void;
  variant: Variant;
  onVariant: (v: Variant) => void;
  padding: { top: number; right: number; bottom: number; left: number };
  onPadding: (p: { top: number; right: number; bottom: number; left: number }) => void;
  gap: number;
  onGap: (n: number) => void;
  addActionOpen: boolean;
  onAddActionOpen: (v: boolean) => void;
  triggerEvent: TriggerEvent;
  onTriggerEvent: (e: TriggerEvent) => void;
  actionCategory: ActionCategory;
  onActionCategory: (c: ActionCategory) => void;
  biometricGuard: boolean;
  onBiometricGuard: (v: boolean) => void;
  wsStatus: WsStatus;
  boundVariable: string;
}

const TABS: { id: RightTab; label: string }[] = [
  { id: 'design', label: 'Design' },
  { id: 'layout', label: 'Layout' },
  { id: 'logic', label: 'Logic' },
  { id: 'data', label: 'Data' },
  { id: 'code', label: 'Code' },
];

const VARIANT_OPTIONS: { id: Variant; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'masked', label: 'Masked' },
  { id: 'negative', label: 'Negative' },
];

const ACTION_TABS: { id: ActionCategory; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'navigation', label: 'Navigation', Icon: ArrowDownToLine },
  { id: 'bankingCore', label: 'Banking Core', Icon: Server },
  { id: 'security', label: 'Security', Icon: ShieldCheck },
  { id: 'webhook', label: 'Webhook', Icon: Globe },
];

/* ------------ small labelled field helpers ------------ */

function Label({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-1 flex items-center justify-between">
      <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">{children}</span>
      {right}
    </div>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-slate-50 px-2 py-1.5 ring-1 ring-slate-200">
      {children}
    </div>
  );
}

/* ------------ sub sections ------------ */

function LayoutAndBox({
  padding,
  onPadding,
  gap,
  onGap,
}: {
  padding: Props['padding'];
  onPadding: Props['onPadding'];
  gap: number;
  onGap: Props['onGap'];
}) {
  const setPad = (side: keyof Props['padding'], value: number) =>
    onPadding({ ...padding, [side]: value });

  return (
    <section className="border-b border-slate-200 px-3 py-3">
      <div className="mb-2 flex items-center justify-between">
        <Label>Layout and Box Model</Label>
        <button className="text-[9px] font-semibold text-[#0040DF]">Flex Col</button>
      </div>

      {/* axis icon row */}
      <div className="mb-2 flex items-center gap-1 text-slate-500">
        <button className="grid h-5 w-5 place-items-center rounded bg-slate-100 text-[#0040DF]">
          <ArrowDownToLine className="h-3 w-3" />
        </button>
        <button className="grid h-5 w-5 place-items-center rounded hover:bg-slate-100">
          <MoveHorizontal className="h-3 w-3" />
        </button>
        <span className="mx-1 h-4 w-px bg-slate-200" />
        <button className="grid h-5 w-5 place-items-center rounded hover:bg-slate-100">
          <ArrowUpToLine className="h-3 w-3" />
        </button>
        <button className="grid h-5 w-5 place-items-center rounded hover:bg-slate-100">
          <LayoutGrid className="h-3 w-3" />
        </button>
      </div>

      {/* padding diagram */}
      <div className="relative rounded-lg border border-dashed border-slate-300 p-3">
        <p className="absolute left-1.5 top-1 text-[7px] font-bold uppercase tracking-wider text-slate-400">
          Padding &amp; Gap
        </p>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
            <div key={side} className="flex items-center gap-1 rounded bg-slate-50 px-1.5 py-1 ring-1 ring-slate-200">
              <span className="w-3 text-[8px] uppercase text-slate-400">{side[0]}</span>
              <input
                type="number"
                value={padding[side]}
                onChange={(e) => setPad(side, Number(e.target.value) || 0)}
                className="w-6 bg-transparent text-[9px] font-semibold text-slate-800 focus:outline-none"
              />
              <span className="text-[8px] text-slate-400">px</span>
            </div>
          ))}
        </div>

        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[8px] font-semibold text-slate-500">Gap</span>
          <div className="flex items-center gap-1 rounded bg-slate-50 px-1.5 py-1 ring-1 ring-slate-200">
            <input
              type="number"
              value={gap}
              onChange={(e) => onGap(Number(e.target.value) || 0)}
              className="w-6 bg-transparent text-[9px] font-semibold focus:outline-none"
            />
            <span className="text-[8px] text-slate-400">px</span>
          </div>
        </div>

        <div className="mx-auto mt-2 w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-semibold text-slate-600">
          361 × 168 (Fill Container)
        </div>
      </div>
    </section>
  );
}

function AddActionCard({
  triggerEvent,
  onTriggerEvent,
  actionCategory,
  onActionCategory,
  biometricGuard,
  onBiometricGuard,
  onClose,
}: {
  triggerEvent: TriggerEvent;
  onTriggerEvent: Props['onTriggerEvent'];
  actionCategory: ActionCategory;
  onActionCategory: Props['onActionCategory'];
  biometricGuard: boolean;
  onBiometricGuard: Props['onBiometricGuard'];
  onClose: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#0040DF]/40 bg-white p-2.5 shadow-sm">
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-amber-500" />
          <p className="text-[10px] font-bold text-slate-900">Add Action Trigger</p>
          <span className="rounded bg-emerald-50 px-1 py-0.5 text-[7px] font-bold text-emerald-600">New Step 3</span>
        </div>
        <button onClick={onClose} className="grid h-4 w-4 place-items-center rounded text-slate-400 hover:bg-slate-100">
          <X className="h-3 w-3" />
        </button>
      </div>

      <p className="mb-2 text-[8px] leading-snug text-slate-500">
        Attach banking events or routing to BalanceCardComponent.
      </p>

      <Label>Trigger event</Label>
      <div className="mb-2 flex rounded-md bg-slate-100 p-0.5">
        {(['onTap', 'hold', 'swipe'] as const).map((e) => (
          <button
            key={e}
            onClick={() => onTriggerEvent(e)}
            className={`flex-1 rounded py-1 text-[9px] font-semibold transition ${
              triggerEvent === e ? 'bg-[#0040DF] text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            {e === 'onTap' ? 'On Tap' : e === 'hold' ? 'Hold' : 'Swipe'}
          </button>
        ))}
      </div>

      <Label>Action category</Label>
      <div className="mb-2 flex gap-1 border-b border-slate-200">
        {ACTION_TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onActionCategory(id)}
            className={`-mb-px flex items-center gap-1 border-b-2 px-1.5 py-1 text-[8px] font-semibold transition ${
              actionCategory === id
                ? 'border-[#0040DF] text-[#0040DF]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Icon className="h-2.5 w-2.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <div>
          <Label>Target destination screen</Label>
          <Field>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0040DF]" />
              <span className="text-[9px] font-semibold text-slate-800">apex://wallet/details</span>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <Label>Transition motion</Label>
            <Field>
              <span className="text-[9px] font-semibold text-slate-800">Spring (250ms)</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </Field>
          </div>
          <div>
            <Label>Passing params</Label>
            <Field>
              <span className="text-[9px] text-slate-400">{'{account.id}'}</span>
              <Braces className="h-3 w-3 text-slate-400" />
            </Field>
          </div>
        </div>

        <label className="flex items-start gap-2 rounded-md bg-slate-50 p-2 ring-1 ring-slate-200">
          <input
            type="checkbox"
            checked={biometricGuard}
            onChange={(e) => onBiometricGuard(e.target.checked)}
            className="mt-0.5 h-3 w-3 rounded border-slate-300 text-[#0040DF] focus:ring-[#0040DF]"
          />
          <div className="leading-tight">
            <p className="text-[9px] font-semibold text-slate-800">Biometric Step-Up Guard</p>
            <p className="text-[7px] text-slate-500">Tier 1 KYC &amp; Passkey check</p>
          </div>
        </label>
      </div>

      <div className="mt-2 flex items-center justify-end gap-1.5">
        <button
          onClick={onClose}
          className="rounded-md border border-slate-200 px-2.5 py-1 text-[9px] font-semibold text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="rounded-md bg-[#0040DF] px-2.5 py-1 text-[9px] font-bold text-white hover:bg-[#0036BF]"
        >
          Attach Action
        </button>
      </div>
    </div>
  );
}

/* ------------ main panel ------------ */

export default function RightPanel(props: Props) {
  const {
    tab,
    onTab,
    variant,
    onVariant,
    padding,
    onPadding,
    gap,
    onGap,
    addActionOpen,
    onAddActionOpen,
    triggerEvent,
    onTriggerEvent,
    actionCategory,
    onActionCategory,
    biometricGuard,
    onBiometricGuard,
    wsStatus,
    boundVariable,
  } = props;

  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-l border-slate-200 bg-white">
      {/* tabs */}
      <div className="flex border-b border-slate-200">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTab(t.id)}
              className={`relative flex-1 py-2.5 text-[9px] font-bold uppercase tracking-wider ${
                active ? 'text-[#0040DF]' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {t.label}
              {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#0040DF]" />}
            </button>
          );
        })}
      </div>

      {/* scroll content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* selection header */}
        <div className="border-b border-slate-200 px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Diamond className="h-3 w-3 text-indigo-500" />
              <p className="text-[11px] font-bold text-slate-900">BalanceCardComponent</p>
              <span className="rounded bg-indigo-100 px-1 py-0.5 text-[7px] font-bold text-indigo-700">Master</span>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Variant state</span>
            <button className="text-[8px] font-semibold text-[#0040DF]">3 variants</button>
          </div>
          <div className="mt-1 flex rounded-md bg-slate-100 p-0.5">
            {VARIANT_OPTIONS.map((v) => (
              <button
                key={v.id}
                onClick={() => onVariant(v.id)}
                className={`flex-1 rounded py-1 text-[9px] font-semibold transition ${
                  variant === v.id ? 'bg-[#0040DF] text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* layout */}
        <LayoutAndBox padding={padding} onPadding={onPadding} gap={gap} onGap={onGap} />

        {/* workflow triggers */}
        <section className="border-b border-slate-200 px-3 py-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Workflow Triggers</Label>
            <button
              onClick={() => onAddActionOpen(true)}
              className="flex items-center gap-0.5 text-[9px] font-semibold text-[#0040DF]"
            >
              <Plus className="h-2.5 w-2.5" /> Add Action
            </button>
          </div>

          <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            WHEN: On Tap (BalanceCard)
          </div>

          <div className="space-y-1">
            {WORKFLOW_STEPS.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1.5 ring-1 ring-slate-200"
              >
                <span className="grid h-4 w-4 place-items-center rounded-full bg-white text-[8px] font-bold text-slate-500 ring-1 ring-slate-200">
                  {i + 1}
                </span>
                <p className="flex-1 truncate text-[9px] font-semibold text-slate-800">{s.title}</p>
                <span
                  className={`rounded px-1 py-0.5 text-[7px] font-bold ${
                    s.badgeTone === 'rule'
                      ? 'bg-blue-50 text-[#0040DF] ring-1 ring-blue-200'
                      : 'bg-purple-50 text-purple-700 ring-1 ring-purple-200'
                  }`}
                >
                  {s.badge}
                </span>
              </div>
            ))}
          </div>

          {addActionOpen && (
            <div className="mt-2">
              <AddActionCard
                triggerEvent={triggerEvent}
                onTriggerEvent={onTriggerEvent}
                actionCategory={actionCategory}
                onActionCategory={onActionCategory}
                biometricGuard={biometricGuard}
                onBiometricGuard={onBiometricGuard}
                onClose={() => onAddActionOpen(false)}
              />
            </div>
          )}
        </section>

        {/* live data binding */}
        <section className="px-3 py-3">
          <div className="mb-2 flex items-center justify-between">
            <Label>Live Core Data Binding</Label>
            <span
              className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                wsStatus === 'active'
                  ? 'bg-emerald-50 text-emerald-700'
                  : wsStatus === 'connecting'
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  wsStatus === 'active' ? 'bg-emerald-500' : wsStatus === 'connecting' ? 'bg-amber-500' : 'bg-slate-400'
                }`}
              />
              {wsStatus === 'active' ? 'WS Active' : wsStatus === 'connecting' ? 'Connecting…' : 'Disconnected'}
            </span>
          </div>

          <div className="mb-2">
            <Label>Financial Core Engine</Label>
            <Field>
              <span className="text-[9px] font-semibold text-slate-800">Apex Banking Core · DDA Ledger</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </Field>
          </div>

          <div>
            <Label>Bounded Entity Variable</Label>
            <div className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1.5 ring-1 ring-slate-200">
              <Braces className="h-3 w-3 text-slate-400" />
              <span className="text-[9px] font-mono text-[#0040DF]">{boundVariable}</span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-[7px] text-slate-400">
              <Check className="h-2.5 w-2.5 text-emerald-500" />
              Type currency matches AmountDisplay
            </p>
          </div>
        </section>
      </div>

      {/* footer */}
      <div className="flex items-center gap-1.5 border-t border-slate-200 p-2.5">
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#0040DF] py-2 text-[10px] font-bold text-white hover:bg-[#0036BF]">
          <Play className="h-3 w-3" /> Preview
        </button>
        <button
          aria-label="Generated code"
          className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <Code2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}