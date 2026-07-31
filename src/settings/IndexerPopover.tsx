import { useFetch_Config } from '@/hooks/remote/useFetch_Config';
import usePost_Config from '@/hooks/usePost_Config';
import SettingFieldRow from '@/settings/components/SettingFieldRow';
import { Box, Stack } from '@mui/material';
import { File, Folder } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const areFiles = ['JSON_PATH']

export default function IndexerPopover() {
  const { data } = useFetch_Config()
  const { mutate } = usePost_Config()
  const { t } = useTranslation()

  if (!data) {
    return <div>{t('loading')}</div>
  }

  const content =  <Stack sx={{ gap: 0.5 }} divider={<Box sx={{ borderBottom: '1px dotted', borderColor: 'divider' }} />} >
    {Object.entries(data)
      .filter(([key]) => !['projectRoot', 'scriptsDir', 'NDJSON_PATH', 'PORT', 'THUMBNAIL_SIZE', 'THUMBNAIL_QUALITY'].includes(key))
      .map(([key, value]) => (
        <SettingFieldRow
          icon={areFiles.includes(key) ? <File /> : <Folder />}
          key={key}
          label={key}
          value={value}
          onChange={(newValue) => mutate({ [key]: newValue })}
        />
      ))}
  </Stack>

  return content
}
