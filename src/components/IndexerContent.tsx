import IndexerMetricCard from '@/components/IndexerMetricCard';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { useFetch_IndexerOff } from '@/hooks/remote/useFetch_IndexerOff';
import { useFetch_IndexerOn } from '@/hooks/remote/useFetch_IndexerOn';
import { useFetch_IndexerStatus } from '@/hooks/remote/useFetch_IndexerStatus';
import { Box, Button, Typography } from '@mui/material';
import { History } from 'lucide-react';
import { useCallback, useEffect } from 'react';

export default function IndexerContent() {
  const { setSetting } = useSettings()
  const indexing = useSettingsStoreSelector((state) => state.indexing);
  const progress = useSettingsStoreSelector((state) => state.indexerProgress);

  const { turnOnJob } = useFetch_IndexerOn();
  const { turnOffJob } = useFetch_IndexerOff();
  const { fetchStatus } = useFetch_IndexerStatus();

  const handleTurnOn = async () => {
    try {
      await turnOnJob();
      setSetting(prev => ({ ...prev, indexing: true, loading: true }));
    } catch (err) {
      console.error(err);
    }
  }

  const handleTurnOff = async () => {
    try {
      await turnOffJob();
      setSetting(prev => ({ ...prev, indexing: false, loading: false }));
    } catch (err) {
      console.error(err);
    }
  }

  const handleGetStatus = useCallback(async () => {
    try {
      const status = await fetchStatus();
      if(status.status === 'running' && status.progress) {
        setSetting(prev => ({ ...prev, indexerProgress: status.progress }));
      }
      console.log('Indexer status:', status);
    } catch (err) {
      console.error(err);
    }
  }, [fetchStatus]);

  useEffect(() => {
    if (!indexing) return;

    const jobInterval = setInterval(() => {
      console.log('Refetching job status...');
      handleGetStatus()
    }, 1000);

    return () => {
      clearInterval(jobInterval);
    };
  }, [indexing, handleGetStatus]);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, p: 1 }}>
        <Button disabled={indexing} variant="contained" color="primary" onClick={() => handleTurnOn()}>On</Button>
        <Button disabled={!indexing} variant="contained" color="primary" onClick={() => handleTurnOff()}>Off</Button>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <Typography variant="caption" color="textSecondary">
            {indexing ? 'Indexer is running' : 'Indexer is stopped'}
          </Typography>
          <Box sx={{
            borderRadius: '50%',
            width: 10,
            height: 10,
            mr: 2,
            backgroundColor: indexing ? 'success.main' : 'divider',
            opacity: indexing ? 0.5 : 1,
            transition: 'background-color 0.3s ease, opacity 0.3s ease',
          }} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, p: 1 }}>
        {progress && Object.entries(progress).map(([key, value]) => <Box key={key} sx={{ flex: '0 1 20%'}}>
          <IndexerMetricCard
            key={key}
            line={`${key}: ${value}`}
            object={{
              icon: <History size={16} />,
              label: key,
            }}
            showChart={true}
          /> </Box>)}
      </Box>
    </>
  );
}
