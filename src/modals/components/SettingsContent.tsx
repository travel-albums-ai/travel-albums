import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import useRegisterTool from '@/hooks/useRegisterTool';
import SidebarCoreButton from '@/layout/components/SidebarCoreButton';
import BYOKPopover from '@/settings/BYOKPopover';
import DrawersPopover from '@/settings/DrawersPopover';
import FilterPhotosPopover from '@/settings/FilterPhotosPopover';
import IndexerPopover from '@/settings/IndexerPopover';
import LayoutPopover from '@/settings/LayoutPopover';
import SectionsPopover from '@/settings/SectionsPopover';
import SettingsPopover from '@/settings/SettingsPopover';
import TagsPopover from '@/settings/TagsPopover';
import { Box, Typography } from '@mui/material';
import { Group, Key, ListFilter, PanelsRightBottom, Server, Shapes, Tag } from 'lucide-react';
import { cloneElement, Fragment, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function SettingsContent() {
  const { t } = useTranslation()
  const { setSetting } = useSettings()
  const activeSettingsTab = useSettingsStoreSelector((state) => state.activeSettingsTab);

  useRegisterTool(
    {
      name: 'toggle_settings_section',
      description:
        'Toggle the active settings section.',
      inputSchema: {
        type: 'object',
        properties: {
          mode: {
            type: 'string',
            enum: ['layout', 'indexer', 'sections', 'demo', 'tags'],
            description: 'Settings section to switch to.',
          },
        },
      },
      execute: async ({ mode }: { mode: 'layout' | 'indexer' | 'sections' | 'demo' | 'tags' }) => {
        setSetting((prev) => ({
          ...prev,
          activeSettingsTab: mode,
        }));

        return {
          content: [
            {
              type: 'text',
              text: `Settings section switched to ${mode}.`,
            },
          ],
        };
      },
    },
    [activeSettingsTab, setSetting]
  );

  const sections = useMemo(() => [
    { key: 'layout', title: t('layout'), component: <LayoutPopover />, icon: <Shapes size={16} />, guidance: t('layoutGuidance') },
    { key: 'filterPhotos', title: t('filterPhotos'), component: <FilterPhotosPopover />, icon: <ListFilter size={16} />, guidance: t('filterPhotosGuidance') },
    { key: 'drawers', title: 'Drawers', component: <DrawersPopover />, icon: <PanelsRightBottom size={16} />, guidance: 'Hide/Show various drawers in the application' },
    { key: 'byok', title: 'BYOK', component: <BYOKPopover />, icon: <Key size={16} />, guidance: 'Set BYOK keys to use AI enhanced features' },
    { key: 'indexer', title: t('indexer'), component: <IndexerPopover />, icon: <Server size={16} />, guidance: t('indexerGuidance') },
    { key: 'sections', title: t('sections'), component: <SectionsPopover />, icon:  <Group size={16} />, guidance: t('sectionsGuidance') },
    { key: 'demo', title: t('demo'), component: <SettingsPopover />, icon:  <Group size={16} />, guidance: t('demoGuidance') },
    { key: 'tags', title: t('tags'), component: <TagsPopover />, icon:  <Tag size={16} />, guidance: t('tagsGuidance') },
  ], [t])

  useEffect(() => {
    if (!activeSettingsTab && sections.length > 0) {
      setSetting((prev) => ({ ...prev, activeSettingsTab: sections[0].key }))

    }
  }, [activeSettingsTab, sections, setSetting]);

  return (<>
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: '0 0 250px' }}>
        {sections.map(section => (
          <SidebarCoreButton
            key={section.key}
            title={section.title}
            icon={section.icon}
            isActive={activeSettingsTab === section.key}
            onClick={() => setSetting((prev) => ({ ...prev, activeSettingsTab: section.key }))}
            noCounts={true}
          />
        ))}

      </Box>

      <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
        {sections
          .filter(section => section.key === activeSettingsTab)
          .map(section => (<Fragment key={section.key}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: 'space-between' }}>
              {section.icon && cloneElement(section.icon, { size: 24 })}
              <Typography variant="h5" sx={{ lineHeight: 1, flex: 1 }}> {section.title}</Typography>
              { section.guidance && <Typography variant="body2" color="textDisabled">{section.guidance}</Typography> }
            </Box>
            <Box key={section.keys} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', p: 2, borderRadius: 2 }}>
              {section.component}
            </Box>
          </Fragment>))}
      </Box>
    </Box>
  </>)
}
