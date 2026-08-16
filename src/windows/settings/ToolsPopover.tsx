import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { toolRegistry } from '@/toolRegistry';
import SettingsSection from '@/windows/components/SettingsSection';
import SettingSelectRow from '@/windows/settings/components/SettingSelectRow';
import { Box, Typography } from '@mui/material';
import { Bug, PaintBucket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ToolsPopover() {
  const tools = toolRegistry.all()
  const themeId = useSettingsStoreSelector((state) => state.themeId)
  const toolIds = [...new Set(tools.map((tool) => tool.tool?.flatMap((item) => item.id)).flat().filter(Boolean) as string[])]
  const { t } = useTranslation()
  const { setSetting } = useSettings()

  return <>
    <SettingsSection title={t('layoutTheme')} icon={<PaintBucket />}>
      <SettingSelectRow
        label={t('layoutTheme')}
        value={themeId}
        options={['default', 'barbie', 'solarized', 'monokai']}
        onChange={(value) => {
          setSetting((prev) => ({
            ...prev,
            themeId: value,
          }))
        }}
      />
    </SettingsSection>

    <SettingsSection title="Debug Tools" icon={<Bug />}>
      {toolIds.map((toolId) => {
        const tool = tools.find((tool) => tool.tool?.some((item) => item.id === toolId))
        if (!tool) {
          return null
        }

        return <Box key={toolId} sx={{ display: 'flex', pointerEvents: 'none', flexDirection: 'column', alignItems: 'flex-start', gap: 1, p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>
          <Typography variant="caption" color="textSecondary">{toolId}</Typography>
          <Box sx={{ width: '100%', overflow: 'auto' }}>
            <GeneralRegistryToolbar group={toolId} context={{ sidebarSearchOpen: false }} />
          </Box>
        </Box>
      })}

    </SettingsSection>

  </>
}
