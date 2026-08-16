import { useAlbumPhotoCard, useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useSettings } from '@/context/settingsStore';
import SettingsSliderRow from '@/windows/settings/components/SettingsSliderRow';
import SettingToggleRow from '@/windows/settings/components/SettingToggleRow';
import { Box, Stack } from '@mui/material';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const toggleControlsPreview = [
  { key: 'width', labelKey: 'layoutWidth', value: 'show-width-size', type: 'number', max: 500, group: 'preview' },
  { key: 'height', labelKey: 'layoutHeight', value: 'show-height-size', type: 'number', max: 500, group: 'preview' },
  { key: 'showDescription', labelKey: 'layoutShowDescription', value: 'show-description', type: 'boolean', group: 'preview' },
  { key: 'showTags', labelKey: 'layoutShowTags', value: 'show-tags', type: 'boolean', group: 'preview' },
  { key: 'showDate', labelKey: 'layoutShowDate', value: 'show-date', type: 'boolean', group: 'preview' },
  { key: 'showLocation', labelKey: 'layoutShowLocation', value: 'show-location', type: 'boolean', group: 'preview' },
  { key: 'showFileName', labelKey: 'layoutShowFileName', value: 'show-file-name', type: 'boolean', group: 'preview' },
] as const

const toggleControlsScroller = [
  { key: 'scrollerGroupedByBatches', labelKey: 'layoutScrollerGroupedByBatches', value: 'scroller-grouped-by-batches', type: 'toolbar', toolbarComponentId: "scroller-grouping-toggle" },
] as const

export default function LayoutPopover() {
  const { setSetting: setCardSetting } = useAlbumPhotoCard()
  const { setSetting } = useSettings()
  const cardSettings = useAlbumPhotoCardStoreSelector((state) => state)
  const settings = useSettings((state) => state)
  const { t } = useTranslation()

  return <Stack sx={{ gap: 0.5 }} divider={<Box sx={{ borderBottom: '1px dotted', borderColor: 'divider' }} />} >
    {toggleControlsPreview
      .map((control) => (
        <Fragment key={control.key}>
          {control.type === 'boolean' && <SettingToggleRow
            key={control.key}
            label={t(control.labelKey)}
            selected={cardSettings[control.key]}
            onChange={() => setCardSetting((prev) => ({ ...prev, [control.key]: !cardSettings[control.key] }))}
          />}

          {control.type === 'number' && <SettingsSliderRow
            key={control.key}
            label={t(control.labelKey)}
            max={control.max}
            value={cardSettings[control.key] || 0}
            onChange={(value) => setCardSetting((prev) => ({ ...prev, [control.key]: value }))}
          />}
        </Fragment>
      ))}

    {toggleControlsScroller
      .map((control) => (
        <Fragment key={control.key}>
          {control.type === 'boolean' && <SettingToggleRow
            key={control.key}
            label={t(control.labelKey)}
            selected={settings[control.key]}
            onChange={() => setSetting((prev) => ({ ...prev, [control.key]: !settings[control.key] }))}
          />}

          {control.type === 'number' && <SettingsSliderRow
            key={control.key}
            label={t(control.labelKey)}
            max={control.max}
            value={settings[control.key] || 0}
            onChange={(value) => setSetting((prev) => ({ ...prev, [control.key]: value }))}
          />}
        </Fragment>
      ))}

  </Stack>
}
