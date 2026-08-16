import GenericPanel from '@/components/generics/GenericPanel';
import NoPhotos from '@/components/NoPhotos';
import SolidChip from '@/components/SolidChip';
import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import GroupingPreviewItemNg from '@/pages/components/GroupingPreviewItemNg';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export default function SelectedPage_type() {
  const { type_name = '' } = useParams()
  const sidebarTerm = useSettingsStoreSelector((state) => state.sidebarTerm)
  const sections = useSections_GLOBAL()
  const { width } = useAlbumPhotoCardStoreSelector((state) => state)
  const { t } = useTranslation()

  const foundSection = sections?.find((s) => s.type === type_name)

  return (
    <>
      <GenericPanel id="selected-page-drawer" tool={
        <>
          {type_name === 'nowAndThen' && <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} divider={<Divider orientation="vertical" flexItem />}>
            <Typography sx={{ fontStyle: 'italic' }} variant="subtitle2" color="textPrimary">{t('nowAndThenTagline')}</Typography>
            <Typography variant="caption" sx={{ lineHeight: 1 }} color="textDisabled">{t('nowAndThenYearsBack', { count: foundSection?.data?.length || 0 })}</Typography>
          </Stack>}

          {type_name === 'timeline' && <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} divider={<Divider orientation="vertical" flexItem />}>
            <Typography sx={{ fontStyle: 'italic' }} variant="subtitle2" color="textPrimary">{t('timelineTagline')}</Typography>
            <Typography variant="caption" sx={{ lineHeight: 1 }} color="textDisabled">{t('timelineMonthsBack', { count: foundSection?.data?.length || 0 })}</Typography>
          </Stack>}

          {type_name === 'peopleAndPets' && <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} divider={<Divider orientation="vertical" flexItem />}>
            <Typography sx={{ fontStyle: 'italic' }} variant="body2" color="textPrimary">{t('peopleTagline')}</Typography>
            <Typography variant="caption" sx={{ lineHeight: 1 }} color="textDisabled">{t('peopleCount', { count: foundSection?.data?.length || 0 })}</Typography>
          </Stack>}

          <SolidChip count={foundSection?.data?.length || 0} height={32} fontSize={14} minWidth={60} />
        </>
      }>
        {foundSection?.data.length > 0 && <Box sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(${width * 1.5}px, 1fr))`,
          gap: 2
        }}>
          {foundSection?.data?.filter(item => sidebarTerm === '' ? true : item.name.toLowerCase().includes(sidebarTerm.toLowerCase()))
            .map((item: any, index: number) => (
              <GroupingPreviewItemNg
                index={index}
                key={item.name + item.description}
                type={type_name} details={item.details}
                photos={item.photos} title={item.name} description={item.description} count={item.photos.length} />
            ))}


        </Box>}
        {(foundSection === undefined || foundSection?.data?.length === 0) && <NoPhotos />}
      </GenericPanel>
    </>
  )
}
