import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataView from '@/components/WebMCPDataView';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { LayoutDashboard, LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ThumbnailCoverToggle() {
  const { setSetting } = useSettings()
  const thumbnailFormat = useSettingsStoreSelector((state) => state.thumbnailFormat)
  const { t } = useTranslation()

  return <>
    <WebMCPDataView
      name="check_thumbnail_format"
      description="Get current thumbnail format"
      execute={async () => ({
        content: [{
          type: 'text',
          text: `Thumbnail format is currently ${thumbnailFormat}.`
        }]
      })}
    />

    <GenericToggleButtonGroup items={[
      {
        value: 'cover',
        tooltip: t('thumbnailCover'),
        onClick: () => setSetting((prev) => ({...prev, thumbnailFormat: 'cover'})),
        icon: <LayoutGrid size={20} />,
        selected: thumbnailFormat === 'cover'
      },
      {
        value: 'contain',
        tooltip: t('thumbnailContain'),
        onClick: () => setSetting((prev) => ({...prev, thumbnailFormat: 'contain'})),
        icon: <LayoutDashboard size={20} />,
        selected: thumbnailFormat === 'contain'
      }
    ] satisfies GenericToggleButtonProps[]} />
  </>;
}
