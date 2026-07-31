import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

const sidebarSections = [
  'peopleAndPets',
  'cities',
  'nowAndThen',
  'folders',
  'trips',
  'places',
  'viewed',
  'timeline',
  'mostLiked',
  'mostCommented',
  'favorites',
  'ignored',
  'private',
  'selected',
  'countries',
  'tags',
  'labels',
] as const;

type SidebarSection = typeof sidebarSections[number];

type SidebarStore = {
  sortBy: 'name' | 'count' | 'original';
  sortAsc: boolean;
  sidebarOpen: Record<SidebarSection, boolean>;
};

const defaults: SidebarStore = {
  sortBy: 'name',
  sortAsc: true,
  sidebarOpen: Object.fromEntries(sidebarSections.map(section => [section, false])) as Record<SidebarSection, boolean>,
};

const {
  Provider: SidebarProvider,
  useSetStore,
  useStoreSelector: useSidebarStoreSelector,
} = createLocalStorageStoreNg<SidebarStore>(defaults, 'sidebarStore');

export const useSidebar = () => {
  const setSetting = useSetStore();

  return {
    setSetting,
    setSidebarOpen: (section: SidebarSection, value: boolean) => {
      setSetting(prev => ({
        ...prev,
        sidebarOpen: {
          ...prev.sidebarOpen,
          [section]: value,
        },
      }))
    }
  };
};

export { SidebarProvider, useSidebarStoreSelector };
