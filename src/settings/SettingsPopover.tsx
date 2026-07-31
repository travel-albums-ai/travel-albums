import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SettingToggleRow from '@/settings/components/SettingToggleRow';
import { Box, Stack } from '@mui/material';
import { Fragment } from 'react';

const toggleControls = [
  { key: 'demoMode', label: 'Demo mode', value: 'demo-mode', type: 'boolean' },
] as const

export default function SettingsPopover() {
  const { setSetting } = useSettings()
  const settings = useSettingsStoreSelector(s => s)

  const content = <Stack sx={{ gap: 0.5 }} divider={<Box sx={{ borderBottom: '1px dotted', borderColor: 'divider' }} />} >
    {toggleControls
      .map((control) => (
        <Fragment key={control.key}>
          {control.type === 'boolean' && <SettingToggleRow
            key={control.key}
            label={control.label}
            selected={settings[control.key]}
            onChange={() => setSetting((prev) => ({ ...prev, [control.key]: !settings[control.key] }))}
          />}
        </Fragment>
      ))}
  </Stack>

  return content
}
