'use client';
import React from 'react';
import {
  ArrowDownLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, Cloud, Coffee,
  CreditCard, Eye, FileText, Globe, Key, Landmark, MoreVertical, Percent, Pencil,
  Plus, QrCode, Receipt, RefreshCw, Search, Send, ShieldCheck, Sliders,
  Smartphone, Snowflake, Sparkles, Truck, Wifi, Zap, Activity, ArrowLeftRight, Monitor
} from 'lucide-react';

// Interface re-declared to make this file standalone
export interface ViewCtx {
  radius: { card: string; tile: string; icon: string };
  accent: string;
  isDark: boolean;
  brand: string;
  interactive: boolean;
}

const darken = (hex: string, t: number) => {
  const c = hex.replace('#', '');
  const n = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
  const r = Math.round(((n >> 16) & 255) * (1 - t));
  const g = Math.round(((n >> 8) & 255) * (1 - t));
  const b = Math.round((n & 255) * (1 - t));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const surface = (dark: boolean) => dark ? 'bg-slate-900 text-slate-100 ring-1 ring-white/5' : 'bg-white text-slate-900 shadow-[0_4px_18px_rgba(37,52,120,0.06)]';

/* ---------------------------- HOME COMPONENTS ---------------------------- */

export function NetWorthHeroCard({ ctx }: { ctx: ViewCtx }) {
  const gradient = `linear-gradient(120deg, ${darken(ctx.accent, 0.72)} 0%, ${darken(ctx.accent, 0.12)} 55%, ${ctx.accent} 100%)`;
  return (
    <div className={`relative flex h-full min-h-[200px] flex-col overflow-hidden p-6 text-white ${ctx.radius.card}`} style={{ background: gradient }}>
      <div className="relative flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">Total Portfolio Net Worth <Eye className="w-3 h-3"/></span>
        <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">+8.42% (+$9,684.20)</span>
      </div>
      <div className="relative mt-2">
        <p className="text-[36px] font-bold leading-none tracking-tight">$124,892<span className="text-[20px] text-white/70">.65</span></p>
        <p className="mt-1 text-[11px] text-white/50">USD • Vault Secured</p>
      </div>
      <div className="relative mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
        <div className="flex gap-2">
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px]"><ArrowDownLeft className="w-3 h-3 text-emerald-300"/> Inflow: $12,450.00</span>
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px]"><RefreshCw className="w-3 h-3 text-blue-300"/> Active Yield: +12.4% APY</span>
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px]"><ArrowUpRight className="w-3 h-3 text-rose-300"/> Outflow: $3,842.50</span>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-900"><Plus className="w-3 h-3"/> Deposit</button>
            <button className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-bold text-white"><ArrowLeftRight className="w-3 h-3"/> Transfer</button>
        </div>
      </div>
    </div>
  );
}

export function BillOptimizationCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`flex h-full flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><Sparkles className="h-5 w-5"/></div>
        <div>
          <p className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mb-1">Aura AI Agent • Found 2 hrs ago</p>
          <p className="text-[14px] font-bold">Bill Optimization Detected</p>
          <p className="text-[11px] text-slate-500 mt-1">We identified a promotional rate to cut your AT&T Fiber bill by <strong>$12/mo ($144/year)</strong> without lowering your 1Gbps speed.</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3">
        <p className="text-[10px] font-medium text-slate-600 flex items-center gap-1"><Check className="w-3 h-3 text-emerald-500"/> Zero paperwork required. Auto-applied via API credential.</p>
        <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-bold text-white whitespace-nowrap">Start Negotiation <ArrowRight className="w-3 h-3 inline ml-1"/></button>
      </div>
    </div>
  );
}

export function QuickTransferFavoritesCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`flex h-full flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[12px] font-bold flex items-center gap-2"><Send className="w-4 h-4"/> Quick Transfer & Favorites</p>
        <button className="text-[10px] font-semibold text-blue-600">View All <ChevronRight className="w-3 h-3 inline"/></button>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-slate-400"><Plus className="w-4 h-4"/></div>
            <span className="text-[9px] font-medium text-slate-500">New Contact</span>
        </div>
        <div className="flex flex-col items-center gap-1">
            <div className="relative"><img src="https://i.pravatar.cc/100?img=5" alt="Sarah" className="h-10 w-10 rounded-full object-cover"/><div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"></div></div>
            <span className="text-[9px] font-medium text-slate-500">Sarah J.</span>
        </div>
        <div className="flex flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 relative">EM<div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"></div></div>
            <span className="text-[9px] font-medium text-slate-500">Elena M.</span>
        </div>
        <div className="flex flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 relative">DL<div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"></div></div>
            <span className="text-[9px] font-medium text-slate-500">David L.</span>
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Instant Presets:</span>
            <div className="flex gap-1">
                {['$50', '$100', '$250', '$500'].map(a => <button key={a} className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">{a}</button>)}
            </div>
        </div>
        <div className="flex gap-2">
            <div className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-[11px] text-slate-400">Custom amount</div>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white"><ArrowRight className="w-4 h-4"/></button>
        </div>
      </div>
    </div>
  );
}

export function BillsScheduledCard({ ctx }: { ctx: ViewCtx }) {
  const bills = [
    { name: 'Internet — FiberLink Gigabit', status: 'Auto-Debit', date: 'Due Oct 28 • Recurring Monthly', amount: '$79.99', icon: Wifi, color: 'bg-blue-50 text-blue-600', active: true },
    { name: 'Electricity — PowerGrid Metro', status: 'Action Req.', date: 'Meter variance detected • Due Nov 02', amount: '$120.75', icon: Zap, color: 'bg-rose-50 text-rose-600', active: false },
    { name: 'Water Utility — AquaPure Municipal', status: 'Scheduled', date: 'Scheduled for Nov 05', amount: '$45.00', icon: Cloud, color: 'bg-cyan-50 text-cyan-600', active: false },
  ];
  return (
    <div className={`flex h-full flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-bold flex items-center gap-2"><Receipt className="w-4 h-4"/> Bills & Scheduled Payments</p>
      </div>
      <div className="flex gap-1 mb-3 bg-slate-100 p-1 rounded-lg w-fit">
        <button className="rounded-md bg-white px-3 py-1 text-[10px] font-semibold shadow-sm">All Bills</button>
        <button className="rounded-md px-3 py-1 text-[10px] font-semibold text-slate-500 hover:text-slate-900">Action Req.</button>
        <button className="rounded-md px-3 py-1 text-[10px] font-semibold text-slate-500 hover:text-slate-900">Scheduled</button>
      </div>
      <div className="flex-1 space-y-2">
        {bills.map(b => (
            <div key={b.name} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${b.color}`}><b.icon className="w-4 h-4"/></div>
                    <div>
                        <p className="text-[11px] font-bold flex items-center gap-2">{b.name} {b.status && <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${b.active ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>{b.status}</span>}</p>
                        <p className="text-[9px] text-slate-500">{b.date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <p className="text-[11px] font-bold">{b.amount}</p>
                        <p className="text-[9px] text-slate-500">{b.active ? 'Verified On Time' : ''}</p>
                    </div>
                    <MoreVertical className="w-4 h-4 text-slate-400"/>
                </div>
            </div>
        ))}
      </div>
      <button className="mt-3 w-full rounded-lg border border-slate-200 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50">+ Connect New Utility or Provider</button>
    </div>
  );
}

export function PrimaryCardCard({ ctx }: { ctx: ViewCtx }) {
  const cardGradient = `linear-gradient(135deg, ${darken(ctx.accent, 0.55)} 0%, ${darken(ctx.accent, 0.78)} 55%, ${darken(ctx.accent, 0.45)} 100%)`;
  return (
    <div className={`flex h-full flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-bold flex items-center gap-2"><CreditCard className="w-4 h-4"/> Primary Card</p>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">ACTIVE</span>
      </div>
      <div className={`relative flex aspect-[1.6] flex-col justify-between overflow-hidden p-4 text-white ${ctx.radius.tile}`} style={{ background: cardGradient }}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-[10px] font-semibold tracking-wider opacity-80">AURA WEALTH OS</p>
                <p className="text-[14px] font-bold">Visa Platinum Elite</p>
            </div>
            <Wifi className="h-4 w-4 rotate-90 opacity-70" />
        </div>
        <div>
            <div className="h-5 w-7 rounded bg-gradient-to-br from-amber-300 to-amber-500 mb-2"></div>
            <p className="font-mono text-[12px] tracking-[0.2em]">•••• •••• •••• 4829</p>
        </div>
        <div className="flex justify-between items-end text-[8px] uppercase tracking-wider opacity-80">
            <div><p className="text-[6px] opacity-60">Cardholder</p><p className="text-[9px] font-semibold">Ethan Carter</p></div>
            <div className="text-right"><p className="text-[6px] opacity-60">Expires</p><p className="text-[9px] font-semibold">08/28</p></div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button className="flex items-center justify-center gap-1 rounded-lg bg-slate-100 py-1.5 text-[9px] font-bold text-slate-700"><Snowflake className="w-3 h-3"/> Freeze</button>
        <button className="flex items-center justify-center gap-1 rounded-lg bg-slate-100 py-1.5 text-[9px] font-bold text-slate-700"><Sliders className="w-3 h-3"/> Limits</button>
        <button className="flex items-center justify-center gap-1 rounded-lg bg-slate-100 py-1.5 text-[9px] font-bold text-slate-700"><Eye className="w-3 h-3"/> View PIN</button>
      </div>
    </div>
  );
}

export function MonthlyPaceBudgetCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`flex h-full flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[12px] font-bold flex items-center gap-2"><Activity className="w-4 h-4"/> Monthly Pace & Budget</p>
        <span className="text-[11px] font-bold">$3,842.50 <span className="text-[9px] text-slate-400 font-normal">/ $5,000</span></span>
      </div>
      <div className="flex items-center justify-between text-[9px] text-slate-500 mb-1">
          <span>Cycle ends in 7 days</span>
          <span className="text-emerald-600 font-semibold">$1,157.50 Remaining</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden mb-4">
          <div className="h-full bg-blue-600 w-[76.8%]"></div>
      </div>
      <div className="space-y-2 mt-auto">
          <div className="flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Food & Dining</span>
              <div className="flex items-center gap-3"><span className="font-bold">$1,240.00</span><span className="text-slate-400 w-6 text-right">32%</span></div>
          </div>
          <div className="flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Bills & Subscriptions</span>
              <div className="flex items-center gap-3"><span className="font-bold">$892.00</span><span className="text-slate-400 w-6 text-right">23%</span></div>
          </div>
          <div className="flex items-center justify-between text-[10px]">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Shopping & Lifestyle</span>
              <div className="flex items-center gap-3"><span className="font-bold">$645.00</span><span className="text-slate-400 w-6 text-right">17%</span></div>
          </div>
      </div>
    </div>
  );
}

export function ActivePerksCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`flex h-full flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-bold flex items-center gap-2"><Sliders className="w-4 h-4"/> Active Perks & Status</p>
        <span className="text-[9px] text-slate-400">Live Audit</span>
      </div>
      <div className="space-y-2">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg"><Percent className="w-4 h-4"/></div>
              <div>
                  <p className="text-[11px] font-bold flex items-center gap-2">Cashback Boost Active <span className="text-[8px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full">+2.5%</span></p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Applied automatically on groceries & fuel this week</p>
              </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
              <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg"><ShieldCheck className="w-4 h-4"/></div>
              <div>
                  <p className="text-[11px] font-bold">Hardware Key Active</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Passkey sync intact • No unauthorized queries</p>
              </div>
          </div>
      </div>
    </div>
  );
}

/* ------------------------ TRANSFER & SEND COMPONENTS ------------------------ */

export function SendMoneyHeroCard({ ctx }: { ctx: ViewCtx }) {
  const gradient = `linear-gradient(135deg, ${ctx.accent} 0%, ${darken(ctx.accent, 0.5)} 100%)`;
  return (
    <div className={`relative flex flex-col justify-between overflow-hidden p-6 text-white ${ctx.radius.card}`} style={{ background: gradient }}>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> REAL-TIME RAILS ACTIVE</span>
          <span className="text-[9px] text-white/70">• FedNow & SEPA Instant</span>
        </div>
        <p className="text-[28px] font-bold leading-tight">Transfer & Send Money</p>
        <p className="text-[11px] text-white/80 max-w-md mt-1">Send funds instantly to any bank account, debit card, or international wire with zero transfer fees and biometric end-to-end encryption.</p>
      </div>
      <div className="flex gap-2 mt-4">
          <div className="bg-white/10 rounded-lg p-2.5 flex-1">
              <p className="text-[9px] text-white/60 mb-0.5">Daily Limit Left</p>
              <p className="text-[14px] font-bold">$48,250.00</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 flex-1">
              <p className="text-[9px] text-white/60 mb-0.5">Network Speed</p>
              <p className="text-[14px] font-bold text-emerald-300 flex items-center gap-1"><Zap className="w-3 h-3"/> 0.4s Avg</p>
          </div>
      </div>
    </div>
  );
}

export function SelectRecipientCard({ ctx }: { ctx: ViewCtx }) {
  const contacts = [
    { name: 'Sarah Jenkins', sub: 'Chase ••8841', img: 'https://i.pravatar.cc/100?img=5', active: true },
    { name: 'Marcus Chen', sub: 'GS Cash ••1092', img: 'https://i.pravatar.cc/100?img=11', active: false },
    { name: 'Alex Rivera', sub: 'Wells ••3319', img: 'https://i.pravatar.cc/100?img=12', active: false },
    { name: 'Elena Rostova', sub: 'BofA ••7721', img: 'https://i.pravatar.cc/100?img=9', active: false },
  ];
  return (
    <div className={`flex flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[12px] font-bold flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</div> Select Recipient</div>
        <button className="text-[10px] font-semibold text-blue-600">View All (28) <ArrowRight className="w-3 h-3 inline"/></button>
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 mb-3">
          <Search className="w-4 h-4 text-slate-400"/>
          <span className="text-[11px] text-slate-400">Search by name, @cashtag, IBAN, email, or phone...</span>
          <QrCode className="w-4 h-4 text-slate-400 ml-auto"/>
      </div>
      <div className="grid grid-cols-4 gap-2">
          {contacts.map(c => (
              <div key={c.name} className={`flex flex-col items-center p-2 rounded-xl border-2 transition ${c.active ? 'border-blue-600 bg-blue-50' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}>
                  <div className="relative mb-1">
                      <img src={c.img} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                      {c.active && <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5"><Check className="w-2.5 h-2.5"/></div>}
                  </div>
                  <p className="text-[10px] font-bold text-center truncate w-full">{c.name.split(' ')[0]} {c.name.split(' ')[1]?.[0]}.</p>
                  <p className="text-[8px] text-slate-500 text-center truncate w-full">{c.sub}</p>
              </div>
          ))}
      </div>
    </div>
  );
}

export function SetTransferAmountCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`flex flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[12px] font-bold flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</div> Set Transfer Amount</div>
        <p className="text-[9px] text-slate-500">Available: <span className="font-bold text-slate-700">$124,892.65</span></p>
      </div>
      <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-xl mb-3">
          <div className="flex items-center gap-1 text-slate-400">
              <span className="text-[20px] font-semibold">$</span>
              <span className="text-[36px] font-bold text-slate-900 tracking-tight">250.00</span>
              <span className="ml-2 rounded bg-white px-2 py-1 text-[10px] font-bold shadow-sm border border-slate-200">US USD</span>
          </div>
          <div className="flex gap-2 mt-3">
              {['+$50', '+$100', '+$250', '+$500', 'Custom'].map(p => (
                  <button key={p} className={`rounded-full px-3 py-1 text-[10px] font-semibold transition ${p === '+$250' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-100'}`}>{p}</button>
              ))}
          </div>
      </div>
      <p className="text-[9px] text-emerald-600 flex items-center justify-center gap-1"><Check className="w-3 h-3"/> No transaction fee applies with instant priority network</p>
    </div>
  );
}

export function SelectTransferMethodCard({ ctx }: { ctx: ViewCtx }) {
  const methods = [
      { id: 'bank', title: 'Instant to Bank', sub: 'Direct ACH & FedNow', time: '1-2 mins', fee: 'Free', icon: Zap, active: true },
      { id: 'card', title: 'Debit Card Push', sub: 'Card ending ••4821', time: 'Instant receipt', fee: 'Free', icon: CreditCard, active: false },
      { id: 'wire', title: 'Domestic Wire', sub: 'Direct FedWire RTGS', time: 'Same day', fee: 'Free', icon: Landmark, active: false },
  ];
  return (
    <div className={`flex flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[12px] font-bold flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</div> Select Transfer Method</div>
        <span className="text-[9px] font-semibold text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Instant Enabled</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
          {methods.map(m => (
              <div key={m.id} className={`flex flex-col p-3 rounded-xl border-2 transition ${m.active ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'}`}>
                  <div className="flex justify-between items-start mb-2">
                      <div className={`p-1.5 rounded-lg ${m.active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}><m.icon className="w-4 h-4"/></div>
                      {m.active && <span className="text-[8px] bg-emerald-100 text-emerald-600 font-bold px-1.5 py-0.5 rounded-full">FASTEST</span>}
                  </div>
                  <p className="text-[11px] font-bold mb-0.5">{m.title}</p>
                  <p className="text-[9px] text-slate-500 mb-3">{m.sub}</p>
                  <div className="mt-auto flex items-center justify-between text-[8px] font-semibold text-slate-600">
                      <span>{m.time}</span>
                      <span>{m.fee}</span>
                  </div>
              </div>
          ))}
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
          <Pencil className="w-4 h-4 text-slate-400"/>
          <span className="text-[11px] text-slate-600 flex-1">Dinner & concert tickets 🎸</span>
          <span className="text-[9px] text-slate-400">Visible to recipient</span>
      </div>
      <button className="mt-3 w-full rounded-lg bg-blue-600 py-2.5 text-[11px] font-bold text-white">Continue to Review & Confirm <ArrowRight className="w-3 h-3 inline"/></button>
    </div>
  );
}

export function TransferBreakdownCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`flex flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[12px] font-bold">Transfer Breakdown</p>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">Ready</span>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">E</div>
          <div>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">From Account</p>
              <p className="text-[11px] font-bold">Smart Wallet ••9042</p>
              <p className="text-[9px] text-slate-400">Balance: $124,892.65</p>
          </div>
          <Check className="w-4 h-4 text-slate-400 ml-auto"/>
      </div>
      <div className="flex justify-center mb-2"><ArrowDownLeft className="w-4 h-4 text-slate-400"/></div>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 mb-4">
          <img src="https://i.pravatar.cc/100?img=5" alt="Sarah" className="w-8 h-8 rounded-full object-cover" />
          <div>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">Recipient</p>
              <p className="text-[11px] font-bold">Sarah Jenkins <Check className="w-3 h-3 inline text-blue-500"/></p>
              <p className="text-[9px] text-slate-400">Chase Premier ••8841</p>
          </div>
          <span className="ml-auto text-[8px] bg-emerald-100 text-emerald-600 font-bold px-1.5 py-0.5 rounded-full">VERIFIED</span>
      </div>
      <div className="space-y-1.5 text-[10px] mb-4">
          <div className="flex justify-between"><span className="text-slate-500">Transfer Amount</span><span className="font-bold">$250.00 USD</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Delivery Method</span><span className="font-bold">Instant to Bank</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Estimated Arrival</span><span className="font-bold">Instant (1-2 mins)</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Transfer Fee</span><span className="font-bold text-slate-400 line-through">$4.50</span> <span className="font-bold text-emerald-600">$0.00 (Promo)</span></div>
      </div>
      <div className="border-t border-slate-100 pt-3 flex items-start justify-between">
          <div><p className="text-[11px] font-bold">Total Debit</p><p className="text-[9px] text-slate-500">No hidden FX charges</p></div>
          <p className="text-[16px] font-bold text-blue-700">$250.00</p>
      </div>
      <div className="mt-4 flex items-start gap-2 bg-blue-50 rounded-lg p-3">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0"/>
          <div>
              <p className="text-[10px] font-bold text-blue-900">Protected Transfer Guarantee</p>
              <p className="text-[9px] text-blue-700 mt-0.5">Covered by 256-bit bank grade encryption, SOC2 Type II isolation, and zero-liability fraudulent protection.</p>
              <a href="#" className="text-[9px] font-bold text-blue-600 mt-1 inline-flex items-center gap-1">View Security Protocol <ArrowUpRight className="w-2.5 h-2.5"/></a>
          </div>
      </div>
    </div>
  );
}

export function RecentActivityCard({ ctx }: { ctx: ViewCtx }) {
  const txns = [
      { name: 'Marcus Chen', sub: 'Today, 11:24 AM • Direct', amount: '-$1,400.00', status: 'Completed', icon: ArrowUpRight, color: 'text-blue-600' },
      { name: 'Elena Rostova', sub: 'Yesterday • Wire', amount: '-$5,820.00', status: 'Settled', icon: ArrowUpRight, color: 'text-blue-600' },
      { name: 'David Kim', sub: 'Oct 21 • Visa Push', amount: '-$120.00', status: 'Completed', icon: ArrowUpRight, color: 'text-blue-600' },
  ];
  return (
    <div className={`flex flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[12px] font-bold flex items-center gap-2"><RefreshCw className="w-4 h-4"/> Recent Activity</p>
        <button className="text-[10px] font-semibold text-blue-600">See all</button>
      </div>
      <div className="space-y-3">
          {txns.map(t => (
              <div key={t.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center ${t.color}`}><t.icon className="w-4 h-4"/></div>
                      <div>
                          <p className="text-[11px] font-bold">{t.name}</p>
                          <p className="text-[9px] text-slate-500">{t.sub}</p>
                      </div>
                  </div>
                  <div className="text-right">
                      <p className="text-[11px] font-bold">{t.amount}</p>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${t.status === 'Settled' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-600'}`}>{t.status}</span>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
}

/* ---------------------------- CARDS COMPONENTS ---------------------------- */

export function ActiveCardPreviewCard({ ctx }: { ctx: ViewCtx }) {
  const cardGradient = `linear-gradient(135deg, ${ctx.accent} 0%, ${darken(ctx.accent, 0.6)} 100%)`;
  return (
    <div className={`flex flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-bold">Active Card Preview</p>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ACTIVE</span>
      </div>
      <div className={`relative flex aspect-[1.6] flex-col justify-between overflow-hidden p-5 text-white ${ctx.radius.tile}`} style={{ background: cardGradient }}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-[10px] font-semibold tracking-wider opacity-80 uppercase">Aura Wealth OS</p>
                <p className="text-[16px] font-bold">Visa Platinum</p>
            </div>
            <div className="flex flex-col items-end gap-1">
                <div className="h-6 w-8 bg-amber-400/80 rounded-md"></div>
                <Wifi className="h-4 w-4 rotate-90 opacity-50"/>
            </div>
        </div>
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[14px] tracking-[0.2em]">•••• •••• •••• 4829</span>
                <Eye className="w-3.5 h-3.5 opacity-50"/>
            </div>
        </div>
        <div className="flex justify-between items-end text-[8px] uppercase tracking-wider opacity-80">
            <div><p className="text-[7px] opacity-60">Card Holder</p><p className="text-[10px] font-semibold">Ethan Carter</p></div>
            <div className="text-right"><p className="text-[7px] opacity-60">Expires</p><p className="text-[10px] font-semibold">08/28</p></div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
          <button className="flex flex-col items-center justify-center gap-1 rounded-md bg-white py-1.5 shadow-sm text-slate-700">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
              <span className="text-[8px] font-bold">Primary Debit</span>
              <span className="text-[7px] text-slate-400">Visa ••4829</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 rounded-md py-1.5 text-slate-500 hover:bg-white/50">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              <span className="text-[8px] font-bold">Titanium Elite</span>
              <span className="text-[7px] text-slate-400">MC ••9012</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 rounded-md py-1.5 text-slate-500 hover:bg-white/50">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[8px] font-bold">Virtual Subs</span>
              <span className="text-[7px] text-slate-400">Visa ••1145</span>
          </button>
      </div>
    </div>
  );
}

export function CardControlsCard({ ctx }: { ctx: ViewCtx }) {
  const controls = [
      { title: 'Freeze Card', sub: 'Instant Lock', icon: Snowflake },
      { title: 'View PIN / C¹', sub: 'Auth Required', icon: Key },
      { title: 'Replace Card', sub: 'Lost or Stolen', icon: RefreshCw },
      { title: 'Sync Wallet', sub: 'Apple & GPay', icon: Smartphone },
  ];
  return (
    <div className={`flex flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[12px] font-bold">Card Controls</p>
        <span className="text-[9px] text-slate-500">Live Hardware Link</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
          {controls.map(c => (
              <button key={c.title} className="flex flex-col items-start p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 text-left">
                  <c.icon className="w-4 h-4 text-blue-600 mb-2"/>
                  <p className="text-[11px] font-bold">{c.title}</p>
                  <p className="text-[9px] text-slate-500">{c.sub}</p>
              </button>
          ))}
      </div>
    </div>
  );
}

export function TitaniumDeliveryCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`flex items-center gap-3 p-4 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl"><Truck className="w-5 h-5"/></div>
      <div className="flex-1">
          <p className="text-[12px] font-bold">Titanium Metal Delivery</p>
          <p className="text-[10px] text-slate-500">FedEx Priority: Estimated delivery tomorrow by 3:00 PM</p>
      </div>
      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">On the way</span>
    </div>
  );
}

export function MonthlySpendingLimitCard({ ctx }: { ctx: ViewCtx }) {
  return (
    <div className={`flex flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Usage & Thresholds</p>
            <p className="text-[12px] font-bold">Monthly Spending Limit</p>
        </div>
        <button className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600"><Sliders className="w-3 h-3"/> Adjust Limit</button>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[28px] font-bold">$2,450.00</span>
          <span className="text-[11px] text-slate-500">spent of $8,000.00 limit</span>
          <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600">30.6% Used</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden mb-1">
          <div className="h-full bg-blue-600 w-[30.6%] rounded-full"></div>
      </div>
      <div className="flex justify-between text-[9px] text-slate-500 mb-4">
          <span className="flex items-center gap-1 text-emerald-600 font-semibold"><Check className="w-3 h-3"/> $5,550.00 safe to spend until Oct 1</span>
          <span>Resets in 7 days</span>
      </div>
      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg">
          <div><p className="text-[8px] text-slate-500">Daily Average</p><p className="text-[11px] font-bold">$102.08</p></div>
          <div><p className="text-[8px] text-slate-500">Top Merchant</p><p className="text-[11px] font-bold">Apple Store</p></div>
          <div><p className="text-[8px] text-slate-500">Projected Month End</p><p className="text-[11px] font-bold">$3,180.00</p></div>
      </div>
    </div>
  );
}

export function SecurityPermissionsCard({ ctx }: { ctx: ViewCtx }) {
  const perms = [
      { title: 'Online Payments', sub: 'E-commerce, web gateways, and recurring app subscriptions', icon: Smartphone, active: true },
      { title: 'International Transactions', sub: 'Foreign currency clearing and physical POS usage overseas', icon: Globe, active: true },
      { title: 'ATM Withdrawals', sub: 'Physical cash dispensing at certified global networks', icon: Landmark, active: false },
  ];
  return (
    <div className={`flex flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Access Verification</p>
            <p className="text-[12px] font-bold">Security & Permissions</p>
        </div>
        <ShieldCheck className="w-5 h-5 text-blue-600"/>
      </div>
      <div className="space-y-3">
          {perms.map(p => (
              <div key={p.title} className="flex items-start gap-3">
                  <div className="bg-slate-100 p-1.5 rounded-lg text-slate-600"><p.icon className="w-4 h-4"/></div>
                  <div className="flex-1">
                      <p className="text-[11px] font-bold">{p.title}</p>
                      <p className="text-[9px] text-slate-500">{p.sub}</p>
                  </div>
                  <div className={`w-8 h-4 rounded-full p-0.5 ${p.active ? 'bg-blue-600' : 'bg-slate-300'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition ${p.active ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
              </div>
          ))}
      </div>
      <div className="mt-4 flex items-start gap-3 p-3 rounded-lg bg-emerald-50">
          <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg"><Percent className="w-4 h-4"/></div>
          <div>
              <p className="text-[11px] font-bold flex items-center gap-2 text-emerald-900">Card Cash Perks Detected <span className="text-[8px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full">ACTIVE BOOST</span></p>
              <p className="text-[9px] text-emerald-700 mt-0.5">You have <strong>3.0% cashback active</strong> on dining & transport transactions with Visa Platinum this billing cycle.</p>
          </div>
          <button className="ml-auto text-[9px] font-bold text-emerald-700 whitespace-nowrap">Explore Perks <ArrowRight className="w-3 h-3 inline"/></button>
      </div>
    </div>
  );
}

export function RecentCardActivityCard({ ctx }: { ctx: ViewCtx }) {
  const txns = [
      { name: 'Apple Store Fifth Ave', sub: 'Today, 1:45 PM • Electronics', amount: '-$149.00', cashback: '+ $4.47 cashback', icon: Monitor },
      { name: 'Starbucks Coffee #084', sub: 'Today, 8:12 AM • Food & Dining', amount: '-$6.45', cashback: '+ $0.19 cashback', icon: Coffee },
      { name: 'Uber Technologies', sub: 'Yesterday, 11:20 PM • Transport', amount: '-$24.80', cashback: '+ $0.74 cashback', icon: Smartphone },
      { name: 'Amazon Web Services', sub: 'Oct 21, 2024 • Software', amount: '-$89.15', cashback: 'Standard 1%', icon: Cloud },
  ];
  return (
    <div className={`flex flex-col p-5 ${ctx.radius.card} ${surface(ctx.isDark)}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Ledger</p>
            <p className="text-[12px] font-bold">Recent Card Activity</p>
        </div>
        <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button className="bg-white px-2 py-0.5 rounded-md text-[9px] font-semibold shadow-sm">All</button>
            <button className="px-2 py-0.5 rounded-md text-[9px] font-semibold text-slate-500 hover:text-slate-900">In-Store</button>
            <button className="px-2 py-0.5 rounded-md text-[9px] font-semibold text-slate-500 hover:text-slate-900">Online</button>
        </div>
      </div>
      <div className="space-y-3">
          {txns.map(t => (
              <div key={t.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"><t.icon className="w-4 h-4"/></div>
                      <div>
                          <p className="text-[11px] font-bold">{t.name}</p>
                          <p className="text-[9px] text-slate-500">{t.sub}</p>
                      </div>
                  </div>
                  <div className="text-right">
                      <p className="text-[11px] font-bold">{t.amount}</p>
                      <p className="text-[8px] text-emerald-600 font-semibold">{t.cashback}</p>
                  </div>
                  <button className="ml-2 p-1 text-slate-400 hover:bg-slate-100 rounded"><FileText className="w-3.5 h-3.5"/></button>
              </div>
          ))}
      </div>
      <button className="mt-4 w-full rounded-lg bg-slate-100 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-200">View All Transactions for This Card (42 records)</button>
    </div>
  );
}