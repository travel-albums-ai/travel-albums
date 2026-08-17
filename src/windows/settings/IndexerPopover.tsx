import IndexerContent from '@/components/IndexerContent';
import { useFetch_Config } from '@/hooks/remote/useFetch_Config';
import usePost_Config from '@/hooks/usePost_Config';
import SettingsSection from '@/windows/components/SettingsSection';
import SettingFieldRow from '@/windows/settings/components/SettingFieldRow';
import { Code, File, Folder } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const areFiles = ['JSON_PATH']

export default function IndexerPopover() {
  const { data } = useFetch_Config()
  const { mutate } = usePost_Config()
  const { t } = useTranslation()

  return <>
    <SettingsSection title="Path to cache and photos archive" icon={<Code />}>
      <>
        {data ? Object.entries(data)
          .filter(([key]) => !['projectRoot', 'scriptsDir', 'NDJSON_PATH', 'PORT', 'THUMBNAIL_SIZE', 'THUMBNAIL_QUALITY'].includes(key))
          .map(([key, value]) => (
            <SettingFieldRow
              icon={areFiles.includes(key) ? <File /> : <Folder />}
              key={key}
              label={key}
              value={value}
              onChange={(newValue) => mutate({ [key]: newValue })}
            />
          )) : <div>{t('loading')}</div>}
      </>
    </SettingsSection>

    <SettingsSection title="Path to cache and photos archive" icon={<Code />}>
      <IndexerContent />
    </SettingsSection>
    {/* {content} */}
  </>
}
