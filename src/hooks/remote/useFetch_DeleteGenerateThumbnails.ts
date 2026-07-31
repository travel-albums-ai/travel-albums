import { SERVER_ORIGIN } from '@/hooks/remote/utils';
import { useCallback } from 'react';

const THUMBNAILS_JOB_URL = `${SERVER_ORIGIN}/jobs`;

export const useFetch_DeleteGenerateThumbnails = () => {
  const deleteJob = useCallback(async (jobId: string) => {
    const res = await fetch(`${THUMBNAILS_JOB_URL}/${jobId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Failed to delete job');
    }

    return res.json();
  }, []);

  return { deleteJob };
};
