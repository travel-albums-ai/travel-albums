import GenericPanel from '@/components/generics/GenericPanel';
import NoPhotos from '@/components/NoPhotos';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { sectionIcons } from '@/icons/IconsIndex';
import BreadscrumbsPrimaryList from '@/layout/BreadcrumbsToolbar/BreadscrumbsPrimaryList';
import AllPhotosGridVirtuoso from '@/pages/components/AllPhotosGridVirtuoso';
import ToolbarActions from '@/pages/components/ToolbarActions';
import { useParams } from 'react-router-dom';

export default function SelectedPhotosPage_type_name() {
  const { type_name = '', id = '' } = useParams()
  const sections = useSections_GLOBAL()
  const photosFiltered = useFilteredPhotos_GLOBAL()

  const showAll = type_name === ''

  const foundSection = sections?.find((s) => s.type === type_name)
  const foundSet = foundSection?.data?.find((d: any) => d.name === id)
  const photos = showAll ? photosFiltered : foundSet?.photos || []

  return (
    <>
      <BreadscrumbsPrimaryList count={photos.length} list={foundSection ? [
        {
          breadcrumbIcon: sectionIcons[type_name],
          breadcrumbTitle: foundSection?.title || '',
        },
        {
          breadcrumbTitle: id
        }
      ] : []} />

      <GenericPanel toolbar={<ToolbarActions photos={photos} showAll={ showAll} />}>
        {photos.length === 0
          ? <NoPhotos />
          : <AllPhotosGridVirtuoso key={type_name} photos={photos} />}
      </GenericPanel>
    </>
  )
}
