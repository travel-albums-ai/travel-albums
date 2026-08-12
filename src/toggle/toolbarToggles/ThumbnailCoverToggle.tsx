import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { LayoutDashboard, LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ThumbnailCoverToggle() {
  const { setSetting } = useSettings()
  const thumbnailFormat = useSettingsStoreSelector((state) => state.thumbnailFormat)
  const { t } = useTranslation()

  const handleThumbnailFormatChange = (newFormat: 'cover' | 'contain') => {
    setSetting((prev) => ({ ...prev, thumbnailFormat: newFormat }));
  }

  return <>
    <WebMCPDataRun
      name="toggle_thumbnail_format"
      description="Toggle the thumbnail format of photos."
      inputSchema={{
        type: 'object',
        properties: {
          thumbnailFormat: {
            type: 'string',
            enum: ['cover', 'contain'],
            description: 'The thumbnail format of photos.',
          },
        },
        additionalProperties: false,
      }}
      execute={async ({ thumbnailFormat }: { thumbnailFormat?: 'cover' | 'contain' }) => {
        if (thumbnailFormat) {
          handleThumbnailFormatChange(thumbnailFormat);
        }

        return { thumbnailFormat: thumbnailFormat ?? 'cover' };
      }}
    />

    <GenericToggleButtonGroup items={[
      {
        value: 'cover',
        tooltip: t('thumbnailCover'),
        onClick: () => handleThumbnailFormatChange('cover'),
        icon: <LayoutGrid size={20} />,
        selected: thumbnailFormat === 'cover'
      },
      {
        value: 'contain',
        tooltip: t('thumbnailContain'),
        onClick: () => handleThumbnailFormatChange('contain'),
        icon: <LayoutDashboard size={20} />,
        selected: thumbnailFormat === 'contain'
      }
    ] satisfies GenericToggleButtonProps[]} />
  </>;
}
