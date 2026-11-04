// /client/app/userdashboard/studio/components/seed.ts
import type { LayerNode, WorkflowStep } from './types';

export const LAYER_TREE: LayerNode[] = [
  {
    id: 'home',
    label: 'Home Dashboard',
    kind: 'screen',
    count: 6,
    children: [
      { id: 'header', label: 'HeaderGreetingBar', kind: 'container' },
      {
        id: 'balance',
        label: 'BalanceCardComponent',
        kind: 'master',
        isMaster: true,
        children: [
          { id: 'mesh', label: 'MeshGradientBackdrop', kind: 'shape' },
          { id: 'amount', label: 'AmountDisplay ($25,000)', kind: 'text' },
          { id: 'wallet', label: 'MyWalletButton', kind: 'button' },
        ],
      },
      { id: 'quick', label: 'QuickActionsGrid', kind: 'container', count: 4 },
      { id: 'savings', label: 'SavingsVaultsRow', kind: 'container' },
      { id: 'recent', label: 'RecentActivityFeed', kind: 'container' },
      { id: 'dock', label: 'BottomDockTabBar', kind: 'container' },
    ],
  },
  { id: 'accounts', label: 'Accounts and Vaults', kind: 'screen', count: 3 },
  { id: 'send', label: 'Send and FedNow Rails', kind: 'screen', count: 4 },
  { id: 'cards', label: 'Card Management', kind: 'screen', count: 3 },
  { id: 'kyc', label: 'KYC and Tier 1 Onboarding', kind: 'screen', count: 2 },
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 's1',
    title: 'Validate KYC Status (Passkey)',
    badge: 'Rule',
    badgeTone: 'rule',
  },
  {
    id: 's2',
    title: 'Open BottomSheet: /wallet/details',
    detail: 'Spring(250ms)',
    badge: 'Spring',
    badgeTone: 'spring',
  },
];

export const SEED_BALANCE = { dollars: '25,000', cents: '40' };
export const SEED_CASHFLOW = { in: 20000, out: 17000 };