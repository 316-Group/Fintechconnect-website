'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  MousePointer2,
  Bell,
  ArrowUpRight,
  Users,
  Home,
  CreditCard,
  ListFilter,
  Search,
  Apple,
  Snowflake,
  Settings,
  Wifi,
  Delete,
  Check,
} from 'lucide-react';

interface StepItem {
  id: number;
  title: string;
  description: string;
}

const stepsData: StepItem[] = [
  {
    id: 1,
    title: 'Canvas',
    description: 'Start blank, or choose a starting point with faint dot grid and safe-area ruler guides.',
  },
  {
    id: 2,
    title: 'Logo and name',
    description: 'Add your identity. Logo and institutional app name appear securely anchored in the mobile header.',
  },
  {
    id: 3,
    title: 'Colour',
    description: 'Choose your colour. Primary colour fills balance card and action triggers with verified accessibility.',
  },
  {
    id: 4,
    title: 'Type and shape',
    description: 'Set your type and shape language. Typography adjusts, button corners morph from rounded to pill.',
  },
  {
    id: 5,
    title: 'Components',
    description: 'Place the components your customers need. Balance cards, quick actions, and transaction lists drop in.',
  },
];

// ---------------------------------------------------------------------------
// Animation timeline: 5 screens x 2s = 10s loop
// ---------------------------------------------------------------------------

const SCREEN_COUNT = 5;
const SCREEN_MS = 2000;
const TOTAL_MS = SCREEN_COUNT * SCREEN_MS;
const TICK_MS = 50;
const AUTO_AMOUNT = '286';

// Stage design size (everything inside is laid out at 1000 x 645, then scaled to fit)
const STAGE_W = 1000;
const STAGE_H = 645;

interface AutoState {
  screen: number;
  digits: string;
  pressedKey: string | null;
}

// Works out what the demo should show at a given point on the 10s timeline
function getAutoState(t: number): AutoState {
  const screen = Math.min(SCREEN_COUNT - 1, Math.floor(t / SCREEN_MS));
  const local = (t % SCREEN_MS) / SCREEN_MS;

  if (screen < 3) return { screen, digits: '', pressedKey: null };
  if (screen === 4) return { screen, digits: AUTO_AMOUNT, pressedKey: null };

  // Screen 4: the amount is typed out key by key (2, 8, 6)
  if (local < 0.18) return { screen, digits: '', pressedKey: null };
  if (local < 0.3) return { screen, digits: '2', pressedKey: '2' };
  if (local < 0.42) return { screen, digits: '2', pressedKey: null };
  if (local < 0.54) return { screen, digits: '28', pressedKey: '8' };
  if (local < 0.66) return { screen, digits: '28', pressedKey: null };
  if (local < 0.78) return { screen, digits: '286', pressedKey: '6' };
  return { screen, digits: '286', pressedKey: null };
}

function formatAmount(raw: string) {
  if (raw === '') return '0.00';
  const [intPart, decPart] = raw.split('.');
  const intFormatted = Number(intPart || '0').toLocaleString('en-US');
  return decPart !== undefined ? `${intFormatted}.${decPart}` : intFormatted;
}

// ---------------------------------------------------------------------------
// Small shared pieces
// ---------------------------------------------------------------------------

const AVATAR_GRADIENTS = [
  'from-amber-300 to-orange-500',
  'from-sky-300 to-indigo-500',
  'from-rose-300 to-pink-500',
  'from-emerald-300 to-teal-500',
  'from-violet-300 to-purple-500',
  'from-slate-300 to-slate-500',
];

function Avatar({
  initials,
  size,
  gradient = 0,
  dot,
}: {
  initials: string;
  size: number;
  gradient?: number;
  dot?: string;
}) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white ${
          AVATAR_GRADIENTS[gradient % AVATAR_GRADIENTS.length]
        }`}
        style={{ fontSize: size * 0.36 }}
      >
        {initials}
      </div>
      {dot && (
        <span
          className="absolute bottom-0 right-0 h-[7px] w-[7px] rounded-full ring-2 ring-white"
          style={{ backgroundColor: dot }}
        />
      )}
    </div>
  );
}

function BottomNav({ active, go }: { active: 'home' | 'cards'; go: (screen: number) => void }) {
  const items = [
    { key: 'people', Icon: Users, target: 2 },
    { key: 'home', Icon: Home, target: 0 },
    { key: 'cards', Icon: CreditCard, target: 1 },
  ];
  return (
    <div className="absolute bottom-[20px] left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#2A2E37] p-1.5 shadow-lg">
      {items.map(({ key, Icon, target }) => {
        const selected = key === active;
        return (
          <button
            key={key}
            type="button"
            onClick={() => go(target)}
            aria-label={key}
            className={`flex h-8 items-center justify-center rounded-full transition-colors ${
              selected ? 'w-[52px] bg-white text-slate-900' : 'w-9 text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="h-3.5 w-3.5" fill={selected && key === 'home' ? 'currentColor' : 'none'} />
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The five phone screens
// ---------------------------------------------------------------------------

const TRANSACTIONS = [
  { name: 'Apple', amount: '-60 $', icon: 'apple', dot: '#2DD4BF', positive: false },
  { name: 'Threads', amount: '-300 $', icon: 'threads', dot: '#FACC15', positive: false },
  { name: 'Apple', amount: '2 000 $', icon: 'apple', dot: '#3B82F6', positive: true },
  { name: 'Exoplan', amount: '-20 $', icon: 'exoplan', dot: '#2DD4BF', positive: false },
  { name: 'Clubhouse', amount: '-140 $', icon: 'club', dot: '#2DD4BF', positive: false },
];

function TxIcon({ kind }: { kind: string }) {
  if (kind === 'threads')
    return <div className="grid h-[26px] w-[26px] place-items-center rounded-full bg-black text-[11px] font-bold text-white">@</div>;
  if (kind === 'exoplan')
    return <div className="grid h-[26px] w-[26px] place-items-center rounded-full bg-slate-700 text-[9px] font-bold text-white">31</div>;
  if (kind === 'club')
    return <div className="grid h-[26px] w-[26px] place-items-center rounded-full bg-orange-50 text-[12px] text-black">♣</div>;
  return (
    <div className="grid h-[26px] w-[26px] place-items-center rounded-full bg-slate-100 text-black">
      <Apple className="h-3 w-3" fill="currentColor" />
    </div>
  );
}

function HomeScreen({ go }: { go: (screen: number) => void }) {
  return (
    <div className="relative h-full w-full bg-[#0F1218] text-white">
      {/* Avatar + bell */}
      <div className="absolute left-4 right-4 top-[46px] flex items-center justify-between">
        <Avatar initials="AL" size={26} gradient={2} />
        <Bell className="h-3.5 w-3.5 text-slate-300" />
      </div>

      {/* Balance */}
      <div className="absolute left-4 top-[92px]">
        <p className="text-[9px] text-slate-400">Total balance</p>
        <p className="mt-0.5 flex items-baseline gap-1">
          <span className="text-[15px] font-semibold">$</span>
          <span className="text-[27px] font-bold leading-none tracking-tight">7,854</span>
          <span className="text-[10px] text-slate-400">.43</span>
        </p>
      </div>

      {/* Actions */}
      <div className="absolute left-4 top-[146px] flex gap-2">
        <button
          type="button"
          onClick={() => go(3)}
          className="flex h-6 items-center gap-1.5 rounded-full border border-white/20 bg-[#1B1F27] pl-1.5 pr-3 text-[9px] font-semibold transition-colors hover:bg-[#252A34]"
        >
          <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-white text-black">
            <ArrowUpRight className="h-2.5 w-2.5" />
          </span>
          Send
        </button>
        <button
          type="button"
          className="flex h-6 items-center rounded-full border border-white/10 bg-[#1B1F27] px-3 text-[9px] font-medium text-slate-200 transition-colors hover:bg-[#252A34]"
        >
          Request
        </button>
      </div>

      {/* Stacked cards peeking in */}
      <div className="absolute right-0 top-[94px] h-[75px] w-[60px]">
        <div className="absolute right-[26px] top-0 h-full w-[28px] rounded-l-lg bg-[#FBD32A]" />
        <div className="absolute right-[13px] top-0 h-full w-[28px] rounded-l-lg bg-[#2DD4A0]" />
        <div className="absolute right-0 top-0 h-full w-[28px] rounded-l-lg bg-[#0A84FF]" />
      </div>

      {/* Spending */}
      <div className="absolute left-3 right-3 top-[178px] flex items-center justify-between rounded-xl border border-white/5 bg-[#161A22] px-3 py-2.5">
        <div>
          <p className="text-[8px] text-slate-400">Spending</p>
          <p className="mt-0.5 text-[12px] font-bold">$1,385</p>
        </div>
        <div className="flex -space-x-1.5">
          {['#16A34A', '#F97316', '#64748B', '#000000', '#FFFFFF', '#C2410C'].map((c, i) => (
            <span
              key={i}
              className="h-[14px] w-[14px] rounded-full ring-1 ring-[#161A22]"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Transactions sheet */}
      <div className="absolute inset-x-0 bottom-0 top-[239px] rounded-t-[22px] bg-white text-slate-900">
        <div className="mx-auto mt-2 h-[3px] w-8 rounded-full bg-slate-200" />
        <div className="mt-3 flex items-center justify-between px-4 text-slate-400">
          <ListFilter className="h-3 w-3" />
          <span className="text-[8px] font-bold tracking-wide text-slate-800">TRANSACTIONS</span>
          <Search className="h-3 w-3" />
        </div>
        <div className="mt-2 px-4">
          {TRANSACTIONS.map((tx, i) => (
            <div key={i} className="flex h-[36px] items-center gap-2.5">
              <div className="relative">
                <TxIcon kind={tx.icon} />
                <span
                  className="absolute bottom-0 right-0 h-[6px] w-[6px] rounded-full ring-2 ring-white"
                  style={{ backgroundColor: tx.dot }}
                />
              </div>
              <span className="flex-1 text-[10px] font-semibold">{tx.name}</span>
              <span
                className={`text-[9px] font-semibold ${tx.positive ? 'text-emerald-500' : 'text-slate-800'}`}
              >
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="home" go={go} />
    </div>
  );
}

const CARD_STYLES = [
  { number: '7642', gradient: 'linear-gradient(135deg,#F5BE0B 0%,#F7D24B 55%,#F2D36B 100%)' },
  { number: '5123', gradient: 'linear-gradient(135deg,#1FC2AE 0%,#46D0BD 55%,#6FDACB 100%)' },
  { number: '3413', gradient: 'linear-gradient(135deg,#2788EE 0%,#4AA6F0 55%,#7CCBF2 100%)' },
];

function CardsScreen({ go }: { go: (screen: number) => void }) {
  return (
    <div className="relative h-full w-full bg-[#0F1218] text-white">
      <div className="absolute left-4 right-4 top-[56px] flex items-center justify-between">
        <h4 className="text-[19px] font-bold tracking-tight">Cards</h4>
        <button
          type="button"
          className="rounded-full bg-white px-2.5 py-1 text-[8px] font-bold text-black transition-opacity hover:opacity-90"
        >
          Order a card
        </button>
      </div>

      <div className="absolute inset-x-3 top-[92px] flex flex-col gap-[10px]">
        {CARD_STYLES.map((card) => (
          <div
            key={card.number}
            className="relative h-[113px] overflow-hidden rounded-xl text-white shadow-lg transition-transform hover:-translate-y-0.5"
            style={{ background: card.gradient }}
          >
            <div className="absolute left-3 top-2.5 text-[8px] font-bold">Digital card</div>
            <div className="absolute right-3 top-2.5 text-[8px] font-bold tracking-widest">
              •••• {card.number}
            </div>
            <div className="absolute bottom-2.5 left-3 flex gap-1.5">
              {[Snowflake, CreditCard, Settings].map((Icon, i) => (
                <span key={i} className="grid h-[22px] w-[22px] place-items-center rounded-full bg-white/30">
                  <Icon className="h-2.5 w-2.5" />
                </span>
              ))}
            </div>
            <div className="absolute bottom-2.5 right-3 flex -space-x-2">
              <span className="h-[18px] w-[18px] rounded-full bg-black/25" />
              <span className="h-[18px] w-[18px] rounded-full bg-black/20" />
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="cards" go={go} />
    </div>
  );
}

const RECIPIENTS = [
  { name: 'Sarah', handle: '@sarahsdesi...' },
  { name: 'Pavlo', handle: '@designwitha...' },
  { name: 'Jordan', handle: '@jordan.creat...' },
  { name: 'Chris', handle: '@chrisgraph...' },
  { name: 'Emily', handle: '@emilyartis...' },
  { name: 'Taylor', handle: '@taylorcrea...' },
];

const RECIPIENT_ROWS = [
  { name: 'Gigi Hadid', account: 'Chase 2983', dot: '#2DD4BF' },
  { name: 'Bella Hadid', account: 'Mastercard 9283', dot: '#D9F100' },
  { name: 'Bella Hadid', account: 'Mastercard 9283', dot: '#D9F100' },
  { name: 'Bella Hadid', account: 'Mastercard 9283', dot: '#D9F100' },
];

function RecipientsScreen({ go }: { go: (screen: number) => void }) {
  return (
    <div className="relative h-full w-full bg-[#0F1218] text-white">
      <div className="absolute left-4 right-4 top-[56px] flex items-center justify-between">
        <h4 className="text-[19px] font-bold tracking-tight">Recipients</h4>
        <button type="button" className="rounded-full bg-white px-3 py-1 text-[8px] font-bold text-black">
          Add
        </button>
      </div>

      <div className="absolute inset-x-4 top-[98px] grid grid-cols-3 gap-y-3">
        {RECIPIENTS.map((r, i) => (
          <button
            key={r.name}
            type="button"
            onClick={() => go(3)}
            className="flex flex-col items-center transition-transform hover:scale-105"
          >
            <Avatar initials={r.name[0]} size={40} gradient={i} />
            <span className="mt-1 text-[9px] font-medium">{r.name}</span>
            <span className="text-[6.5px] text-slate-500">{r.handle}</span>
          </button>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 top-[322px] rounded-t-[22px] bg-white text-slate-900">
        <div className="mx-auto mt-2 h-[3px] w-8 rounded-full bg-slate-200" />
        <div className="mt-3 flex items-center justify-between px-4">
          <div className="flex rounded-full bg-slate-100 p-[3px] text-[8px]">
            <span className="rounded-full bg-white px-2.5 py-1 font-bold shadow-sm">All</span>
            <span className="px-2.5 py-1 text-slate-400">My accounts</span>
          </div>
          <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-100 text-slate-500">
            <Search className="h-2.5 w-2.5" />
          </span>
        </div>
        <div className="mt-2 px-4">
          {RECIPIENT_ROWS.map((row, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(3)}
              className="flex h-[42px] w-full items-center gap-2.5 text-left transition-colors hover:bg-slate-50"
            >
              <Avatar initials={row.name[0]} size={26} gradient={i + 2} dot={row.dot} />
              <span className="flex-1 text-[10px] font-bold">{row.name}</span>
              <span className="text-[8px] text-slate-400">{row.account}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back'];

function SendScreen({
  digits,
  pressedKey,
  onKey,
  onSend,
}: {
  digits: string;
  pressedKey: string | null;
  onKey: (key: string) => void;
  onSend: () => void;
}) {
  const hasAmount = digits !== '' && parseFloat(digits) > 0;
  return (
    <div className="relative h-full w-full bg-[#0F1218]">
      {/* Peek of the screen behind the sheet */}
      <div className="absolute inset-x-3 top-[58px] h-[44px] rounded-t-2xl bg-[#1A1E26]" />

      <div className="absolute inset-x-0 bottom-0 top-[84px] rounded-t-[22px] bg-white text-slate-900">
        <div className="mx-auto mt-2 h-[3px] w-8 rounded-full bg-slate-200" />

        {/* Send / Request */}
        <div className="mx-auto mt-3 flex w-[150px] rounded-full bg-slate-100 p-[3px] text-[9px]">
          <span className="flex-1 rounded-full bg-white py-1.5 text-center font-bold shadow-sm">Send</span>
          <span className="flex-1 py-1.5 text-center text-slate-400">Request</span>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1 text-[8px] text-slate-400">
          Pavlo • 7642 USD <ChevronDown className="h-2.5 w-2.5" />
        </p>

        {/* Amount */}
        <p
          className={`mt-2 text-center text-[40px] font-semibold leading-none tracking-tight transition-colors ${
            digits === '' ? 'text-slate-300' : 'text-[#0F1218]'
          }`}
        >
          <span className="mr-1.5">$</span>
          {formatAmount(digits)}
        </p>
        <p className="mt-2 text-center text-[8px] text-slate-400">
          Available <span className="font-semibold underline">$ 7,854.43</span>
        </p>

        {/* Confirm */}
        <div className="mt-2 flex h-[26px] justify-center">
          {hasAmount && (
            <button
              type="button"
              onClick={onSend}
              className="rounded-full bg-[#0F1218] px-5 text-[9px] font-bold text-white transition-transform hover:scale-105"
            >
              Send ${formatAmount(digits)}
            </button>
          )}
        </div>

        {/* Operators */}
        <div className="mt-2 flex justify-around px-8 text-[15px] text-slate-300">
          <span>+</span>
          <span>−</span>
          <span>×</span>
          <span>÷</span>
        </div>

        {/* Keypad */}
        <div className="mx-3 mt-3 grid grid-cols-3 gap-1.5 rounded-2xl bg-slate-100 p-2">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onKey(k)}
              aria-label={k === 'back' ? 'Delete' : k}
              className={`grid h-[34px] place-items-center rounded-xl text-[16px] font-medium text-slate-700 transition-all active:scale-95 ${
                pressedKey === k ? 'scale-95 bg-slate-200' : 'bg-white hover:bg-slate-50'
              }`}
            >
              {k === 'back' ? <Delete className="h-4 w-4" /> : k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SentScreen({ digits, onDone }: { digits: string; onDone: () => void }) {
  return (
    <button
      type="button"
      onClick={onDone}
      className="flex h-full w-full flex-col items-center justify-center bg-[#00D90B] pb-12 text-white"
    >
      <Check className="h-9 w-9" strokeWidth={4} />
      <p className="mt-5 text-[34px] font-bold leading-none tracking-tight">
        $ {formatAmount(digits || AUTO_AMOUNT)}
      </p>
      <p className="mt-2 text-[11px] font-medium">Sent to Pavlo</p>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Phone frame
// ---------------------------------------------------------------------------

const SCREEN_W = 282;

function PhoneDemo({
  current,
  digits,
  pressedKey,
  go,
  onKey,
  onSend,
  onDone,
}: {
  current: number;
  digits: string;
  pressedKey: string | null;
  go: (screen: number) => void;
  onKey: (key: string) => void;
  onSend: () => void;
  onDone: () => void;
}) {
  return (
    <div
      className="absolute rounded-[46px] bg-[#141B3A] p-[9px] shadow-[0_30px_60px_-20px_rgba(15,23,42,0.35)]"
      style={{ left: 348, top: 30, width: 300, height: 582 }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[37px] bg-[#0F1218]">
        {/* Sliding strip of screens */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            width: SCREEN_W * SCREEN_COUNT,
            transform: `translateX(-${current * SCREEN_W}px)`,
          }}
        >
          {[
            <HomeScreen key="home" go={go} />,
            <CardsScreen key="cards" go={go} />,
            <RecipientsScreen key="recipients" go={go} />,
            <SendScreen key="send" digits={digits} pressedKey={pressedKey} onKey={onKey} onSend={onSend} />,
            <SentScreen key="sent" digits={digits} onDone={onDone} />,
          ].map((screen, i) => (
            <div key={i} className="h-full shrink-0 overflow-hidden" style={{ width: SCREEN_W }}>
              {screen}
            </div>
          ))}
        </div>

        {/* Status bar + dynamic island (fixed over the sliding screens) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-[34px] items-center justify-between px-5 text-[9px] font-semibold text-white">
          <span>09:41</span>
          <span className="absolute left-1/2 top-[9px] h-[15px] w-[64px] -translate-x-1/2 rounded-full bg-black" />
          <span className="flex items-center gap-1">
            <span className="flex items-end gap-[1.5px]">
              <i className="h-[3px] w-[2px] bg-white" />
              <i className="h-[5px] w-[2px] bg-white" />
              <i className="h-[7px] w-[2px] bg-white" />
            </span>
            <Wifi className="h-2.5 w-2.5" />
            <span className="h-[7px] w-[12px] rounded-[2px] bg-white" />
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Canvas chrome: rulers, toolbar, checkered background
// ---------------------------------------------------------------------------

const TOP_RULER = [0, 80, 160, 240, 320, 400, 480, 560, 640];
const LEFT_RULER = [0, 120, 240, 360, 480, 600];

function CanvasChrome() {
  return (
    <>
      {/* Top ruler */}
      <div className="absolute inset-x-0 top-0 h-[24px] border-b border-slate-200/70 bg-white/80">
        {TOP_RULER.map((n, i) => (
          <span
            key={n}
            className="absolute top-[7px] -translate-x-1/2 text-[9px] text-slate-400"
            style={{ left: 26 + i * 117.0 }}
          >
            {n}
          </span>
        ))}
      </div>

      {/* Left ruler */}
      <div className="absolute inset-y-0 left-0 w-[24px] border-r border-slate-200/70 bg-white/80">
        {LEFT_RULER.map((n, i) => (
          <span
            key={n}
            className="absolute left-0 w-full -translate-y-1/2 text-center text-[9px] text-slate-400"
            style={{ top: 57 + i * 110.2 }}
          >
            {n}
          </span>
        ))}
      </div>

      {/* Floating toolbar */}
      <div className="absolute right-[38px] top-[44px] flex w-[44px] flex-col items-center gap-1 rounded-xl bg-white p-1.5 text-slate-500 shadow-[0_4px_16px_rgba(15,23,42,0.12)]">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#E8EEFF] text-blue-600">
          <MousePointer2 className="h-4 w-4" />
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-lg">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
            <path d="M12 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
            <path d="M12 4l5 2.5v11L12 20" />
          </svg>
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-lg text-[12px] font-bold">T</span>
        <span className="grid h-8 w-8 place-items-center rounded-lg text-[9px] font-bold">OC</span>
        <span className="grid h-8 w-8 place-items-center rounded-lg">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M5 8h14M5 12h14M9 16h10" />
          </svg>
        </span>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export default function CanvasSection() {
  const [openStep, setOpenStep] = useState<number | null>(1);
  // Tracks the mouse position for the custom "Your team" cursor over the canvas
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Animation state
  const [t, setT] = useState(0); // position on the 10s timeline (autoplay)
  const [hovered, setHovered] = useState(false);
  const [manualScreen, setManualScreen] = useState(0);
  const [manualDigits, setManualDigits] = useState('');

  // Scale the fixed-size stage to fit its container
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / STAGE_W);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Autoplay: advance the timeline unless the user is hovering
  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => setT((prev) => (prev + TICK_MS) % TOTAL_MS), TICK_MS);
    return () => clearInterval(id);
  }, [hovered]);

  const auto = getAutoState(t);
  const current = hovered ? manualScreen : auto.screen;
  const digits = hovered ? manualDigits : auto.digits;
  const pressedKey = hovered ? null : auto.pressedKey;

  const handleEnter = () => {
    // Freeze on whatever the animation is showing right now
    setManualScreen(auto.screen);
    setManualDigits(auto.digits);
    setHovered(true);
  };

  const handleLeave = () => {
    // Resume the animation from the screen the user ended on
    setT(manualScreen * SCREEN_MS);
    setHovered(false);
    setCursorPos(null);
  };

  const go = (screen: number) => setManualScreen(screen);

  const handleKey = (key: string) => {
    setManualDigits((d) => {
      if (key === 'back') return d.slice(0, -1);
      if (key === '.') return d.includes('.') ? d : d === '' ? '0.' : d + '.';
      if (d.length >= 8) return d;
      if (d.includes('.') && d.split('.')[1].length >= 2) return d;
      return d === '0' ? key : d + key;
    });
  };

  const handleSend = () => setManualScreen(4);

  const handleDone = () => {
    setManualDigits('');
    setManualScreen(0);
  };

  const toggleStep = (id: number) => {
    setOpenStep((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-20 font-sans text-slate-900 overflow-hidden">
      <div className="max-w-full mx-auto space-y-10">

        {/* SECTION HEADER */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block mb-2">
            YOUR CANVAS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Start with an empty canvas. Bring your brand to life.
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal pt-1">
            Begin from a blank screen or a template, then add your logo, colour, type and components one layer at a time. The platform supplies the native structure. You supply the identity.
          </p>
        </div>

        {/* SPLIT GRID: TIMELINE ACCORDION (LEFT) & CANVAS GRAPHIC ASSET (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start pt-4">

          {/* LEFT COLUMN: INTERACTIVE ACCORDION STEPS */}
          <div className="lg:col-span-5 space-y-5">
            <div className="divide-y divide-slate-100">
              {stepsData.map((step) => {
                const isOpen = openStep === step.id;
                return (
                  <div key={step.id} className="py-4 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => toggleStep(step.id)}
                      className="w-full flex items-center justify-between text-left py-4 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}
                        >
                          {step.id}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                          {step.title}
                        </h3>
                      </div>

                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {/* Accordion Description Content */}
                    {isOpen && (
                      <div className="pl-10 pt-2 pb-1">
                        <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                Try it yourself
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Start from a template <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: ANIMATED CANVAS */}
          {/* The native pointer is hidden everywhere inside so the custom "Your team" cursor takes over */}
          <div
            ref={canvasRef}
            className="lg:col-span-7 relative w-full select-none overflow-hidden rounded-2xl border border-slate-200 bg-[#FBFCFE] cursor-none [&_*]:!cursor-none"
            style={{
              aspectRatio: `${STAGE_W} / ${STAGE_H}`,
              backgroundImage:
                'conic-gradient(#F1F4F9 25%, transparent 0 50%, #F1F4F9 0 75%, transparent 0)',
              backgroundSize: '16px 16px',
            }}
            onMouseEnter={handleEnter}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            onMouseLeave={handleLeave}
            aria-label="Animated mobile app demo. Hover to pause and interact."
          >
            {/* Fixed-size stage, scaled to fit */}
            <div
              className="absolute left-0 top-0 origin-top-left"
              style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}
            >
              <CanvasChrome />
              <PhoneDemo
                current={current}
                digits={digits}
                pressedKey={pressedKey}
                go={go}
                onKey={handleKey}
                onSend={handleSend}
                onDone={handleDone}
              />
            </div>

            {/* Custom collaborative-style cursor: blue arrow + "Your team" pill */}
            {cursorPos && (
              <div
                className="pointer-events-none absolute z-40 flex items-start gap-1 will-change-transform"
                style={{ left: cursorPos.x, top: cursorPos.y }}
                aria-hidden
              >
                {/* Arrow tip sits exactly on the mouse position */}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="#2563EB"
                  className="shrink-0 drop-shadow-sm"
                >
                  <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.36Z" />
                </svg>
                {/* Name tag pill, aligned to the top of the arrow like the reference */}
                <span className="whitespace-nowrap rounded-full bg-blue-600 px-4 py-1.5 text-[13px] font-medium leading-none text-white shadow-lg shadow-blue-600/30">
                  Your team
                </span>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}