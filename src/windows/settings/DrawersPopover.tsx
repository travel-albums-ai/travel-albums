import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SettingToggleRow from '@/windows/settings/components/SettingToggleRow';
import { Box, Stack } from '@mui/material';
import { Ban, Check } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const toggleControls = [
  { key: 'sidebar', labelKey: 'Explorer', value: 'show-sidebar', type: 'boolean', disabled: true },
  { key: 'globe', labelKey: 'Globe', value: 'show-globe', type: 'boolean' },
  { key: 'outlet', labelKey: 'Main', value: 'show-outlet', type: 'boolean', disabled: true },
  { key: 'preview', labelKey: 'Preview', value: 'show-preview', type: 'boolean', disabled: true },
  { key: 'adjustments', labelKey: 'Adjustments', value: 'show-adjustments', type: 'boolean' },
  { key: 'files', labelKey: 'Files', value: 'show-files', type: 'boolean' },
  { key: 'labeler', labelKey: 'Labeler', value: 'show-labeler', type: 'boolean' },
  { key: 'scroller', labelKey: 'Scroller', value: 'show-scroller', type: 'boolean' },
  { key: 'rows', labelKey: 'Rows', value: 'show-rows', type: 'boolean' },
  { key: 'calendar', labelKey: 'Calendar', value: 'show-calendar', type: 'boolean' },
  { key: 'folderHandler', labelKey: 'Folder Handlers', value: 'show-folder-handlers', type: 'boolean' },
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
        .sort((a, b) => (a.disabled !== b.disabled ? (a.disabled ? 1 : -1) : 0))
        .map((control) => (
          <Fragment key={control.key}>
            {control.type === 'boolean' && <SettingToggleRow
              label={t(control.labelKey)}
              icon={control.icon}
              disabled={control.disabled ?? false}
              inactiveIcon={control.disabled ? undefined : <Check size={16} />}
              activeIcon={control.disabled ? undefined : <Ban size={16} />}
              selected={drawers[control.key]}
              onChange={() => setDrawer(control.key, !drawers[control.key])}
            />}
          </Fragment>
        ))}
    </Stack>
  </>
}
