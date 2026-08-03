import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
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
  ] satisfies GenericToggleButtonProps[]} />
}

export const meta = {
  id: "thumbnailCover",
  toolbar: [
    {
      id: 'selected-photos-drawer',
      side: 'right',
      priority: 100
    },
    {
      id: 'scroller-drawer',
      side: 'right',
      priority: 200
    }
  ],
  component: ThumbnailCoverToggle,
};
