import SettingsSection from '@/components/SettingsSection';
import { useFetch_Config } from '@/hooks/remote/useFetch_Config';
import usePost_Config from '@/hooks/remote/useFetch_PostConfig';
import SettingsSliderRow from '@/middleware/windows/settings/components/SettingsSliderRow';
import { t } from 'i18next';
import { Turtle } from 'lucide-react';
import { Fragment } from 'react';

const groups = [

  {
    title: "Performance",
    controls: [
      { key: 'CONCURRENCY', labelKey: 'CONCURRENCY', type: 'number', max: 32 },
      { key: "IMAGE_CONCURRENCY", labelKey: 'IMAGE_CONCURRENCY', type: 'number', max: 32 },
      { key: 'THUMBNAIL_SIZE', labelKey: 'THUMBNAIL_SIZE', type: 'number', max: 960 },
      { key: 'THUMBNAIL_QUALITY', labelKey: 'THUMBNAIL_QUALITY', type: 'number', max: 100 }
    ],
    icon: <Turtle />,
  },
]


export default function IndexerPerformancePopover() {
  const { data } = useFetch_Config();
  const { mutate } = usePost_Config();

  const updateSetting = (key: string, value: number) => {
    mutate({ [key]: value });
  }

  return <>
    {groups.map((group) => (
      <SettingsSection key={group.title} title={group.title} icon={group.icon} >
        {group.controls
          .map((control) => (
            <Fragment key={control.key}>
              {control.type === 'number' && <SettingsSliderRow
                label={t(control.labelKey)}
                max={control.max}
                value={data?.[control.key] || 0}
                onChange={(value) => updateSetting(control.key, value)}
              />}
            </Fragment>
          ))}
      </SettingsSection>
    ))}
  </>
}
