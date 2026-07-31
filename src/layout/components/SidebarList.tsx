import { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { useSidebarStoreSelector } from '@/context/sidebarStore';

import { sectionIcons } from '@/icons/IconsIndex';

import { useSettingsStoreSelector } from '@/context/settingsStore';
import SidebarSectionHeader from '@/layout/components/SidebarSectionHeader';
import SidebarSectionItem from '@/layout/components/SidebarSectionItem';

type Section = ReturnType<typeof useSections_GLOBAL>[number];

type SidebarRow =
  | {
      type: 'header';
      key: string;
      section: Section;
    }
  | {
      type: 'item';
      key: string;
      section: Section;
      item: Section['data'][number];
    };

export default function SidebarList() {
  const sections = useSections_GLOBAL();
  const sidebarOpen = useSidebarStoreSelector((s) => s.sidebarOpen);
  const modules = useSettingsStoreSelector((s) => s.modules);

  const rows = useMemo<SidebarRow[]>(() => {
    const result: SidebarRow[] = [];

    for (const section of sections) {
      // if (!section.data?.length) continue;

      if(modules && !modules[section.type as keyof typeof modules]) continue;

      result.push({
        type: 'header',
        key: `header-${section.type}`,
        section,
      });

      if (!sidebarOpen?.[section.type as keyof typeof sidebarOpen]) continue;

      for (const item of section.data) {
        result.push({
          type: 'item',
          key: `${section.type}-${item.name}`,
          section,
          item,
        });
      }
    }

    return result;
  }, [sections, sidebarOpen, modules]);

  return (
    <Virtuoso
      data={rows}
      computeItemKey={(_, row) => row.key}
      itemContent={(_, row) => {
        const icon = sectionIcons[row.section.type];

        if (row.type === 'header') {
          return (
            <SidebarSectionHeader
              title={row.section.title}
              icon={icon}
              data={row.section.data}
              type={row.section.type}
            />
          );
        }

        return (
          <SidebarSectionItem
            section={row.section}
            item={row.item}
            type={row.section.type}
            icon={icon}
          />
        );
      }}
    />
  );
}
