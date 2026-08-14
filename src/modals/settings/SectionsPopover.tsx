import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { sectionIcons } from '@/icons/IconsIndex';
import SettingToggleRow from '@/modals/settings/components/SettingToggleRow';
import { Box, Stack } from '@mui/material';
import { Ban, Check } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const toggleControls = [
  { key: 'trips', icon: sectionIcons.trips, labelKey: 'sectionTrips', value: 'show-trips', type: 'boolean' },
  { key: 'peopleAndPets', icon: sectionIcons.peopleAndPets, labelKey: 'sectionPeopleAndPets', value: 'show-people-and-pets', type: 'boolean' },
  { key: 'countries', icon: sectionIcons.countries, labelKey: 'sectionCountries', value: 'show-countries', type: 'boolean' },
  { key: 'nowAndThen', icon: sectionIcons.nowAndThen, labelKey: 'sectionNowAndThen', value: 'show-now-and-then', type: 'boolean' },
  { key: 'views', icon: sectionIcons.viewed, labelKey: 'sectionViews', value: 'show-views', type: 'boolean' },
  { key: 'likes', icon: sectionIcons.mostLiked, labelKey: 'sectionLikes', value: 'show-likes', type: 'boolean' },
  { key: 'comments', icon: sectionIcons.mostCommented, labelKey: 'sectionComments', value: 'show-comments', type: 'boolean' },
  { key: 'favorites', icon: sectionIcons.favorites, labelKey: 'sectionFavorites', value: 'show-favorites', type: 'boolean' },
  { key: 'timeline', icon: sectionIcons.timeline, labelKey: 'sectionTimeline', value: 'show-timeline', type: 'boolean' },
  { key: 'ignored', icon: sectionIcons.ignored, labelKey: 'sectionIgnored', value: 'show-ignored', type: 'boolean', disabled: true },
  { key: 'private', icon: sectionIcons.private, labelKey: 'sectionPrivate', value: 'show-private', type: 'boolean', disabled: true },
  { key: 'selected', icon: sectionIcons.selected, labelKey: 'sectionSelected', value: 'show-selected', type: 'boolean', disabled: true },
  { key: 'tags', icon: sectionIcons.tags, labelKey: 'sectionTags', value: 'show-tags', type: 'boolean'},
  { key: 'labels', icon: sectionIcons.labels, labelKey: 'sectionLabels', value: 'show-labels', type: 'boolean' },
  { key: 'cities', icon: sectionIcons.cities, labelKey: 'sectionCities', value: 'show-cities', type: 'boolean' },
] as const

export default function SectionsPopover({ filter }: { filter?: string }) {
  const { setModule } = useSettings()
  const modules = useSettingsStoreSelector((state) => state.modules)
  const { t } = useTranslation()

  return <>
    <Stack sx={{ gap: 0.5 }} divider={<Box sx={{ borderBottom: '1px dotted', borderColor: 'divider' }} />} >
      {toggleControls
        .filter(control => !filter || t(control.labelKey).toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => t(a.labelKey).localeCompare(t(b.labelKey)))
        .sort((a, b) => (a.disabled !== b.disabled ? (a.disabled ? 1 : -1) : 0))
        .map((control) => (
          <Fragment key={control.key}>
            {control.type === 'boolean' && <SettingToggleRow
              label={t(control.labelKey)}
              icon={control.icon}
              disabled={control.disabled ?? false}
              inactiveIcon={control.disabled ? undefined : <Check size={16} />}
              activeIcon={control.disabled ? undefined : <Ban size={16} />}
              selected={modules[control.key]}
              onChange={() => setModule(control.key, !modules[control.key])}
            />}
          </Fragment>
        ))}
    </Stack>
  </>
}
