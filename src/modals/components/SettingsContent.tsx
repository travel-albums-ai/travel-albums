import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SidebarCoreButton from '@/layout/components/SidebarCoreButton';
import IndexerPopover from '@/settings/IndexerPopover';
import LayoutPopover from '@/settings/LayoutPopover';
import SectionsPopover from '@/settings/SectionsPopover';
import SettingsPopover from '@/settings/SettingsPopover';
import TagsPopover from '@/settings/TagsPopover';
import { Box, Typography } from '@mui/material';
import { Group, Server, Shapes, Tag } from 'lucide-react';
import { cloneElement, Fragment, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function SettingsContent() {
  const { t } = useTranslation()
  const { setSetting } = useSettings()
  const activeSettingsTab = useSettingsStoreSelector((state) => state.activeSettingsTab);

  const sections = useMemo(() => [
    { key: 'layout', title: t('layout'), component: <LayoutPopover />, icon: <Shapes size={16} />, guidance: t('layoutGuidance') },
    { key: 'indexer', title: t('indexer'), component: <IndexerPopover />, icon: <Server size={16} />, guidance: t('indexerGuidance') },
    { key: 'sections', title: t('sections'), component: <SectionsPopover />, icon:  <Group size={16} />, guidance: t('sectionsGuidance') },
    { key: 'demo', title: t('demo'), component: <SettingsPopover />, icon:  <Group size={16} />, guidance: t('demoGuidance') },
    { key: 'tags', title: t('tags'), component: <TagsPopover />, icon:  <Tag size={16} />, guidance: t('tagsGuidance') },
  ], [t])

  useEffect(() => {
    if (!activeSettingsTab && sections.length > 0) {
      setSetting((prev) => ({ ...prev, activeSettingsTab: sections[0].title }))

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
