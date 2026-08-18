import { SERVER_ORIGIN } from '@/hooks/remote/utils';
import { useQuery } from '@tanstack/react-query';

const TAKEOUT_METADATA_URL = `${SERVER_ORIGIN}/config`

type ConfigPayload = {
  TAKEOUT_ROOTS?: string[]
  TARGET_ROOT?: string
}

export const useFetch_Config = () => {
  const { data = null, refetch } = useQuery<ConfigPayload>({
    queryKey: ['config'],
    queryFn: () => fetch(TAKEOUT_METADATA_URL).then((res) => res.json()),
  })

  return { data, refetch }
}
