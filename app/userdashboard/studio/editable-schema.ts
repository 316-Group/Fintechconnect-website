// /client/app/userdashboard/studio/editable-schema.ts
import type { ModuleId } from './phone-cards';

export interface TextSlot  { slot: string; label: string; defaultValue: string }
export interface ColorSlot { slot: string; label: string; defaultValue: string }

/**
 * Every module declares the slots it exposes to the RightPanel.
 * The defaultValue is only used as a placeholder — the component's
 * `fallback` argument is what actually renders when no override exists.
 */
export const EDITABLE_SCHEMA: Partial<Record<ModuleId, { text?: TextSlot[]; colors?: ColorSlot[] }>> = {
  headerGreeting: {
    text: [
      { slot: 'greeting', label: 'Greeting',        defaultValue: 'Good morning' },
      { slot: 'name',     label: 'Name',            defaultValue: 'Krishnan' },
      { slot: 'avatar',   label: 'Avatar initial',  defaultValue: 'K' },
    ],
    colors: [
      { slot: 'avatarBg', label: 'Avatar background', defaultValue: '#0040DF' },
    ],
  },
  accounts: {
    text: [
      { slot: 'label',   label: 'Top label',   defaultValue: 'Total Balance' },
      { slot: 'balance', label: 'Balance',     defaultValue: '$25,000.40' },
      { slot: 'cta',     label: 'CTA label',   defaultValue: 'My Wallet' },
    ],
    colors: [
      { slot: 'bg',     label: 'Card background', defaultValue: '#1B1B1F' },
      { slot: 'accent', label: 'Accent circle',   defaultValue: '#0040DF' },
      { slot: 'ctaBg',  label: 'CTA pill',        defaultValue: '#FFFFFF' },
    ],
  },
  cashflow: {
    text: [
      { slot: 'incomeLabel',  label: 'Income label',  defaultValue: 'Income' },
      { slot: 'incomeValue',  label: 'Income value',  defaultValue: '$ 20,000' },
      { slot: 'outcomeLabel', label: 'Outcome label', defaultValue: 'Outcome' },
      { slot: 'outcomeValue', label: 'Outcome value', defaultValue: '$ 17,000' },
    ],
    colors: [
      { slot: 'bg',          label: 'Card background', defaultValue: '#1B1B1F' },
      { slot: 'incomeTint',  label: 'Income tint',     defaultValue: '#10B981' },
      { slot: 'outcomeTint', label: 'Outcome tint',    defaultValue: '#F43F5E' },
    ],
  },
  // …repeat for every module you want to be editable
};