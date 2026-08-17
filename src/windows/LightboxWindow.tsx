import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { composeUrl } from '@/lib/thumbnailService';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Lightbox } from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

export default function LightboxWindow() {
  const lightboxOpen = useSettingsStoreSelector(s => s.lightboxOpen)
  const { setSetting } = useSettings()
  const { setPreviewPhotoObj } = useSettings();

  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)
  const photo = previewPhotoObj ?? null

  const { type_name = '', id = '' } = useParams()
  const sections = useSections_GLOBAL()
  const photosFiltered = useFilteredPhotos_GLOBAL()

  const showAll = type_name === ''

  const foundSection = sections?.find((s) => s.type === type_name)
  const foundSet = foundSection?.data?.find((d: any) => d.name === id)
  const photos = showAll ? photosFiltered : foundSet?.photos || []

  const showWindow = lightboxOpen === true

  if (!showWindow) {
    return null
  }

  const updatePreviewPhoto = (index: number) => {
    setPreviewPhotoObj(photos[index])
  }

  return <>
    <Box sx={{ zIndex: 1, position: 'relative', top: 0, left: 0, width: '100%', height: '100%' }}>
      <Lightbox
        carousel={{
          finite: true
        }}
        on={{
          click: (props) => updatePreviewPhoto(props.index),
        }}
        index={photos.findIndex(p => p === photo)}
        plugins={[Fullscreen, Slideshow, Zoom]}
        open={showWindow}
        close={() => setSetting(prev => ({ ...prev, lightboxOpen: false }))}
        slides={[...photos.map(p => ({ src: composeUrl(p, true) }))]}
      />
    </Box>
  </>;
}
