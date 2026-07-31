import { SERVER_ORIGIN } from '@/hooks/remote/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const THUMBNAILS_JOB_URL = `${SERVER_ORIGIN}/jobs`;
const TEN_SECONDS = 0.1 * 60 * 1000;

export const useFetch_JobGenerateThumbnails = ({ jobId }: { jobId?: string }) => {
  const enabled = Boolean(jobId);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['job', jobId],
    enabled,
    queryFn: async () => {
      const res = await fetch(`${THUMBNAILS_JOB_URL}/${jobId}`);
      if (!res.ok) throw new Error('Failed to fetch job');
      return res.json();
    },
    staleTime: TEN_SECONDS,
  });

  const refetch = () => {
    if (!jobId) return;
    return queryClient.invalidateQueries({ queryKey: ['job', jobId] });
  };

  return {
    data: query.data ?? null,
    refetch,
  };
};
