import { SERVER_ORIGIN } from '@/hooks/remote/utils';
import { useQuery } from '@tanstack/react-query';

const TAKEOUT_METADATA_URL = `${SERVER_ORIGIN}/config`

export const useFetch_Config = () => {
  const { data = null, refetch } = useQuery<unknown>({
    queryKey: ['config'],
    queryFn: () => fetch(TAKEOUT_METADATA_URL).then((res) => res.json()),
  })

  return { data, refetch }
}
