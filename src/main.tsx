import AppRoutes from '@/components/AppRoutes';
import '@/lib/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/react";
import 'leaflet/dist/leaflet.css';
import { createRoot } from 'react-dom/client';
import AppProviders from './context/AppProviders';

import './freakflags.css';
import './index.css';

const queryClient = new QueryClient()
export const debug = true

const container = document.getElementById('root') as HTMLElement;
const root = (window as any).__ROOT__ ??= createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <SpeedInsights />
    <Analytics />
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </QueryClientProvider>,
)
