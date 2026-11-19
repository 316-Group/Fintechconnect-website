'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Check, CheckCircle2, ChevronDown, ChevronRight, CircleDollarSign, Equal, Eye, Fingerprint, Hand, Layers,
  MousePointerClick, Pencil, Plus, Pointer, RefreshCw, SlidersHorizontal, Timer, Trash2, Vibrate, X,
  type LucideIcon,
} from 'lucide-react';
import { PAGES } from './phone-cards';
import { findElementById, getElementDisplayName, getTinkerElementId } from './edit-context';

/* ═══════════════════════════ Model ═══════════════════════════ */

export type LogicEvent =
  | 'tap' | 'doubleTap' | 'longPress' | 'hold' | 'swipe' | 'amountChange' | 'pullToRefresh' | 'appear';
export type LogicAction =
  | 'navigate' | 'openSheet' | 'biometric' | 'startTransfer' | 'dispatchApi'
  | 'toggleFreeze' | 'haptic' | 'showToast' | 'openLink';
export type LogicOperator = '==' | '!=' | '<' | '<=' | '>' | '>=';
export type StyleEffect = 'none' | 'warning' | 'highlight' | 'dim' | 'error' | 'success' | 'hide';
export type BehaviorEffect = 'none' | 'disableTap' | 'blockWithReason' | 'stepUpAuth' | 'requireOtp' | 'routeKyc';

export interface LogicTrigger {
  id: string;
  event: LogicEvent;
  action: LogicAction;
  /** The screen, sheet, API action… the action works on (depends on the action). */
  target: string;
  /** Success route, deep link, toast message or request payload. */
  payload: string;
  animation: string;
  haptic: string;
  throttle: string;
  requireKyc: boolean;
}

export interface LogicCondition {
  id: string;
  /** How this condition joins the ones before it (ignored on the first). */
  join: 'AND' | 'OR';
  variable: string;
  operator: LogicOperator;
  value: string;
}

export interface LogicRule {
  id: string;
  number: number;
  name: string;
  conditions: LogicCondition[];
  styleEffect: StyleEffect;
  behaviorEffect: BehaviorEffect;
  pushAlert: boolean;
}

/** Everything configured for one component, or one button/part inside it. */
export interface ElementLogic {
  triggers: LogicTrigger[];
  rules: LogicRule[];
  route?: string;
  authGuard?: boolean;
}

/** Keyed by `logicKey(moduleId, elementId)`. Saved with the build and part of undo/redo. */
export type LogicMap = Record<string, ElementLogic>;

/** Live values of the banking variables rules can test. */
export type LogicState = Record<string, string | number | boolean>;

const ROOT = '@root';
export const logicKey = (moduleId: string, elementId: string | null) => `${moduleId}::${elementId ?? ROOT}`;
const splitKey = (key: string): [string, string | null] => {
  const at = key.lastIndexOf('::');
  const element = key.slice(at + 2);
  return [key.slice(0, at), element === ROOT ? null : element];
};

const EMPTY_LOGIC: ElementLogic = { triggers: [], rules: [] };
const isEmptyLogic = (entry: ElementLogic) =>
  entry.triggers.length === 0 && entry.rules.length === 0 && !entry.route && !entry.authGuard;

const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/* ─────────────────────────── Catalogues ─────────────────────────── */

const EVENTS: Record<LogicEvent, { label: string; short: string; Icon: LucideIcon; kind: string; live: boolean }> = {
  tap: { label: 'On Tap (Press)', short: 'Tap (Press)', Icon: Pointer, kind: 'Trigger', live: true },
  doubleTap: { label: 'Double Tap', short: 'Double Tap', Icon: MousePointerClick, kind: 'Trigger', live: true },
  longPress: { label: 'Long Press (500ms)', short: 'Long Press', Icon: Fingerprint, kind: 'Gesture', live: true },
  hold: { label: 'Hold (1000ms)', short: 'Hold (1000ms)', Icon: Timer, kind: 'Gesture', live: true },
  swipe: { label: 'Swipe / Pan', short: 'Swipe / Pan', Icon: Hand, kind: 'Gesture', live: true },
  amountChange: { label: 'Amount Change', short: 'Amount Change', Icon: CircleDollarSign, kind: 'Action', live: false },
  pullToRefresh: { label: 'Pull to Refresh', short: 'Pull to Refresh', Icon: RefreshCw, kind: 'Action', live: false },
  appear: { label: 'On Screen Appear', short: 'Screen Appear', Icon: Eye, kind: 'Lifecycle', live: true },
};
const EVENT_ORDER: LogicEvent[] = ['tap', 'doubleTap', 'longPress', 'hold', 'swipe', 'amountChange', 'pullToRefresh', 'appear'];

const SHEETS = [
  'WalletDetailsModal', 'TransferReviewSheet', 'CardDetailsSheet', 'BeneficiaryPickerSheet',
  'StatementExportSheet', 'FxQuoteSheet', 'DisputeTransactionSheet', 'SupportChatSheet',
];
const API_ACTIONS = [
  'syncBalanceAction()', 'fetchTransactions()', 'refreshFxRates()', 'createPaymentIntent()',
  'freezeCardAction()', 'requestStatement()', 'verifyPayee()',
];
const PAGE_OPTIONS = PAGES.map((page) => ({ value: page.id, label: page.label }));
const pageLabel = (id: string) => PAGES.find((page) => page.id === id)?.label ?? id;

const ACTIONS: Record<LogicAction, { label: string; targetLabel?: string; targets?: string[] | 'pages'; payloadLabel: string }> = {
  navigate: { label: 'Navigate to Screen', targetLabel: 'Destination screen', targets: 'pages', payloadLabel: 'Success Route & Payload' },
  openSheet: { label: 'Open Sheet / Modal', targetLabel: 'Sheet / modal', targets: SHEETS, payloadLabel: 'Success Route & Payload' },
  biometric: {
    label: 'Trigger Biometric Auth / Passkey', targetLabel: 'Authenticator',
    targets: ['Face ID / Touch ID', 'Passkey (WebAuthn)', 'Device PIN fallback'], payloadLabel: 'Success Route & Payload',
  },
  startTransfer: {
    label: 'Start Transfer Flow', targetLabel: 'Transfer rail',
    targets: ['Send to recipient', 'Between my accounts', 'Instant (RTP / FedNow)', 'Domestic wire', 'International wire (SWIFT)'],
    payloadLabel: 'Success Route & Payload',
  },
  dispatchApi: { label: 'Dispatch Core API Action', targetLabel: 'API action', targets: API_ACTIONS, payloadLabel: 'Request Payload' },
  toggleFreeze: {
    label: 'Toggle Card Freeze', targetLabel: 'Card', targets: ['Primary debit card', 'Virtual card', 'All cards'],
    payloadLabel: 'Success Route & Payload',
  },
  haptic: {
    label: 'Haptic Feedback + Quick Action Menu', targetLabel: 'Menu',
    targets: ['Quick action menu', 'Haptic only'], payloadLabel: 'Menu Items / Payload',
  },
  showToast: { label: 'Show Toast / Alert', payloadLabel: 'Message' },
  openLink: { label: 'Open Deep Link', payloadLabel: 'Deep Link URL' },
};
const ACTION_ORDER: LogicAction[] = [
  'navigate', 'openSheet', 'biometric', 'startTransfer', 'dispatchApi', 'toggleFreeze', 'haptic', 'showToast', 'openLink',
];

const ANIMATIONS = ['Spring (250ms)', 'Spring (0.3s)', 'Ease In-Out (200ms)', 'Slide Up (Sheet)', 'Fade (180ms)', 'None'];
const HAPTICS = ['None', 'Light Impact', 'Medium Impact', 'Heavy Impact', 'Success', 'Warning', 'Selection'];
const THROTTLES = ['None', '1s', '5s', '30s'];

type VariableKind = 'currency' | 'number' | 'enum' | 'boolean';
const VARIABLES: { id: string; kind: VariableKind; options?: string[] }[] = [
  { id: 'account.balance', kind: 'currency' },
  { id: 'account.availableBalance', kind: 'currency' },
  { id: 'account.status', kind: 'enum', options: ['ACTIVE', 'FROZEN', 'DORMANT', 'CLOSED'] },
  { id: 'card.status', kind: 'enum', options: ['ACTIVE', 'FROZEN', 'LOST', 'EXPIRED'] },
  { id: 'transfer.amount', kind: 'currency' },
  { id: 'transfer.dailyTotal', kind: 'currency' },
  { id: 'user.kycTier', kind: 'enum', options: ['TIER_1', 'TIER_2', 'TIER_3'] },
  { id: 'user.kycStatus', kind: 'enum', options: ['VERIFIED', 'PENDING', 'REJECTED'] },
  { id: 'session.biometricEnabled', kind: 'boolean' },
  { id: 'device.trusted', kind: 'boolean' },
  { id: 'transactions.pendingCount', kind: 'number' },
  { id: 'fx.usdEurRate', kind: 'number' },
];
const variableDef = (id: string) => VARIABLES.find((v) => v.id === id) ?? VARIABLES[0];

/** Sandbox values for variables the Studio does not simulate itself. */
export const DEFAULT_LOGIC_STATE: LogicState = {
  'account.balance': 0,
  'account.availableBalance': 0,
  'account.status': 'ACTIVE',
  'card.status': 'ACTIVE',
  'transfer.amount': 0,
  'transfer.dailyTotal': 0,
  'user.kycTier': 'TIER_2',
  'user.kycStatus': 'VERIFIED',
  'session.biometricEnabled': true,
  'device.trusted': true,
  'transactions.pendingCount': 0,
  'fx.usdEurRate': 0.92,
};

const OPERATORS: { value: LogicOperator; label: string }[] = [
  { value: '==', label: '== (Equals)' },
  { value: '!=', label: '!= (Not equal)' },
  { value: '<', label: '< (Less than)' },
  { value: '<=', label: '<= (At most)' },
  { value: '>', label: '> (Greater than)' },
  { value: '>=', label: '>= (At least)' },
];
const operatorsFor = (kind: VariableKind) =>
  kind === 'enum' || kind === 'boolean' ? OPERATORS.slice(0, 2) : OPERATORS;

const STYLE_EFFECTS: Record<StyleEffect, { label: string; text: string; box: string }> = {
  none: { label: 'No style change', text: '', box: 'border-slate-200 bg-slate-50 text-slate-500' },
  warning: {
    label: 'Warning Amber Border (#F59E0B) & Show Banner',
    text: 'Add a Warning Amber border (#F59E0B) and show a banner',
    box: 'border-amber-300 bg-amber-50 text-amber-700',
  },
  highlight: {
    label: 'Highlight in Warning Amber (#F59E0B)', text: 'Highlight in Warning Amber (#F59E0B)',
    box: 'border-amber-300 bg-amber-50 text-amber-700',
  },
  dim: {
    label: 'Opacity 0.6 + Lock Badge', text: 'Set style: Opacity 0.6, show lock badge',
    box: 'border-slate-300 bg-slate-100 text-slate-600',
  },
  error: {
    label: 'Error Red Border (#EF4444)', text: 'Add an Error Red border (#EF4444)',
    box: 'border-rose-300 bg-rose-50 text-rose-700',
  },
  success: {
    label: 'Success Green Accent (#10B981)', text: 'Add a Success Green accent (#10B981)',
    box: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  },
  hide: { label: 'Hide Component', text: 'Hide this component', box: 'border-slate-300 bg-slate-100 text-slate-600' },
};
const BEHAVIOR_EFFECTS: Record<BehaviorEffect, { label: string; text: string }> = {
  none: { label: 'No behaviour change', text: '' },
  disableTap: { label: 'Disable Tap Actions', text: 'Disable tap actions' },
  blockWithReason: { label: 'Block Action & Show Reason', text: 'Block the action and show the reason' },
  stepUpAuth: { label: 'Enforce Step-Up Biometric Auth', text: 'Enforce step-up biometric auth' },
  requireOtp: { label: 'Require OTP / 2FA Approval', text: 'Require OTP / 2FA approval' },
  routeKyc: { label: 'Route to KYC Upgrade Flow', text: 'Route to the KYC upgrade flow' },
};

/* ─────────────────────────── Rule evaluation ─────────────────────────── */

const parseNumber = (raw: string) => Number(raw.replace(/[^0-9.-]/g, ''));

function conditionHolds(condition: LogicCondition, state: LogicState): boolean {
  const def = variableDef(condition.variable);
  const actual = state[condition.variable];
  if (actual === undefined) return false;
  if (def.kind === 'boolean' || def.kind === 'enum') {
    const equal = def.kind === 'boolean'
      ? actual === (condition.value === 'true')
      : String(actual).toUpperCase() === condition.value.trim().toUpperCase();
    return condition.operator === '!=' ? !equal : equal;
  }
  const a = Number(actual);
  const b = parseNumber(condition.value);
  if (Number.isNaN(a) || Number.isNaN(b) || condition.value.trim() === '') return false;
  switch (condition.operator) {
    case '==': return a === b;
    case '!=': return a !== b;
    case '<': return a < b;
    case '<=': return a <= b;
    case '>': return a > b;
    case '>=': return a >= b;
  }
}

/** Whether a rule's conditions are true for the given state (evaluated left to right). */
export function ruleHolds(rule: LogicRule, state: LogicState): boolean {
  if (rule.conditions.length === 0) return false;
  return rule.conditions.slice(1).reduce(
    (result, condition) => condition.join === 'AND'
      ? result && conditionHolds(condition, state)
      : result || conditionHolds(condition, state),
    conditionHolds(rule.conditions[0], state),
  );
}

function formatValue(variable: string, value: string | number | boolean): string {
  const def = variableDef(variable);
  if (def.kind === 'currency') {
    const n = typeof value === 'number' ? value : parseNumber(String(value));
    return Number.isNaN(n) ? String(value) : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (def.kind === 'enum') return `"${String(value).toUpperCase()}"`;
  return String(value);
}

const conditionText = (rule: LogicRule) => rule.conditions
  .map((c, i) => `${i > 0 ? ` ${c.join} ` : ''}${c.variable} ${c.operator} ${formatValue(c.variable, c.value)}`)
  .join('');

function ruleDescription(rule: LogicRule): string {
  const parts = [STYLE_EFFECTS[rule.styleEffect].text, BEHAVIOR_EFFECTS[rule.behaviorEffect].text]
    .filter(Boolean);
  if (rule.pushAlert) parts.push('Send an in-app push alert');
  return parts.length ? `${parts.join('. ')}.` : 'No effect yet.';
}

function ruleTag(rule: LogicRule): { label: string; cls: string } {
  if (rule.behaviorEffect === 'disableTap' || rule.behaviorEffect === 'blockWithReason') {
    return { label: 'State Lock', cls: 'bg-rose-50 text-rose-600' };
  }
  if (rule.behaviorEffect === 'stepUpAuth' || rule.behaviorEffect === 'requireOtp') {
    return { label: 'Step-Up', cls: 'bg-indigo-50 text-indigo-600' };
  }
  if (rule.behaviorEffect === 'routeKyc') return { label: 'KYC Gate', cls: 'bg-violet-50 text-violet-600' };
  if (rule.styleEffect === 'warning' || rule.styleEffect === 'highlight' || rule.styleEffect === 'error') {
    return { label: 'Alert', cls: 'bg-amber-50 text-amber-600' };
  }
  if (rule.styleEffect === 'hide') return { label: 'Visibility', cls: 'bg-slate-100 text-slate-600' };
  return { label: 'Rule', cls: 'bg-blue-50 text-[#0040DF]' };
}

/** "Open Sheet / Modal → WalletDetailsModal" */
export function describeTrigger(trigger: LogicTrigger): string {
  const target = trigger.action === 'navigate' ? pageLabel(trigger.target) : trigger.target;
  const extra = trigger.action === 'showToast' || trigger.action === 'openLink' ? trigger.payload : target;
  return `${ACTIONS[trigger.action].label}${extra ? ` → ${extra}` : ''}`;
}

/* ═══════════════════════════ Small controls ═══════════════════════════ */

function Select({
  value, onChange, options, ariaLabel, className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full cursor-pointer appearance-none truncate rounded-lg border border-slate-200 bg-white py-2 pl-2 pr-6 text-[11.5px] font-medium text-slate-800 outline-none focus:border-[#0040DF]"
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

const textInputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[12px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#0040DF]';

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (next: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-[#0040DF]' : 'bg-slate-300'}`}
    >
      <span className={`absolute left-0 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>
  );
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center justify-between gap-2">
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">{title}</h3>
      {action}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-1 text-[11.5px] font-semibold text-[#0040DF] hover:text-[#0036BF]">
      <Plus className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[#0040DF] hover:bg-blue-100">
      <X className="h-3 w-3" /> Close
    </button>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-[3px] text-[11.5px]">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="min-w-0 truncate text-right font-medium text-slate-800">{children}</span>
    </div>
  );
}

function CardActions({ onEdit, onDelete, name }: { onEdit: () => void; onDelete: () => void; name: string }) {
  return (
    <span className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
      <button type="button" onClick={onEdit} title={`Edit ${name}`} aria-label={`Edit ${name}`}
        className="grid h-6 w-6 place-items-center rounded text-slate-400 hover:bg-slate-100 hover:text-[#0040DF]">
        <Pencil className="h-3 w-3" />
      </button>
      <button type="button" onClick={onDelete} title={`Delete ${name}`} aria-label={`Delete ${name}`}
        className="grid h-6 w-6 place-items-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-500">
        <Trash2 className="h-3 w-3" />
      </button>
    </span>
  );
}

/* ═══════════════════════════ Trigger editor (logic tab 2) ═══════════════════════════ */

function defaultPayload(action: LogicAction, target: string, scheme: string): string {
  switch (action) {
    case 'navigate': return `${scheme}://${target}`;
    case 'openSheet': return `${scheme}://wallet/details?view=full`;
    case 'biometric': return `${scheme}://auth/verified`;
    case 'startTransfer': return `${scheme}://send/review`;
    case 'dispatchApi': return '{ "accountId": "{{account.id}}" }';
    case 'toggleFreeze': return `${scheme}://cards/controls`;
    case 'haptic': return 'Send, Request, Copy account number';
    case 'showToast': return 'Action completed';
    case 'openLink': return `${scheme}://wallet/cards/balance-summary`;
  }
}

function defaultTarget(action: LogicAction): string {
  const targets = ACTIONS[action].targets;
  if (targets === 'pages') return 'send';
  return targets?.[0] ?? '';
}

function TriggerEditor({
  initial, scopeIdent, scopeKind, scheme, onCancel, onSave,
}: {
  initial: LogicTrigger | null;
  scopeIdent: string;
  scopeKind: string;
  scheme: string;
  onCancel: () => void;
  onSave: (trigger: LogicTrigger) => void;
}) {
  const [draft, setDraft] = useState<LogicTrigger>(() => initial ?? {
    id: newId('trg'),
    event: 'tap',
    action: 'openSheet',
    target: 'WalletDetailsModal',
    payload: defaultPayload('openSheet', 'WalletDetailsModal', scheme),
    animation: 'Spring (250ms)',
    haptic: 'Medium Impact',
    throttle: 'None',
    requireKyc: false,
  });
  const patch = (next: Partial<LogicTrigger>) => setDraft((current) => ({ ...current, ...next }));
  const action = ACTIONS[draft.action];
  const targetOptions = action.targets === 'pages'
    ? PAGE_OPTIONS
    : action.targets?.map((t) => ({ value: t, label: t }));

  return (
    <div className="mb-3 rounded-2xl border-2 border-[#0040DF] bg-white p-3 shadow-[0_6px_20px_-8px_rgba(0,64,223,0.35)]">
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2.5">
        <p className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
          <span className="h-2 w-2 rounded-full bg-[#0040DF]" />
          {initial ? 'Edit Trigger' : 'Configure New Trigger'}
        </p>
        <span className="rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-[#0040DF]">
          {initial ? 'EDIT_FLOW' : 'NEW_FLOW'}
        </span>
      </div>

      <p className="mb-1.5 text-[11.5px] font-medium text-slate-600">Select Trigger Gesture / Event</p>
      <div className="mb-3 grid grid-cols-2 gap-1.5">
        {EVENT_ORDER.map((event) => {
          const meta = EVENTS[event];
          const selected = draft.event === event;
          return (
            <button key={event} type="button" aria-pressed={selected} onClick={() => patch({ event })}
              className={`flex min-w-0 items-center gap-1.5 rounded-lg border px-2 py-2 text-left text-[11.5px] font-semibold transition ${
                selected ? 'border-[#0040DF] bg-blue-50 text-[#0040DF]' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
              }`}>
              <meta.Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{meta.short}</span>
            </button>
          );
        })}
      </div>
      {!EVENTS[draft.event].live && (
        <p className="-mt-1.5 mb-3 text-[10.5px] leading-snug text-slate-400">
          {EVENTS[draft.event].label} runs in the built app. The Studio prototype simulates taps, long press, hold, swipe and screen appear.
        </p>
      )}

      <p className="mb-1.5 text-[11.5px] font-medium text-slate-600">Target Component Scope</p>
      <div className="mb-3.5 flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
        <span className="flex min-w-0 items-center gap-1.5 text-[12px] font-semibold text-slate-800">
          <Layers className="h-3.5 w-3.5 shrink-0 text-[#0040DF]" />
          <span className="truncate">{scopeIdent}</span>
        </span>
        <span className="shrink-0 text-[10.5px] text-slate-400">{scopeKind}</span>
      </div>

      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-800">Action Pipeline</p>
      <div className="mb-2 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11.5px] font-semibold text-[#0040DF]">Step 1: Action Type</span>
          <Equal className="h-3.5 w-3.5 text-slate-400" />
        </div>
        <Select
          ariaLabel="Action type"
          value={draft.action}
          options={ACTION_ORDER.map((a) => ({ value: a, label: ACTIONS[a].label }))}
          onChange={(value) => {
            const next = value as LogicAction;
            const target = defaultTarget(next);
            patch({ action: next, target, payload: defaultPayload(next, target, scheme) });
          }}
        />
      </div>
      <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11.5px] font-semibold text-[#0040DF]">Step 2: {action.payloadLabel}</span>
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
        </div>
        {targetOptions && (
          <div className="mb-1.5">
            <span className="mb-1 block text-[10.5px] text-slate-500">{action.targetLabel}</span>
            <Select
              ariaLabel={action.targetLabel ?? 'Target'}
              value={draft.target}
              options={targetOptions}
              onChange={(target) => patch({
                target,
                payload: draft.action === 'navigate' ? defaultPayload('navigate', target, scheme) : draft.payload,
              })}
            />
          </div>
        )}
        <input
          aria-label={action.payloadLabel}
          value={draft.payload}
          onChange={(event) => patch({ payload: event.target.value })}
          className={`${textInputCls} ${draft.action === 'dispatchApi' ? 'font-mono text-[11px]' : ''}`}
        />
        {draft.action === 'dispatchApi' && (
          <div className="mt-1.5">
            <span className="mb-1 block text-[10.5px] text-slate-500">Throttle limit</span>
            <Select ariaLabel="Throttle limit" value={draft.throttle}
              options={THROTTLES.map((t) => ({ value: t, label: t }))} onChange={(throttle) => patch({ throttle })} />
          </div>
        )}
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <label className="min-w-0">
          <span className="mb-1 block text-[11px] text-slate-600">Animation Curve</span>
          <Select ariaLabel="Animation curve" value={draft.animation}
            options={ANIMATIONS.map((a) => ({ value: a, label: a }))} onChange={(animation) => patch({ animation })} />
        </label>
        <label className="min-w-0">
          <span className="mb-1 flex items-center gap-1 text-[11px] text-slate-600">Haptic Feedback <Vibrate className="h-3 w-3 text-slate-400" /></span>
          <Select ariaLabel="Haptic feedback" value={draft.haptic}
            options={HAPTICS.map((h) => ({ value: h, label: h }))} onChange={(haptic) => patch({ haptic })} />
        </label>
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-[12px] font-medium text-slate-800">
          <input type="checkbox" checked={draft.requireKyc} onChange={(event) => patch({ requireKyc: event.target.checked })}
            className="h-4 w-4 cursor-pointer rounded accent-[#0040DF]" />
          Require KYC Verification
        </label>
        <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
          draft.requireKyc ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
        }`}>
          {draft.requireKyc ? 'Guard Active' : 'No Guard'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50">
          Cancel
        </button>
        <button type="button" onClick={() => onSave(draft)}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#0040DF] py-2 text-[12px] font-bold text-white hover:bg-[#0036BF]">
          <Check className="h-3.5 w-3.5" /> Save Trigger
        </button>
      </div>
    </div>
  );
}

function TriggerCard({ trigger, onEdit, onDelete }: { trigger: LogicTrigger; onEdit: () => void; onDelete: () => void }) {
  const meta = EVENTS[trigger.event];
  const target = trigger.action === 'navigate' ? pageLabel(trigger.target) : trigger.target;
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <button type="button" onClick={onEdit} className="flex min-w-0 items-center gap-1.5 text-left text-[12.5px] font-bold text-slate-900">
          <meta.Icon className="h-3.5 w-3.5 shrink-0 text-[#0040DF]" />
          <span className="truncate">{meta.label}</span>
        </button>
        <span className="flex shrink-0 items-center gap-1">
          <CardActions onEdit={onEdit} onDelete={onDelete} name={meta.label} />
          <span className="text-[10.5px] text-slate-400">{meta.kind}</span>
        </span>
      </div>
      <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-2.5 py-1.5">
        {trigger.action === 'dispatchApi' ? (
          <>
            <Row label="Dispatch:"><span className="font-mono text-emerald-600">{target}</span></Row>
            <Row label="Throttle Limit:">{trigger.throttle}</Row>
          </>
        ) : (
          <>
            <Row label="Action:">{ACTIONS[trigger.action].label}</Row>
            {target && <Row label="Target:"><span className="text-[#0040DF]">{target}</span></Row>}
            {(trigger.action === 'showToast' || trigger.action === 'openLink') && trigger.payload && (
              <Row label={ACTIONS[trigger.action].payloadLabel + ':'}><span className="text-[#0040DF]">{trigger.payload}</span></Row>
            )}
          </>
        )}
        {trigger.animation !== 'None' && <Row label="Animation:">{trigger.animation}</Row>}
        {trigger.haptic !== 'None' && <Row label="Haptic:">{trigger.haptic}</Row>}
        {trigger.requireKyc && <Row label="Guard:"><span className="text-emerald-600">KYC verified</span></Row>}
      </div>
    </div>
  );
}

/* ═══════════════════════════ Rule editor (logic tab 3) ═══════════════════════════ */

function defaultConditionFor(variable: string, previous?: LogicCondition): Omit<LogicCondition, 'id' | 'join'> {
  const def = variableDef(variable);
  if (def.kind === 'enum') return { variable, operator: '==', value: def.options?.[1] ?? def.options?.[0] ?? '' };
  if (def.kind === 'boolean') return { variable, operator: '==', value: 'false' };
  const keepOperator = previous && operatorsFor(def.kind).some((o) => o.value === previous.operator);
  return { variable, operator: keepOperator ? previous.operator : '<', value: def.kind === 'currency' ? '500.00' : '' };
}

function ConditionFields({
  condition, onChange, state, compact,
}: {
  condition: LogicCondition;
  onChange: (next: LogicCondition) => void;
  state: LogicState;
  compact?: boolean;
}) {
  const def = variableDef(condition.variable);
  const current = state[condition.variable];
  return (
    <>
      <div className="grid grid-cols-[1.4fr_1fr] gap-2">
        <label className="min-w-0">
          {!compact && <span className="mb-1 block text-[11px] text-slate-600">Variable</span>}
          <Select ariaLabel="Variable" value={condition.variable}
            options={VARIABLES.map((v) => ({ value: v.id, label: v.id }))}
            onChange={(variable) => onChange({ ...condition, ...defaultConditionFor(variable, condition) })} />
        </label>
        <label className="min-w-0">
          {!compact && <span className="mb-1 block text-[11px] text-slate-600">Operator</span>}
          <Select ariaLabel="Operator" value={condition.operator} options={operatorsFor(def.kind)}
            onChange={(operator) => onChange({ ...condition, operator: operator as LogicOperator })} />
        </label>
      </div>
      <label className="mt-2 block">
        {!compact && (
          <span className="mb-1 block text-[11px] text-slate-600">
            {def.kind === 'currency' || def.kind === 'number' ? 'Threshold Value' : 'Comparison Value'}
          </span>
        )}
        {def.kind === 'enum' || def.kind === 'boolean' ? (
          <Select ariaLabel="Comparison value" value={condition.value}
            options={(def.kind === 'boolean' ? ['true', 'false'] : def.options ?? []).map((o) => ({ value: o, label: o }))}
            onChange={(value) => onChange({ ...condition, value })} />
        ) : (
          <input
            aria-label="Threshold value"
            inputMode="decimal"
            value={def.kind === 'currency' && !compact ? `$${condition.value}` : condition.value}
            onChange={(event) => onChange({ ...condition, value: event.target.value.replace(/^\$/, '') })}
            placeholder={def.kind === 'currency' ? '$0.00' : '0'}
            className={`${textInputCls} bg-slate-50`}
          />
        )}
      </label>
      {current !== undefined && (
        <p className="mt-1 text-[10px] text-slate-400">Sandbox value now: {formatValue(condition.variable, current)}</p>
      )}
    </>
  );
}

function RuleEditor({
  initial, ruleNumber, state, onCancel, onSave,
}: {
  initial: LogicRule | null;
  ruleNumber: number;
  state: LogicState;
  onCancel: () => void;
  onSave: (rule: LogicRule) => void;
}) {
  const [draft, setDraft] = useState<LogicRule>(() => initial ?? {
    id: newId('rule'),
    number: ruleNumber,
    name: '',
    conditions: [{ id: newId('cond'), join: 'AND', ...defaultConditionFor('account.balance') }],
    styleEffect: 'warning',
    behaviorEffect: 'stepUpAuth',
    pushAlert: true,
  });
  const patch = (next: Partial<LogicRule>) => setDraft((current) => ({ ...current, ...next }));
  const setCondition = (index: number, next: LogicCondition) =>
    patch({ conditions: draft.conditions.map((c, i) => (i === index ? next : c)) });
  const style = STYLE_EFFECTS[draft.styleEffect];
  const live = ruleHolds(draft, state);

  return (
    <div className="mb-3 overflow-hidden rounded-2xl border-2 border-[#0040DF] bg-white shadow-[0_6px_20px_-8px_rgba(0,64,223,0.35)]">
      <div className="flex items-center justify-between bg-[#0040DF] px-3 py-2.5">
        <p className="flex items-center gap-2 text-[13px] font-bold text-white">
          <SlidersHorizontal className="h-4 w-4" />
          {initial ? 'Edit Conditional Rule' : 'Add Conditional Rule'}
        </p>
        <span className="rounded-md bg-white/20 px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-white">
          RULE #{String(draft.number).padStart(2, '0')}
        </span>
      </div>

      <div className="p-3">
        <label className="mb-3 block">
          <span className="mb-1 block text-[11.5px] font-medium text-slate-600">Rule Name / Description</span>
          <input value={draft.name} onChange={(event) => patch({ name: event.target.value })}
            placeholder="e.g. Tier 1 Balance Deficit Warning" className={`${textInputCls} bg-slate-50`} />
        </label>

        {/* IF */}
        <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-800">
              <span className="rounded bg-[#0040DF] px-1.5 py-0.5 text-[9.5px] font-bold text-white">IF</span>
              Condition Clause
            </span>
            <span className="font-mono text-[10px] text-slate-400">eval: onStateChange</span>
          </div>
          {draft.conditions.map((condition, index) => (
            <div key={condition.id} className={index > 0 ? 'mt-2.5 border-t border-dashed border-slate-200 pt-2.5' : ''}>
              {index > 0 && (
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex rounded-md border border-slate-200 bg-white p-0.5">
                    {(['AND', 'OR'] as const).map((join) => (
                      <button key={join} type="button" aria-pressed={condition.join === join}
                        onClick={() => setCondition(index, { ...condition, join })}
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          condition.join === join ? 'bg-[#0040DF] text-white' : 'text-slate-500 hover:text-slate-800'
                        }`}>
                        {join}
                      </button>
                    ))}
                  </div>
                  <button type="button" aria-label="Remove condition" title="Remove condition"
                    onClick={() => patch({ conditions: draft.conditions.filter((c) => c.id !== condition.id) })}
                    className="grid h-6 w-6 place-items-center rounded text-slate-400 hover:bg-rose-50 hover:text-rose-500">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <ConditionFields condition={condition} state={state} compact={index > 0}
                onChange={(next) => setCondition(index, next)} />
            </div>
          ))}
          <button type="button"
            onClick={() => patch({
              conditions: [...draft.conditions, { id: newId('cond'), join: 'AND', ...defaultConditionFor('card.status') }],
            })}
            className="mt-2.5 flex items-center gap-1 text-[11.5px] font-semibold text-[#0040DF] hover:text-[#0036BF]">
            <Plus className="h-3.5 w-3.5" /> Add AND/OR condition
          </button>
        </div>

        {/* THEN */}
        <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-800">
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9.5px] font-bold text-white">THEN</span>
              Consequence Action
            </span>
            <span className="font-mono text-[10px] text-slate-400">UI + State</span>
          </div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-[11.5px] text-slate-600">State Effect:</span>
            {/* The link-style label opens a native picker laid invisibly over it. */}
            <span className="relative flex shrink-0 items-center gap-0.5 text-[11.5px] font-semibold text-[#0040DF]">
              {draft.styleEffect === 'none' ? 'Choose Style Override' : 'Apply Style Override'}
              <ChevronDown className="h-3 w-3" />
              <select aria-label="State effect" value={draft.styleEffect}
                onChange={(event) => patch({ styleEffect: event.target.value as StyleEffect })}
                className="absolute inset-0 cursor-pointer opacity-0">
                {(Object.keys(STYLE_EFFECTS) as StyleEffect[]).map((s) => (
                  <option key={s} value={s}>{STYLE_EFFECTS[s].label}</option>
                ))}
              </select>
            </span>
          </div>
          <div className={`mb-2.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium ${style.box}`}>{style.label}</div>
          <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-2">
            <span className="shrink-0 text-[11.5px] text-slate-600">Behavior Effect:</span>
            <span className="relative min-w-0">
              <select aria-label="Behavior effect" value={draft.behaviorEffect}
                onChange={(event) => patch({ behaviorEffect: event.target.value as BehaviorEffect })}
                className="w-full cursor-pointer appearance-none truncate bg-transparent pr-4 text-right text-[11.5px] font-medium text-slate-800 outline-none">
                {(Object.keys(BEHAVIOR_EFFECTS) as BehaviorEffect[]).map((b) => (
                  <option key={b} value={b}>{BEHAVIOR_EFFECTS[b].label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            </span>
          </div>
        </div>

        <div className="mb-2.5 flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-2.5 py-2">
          <div>
            <p className="text-[12px] font-semibold text-slate-800">Push Alert Trigger</p>
            <p className="text-[10.5px] text-slate-500">Trigger In-App Push Notification</p>
          </div>
          <Toggle checked={draft.pushAlert} onChange={(pushAlert) => patch({ pushAlert })} label="Push alert trigger" />
        </div>

        <div className="mb-3 flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-medium text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0">
            Audited Rule: changes are logged for SOC 2 / PCI DSS review
            <span className="text-emerald-600/80"> · {live ? 'true' : 'false'} with sandbox data</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={onCancel}
            className="rounded-lg border border-slate-200 bg-white py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={() => onSave(draft)} disabled={draft.conditions.length === 0}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-[#0040DF] py-2 text-[12px] font-bold text-white hover:bg-[#0036BF] disabled:opacity-50">
            <Check className="h-3.5 w-3.5" /> Apply &amp; Save Rule
          </button>
        </div>
      </div>
    </div>
  );
}

function RuleCard({ rule, state, onEdit, onDelete }: { rule: LogicRule; state: LogicState; onEdit: () => void; onDelete: () => void }) {
  const tag = ruleTag(rule);
  const live = ruleHolds(rule, state);
  const title = `If ${conditionText(rule)}`;
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-2.5">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <button type="button" onClick={onEdit} className="min-w-0 text-left">
          <p className="break-words text-[12px] font-bold leading-snug text-slate-900">{title}</p>
          {rule.name && <p className="mt-0.5 truncate text-[10.5px] text-slate-500">{rule.name}</p>}
        </button>
        <span className="flex shrink-0 items-center gap-1">
          <CardActions onEdit={onEdit} onDelete={onDelete} name={`rule ${rule.number}`} />
          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${tag.cls}`}>{tag.label}</span>
        </span>
      </div>
      <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-2.5 py-1.5 text-[11.5px] leading-snug text-slate-700">
        {ruleDescription(rule)}
      </div>
      <p className={`mt-1.5 flex items-center gap-1.5 text-[10px] ${live ? 'text-emerald-600' : 'text-slate-400'}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-emerald-500' : 'bg-slate-300'}`} />
        {live ? 'Active now with sandbox data' : 'Not active with sandbox data'}
      </p>
    </div>
  );
}

/* ═══════════════════════════ Logic tab ═══════════════════════════ */

const toIdent = (name: string) => name
  .replace(/[^A-Za-z0-9]+/g, ' ')
  .trim()
  .split(' ')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join('') || 'Component';

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** The deep-link scheme for the app, from its project name ("Apex Digital Bank" → "apex"). */
export function appSchemeFor(projectName: string | null | undefined): string {
  const first = (projectName ?? '').trim().split(/\s+/)[0] ?? '';
  return slug(first) || 'app';
}

const countLabel = (entry: ElementLogic) => {
  const parts = [];
  if (entry.triggers.length) parts.push(`${entry.triggers.length} trigger${entry.triggers.length === 1 ? '' : 's'}`);
  if (entry.rules.length) parts.push(`${entry.rules.length} rule${entry.rules.length === 1 ? '' : 's'}`);
  if (!parts.length && (entry.route || entry.authGuard)) parts.push('routing');
  return parts.join(' · ');
};

type Editing = { kind: 'trigger' | 'rule'; id: string | null } | null;

/**
 * The right panel's Logic tab: what happens when the selected component — or the button
 * / part selected inside it — is pressed, plus conditional rules and deep-link routing.
 * Mount it with `key={logicKey(moduleId, elementId)}` so the forms reset per target.
 */
export function LogicTab({
  moduleId, componentTitle, elementId, pageId, logic, setLogic, state, scheme, onSelectElement,
}: {
  moduleId: string;
  componentTitle: string;
  elementId: string | null;
  pageId: string;
  logic: LogicMap;
  setLogic: React.Dispatch<React.SetStateAction<LogicMap>>;
  state: LogicState;
  scheme: string;
  onSelectElement: (elementId: string | null) => void;
}) {
  const key = logicKey(moduleId, elementId);
  const entry = logic[key] ?? EMPTY_LOGIC;
  const [editing, setEditing] = useState<Editing>(null);

  const elementName = elementId ? getElementDisplayName(elementId) : null;
  const scopeName = elementName ?? componentTitle;
  const scopeIdent = elementName ? toIdent(elementName) : `${toIdent(componentTitle)}Component`;
  const scopeKind = elementName ? 'Sub-component' : 'Root Node';
  const defaultRoute = `${scheme}://${slug(pageId)}/${slug(scopeName)}`;

  const update = (change: (current: ElementLogic) => ElementLogic) => setLogic((all) => {
    const next = change(all[key] ?? EMPTY_LOGIC);
    const rest = { ...all };
    delete rest[key];
    return isEmptyLogic(next) ? rest : { ...rest, [key]: next };
  });

  const saveTrigger = (trigger: LogicTrigger) => {
    update((current) => ({
      ...current,
      triggers: current.triggers.some((t) => t.id === trigger.id)
        ? current.triggers.map((t) => (t.id === trigger.id ? trigger : t))
        : [...current.triggers, trigger],
    }));
    setEditing(null);
  };
  const saveRule = (rule: LogicRule) => {
    update((current) => ({
      ...current,
      rules: current.rules.some((r) => r.id === rule.id)
        ? current.rules.map((r) => (r.id === rule.id ? rule : r))
        : [...current.rules, rule],
    }));
    setEditing(null);
  };

  const editingTrigger = editing?.kind === 'trigger';
  const editingRule = editing?.kind === 'rule';
  const nextRuleNumber = entry.rules.reduce((max, r) => Math.max(max, r.number), 0) + 1;

  // Other parts of this component that already have logic, so they are easy to find again.
  const siblings = Object.entries(logic)
    .map(([k, value]) => ({ k, value, parts: splitKey(k) }))
    .filter(({ k, parts }) => parts[0] === moduleId && k !== key);

  return (
    <div className="px-3 py-3">
      {/* Target */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
        {elementName && (
          <button type="button" onClick={() => onSelectElement(null)} title={`Logic for all of ${componentTitle}`}
            className="mb-0.5 flex max-w-full items-center gap-0.5 text-[10.5px] font-medium text-slate-500 hover:text-[#0040DF]">
            <span className="truncate">{componentTitle}</span>
            <ChevronRight className="h-3 w-3 shrink-0" />
          </button>
        )}
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[12.5px] font-bold text-slate-900">{scopeName}</p>
          <span className="shrink-0 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">
            {scopeKind}
          </span>
        </div>
        <p className="mt-1 text-[10.5px] leading-snug text-slate-500">
          {elementName
            ? `Logic runs when ${elementName} is used. The rest of ${componentTitle} keeps its own logic.`
            : `Click a button or part inside ${componentTitle} on the phone to give it its own logic.`}
        </p>
        {siblings.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {siblings.map(({ k, value, parts }) => (
              <button key={k} type="button" onClick={() => onSelectElement(parts[1])}
                title={countLabel(value)}
                className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-medium text-[#0040DF] ring-1 ring-blue-100 hover:ring-[#0040DF]">
                {parts[1] ? getElementDisplayName(parts[1]) : `All of ${componentTitle}`} · {countLabel(value)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Event triggers & actions */}
      <section className="mb-5">
        <SectionHeader
          title="Event Triggers & Actions"
          action={editingTrigger
            ? <CloseButton onClick={() => setEditing(null)} />
            : <AddButton label="Add Trigger Event" onClick={() => setEditing({ kind: 'trigger', id: null })} />}
        />
        {editingTrigger && (
          <TriggerEditor
            key={editing.id ?? 'new'}
            initial={entry.triggers.find((t) => t.id === editing.id) ?? null}
            scopeIdent={scopeIdent}
            scopeKind={scopeKind}
            scheme={scheme}
            onCancel={() => setEditing(null)}
            onSave={saveTrigger}
          />
        )}
        <div className="space-y-2">
          {entry.triggers
            .filter((t) => !(editingTrigger && editing.id === t.id))
            .map((trigger) => (
              <TriggerCard
                key={trigger.id}
                trigger={trigger}
                onEdit={() => setEditing({ kind: 'trigger', id: trigger.id })}
                onDelete={() => update((current) => ({ ...current, triggers: current.triggers.filter((t) => t.id !== trigger.id) }))}
              />
            ))}
          {entry.triggers.length === 0 && !editingTrigger && (
            <p className="rounded-xl border border-dashed border-slate-200 px-3 py-3 text-center text-[11px] leading-snug text-slate-400">
              No triggers yet. Add one to choose what happens when {scopeName} is tapped, held or swiped.
            </p>
          )}
        </div>
      </section>

      {/* Conditional logic rules */}
      <section className="mb-5">
        <SectionHeader
          title="Conditional Logic Rules"
          action={editingRule
            ? <CloseButton onClick={() => setEditing(null)} />
            : <AddButton label="Add Rule" onClick={() => setEditing({ kind: 'rule', id: null })} />}
        />
        {editingRule && (
          <RuleEditor
            key={editing.id ?? 'new'}
            initial={entry.rules.find((r) => r.id === editing.id) ?? null}
            ruleNumber={nextRuleNumber}
            state={state}
            onCancel={() => setEditing(null)}
            onSave={saveRule}
          />
        )}
        <div className="space-y-2">
          {entry.rules
            .filter((r) => !(editingRule && editing.id === r.id))
            .map((rule) => (
              <RuleCard
                key={rule.id}
                rule={rule}
                state={state}
                onEdit={() => setEditing({ kind: 'rule', id: rule.id })}
                onDelete={() => update((current) => ({ ...current, rules: current.rules.filter((r) => r.id !== rule.id) }))}
              />
            ))}
          {entry.rules.length === 0 && !editingRule && (
            <p className="rounded-xl border border-dashed border-slate-200 px-3 py-3 text-center text-[11px] leading-snug text-slate-400">
              No rules yet. Rules change how {scopeName} looks or behaves based on account, card or KYC state.
            </p>
          )}
        </div>
      </section>

      {/* Navigation routing */}
      <section>
        <SectionHeader title="Navigation Routing" />
        <div className="rounded-xl border border-slate-200 bg-white p-2.5">
          <label className="block">
            <span className="mb-1 block text-[11.5px] font-medium text-slate-600">Deep Link Route</span>
            <input
              value={entry.route ?? ''}
              placeholder={defaultRoute}
              onChange={(event) => update((current) => ({ ...current, route: event.target.value || undefined }))}
              className={`${textInputCls} bg-slate-50 font-mono text-[11px]`}
            />
          </label>
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-slate-800">Auth Guard</p>
              <p className="text-[10.5px] text-slate-500">Require Biometric / Passkey unlock on tap</p>
            </div>
            <Toggle checked={!!entry.authGuard} label="Auth guard"
              onChange={(authGuard) => update((current) => ({ ...current, authGuard: authGuard || undefined }))} />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════ Prototype runtime ═══════════════════════════ */

const LONG_PRESS_MS = 500;
const HOLD_MS = 1000;
const SWIPE_PX = 40;
const PART_SELECTOR = '[data-studio-element], button, [data-text-slot], [role="button"]';

type Hit = { moduleId: string; elementId: string | null; host: HTMLElement };

/** The component (and part inside it) under a pointer event, for components in the phone. */
function hitFor(target: EventTarget | null): Hit | null {
  if (!(target instanceof Element)) return null;
  const host = target.closest<HTMLElement>('[data-studio-tinker-host]');
  if (!host || !host.closest('[data-module-id]')) return null;
  const moduleId = host.dataset.studioTinkerHost;
  if (!moduleId) return null;
  const part = target.closest<HTMLElement>(PART_SELECTOR);
  const elementId = part && host.contains(part) ? getTinkerElementId(part, host) : null;
  return { moduleId, elementId, host };
}

/** The logic entries that apply to a hit: the part's own logic first, then the whole component's. */
function entriesFor(logic: LogicMap, hit: Hit): ElementLogic[] {
  const keys = hit.elementId ? [logicKey(hit.moduleId, hit.elementId), logicKey(hit.moduleId, null)] : [logicKey(hit.moduleId, null)];
  return keys.map((k) => logic[k]).filter((entry): entry is ElementLogic => !!entry);
}

/** The triggers for an event: the part's own, or the component's if the part has none. */
function triggersFor(entries: ElementLogic[], event: LogicEvent): { triggers: LogicTrigger[]; owner: ElementLogic | null } {
  for (const entry of entries) {
    const triggers = entry.triggers.filter((t) => t.event === event);
    if (triggers.length) return { triggers, owner: entry };
  }
  return { triggers: [], owner: null };
}

const EFFECT_CSS = `
[data-logic-effect="warning"] { outline: 2px solid #F59E0B !important; outline-offset: 2px; box-shadow: 0 0 0 4px rgba(245,158,11,.18) !important; }
[data-logic-effect="highlight"] { background-color: rgba(245,158,11,.16) !important; color: #B45309 !important; }
[data-logic-effect="dim"] { opacity: .6 !important; filter: grayscale(.35); position: relative; }
[data-logic-effect="dim"]::after { content: "LOCKED"; position: absolute; top: 4px; right: 4px; padding: 1px 4px; border-radius: 4px; background: #0F172A; color: #fff; font: 700 7px/1.4 system-ui, sans-serif; letter-spacing: .06em; pointer-events: none; }
[data-logic-effect="error"] { outline: 2px solid #EF4444 !important; outline-offset: 2px; }
[data-logic-effect="success"] { outline: 2px solid #10B981 !important; outline-offset: 2px; }
[data-logic-effect="hide"] { visibility: hidden !important; }
`;

/**
 * Runs the Logic tab's configuration on the phone while the Studio is in Prototype mode:
 * gestures fire their triggers (instead of the component's built-in action), rules that
 * are true apply their style overrides and can block, step up or reroute an action.
 */
export function LogicRuntime({
  enabled, logic, state, pageId, onTrigger, onNotice,
}: {
  enabled: boolean;
  logic: LogicMap;
  state: LogicState;
  pageId: string;
  /** Performs a trigger's side effect (navigation, card freeze…). */
  onTrigger: (trigger: LogicTrigger) => void;
  onNotice: (message: string) => void;
}) {
  const latest = useRef({ logic, state, onTrigger, onNotice });
  useLayoutEffect(() => {
    latest.current = { logic, state, onTrigger, onNotice };
  });

  // Gestures.
  useEffect(() => {
    if (!enabled) return;

    /** Runs an event's logic for a hit. Returns true when the logic took over the gesture. */
    const run = (event: LogicEvent, hit: Hit): boolean => {
      const { logic: map, state: values, onTrigger: perform, onNotice: notify } = latest.current;
      const entries = entriesFor(map, hit);
      if (!entries.length) return false;
      const { triggers, owner } = triggersFor(entries, event);
      const activeRules = entries.flatMap((entry) => entry.rules).filter((rule) => ruleHolds(rule, values));
      const label = EVENTS[event].label;
      const messages: string[] = [];
      const pushCount = activeRules.filter((rule) => rule.pushAlert).length;
      const pushes = pushCount ? [`${pushCount === 1 ? 'Push alert' : `${pushCount} push alerts`} sent`] : [];

      const blocking = activeRules.find((rule) => rule.behaviorEffect === 'disableTap' || rule.behaviorEffect === 'blockWithReason');
      if (blocking && (triggers.length || event === 'tap')) {
        notify([
          blocking.behaviorEffect === 'blockWithReason'
            ? `Blocked: ${blocking.name || conditionText(blocking)}`
            : 'Tap actions are disabled by a rule',
          ...pushes,
        ].join(' · '));
        return true;
      }
      if (!triggers.length) return false;

      const kycRule = activeRules.find((rule) => rule.behaviorEffect === 'routeKyc');
      if (kycRule) {
        perform({ ...triggers[0], action: 'navigate', target: 'profile' });
        notify([`KYC upgrade required: ${kycRule.name || conditionText(kycRule)}`, ...pushes].join(' · '));
        return true;
      }
      if (activeRules.some((rule) => rule.behaviorEffect === 'stepUpAuth')) messages.push('Step-up Face ID approved (sandbox)');
      if (activeRules.some((rule) => rule.behaviorEffect === 'requireOtp')) messages.push('OTP approved (sandbox)');
      if (owner?.authGuard) messages.push('Passkey unlock approved (sandbox)');

      for (const trigger of triggers) {
        if (trigger.requireKyc && String(values['user.kycStatus']).toUpperCase() !== 'VERIFIED') {
          messages.push(`${ACTIONS[trigger.action].label} stopped: KYC verification required`);
          continue;
        }
        perform(trigger);
        messages.push(`${label} → ${describeTrigger(trigger)}${trigger.haptic !== 'None' ? ` · ${trigger.haptic} haptic` : ''}`);
      }
      notify([...messages, ...pushes].join(' · '));
      return true;
    };

    let press: { hit: Hit; x: number; y: number; timers: number[]; fired: boolean } | null = null;
    let suppressClickUntil = 0;
    const clearPress = () => {
      press?.timers.forEach((timer) => window.clearTimeout(timer));
      press = null;
    };
    const has = (hit: Hit, event: LogicEvent) => triggersFor(entriesFor(latest.current.logic, hit), event).triggers.length > 0;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      clearPress();
      const hit = hitFor(event.target);
      if (!hit) return;
      const current = { hit, x: event.clientX, y: event.clientY, timers: [] as number[], fired: false };
      const timed: [LogicEvent, number][] = [['longPress', LONG_PRESS_MS], ['hold', HOLD_MS]];
      for (const [gesture, delay] of timed) {
        if (!has(hit, gesture)) continue;
        current.timers.push(window.setTimeout(() => {
          if (press !== current || current.fired) return;
          current.fired = run(gesture, hit) || current.fired;
        }, delay));
      }
      press = current;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!press) return;
      const { hit, x, y, fired } = press;
      const dx = event.clientX - x;
      const dy = event.clientY - y;
      clearPress();
      let handled = fired;
      if (!handled && Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) handled = run('swipe', hit);
      if (handled) suppressClickUntil = Date.now() + 400;
    };
    const onClick = (event: MouseEvent) => {
      const hit = hitFor(event.target);
      if (!hit) return;
      const stop = () => { event.preventDefault(); event.stopPropagation(); };
      if (Date.now() < suppressClickUntil) { stop(); return; }
      if (run('tap', hit)) { stop(); return; }
      // A part that only has a double-tap trigger waits for the second tap instead of its default action.
      if (has(hit, 'doubleTap')) stop();
    };
    const onDoubleClick = (event: MouseEvent) => {
      const hit = hitFor(event.target);
      if (hit && run('doubleTap', hit)) { event.preventDefault(); event.stopPropagation(); }
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('pointerup', onPointerUp, true);
    document.addEventListener('pointercancel', clearPress, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('dblclick', onDoubleClick, true);
    return () => {
      clearPress();
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('pointerup', onPointerUp, true);
      document.removeEventListener('pointercancel', clearPress, true);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('dblclick', onDoubleClick, true);
    };
  }, [enabled]);

  // On Screen Appear: once each time a screen opens in the prototype.
  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => {
      const { logic: map, onTrigger: perform, onNotice: notify } = latest.current;
      const messages: string[] = [];
      for (const host of document.querySelectorAll<HTMLElement>('[data-module-id] [data-studio-tinker-host]')) {
        const entry = map[logicKey(host.dataset.studioTinkerHost ?? '', null)];
        for (const trigger of entry?.triggers.filter((t) => t.event === 'appear') ?? []) {
          perform(trigger);
          messages.push(`On Screen Appear → ${describeTrigger(trigger)}`);
        }
      }
      if (messages.length) notify(messages.join(' · '));
    }, 60);
    return () => window.clearTimeout(timer);
  }, [enabled, pageId]);

  // Style overrides of rules that are currently true. Re-applied after every render,
  // because the phone's DOM changes as screens and components change.
  useEffect(() => {
    if (!enabled) return;
    const marked: HTMLElement[] = [];
    for (const [key, entry] of Object.entries(logic)) {
      const active = entry.rules.filter((rule) => rule.styleEffect !== 'none' && ruleHolds(rule, state));
      if (!active.length) continue;
      const [moduleId, elementId] = splitKey(key);
      const hosts = document.querySelectorAll<HTMLElement>(
        `[data-module-id] [data-studio-tinker-host="${CSS.escape(moduleId)}"]`,
      );
      for (const host of hosts) {
        const element = elementId ? findElementById(host, elementId) : host;
        if (!element) continue;
        element.setAttribute('data-logic-effect', active[active.length - 1].styleEffect);
        marked.push(element);
      }
    }
    return () => marked.forEach((element) => element.removeAttribute('data-logic-effect'));
  });

  return enabled ? <style>{EFFECT_CSS}</style> : null;
}
