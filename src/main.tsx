import AppRoutes from '@/components/AppRoutes';
import '@/lib/i18n';
import { warmToolbarDiscovery } from '@/toolbarDiscovery';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import 'leaflet/dist/leaflet.css';
import { createRoot, Root } from 'react-dom/client';
import AppProviders from './context/AppProviders';

import './freakflags.css';
import './index.css';

const queryClient = new QueryClient()
export const debug = true

declare global {
  interface Window {
    __ROOT__?: Root;
  }
}

const warmToolbar = () => {
  warmToolbarDiscovery();
};

if (typeof window !== 'undefined') {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(warmToolbar, { timeout: 1500 });
  } else {
    globalThis.setTimeout(warmToolbar, 0);
  }
}

const container = document.getElementById('root') as HTMLElement;
const root = window.__ROOT__ ??= createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <SpeedInsights />
    <Analytics />
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </QueryClientProvider>,
)
