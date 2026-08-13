import AutoTileCanvas from '@/components/AutoTileCanvas';
import GenericPanel from '@/components/generics/GenericPanel';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const batchSize = 20

export default function AutoDescriptionDrawer() {
  const { type_name = '', id = '' } = useParams()
  const { setSetting } = useBYOK()
  const sections = useSections_GLOBAL()
  const filteredPhotos = useFilteredPhotos_GLOBAL();
  const byokOpenAIKey = useBYOKStoreSelector((state) => state.byokOpenAIKey)

  const [renderedIndex, setRenderedIndex] = useState(0)
  // const [generatedImage, setGeneratedImage] = useState<File | null>(null)

  const foundSection = sections?.find((s) => s.type === type_name)
  const foundSet = foundSection?.data?.find((d: any) => d.name === id)
  const photos = type_name === '' ? filteredPhotos : foundSet?.photos || []

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

      {/* {byokOpenAIKey && (
        <ImageAnalyzer
          apiKey={byokOpenAIKey}
          image={generatedImage}
        />
      )} */}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        <Button variant="outlined" onClick={() => setRenderedIndex(renderedIndex - 1)} disabled={renderedIndex <= 0}>-</Button>
        <Button variant="outlined" onClick={() => setRenderedIndex(renderedIndex + 1)}>+</Button>
      </Box>


      <AutoTileCanvas
        photos={photos.filter((_, index) => index >= renderedIndex * batchSize && index < (renderedIndex + 1) * batchSize)}
        tileSize={175}
        columns={5}
        gap={10}
        // onFile={setGeneratedImage}
      />

    </GenericPanel>
  )
}
