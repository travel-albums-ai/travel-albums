import { useAlbumPhotoCard, useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SettingSelectRow from '@/settings/components/SettingSelectRow';
import SettingsSliderRow from '@/settings/components/SettingsSliderRow';
import SettingToggleRow from '@/settings/components/SettingToggleRow';
import { Box, Stack } from '@mui/material';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const toggleControls = [
  { key: 'width', labelKey: 'layoutWidth', value: 'show-width-size', type: 'number', max: 500 },
  { key: 'height', labelKey: 'layoutHeight', value: 'show-height-size', type: 'number', max: 500 },
  { key: 'showViews', labelKey: 'layoutShowViews', value: 'show-views', type: 'boolean' },
] as const

export default function LayoutPopover() {
  const { setSetting: setCardSetting } = useAlbumPhotoCard()
  const cardSettings = useAlbumPhotoCardStoreSelector((state) => state)
  const { setSetting } = useSettings()
  const themeId = useSettingsStoreSelector((state) => state.themeId)
  const { t } = useTranslation()

  return <Stack sx={{ gap: 0.5 }} divider={<Box sx={{ borderBottom: '1px dotted', borderColor: 'divider' }} />} >
    {toggleControls
      .map((control) => (
        <Fragment key={control.key}>
          {control.type === 'boolean' && <SettingToggleRow
            key={control.key}
            label={t(control.labelKey)}
            selected={cardSettings[control.key]}
            onChange={() => setCardSetting((prev) => ({ ...prev, [control.key]: !cardSettings[control.key] }))}
          />}

          {control.type === 'number' && <SettingsSliderRow
            key={control.label}
            label={t(control.labelKey)}
            max={control.max}
            value={cardSettings[control.key] || 0}
            onChange={(value) => setCardSetting((prev) => ({ ...prev, [control.key]: value }))}
          />}
        </Fragment>
      ))}
    <SettingSelectRow
      label={t('layoutTheme')}
      value={themeId}
      options={['default', 'barbie', 'solarized', 'monokai']}
      onChange={(value) => {
        setSetting((prev) => ({
          ...prev,
          themeId: value,
        }))
      }}
    />
  </Stack>
}
