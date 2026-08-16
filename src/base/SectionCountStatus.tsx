import SolidChip from '@/components/SolidChip';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { Tooltip } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function SelectionCountStatus() {
  const { type_name = '', id = '' } = useParams()
  const sections = useSections_GLOBAL()
  const photosFiltered = useFilteredPhotos_GLOBAL()

  const showAll = type_name === ''

  const foundSection = sections?.find((s) => s.type === type_name)
  const foundSet = foundSection?.data?.find((d: any) => d.name === id)
  const photos = showAll ? photosFiltered : foundSet?.photos || []

  return (<>
    <Tooltip title={`Section photos: ${photos.length}`} arrow>
      <SolidChip count={photos.length} label="total" />
    </Tooltip>
  </>)
}
