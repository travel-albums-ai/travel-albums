import PopoverButton from '@/components/PopoverButton';
import { useLabelsStoreSelector } from '@/context/labelsStore';
import ZoomPhoto from '@/drawers/components/ZoomPhoto';
import { GalleryPhoto } from '@/lib/galleryData';
import { Box, Typography } from '@mui/material';
import { InfoIcon } from 'lucide-react';

export default function LabelerItem({ photo  }: { photo: GalleryPhoto }) {
  const labels = useLabelsStoreSelector((state) => state.labels)
  const labelsPrimary = useLabelsStoreSelector((state) => state.labelsPrimary)

  const labelsForPhoto = labels[photo.id]?.filter(label => label.score > 0.25)

  const findLabelHeader = () => {
    return Object.entries(labelsPrimary).filter(([_, photoIds]) => photoIds.some(id => id === photo.id)).map(([label]) => label)[0]
  }

  return (
    <Box key={photo.id} sx={{
      display: 'flex', flexDirection: 'column', gap: 1,
      cursor: 'pointer',
      borderRadius: 2,
      width: '100%',
    }}>
      <ZoomPhoto />

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
        <Typography variant="subtitle2">{findLabelHeader()}</Typography>

        {labelsForPhoto?.length > 0 && <PopoverButton icon={<InfoIcon />} label="Labels">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 0.5 }}>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {labelsForPhoto?.map((label, index) => <Box key={index} sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', borderRadius: 2, px: 0.75, py: 0.25 }}>
                <Box sx={{ display: 'flex', gap: 0.25 }}>
                  <span>{label.description}</span>
                  <span style={{ color: 'gray' }}>{`(${(label.score * 100).toFixed(1)}%)`}</span>
                </Box>
              </Box>)}
            </Box>
          </Box>
        </PopoverButton>}
      </Box>
    </Box>
  )
}
