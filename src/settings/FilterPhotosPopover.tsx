import PopoverButton from '@/components/PopoverButton';
import { useFilterPhotos, useFilterStoreSelector } from '@/context/filterStore';
import FilterPresets from '@/settings/components/FilterPresets';
import SettingComponentRow from '@/settings/components/SettingComponentRow';
import SettingDateRow from '@/settings/components/SettingDateRow';
import SettingsSliderRow from '@/settings/components/SettingsSliderRow';
import SettingToggleRow from '@/settings/components/SettingToggleRow';
import SettingTrileanRow from '@/settings/components/SettingTrileanRow';
import CountriesFilter from '@/settings/filters/CountriesFilter';
import DatesFilter from '@/settings/filters/DatesFilter';
import FoldersFilter from '@/settings/filters/FoldersFilter';
import GeneralRow from '@/settings/filters/GeneralRow';
import PeopleAndPetsFilter from '@/settings/filters/PeopleAndPetsFilter';
import { Box, Stack, Typography } from '@mui/material';
import { Calendar, Folder, Image, LocateFixed, LocateOff, Users } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

export default function FilterPhotosPopover({ filter }: { filter?: string }) {
  const { setSetting } = useFilterPhotos()
  const settings =  useFilterStoreSelector((state) => state)
  const { t } = useTranslation()

  const categories = [
    { key: 'date', label: t('filterCategoryDate'), icon: <Calendar size={ 16} /> },
    { key: 'people', label: t('filterCategoryPeople'), tile: true, icon: <Users size={ 16} /> },
    { key: 'locations', label: t('filterCategoryLocations'), tile: true, icon: <LocateFixed size={ 16} /> },
    { key: 'views', label: t('filterCategoryViews'), tile: true, icon: <Image size={ 16} /> },
    { key: 'folders', label: t('filterCategoryFolders'), icon: <Folder size={ 16} /> },
  ]

  const toggleControls = [
    { key: 'showWithWithoutPersons', label: t('filterNarrowByPersons'), value: 'show-without-persons', type: 'trilean', category: 'people', activeIcon: <Users size={16} />, inactiveIcon: <Image size={16} /> },
    { key: 'filterPeopleAndPets', label: t('filterByPeopleAndPets'), value: 'filter-people-and-pets', type: 'boolean', category: 'people' },
    { key: 'peopleAndPets2', label: t('filterIncludeExcludePeopleAndPets'), value: 'show-without-persons', type: 'component', category: 'people', component: <PopoverButton  triggerNaked={ false} width={450} trigger={<GeneralRow type="peopleAndPets" label={t('filterCategoryPeople')} />}><PeopleAndPetsFilter /></PopoverButton> },

    { key: 'showWithWithoutGps', label: t('filterShowGps'), value: 'show-without-gps', type: 'trilean', category: 'locations', activeIcon: <LocateFixed size={16} />, inactiveIcon: <LocateOff size={16} /> },
    { key: 'filterCountries', label: t('filterByCountries'), value: 'filter-countries', type: 'boolean', category: 'locations' },
    {
      key: 'countries2', label: t('filterIncludeExcludeCountries'), value: 'countries', type: 'component', category: 'locations', component: <PopoverButton width={550}  triggerNaked={ false} trigger={<GeneralRow type="countries" label={t('sectionCountries')} />}>
        <CountriesFilter />
      </PopoverButton>
    },

    { key: 'showViews', label: t('filterNarrowByViews'), value: 'show-views', type: 'boolean', category: 'views' },
    { key: 'showViewsMin', label: t('filterMinViews'), value: 'show-views-min', type: 'number', category: 'views' },
    { key: 'filterDates', label: t('filterByDates'), value: 'filter-dates', type: 'boolean', category: 'date' },

    { key: 'filterFolders', label: t('filterByFolders'), value: 'filter-folders', type: 'boolean', category: 'folders' },
    { key: 'folders2', label: t('filterIncludeExcludeFolders'), value: 'folders', type: 'component', category: 'folders', component: <PopoverButton width={450} triggerNaked={ false} trigger={<GeneralRow type="folders" label={t('filterCategoryFolders')} />}><FoldersFilter /></PopoverButton> },

    {
      key: 'dateFilter',
      label: t('filterNarrowByDateRanges'),
      value: 'date-range',
      type: 'component',
      category: 'date',
      component: <PopoverButton width={450} label={t('filterDatesLabel')} anchorHorizontal="center" anchorVertical="bottom" transformHorizontal="center" transformVertical="top">
        <DatesFilter />
      </PopoverButton>
    },
  ] as const


  const groupedControls = toggleControls.reduce((acc, control) => {
    if (!acc[control.category]) acc[control.category] = [];
    acc[control.category].push(control);
    return acc;
  }, {} as Record<string, typeof toggleControls>)


  return <>

    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider', pb: 1, mb: 1 }} >
      <FilterPresets />
    </Box>

    <Stack sx={{ gap: 0.5 }} divider={<Box sx={{ borderBottom: '1px dotted', borderColor: 'divider' }} />} >
      {Object.entries(groupedControls)
        .map(([category, controls], i) => (
          <Box key={category} sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, px: 1 }}>
              { categories.find(c => c.key === category)?.icon}
              <Typography variant="subtitle2" sx={{ mb: 1, mt: 1, textTransform: 'capitalize' }}>{categories.find(c => c.key === category)?.label ?? category}</Typography>
            </Box>
            {controls
              .filter(control => !filter || control.label.toLowerCase().includes(filter.toLowerCase()))
              .map((control) => (
                <Fragment key={control.key}>
                  {control.type === 'component' && control.component && <SettingComponentRow label={control.label} component={control.component} />}

                  {control.type === 'boolean' && <SettingToggleRow
                    label={control.label}
                    activeIcon={control.activeIcon}
                    inactiveIcon={control.inactiveIcon}
                    selected={settings[control.key]}
                    onChange={() => setSetting((prev) => ({ ...prev, [control.key]: !settings[control.key] }))}
                  />}

                  {control.type === 'trilean' && <SettingTrileanRow
                    label={control.label}
                    activeIcon={control.activeIcon}
                    inactiveIcon={control.inactiveIcon}
                    selected={settings[control.key]}
                    onChange={(value) => setSetting((prev) => ({ ...prev, [control.key]: value }))}
                  />}

                  {control.type === 'date' && <SettingDateRow
                    label={control.label}
                    activeIcon={control.activeIcon}
                    inactiveIcon={control.inactiveIcon}
                    value={settings[control.key]}
                    onChange={(value) => setSetting((prev) => ({ ...prev, [control.key]: value }))}
                  />}

                  {control.type === 'number' && <SettingsSliderRow
                    label={control.label}
                    max={control.max}
                    value={settings[control.key] || 0}
                    onChange={(value) => setSetting((prev) => ({ ...prev, [control.key]: value }))}
                    disabled={!settings[control.key.replace('Min', '') as keyof typeof settings]}
                  />}
                </Fragment>
              ))}
          </Box>
        ))}
    </Stack>
  </>
}
