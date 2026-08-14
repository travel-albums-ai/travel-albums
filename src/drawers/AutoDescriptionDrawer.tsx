import AutoTileCanvas from '@/components/AutoTileCanvas';
import GenericPanel from '@/components/generics/GenericPanel';
import SolidChip from '@/components/SolidChip';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import { useDescriptionsStoreSelector } from '@/context/descriptionsStore';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import SemanticPhotoSearch from '@/drawers/autoDescription/SemanticPhotoSearch';
import { GalleryPhoto } from '@/lib/galleryData';
import ImageAnalyzer from '@/robot/ImageAnalyzer';
import { Box, Button, IconButton } from '@mui/material';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';


export default function AutoDescriptionDrawer() {
  const { type_name = '', id = '' } = useParams()
  const { setSetting } = useBYOK()
  const sections = useSections_GLOBAL()
  const filteredPhotos = useFilteredPhotos_GLOBAL();
  const byokOpenAIKey = useBYOKStoreSelector((state) => state.byokOpenAIKey)
  const descriptionsStore = useDescriptionsStoreSelector(state => state.descriptions)

  const [renderedIndex, setRenderedIndex] = useState(0)
  const [batchSize, setBatchSize] = useState(20)

  const foundSection = sections?.find((s) => s.type === type_name)
  const foundSet = foundSection?.data?.find((d: any) => d.name === id)
  const photos = type_name === '' ? filteredPhotos : foundSet?.photos || []

  const selectedPhotos = photos
    .filter((photo: GalleryPhoto) => !descriptionsStore.some((desc) => desc.id === photo.id))
    .filter((_, index) => index >= renderedIndex * batchSize && index < (renderedIndex + 1) * batchSize)

  const uniquePlaces =  [...new Set(selectedPhotos?.map(p => p?.city).map(c => c?.name))]

  return (
    <GenericPanel id="auto-description-drawer" defaultToolbar toolbar={<>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
        <SolidChip count={batchSize} label="batch size" minWidth={80} />
        <IconButton onClick={() => setBatchSize(batchSize - 1)} disabled={batchSize <= 1}>
          <Minus size={16} />
        </IconButton>
        <IconButton onClick={() => setBatchSize(batchSize + 1)}>
          <Plus size={16} />
        </IconButton>
      </Box>
    </>}>

      {byokOpenAIKey && <SemanticPhotoSearch
        apiKey={byokOpenAIKey}
        photos={descriptionsStore}
      />}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'flex-start', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center', flexDirection: 'row', width: '100%', borderBottom: '1px solid', borderColor: 'divider', pb: 1, mb: 1 }}>
          <Button variant="outlined" onClick={() => setRenderedIndex(renderedIndex - 1)} disabled={renderedIndex <= 0}>-</Button>
          <AutoTileCanvas
            photos={selectedPhotos}
            tileSize={175}
            columns={5}
            gap={10}
          />
          <Button variant="outlined" onClick={() => setRenderedIndex(renderedIndex + 1)} disabled={(renderedIndex + 1) * batchSize >= photos.length}>+</Button>
        </Box>

        <Box sx={{ flex: 1 }} >
          <ImageAnalyzer photos={selectedPhotos} context={{ photoLocations: 'Photo where these photos were taken: ' + uniquePlaces.join(', ') }} />
        </Box>
      </Box>

    </GenericPanel>
  )
}
