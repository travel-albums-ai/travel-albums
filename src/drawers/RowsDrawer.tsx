import GenericPanel from '@/components/generics/GenericPanel';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import AllPhotosRowsVirtuoso from '@/drawers/rows/AllPhotosRowsVirtuoso';
import ToolbarActions from '@/pages/components/ToolbarActions';
import { useParams } from 'react-router-dom';

export default function RowsDrawer() {
  const { type_name = '', id = '' } = useParams()
  const sections = useSections_GLOBAL()
  const photosFiltered = useFilteredPhotos_GLOBAL()

  const showAll = type_name === ''

  const foundSection = sections?.find((s) => s.type === type_name)
  const foundSet = foundSection?.data?.find((d: any) => d.name === id)
  const photos = showAll ? photosFiltered : foundSet?.photos || []

  return (
    <GenericPanel toolbar={<ToolbarActions photos={photos} showAll={showAll} />}>
      <AllPhotosRowsVirtuoso photos={photos} />
    </GenericPanel>
  );
}
