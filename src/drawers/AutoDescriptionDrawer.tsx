import AutoTileCanvas from '@/components/AutoTileCanvas';
import GenericPanel from '@/components/generics/GenericPanel';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import { useDescriptionsStoreSelector } from '@/context/descriptionsStore';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { GalleryPhoto } from '@/lib/galleryData';
import ImageAnalyzer from '@/robot/ImageAnalyzer';
import { Box, Button, TextField } from '@mui/material';
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


  return (
    <GenericPanel id="auto-description-drawer" toolbar={<>
      <TextField
        label="BYOK OpenAI Key"
        variant="outlined"
        fullWidth
        value={byokOpenAIKey}
        onChange={(e) => setSetting({ byokOpenAIKey: e.target.value })}
        margin="normal"
      />
    </>}>

      <ImageAnalyzer photos={selectedPhotos} />

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
        <Button variant="outlined" onClick={() => setBatchSize(batchSize - 1)} disabled={batchSize <= 1}>-</Button>
        {batchSize}
        <Button variant="outlined" onClick={() => setBatchSize(batchSize + 1)}>+</Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
        <Button variant="outlined" onClick={() => setRenderedIndex(renderedIndex - 1)} disabled={renderedIndex <= 0}>-</Button>
        <AutoTileCanvas
          photos={selectedPhotos}
          tileSize={175}
          columns={5}
          gap={10}
        />
        <Button variant="outlined" onClick={() => setRenderedIndex(renderedIndex + 1)} disabled={(renderedIndex + 1) * batchSize >= photos.length}>+</Button>
      </Box>

    </GenericPanel>
  )
}
