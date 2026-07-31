import { SERVER_ORIGIN } from '@/hooks/remote/utils';
import { useQuery } from '@tanstack/react-query';

const THUMBNAIL_FILES_URL = `${SERVER_ORIGIN}/original-files`
const HALF_MINUTE_MS = 0.5 * 60 * 1000

export type ThumbnailFilesData = {
  folders?: Record<string, string[]>
}

export const useFetch_OriginalFiles = () => {
  const { data = null, refetch } = useQuery<{ folders: Record<string, string[]>, folderSets: Record<string, Set<string>> } | null>({
    queryKey: ['original-files'],
    queryFn: () => fetch(THUMBNAIL_FILES_URL).then((res) => res.json() as ThumbnailFilesData),
    select: (raw) => {
      const folders = raw?.folders ?? {}
      return { folders }
    },
    staleTime: HALF_MINUTE_MS,
  })

  return { data, refetch }
}
