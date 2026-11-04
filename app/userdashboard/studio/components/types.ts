// /client/app/userdashboard/studio/components/types.ts
export type DeviceType = 'iphone' | 'pixel' | 'tablet';
export type StudioMode = 'design' | 'prototype' | 'workflows' | 'code';
export type LeftTab = 'navigator' | 'comps' | 'assets';
export type RightTab = 'design' | 'layout' | 'logic' | 'data' | 'code';
export type Variant = 'default' | 'masked' | 'negative';
export type Tool = 'select' | 'hand' | 'insert' | 'interactions' | 'snap';
export type ActionCategory = 'navigation' | 'bankingCore' | 'security' | 'webhook';
export type TriggerEvent = 'onTap' | 'hold' | 'swipe';
export type WsStatus = 'active' | 'connecting' | 'disconnected';

export interface LayerNode {
  id: string;
  label: string;
  kind: 'screen' | 'master' | 'text' | 'container' | 'button' | 'shape';
  isMaster?: boolean;
  count?: number;
  children?: LayerNode[];
  collapsed?: boolean;
}

export interface WorkflowStep {
  id: string;
  title: string;
  detail?: string;
  badge: string;
  badgeTone: 'rule' | 'spring';
}