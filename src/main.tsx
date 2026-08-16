import AppRoutes from '@/components/AppRoutes';
import '@/lib/i18n';
import { warmToolDiscovery, warmToolGroup } from '@/toolDiscovery';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import 'leaflet/dist/leaflet.css';
import { createRoot, Root } from 'react-dom/client';
import AppProviders from './context/AppProviders';

import "driver.js/dist/driver.css";
import 'flexlayout-react/style/alpha_dark.css';
import 'flexlayout-react/style/combined.css';
import 'uplot/dist/uPlot.min.css';
import './freakflags.css';
import './index.css';

const queryClient = new QueryClient()
export const debug = true

declare global {
  interface Window {
    __ROOT__?: Root;
  }
}

const warmTool = () => {
  warmToolDiscovery();
  warmToolGroup('header');
};

if (typeof window !== 'undefined') {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(warmTool, { timeout: 250 });
  } else {
    globalThis.setTimeout(warmTool, 0);
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
