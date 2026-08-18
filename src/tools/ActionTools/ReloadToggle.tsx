import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
import { useNotifications } from '@/context/notificationsStore';
import { useFetch_TakeoutMetadata } from '@/hooks/remote/useFetch_TakeoutMetadata';
import { Database, RotateCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ReloadToggle() {
  const { t } = useTranslation()
  const { clearCache } = useFetch_TakeoutMetadata();
  const { addNotification } = useNotifications()

  return <>
    <WebMCPDataRun
      name="reload_toggle"
      description="Reload the page or clear the cache."
      inputSchema={{
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['refresh', 'clear_cache'],
            description: 'Reload or clear cache action to perform',
          },
        },
        additionalProperties: false,
      }}
      execute={async ({ action }: { action?: 'refresh' | 'clear_cache' }) => {
        if (action === 'refresh') {
          window.location.reload();
        } else if (action === 'clear_cache') {
          clearCache()
          addNotification("Cache Cleared","The local cache has been successfully cleared. A fresh fetch from the server will be performed on the next data request.");
        }

        return { action };
      }}
    />

    <GenericToggleButtonGroup items={[
      {
        webMcp: true,
        icon: <RotateCw />,
        onClick: () => window.location.reload(),
        tooltip: t('navRefresh')
      },
      {
        icon: <Database />,
        onClick: () => {
          clearCache()
          addNotification("Cache Cleared","The local cache has been successfully cleared. A fresh fetch from the server will be performed on the next data request.");
        },
        tooltip: "Reload data from server"
      },
    ] satisfies GenericToggleButtonProps[]} variant="standard" />
  </>;
}
