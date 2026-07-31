import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { useSelectedStoreSelector } from '@/context/selectedStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import GroupToolbarItems from '@/layout/components/GroupToolbarItems';
import { GalleryPhoto } from '@/lib/galleryData';
import AllToFavoriteToggle from '@/toggle/AllToFavoriteToggle';
import AllToIgnoreToggle from '@/toggle/AllToIgnoreToggle';
import AllToPrivateToggle from '@/toggle/AllToPrivateToggle';
import AllToTagsToggle from '@/toggle/AllToTagsToggle';
import NarrowMapToggle from '@/toggle/NarrowMapToggle';
import PinnedToggle from '@/toggle/PinnedToggle';
import SelectionToggle from '@/toggle/SelectionToggle';
import SelectModeToggle from '@/toggle/SelectModeToggle';
import SortOrderToggle from '@/toggle/SortOrderToggle';
import ThumbnailCoverToggle from '@/toggle/ThumbnailCoverToggle';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function ToolbarActions({ showAll = false, children }: { showAll?: boolean, children?: React.ReactNode }) {
  const { type_name = '', id = '' } = useParams()
  const sections = useSections_GLOBAL()
  const selectMode = useSettingsStoreSelector((state) => state.selectMode)
  const albumType = useSettingsStoreSelector((state) => state.albumType)
  const selectedPhotos = useSelectedStoreSelector((state) => state.photos)
  const photosFiltered = useFilteredPhotos_GLOBAL()

  const foundSection = sections?.find((s) => s.type === type_name)
  const photos = showAll ? photosFiltered : foundSection?.data?.find((d: any) => d.name === id)?.photos || []

  const photosIds = photos.map((p: GalleryPhoto) => p.id)

  return <>
    <GroupToolbarItems>
      {!showAll && <PinnedToggle />}
      <SortOrderToggle />
      {albumType !== 'labeler' && <>
        <SelectModeToggle />
        {selectMode && <SelectionToggle photoIds={photosIds} />}
        {selectMode && selectedPhotos.length > 0 && <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
          <AllToFavoriteToggle photosIds={photosIds} />
          <AllToPrivateToggle photosIds={photosIds} />
          <AllToIgnoreToggle photosIds={photosIds} />
          <AllToTagsToggle photosIds={photosIds} />
        </Box>}
      </>}
    </GroupToolbarItems>

    <GroupToolbarItems>
      <ThumbnailCoverToggle />
      {albumType === 'globe' && <NarrowMapToggle />}
      {children}
    </GroupToolbarItems>
  </>
}
