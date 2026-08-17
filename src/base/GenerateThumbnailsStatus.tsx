import PopoverButton from '@/components/PopoverButton';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { useFetch_IndexerOff } from '@/hooks/remote/useFetch_IndexerOff';
import { useFetch_IndexerOn } from '@/hooks/remote/useFetch_IndexerOn';
import { useFetch_IndexerStatus } from '@/hooks/remote/useFetch_IndexerStatus';
import { Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

export default function GenerateThumbnailsStatus() {
  const { setSetting } = useSettings()
  const indexing = useSettingsStoreSelector((state) => state.indexing);

  const [progress, setProgress] = useState({});

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
        setProgress(status.progress);
      }
      console.log('Indexer status:', status);
    } catch (err) {
      console.error(err);
    }
  }, [fetchStatus]);

  // ⏱ polling logic
  useEffect(() => {
    if (!indexing) return;

    const jobInterval = setInterval(() => {
      console.log('Refetching job status...');
      handleGetStatus()
    }, 2000);

    return () => {
      clearInterval(jobInterval);
    };
  }, [indexing, handleGetStatus]);

  return (
    <>
      <PopoverButton id="indexer" upsideDown={true} width={650} label="" icon="" trigger={<Button variant="contained" color="primary">Indexer Control</Button>}>
        <Button onClick={() => handleTurnOn()}>On</Button>
        <Button onClick={() => handleTurnOff()}>Off</Button>
        <Button onClick={() => handleGetStatus()}>Status</Button>
        <div>status: {indexing ? 'indexing' : 'idle'}</div>
        <div>progress: {progress ? JSON.stringify(progress) : 'no progress'}</div>
        {/* <ThumbnailsStatus
          busy={indexing}
          handleDelete={() => {}}
          handleGenerate={() => {}}
          lastLine=""
        /> */}
      </PopoverButton>
    </>
  );
}
