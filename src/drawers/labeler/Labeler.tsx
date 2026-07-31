import SolidChip from '@/components/SolidChip';
import { useLabels, useLabelsStoreSelector } from '@/context/labelsStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import LabelerItem from '@/drawers/labeler/LabelerItem';
import { thumbnailUrl } from '@/lib/thumbnailService';
import { Box, Typography } from '@mui/material';

export default function Labeler() {
  const { mapping } = useLabels()
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)
  const labelsPrimary = useLabelsStoreSelector((state) => state.labelsPrimary)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, overflow: 'hidden', gap: 1 }}>

      <Box sx={{ display: 'flex', flex: '0 0 50%', width: '100%', overflow: 'hidden', borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 2 }}>
        <LabelerItem photo={previewPhotoObj} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column',  overflow:'auto', gap: 2, flex: '1 1 auto' }}>

        <Box sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: '1fr 1fr',
        }}>
          {Object.entries(mapping)
            .filter(([label]) => labelsPrimary[label]?.length > 0)
            .map(([label]) => <Box key={label} sx={{ display: 'flex', flexDirection: 'column', gap: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <Typography variant="caption" color="textSecondary">{label} ({ labelsPrimary[label]?.length})</Typography>
                <SolidChip label={'count'} count={labelsPrimary[label]?.length} size="small" />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {labelsPrimary[label]?.map(photoId => <img key={ photoId} src={thumbnailUrl(photoId)} style={{ height: 50, objectFit: 'cover', borderRadius: 4 }} />)}
              </Box>
            </Box>)}
        </Box>
      </Box>
    </Box>
  )
}
