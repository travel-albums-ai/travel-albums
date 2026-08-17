import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
import { useNotifications } from '@/context/notificationsStore';
import { useFetch_TakeoutMetadata } from '@/hooks/remote/useFetch_TakeoutMetadata';
import { ArrowLeft, ArrowRight, Database, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NavigationToggle() {
  const { t } = useTranslation()
  const { clearCache } = useFetch_TakeoutMetadata();
  const { addNotification } = useNotifications()

  return <>
    <WebMCPDataRun
      name="navigate_back_forward_refresh"
      description="Navigate back, forward, or refresh the page."
      inputSchema={{
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['back', 'forward', 'refresh'],
            description: 'Navigation action to perform',
          },
        },
        additionalProperties: false,
      }}
      execute={async ({ action }: { action?: 'back' | 'forward' | 'refresh' }) => {
        if (action === 'back') {
          window.history.back();
        } else if (action === 'forward') {
          window.history.forward();
        } else if (action === 'refresh') {
          window.location.reload();
        }

        return { action };
      }}
    />

    <GenericToggleButtonGroup items={[
      {
        webMcp: true,
        icon: <ArrowLeft />,
        onClick: () => window.history.back(),
        tooltip: t('navBack')
      },
      {
        webMcp: true,
        icon: <ArrowRight />,
        onClick: () => window.history.forward(),
        tooltip: t('navForward')
      },
      {
        webMcp: true,
        icon: <RefreshCw />,
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
