import GeneralRegistryToolRenderer from '@/components/registry/GeneralRegistryToolRenderer';
import { useAlbumPhotoCard, useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useSettings } from '@/context/settingsStore';
import SettingsComponentRow from '@/windows/settings/components/SettingsComponentRow';
import SettingsSliderRow from '@/windows/settings/components/SettingsSliderRow';
import SettingToggleRow from '@/windows/settings/components/SettingToggleRow';
import { Box, Stack } from '@mui/material';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const toggleControlsPreview = [
  { key: 'width', labelKey: 'layoutWidth', type: 'number', max: 500 },
  { key: 'height', labelKey: 'layoutHeight', type: 'number', max: 500 },
  { key: 'showDescription', labelKey: 'layoutShowDescription', type: 'boolean' },
  { key: 'showTags', labelKey: 'layoutShowTags', type: 'boolean' },
  { key: 'showDate', labelKey: 'layoutShowDate', type: 'boolean' },
  { key: 'showLocation', labelKey: 'layoutShowLocation', type: 'boolean' },
  { key: 'showFileName', labelKey: 'layoutShowFileName', type: 'boolean' },
] as const

const toggleControlsScroller = [
  { key: 'scrollerGroupedByBatches', labelKey: 'layoutScrollerGroupedByBatches', type: 'toolbar', toolbarComponentId: "scroller-grouping-toggle" },
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
          {control.type === 'toolbar' && <SettingsComponentRow label={t(control.labelKey)}>
            <GeneralRegistryToolRenderer toolId={control.toolbarComponentId} />
          </SettingsComponentRow>}
        </Fragment>
      ))}

  </Stack>
}
