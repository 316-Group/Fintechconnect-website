// /client/app/userdashboard/studio/page.tsx
import type { Metadata } from 'next';
import StudioClient from './StudioClient';

export const metadata: Metadata = {
  title: 'White-label Studio · FintecConnect',
  description: 'Configure, theme and publish your white-label mobile banking app.',
};

export default function StudioPage() {
  return <StudioClient />;
}