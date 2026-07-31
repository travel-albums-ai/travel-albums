import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SettingToggleRow from '@/settings/components/SettingToggleRow';
import { Box, Stack } from '@mui/material';
import { Ban, Check } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const toggleControls = [
  { key: 'outlet', labelKey: '_Main', value: 'show-outlet', type: 'boolean' },
  { key: 'scroller', labelKey: 'Scroller', value: 'show-scroller', type: 'boolean' },
  { key: 'globe', labelKey: 'Globe', value: 'show-globe', type: 'boolean' },

  { key: 'sidebar', labelKey: 'Explorer', value: 'show-sidebar', type: 'boolean' },
  { key: 'files', labelKey: 'Files', value: 'show-files', type: 'boolean' },
  { key: 'preview', labelKey: 'Preview', value: 'show-preview', type: 'boolean' },
  { key: 'adjustments', labelKey: 'Adjustments', value: 'show-adjustments', type: 'boolean' },
  { key: 'labeler', labelKey: 'Labeler', value: 'show-labeler', type: 'boolean' },
  { key: 'rows', labelKey: 'Rows', value: 'show-rows', type: 'boolean' },
  { key: 'calendar', labelKey: 'Calendar', value: 'show-calendar', type: 'boolean' },
] as const

export default function DrawersPopover({ filter }: { filter?: string }) {
  const { setDrawer } = useSettings()
  const drawers = useSettingsStoreSelector((state) => state.drawers)
  const { t } = useTranslation()

  return <>
    <Stack sx={{ gap: 0.5 }} divider={<Box sx={{ borderBottom: '1px dotted', borderColor: 'divider' }} />} >
      {toggleControls
        .filter(control => !filter || t(control.labelKey).toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => t(a.labelKey).localeCompare(t(b.labelKey)))
        .map((control) => (
          <Fragment key={control.key}>
            {control.type === 'boolean' && <SettingToggleRow
              label={control.labelKey}
              icon={control.icon}
              inactiveIcon={<Check size={16} />}
              activeIcon={<Ban size={16} />}
              selected={drawers[control.key]}
              onChange={() => setDrawer(control.key, !drawers[control.key])}
            />}
          </Fragment>
        ))}
    </Stack>
  </>
}
