import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { useFetch_IndexerStatus } from '@/hooks/remote/useFetch_IndexerStatus';
import { useFetch_TakeoutMetadata } from '@/hooks/remote/useFetch_TakeoutMetadata';
import {
    Bug,
    ChevronLast,
    CircleCheckBig,
    Cpu,
    Gauge,
    Hourglass,
    List
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const items = [
  {
    key: 'processed',
    label: 'Processed',
    icon: <Cpu size={24} />,
  },
  {
    key: 'total',
    label: 'Total',
    icon: <List size={24} />,
  },
  {
    key: 'generated',
    label: 'Generated',
    icon: <CircleCheckBig size={24} />,
  },
  {
    key: 'skipped',
    label: 'Remaining',
    icon: <ChevronLast size={24} />,
  },
  {
    key: 'failed',
    label: 'Failed',
    icon: <Bug size={24} />,
  },
  {
    key: 'img/s',
    label: 'Rate (img/s)',
    icon: <Gauge size={24} />,
  },
  {
    key: 'ETA',
    label: 'ETA (min)',
    format: (value: string) => Math.round(Number(value) / 1000 / 60) + 'm',
    icon: <Hourglass size={24} />,
  },
];

function formatElapsed(startedAt: number): string {
  const seconds = Math.floor((Date.now() - startedAt) / 1000);

  if (seconds < 60) {
    return 'just now';
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    return remainingMinutes
      ? `${hours}h ${remainingMinutes}m ago`
      : `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return remainingHours
    ? `${days}d ${remainingHours}h ago`
    : `${days}d ago`;
}

export default function IndexerRefresh() {
  const { setSetting } = useSettings();
  const indexing = useSettingsStoreSelector((state) => state.indexing);
  const { forceRefresh } = useFetch_TakeoutMetadata();
  const { fetchStatus } = useFetch_IndexerStatus();

  const [, setElapsedTick] = useState(0);

  const handleGetStatus = useCallback(async () => {
    try {
      const status = await fetchStatus();

      if (status.status === 'running' && status.progress) {
        setSetting((prev) => ({
          ...prev,
          indexerProgress: status.progress,
        }));
      }

      console.log('Indexer status:', status);
    } catch (err) {
      console.error(err);
    }
  }, [fetchStatus, setSetting]);

  useEffect(() => {
    if (!indexing) return;

    const interval = setInterval(() => {
      handleGetStatus();
      setElapsedTick((tick) => tick + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [indexing, handleGetStatus]);

  useEffect(() => {
    if (!indexing) return;

    const interval = setInterval(() => {
      console.log('🔥 Refreshing takeout metadata...');
      forceRefresh();
    }, 30_000);

    return () => {
      clearInterval(interval);
    };
  }, [indexing, forceRefresh]);

  return null
}
