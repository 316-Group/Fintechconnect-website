// /client/app/userdashboard/studio/StudioClient.tsx
'use client';

import React, { useState } from 'react';
import { Urbanist } from 'next/font/google';
import IconRail from './components/IconRail';
import LeftPanel from './components/LeftPanel';
import Canvas from './components/Canvas';
import RightPanel from './components/RightPanel';
import TopBar from './components/TopBar';
import FloatingToolbar from './components/FloatingToolbar';
import type {
  DeviceType,
  StudioMode,
  LeftTab,
  RightTab,
  Variant,
  Tool,
  ActionCategory,
  TriggerEvent,
} from './components/types';

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export default function StudioClient() {
  /* ---------- editor shell state ---------- */
  const [mode, setMode] = useState<StudioMode>('design');
  const [device, setDevice] = useState<DeviceType>('iphone');
  const [leftTab, setLeftTab] = useState<LeftTab>('navigator');
  const [rightTab, setRightTab] = useState<RightTab>('design');
  const [tool, setTool] = useState<Tool>('select');
  const [zoom, setZoom] = useState(100);
  const [saveState, setSaveState] = useState<'saving' | 'saved' | 'unsaved'>('saved');

  /* ---------- selection / variants ---------- */
  const [selectedLayerId, setSelectedLayerId] = useState('balance');
  const [variant, setVariant] = useState<Variant>('default');

  /* ---------- workflow state ---------- */
  const [addActionOpen, setAddActionOpen] = useState(true);
  const [triggerEvent, setTriggerEvent] = useState<TriggerEvent>('onTap');
  const [actionCategory, setActionCategory] = useState<ActionCategory>('navigation');
  const [biometricGuard, setBiometricGuard] = useState(true);

  /* ---------- data-binding state ---------- */
  const [wsStatus] = useState<'active' | 'connecting' | 'disconnected'>('active');
  const [boundVariable] = useState('{{account.available_balance}}');

  /* ---------- padding / box model ---------- */
  const [padding, setPadding] = useState({ top: 2, right: 2, bottom: 2, left: 2 });
  const [gap, setGap] = useState(12);

  return (
    <div
      className={`${urbanist.className} flex min-h-0 w-full min-w-[760px] flex-col overflow-hidden bg-[#F3F4F8] text-slate-900`}
      style={{ height: '100dvh' }}
    >
      <TopBar
        mode={mode}
        onMode={setMode}
        device={device}
        onDevice={setDevice}
        zoom={zoom}
        onZoom={setZoom}
        saveState={saveState}
        onSaveState={setSaveState}
        onPublish={() => setSaveState('saved')}
      />

      <div className="flex min-h-0 min-w-0 flex-1">
        <IconRail />
        <LeftPanel
          tab={leftTab}
          onTab={setLeftTab}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
        />
        <div className="relative flex min-w-0 flex-1">
          <Canvas
            device={device}
            zoom={zoom}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            variant={variant}
            padding={padding}
            gap={gap}
          />
          <FloatingToolbar tool={tool} onTool={setTool} />
        </div>
        <RightPanel
          tab={rightTab}
          onTab={setRightTab}
          variant={variant}
          onVariant={setVariant}
          padding={padding}
          onPadding={setPadding}
          gap={gap}
          onGap={setGap}
          addActionOpen={addActionOpen}
          onAddActionOpen={setAddActionOpen}
          triggerEvent={triggerEvent}
          onTriggerEvent={setTriggerEvent}
          actionCategory={actionCategory}
          onActionCategory={setActionCategory}
          biometricGuard={biometricGuard}
          onBiometricGuard={setBiometricGuard}
          wsStatus={wsStatus}
          boundVariable={boundVariable}
        />
      </div>
    </div>
  );
}