import { useFetch_Config } from '@/hooks/remote/useFetch_Config';
import usePost_Config from '@/hooks/usePost_Config';
import SettingFieldRow from '@/modals/settings/components/SettingFieldRow';
import { Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ConfigSettings() {
  const { data } = useFetch_Config()
  const { mutate } = usePost_Config()
  const { t } = useTranslation()

  if (!data) {
    return <div>{t('loading')}</div>
  }

  return (
    <div>
      <Alert>
        {t('sampleFormat')}
      </Alert>
      {Object.entries(data)
        .filter(([key]) => !['projectRoot', 'scriptsDir', 'NDJSON_PATH', 'PORT', 'THUMBNAIL_SIZE', 'THUMBNAIL_QUALITY'].includes(key))
        .map(([key, value]) => (
          <SettingFieldRow key={key} label={key} value={value} onChange={(newValue) => mutate({ [key]: newValue })} />
        ))}
      <Alert severity="info">
        Find the indexer ready in the status bar. Turn it on and let it discover your entire library
      </Alert>
    </div>
  )
}
