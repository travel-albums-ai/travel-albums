import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSidebar, useSidebarStoreSelector } from '@/context/sidebarStore';
import SettingSelectRow from '@/settings/components/SettingSelectRow';
import { ArrowDown01Icon, ArrowUp01Icon, EllipsisVertical } from 'lucide-react';

export default function SortSectionsToggle() {
  const { setSetting } = useSidebar()
  const { sortBy, sortAsc } = useSidebarStoreSelector((state) => state)

  return <GenericToggleButtonGroup id="sort-sections-toggle"
    items={[
      {
        value: true,
        tooltip: 'Ascending',
        icon: <ArrowDown01Icon size={20} />,
        onClick: () => setSetting((prev) => ({ ...prev, sortAsc: true })),
        selected: sortAsc === true,
        disabled: sortBy === 'original',
      },
      {
        value: false,
        tooltip: 'Descending',
        icon: <ArrowUp01Icon size={20} />,
        onClick: () => setSetting((prev) => ({ ...prev, sortAsc: false })),
        selected: sortAsc === false,
        disabled: sortBy === 'original',
      },
      {
        tooltip: 'Open sections settings',
        icon: <EllipsisVertical />,
        popover: <>
          <SettingSelectRow
            label=""
            value={sortBy}
            options={['count', 'name', 'original']}
            onChange={(value) => setSetting((prev) => ({ ...prev, sortBy: value as any }))}
          />
        </>,
      },
    ] as GenericToggleButtonProps[] satisfies GenericToggleButtonProps[]}
    asGroup />
}
