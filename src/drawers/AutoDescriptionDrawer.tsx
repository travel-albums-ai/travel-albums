import AutoTileCanvas from '@/components/AutoTileCanvas';
import GenericPanel from '@/components/generics/GenericPanel';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { useParams } from 'react-router-dom';

export default function AutoDescriptionDrawer() {
  const { type_name = '', id = '' } = useParams()
  const sections = useSections_GLOBAL()
  const filteredPhotos = useFilteredPhotos_GLOBAL();

  const foundSection = sections?.find((s) => s.type === type_name)
  const foundSet = foundSection?.data?.find((d: any) => d.name === id)
  const photos = type_name === '' ? filteredPhotos : foundSet?.photos || []

  return (
    <GenericPanel id="auto-description-drawer" defaultToolbar>

      {photos.length}

      <AutoTileCanvas
        photos={photos.filter((p, index) => index < 20)}
        tileSize={300}
        columns={5}
      />


    </GenericPanel>
  )
}
