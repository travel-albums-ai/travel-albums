import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SettingsSection from '@/windows/components/SettingsSection';
import SettingToggleRow from '@/windows/settings/components/SettingToggleRow';
import { Fragment } from 'react';

const toggleControls = [] as const

export default function SettingsPopover() {
  const { setSetting } = useSettings()
  const settings = useSettingsStoreSelector(s => s)

  return (
    <SettingsSection>
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
    </SettingsSection>
  )
}
