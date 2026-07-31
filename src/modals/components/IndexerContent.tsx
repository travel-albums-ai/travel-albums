import GenericPanel from '@/components/generics/GenericPanel';
import SolidChip from '@/components/SolidChip';
import { useUnfilteredPhotos_GLOBAL } from '@/context/globals/unfilteredPhotosStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { useFetch_OriginalFiles } from '@/hooks/remote/useFetch_OriginalFiles';
import SidebarCoreButton from '@/layout/components/SidebarCoreButton';
import { Box, Button, LinearProgress } from '@mui/material';
import { Fragment, useEffect, useMemo, useState } from 'react';

export default function IndexerContent() {
  const { data: originalFiles_, refetch } = useFetch_OriginalFiles()
  const rawPhotos = useUnfilteredPhotos_GLOBAL();
  const indexing = useSettingsStoreSelector(s => s.indexing)

  const [showDetails, setShowDetails] = useState(true)

  const stats = useMemo(() => {
    if (!originalFiles_) return null

    const photos = rawPhotos || []
    const folders: Record<string, string[]> = {}
    const missingFiles: Record<string, string[]> = {}
    const remaining: Record<string, number> = {}

    for (const [folder, files_] of Object.entries(originalFiles_.folders ?? {})) {
      const files = files_

      folders[folder] = files

      const set = new Set(files)

      for (const photo of photos ?? []) {
        if (photo.albumName === folder) {
          set.delete(photo.id.split('::')[1])
        }
      }

      missingFiles[folder] = [...set]
      remaining[folder] = set.size
    }

    const totalFiles = Object.values(folders)
      .reduce((sum, files) => sum + files.length, 0)

    const totalRemaining = Object.values(remaining)
      .reduce((sum, count) => sum + count, 0)

    return {
      folders,
      remaining,
      missingFiles,
      totalFiles,
      totalRemaining,
    }
  }, [originalFiles_, rawPhotos])

  console.log('stats', stats)

  useEffect(() => {
    if (!stats?.totalRemaining && !indexing) return

    const interval = setInterval(() => {
      void refetch()
    }, 7500)

    return () => clearInterval(interval)
  }, [stats?.totalRemaining, indexing, refetch])

  console.log('stats', stats)

  return (<>
    <GenericPanel toolbar={<>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
        {indexing ? 'Indexing in progress...' : 'Indexing stopped'}
        <Button variant="outlined" onClick={() => setShowDetails(!showDetails)}>Toggle details</Button>
        <SolidChip label="remaining" count={stats?.totalRemaining ?? 0} fontSize={ 16} minWidth={100} height={ 32} />
        <SolidChip label="total" count={stats?.totalFiles ?? 0} fontSize={16} minWidth={100} height={32} />
      </Box>
    </>}>
      <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
        {Object.entries(stats?.folders ?? {})
          .map(([folder, files]) => {
            const done = files.length - stats!.remaining[folder]

            return <>
              <SidebarCoreButton
                key={folder}
                title={folder}
                count={files.length - stats!.remaining[folder]}
                isActive={false}
              >


                <LinearProgress
                  sx={{ width: 200, height: 20, borderRadius: 1 }}
                  variant="determinate"
                  color={ done === files.length ? 'success' : 'primary' }
                  value={(done / files.length) * 100}
                />
                <SolidChip label={`${Math.round((done / files.length) * 100)}%`} minWidth={40} />
                <SolidChip label={`${files.length}`} minWidth={40} />
              </SidebarCoreButton>
              {showDetails && stats?.missingFiles[folder].length > 0 && <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, p: 2, flexWrap: 'wrap' }}>
                {stats?.missingFiles[folder]?.reverse().filter((_, i) => i < 10).map(file => <Fragment key={file}>
                  <SolidChip label={`${file}`} minWidth={40} />
                </Fragment>)}
                { Math.max(0, stats?.missingFiles[folder]?.length - 10) > 0 && <>...{Math.max(0, stats?.missingFiles[folder]?.length - 10)} more</>}
              </Box>}
            </>
          })}
      </Box>
    </GenericPanel>
  </>)
}
