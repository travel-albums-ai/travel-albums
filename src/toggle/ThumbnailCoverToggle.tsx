import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { GenericToggleButtonProps } from '@/toggle/shared/GenericToggleButton';
import GenericToggleButtonGroup from '@/toggle/shared/GenericToggleButtonGroup';
import { LayoutDashboard, LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ThumbnailCoverToggle() {
  const { setSetting } = useSettings()
  const thumbnailFormat = useSettingsStoreSelector((state) => state.thumbnailFormat)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
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
  ] satisfies GenericToggleButtonProps[]} asGroup />
}
