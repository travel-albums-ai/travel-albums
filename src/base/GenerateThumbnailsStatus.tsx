import ThumbnailsStatus from '@/components/ThumbnailsStatus';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { useFetch_DeleteGenerateThumbnails } from '@/hooks/remote/useFetch_DeleteGenerateThumbnails';
import { useFetch_JobGenerateThumbnails } from '@/hooks/remote/useFetch_JobGenerateThumbnails';
import { useFetch_TakeoutMetadata } from '@/hooks/remote/useFetch_TakeoutMetadata';
import { usePost_ScriptsGenerateThumbnails } from '@/hooks/usePost_ScriptsGenerateThumbnails';
import { useEffect, useMemo, useRef } from 'react';

export default function GenerateThumbnailsStatus() {
  const { setSetting } = useSettings()
  const indexing = useSettingsStoreSelector((state) => state.indexing);

  const { deleteJob } = useFetch_DeleteGenerateThumbnails();
  const { run: generateThumbnails, data: generateThumbnailsData } =
    usePost_ScriptsGenerateThumbnails();

  const { clearCache } = useFetch_TakeoutMetadata();

  const jobId = generateThumbnailsData?.jobId;

  const hasJob = typeof jobId === 'string' && jobId.length > 0;

  const { data: jobData, refetch: refetchJob } =
    useFetch_JobGenerateThumbnails({
      jobId: jobId ?? '',
      enabled: hasJob,
    });

  const lastLine = useMemo(() => {
    const stdout = jobData?.stdout ?? '';
    return stdout.split('\r').filter(Boolean).slice(-1)[0] ?? '';
  }, [jobData?.stdout]);

  const refetchJobRef = useRef(refetchJob);
  const clearCacheRef = useRef(clearCache);

  useEffect(() => {
    refetchJobRef.current = refetchJob;
  }, [refetchJob]);

  useEffect(() => {
    clearCacheRef.current = clearCache;
  }, [clearCache]);

  // ⏱ polling logic
  useEffect(() => {
    if (!indexing || !hasJob) return;

    const jobInterval = setInterval(() => {
      console.log('Refetching job status...');
      refetchJobRef.current?.();
    }, 2000);

    const dbInterval = setInterval(() => {
      console.log('Clearing cache and refetching metadata...');
      clearCacheRef.current?.();
    }, 25000);

    return () => {
      clearInterval(jobInterval);
      clearInterval(dbInterval);
    };
  }, [indexing, hasJob]);

  useEffect(() => {
    if (!indexing) return;

    const status =
      jobData?.status ??
      jobData?.state ??
      (jobData?.finished ? 'finished' : undefined);

    if (status === 'finished') {
      setSetting(prev => ({ ...prev, indexing: false }));
    }
  }, [jobData, indexing, setSetting]);

  const handleDelete = async () => {
    try {
      await deleteJob(jobId);
      setSetting(prev => ({ ...prev, indexing: false }));
    } catch (err) {
      console.error(err);
    }
  };

  const onGenerate = () => {
    generateThumbnails({ mode: 'async' });
    setSetting(prev => ({ ...prev, indexing: true }));
  };

  return (
    <ThumbnailsStatus
      busy={indexing}
      handleDelete={handleDelete}
      handleGenerate={onGenerate}
      lastLine={lastLine}
    />
  );
}
