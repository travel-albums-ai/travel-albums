import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import FilterPhotosPopover from '@/settings/FilterPhotosPopover';
import IndexerPopover from '@/settings/IndexerPopover';
import LayoutPopover from '@/settings/LayoutPopover';
import SectionsPopover from '@/settings/SectionsPopover';
import SettingsPopover from '@/settings/SettingsPopover';
import TagsPopover from '@/settings/TagsPopover';
import { Filter, Group, Server, Shapes, Tag } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function CopyrightPage() {
  const { t } = useTranslation()
  const { setSetting } = useSettings()
  const activeSettingsTab = useSettingsStoreSelector((state) => state.activeSettingsTab);

  const sections = useMemo(() => [
    { key: 'filterPhotos', title: t('filterPhotos'), component: <FilterPhotosPopover />, icon: <Filter size={16} />, guidance: t('filterPhotosGuidance') },
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
    List of cities of the world and their respective countries. This data is used for various purposes, including travel planning, geographic analysis, and cultural studies. The list includes major cities, capitals, and other significant urban areas across different continents.

    Copyright
    https://github.com/lutangar/cities.json
    https://www.geonames.org/datasources/
    https://download.geonames.org/export/dump/
    https://github.com/lutangar/cities.json?tab=CC-BY-4.0-1-ov-file
  </>)
}
