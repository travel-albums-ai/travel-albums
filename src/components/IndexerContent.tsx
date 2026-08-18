import IndexerMetricCard from '@/components/IndexerMetricCard';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { useFetch_IndexerOff } from '@/hooks/remote/useFetch_IndexerOff';
import { useFetch_IndexerOn } from '@/hooks/remote/useFetch_IndexerOn';
import { useFetch_IndexerStatus } from '@/hooks/remote/useFetch_IndexerStatus';
import { Box, Button, Typography } from '@mui/material';
import {
  Bug,
  ChevronLast,
  CircleCheckBig,
  Cpu,
  Gauge,
  History,
  Hourglass,
  List,
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

export default function IndexerContent() {
  const { setSetting } = useSettings();
  const indexing = useSettingsStoreSelector((state) => state.indexing);
  const progress = useSettingsStoreSelector((state) => state.indexerProgress);

  const { turnOnJob } = useFetch_IndexerOn();
  const { turnOffJob } = useFetch_IndexerOff();
  const { fetchStatus } = useFetch_IndexerStatus();

  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [, setElapsedTick] = useState(0);

  const handleTurnOn = async () => {
    try {
      await turnOnJob();

      setStartedAt(Date.now());

      setSetting((prev) => ({
        ...prev,
        indexing: true,
        loading: true,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTurnOff = async () => {
    try {
      await turnOffJob();

      setStartedAt(null);

      setSetting((prev) => ({
        ...prev,
        indexing: false,
        loading: false,
      }));
    } catch (err) {
      console.error(err);
    }
  };

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

    const jobInterval = setInterval(() => {
      handleGetStatus();

      // Re-render elapsed time
      setElapsedTick((tick) => tick + 1);
    }, 1000);

    return () => {
      clearInterval(jobInterval);
    };
  }, [indexing, handleGetStatus]);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, p: 1 }}>
        <Button
          disabled={indexing}
          variant="contained"
          color="primary"
          onClick={handleTurnOn}
        >
          On
        </Button>

        <Button
          disabled={!indexing}
          variant="contained"
          color="primary"
          onClick={handleTurnOff}
        >
          Off
        </Button>

        {indexing && startedAt && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'flex',
              alignItems: 'center',
              ml: 1,
              whiteSpace: 'nowrap',
            }}
          >
            Indexing since {formatElapsed(startedAt)} {startedAt && `(${new Date(startedAt).toLocaleTimeString()})`}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {indexing ? 'Indexer is running' : 'Indexer is stopped'}
          </Typography>

          <Box
            sx={{
              borderRadius: '50%',
              width: 10,
              height: 10,
              mr: 2,
              backgroundColor: indexing ? 'success.main' : 'divider',
              opacity: indexing ? 0.5 : 1,
              transition: 'background-color 0.3s ease, opacity 0.3s ease',
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, p: 1 }}>
        {progress &&
          Object.entries(progress).map(([key, value]) => (
            <Box key={key} sx={{ flex: '0 1 20%' }}>
              <IndexerMetricCard
                line={`${key}: ${value}`}
                object={{
                  icon: <History size={16} />,
                  label: key,
                }}
                showChart
              />
            </Box>
          ))}
      </Box>
    </>
  );
}
