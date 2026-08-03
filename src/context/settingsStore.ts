import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';
import { GalleryPhoto } from '@/lib/galleryData';
import type { SupportedLanguage } from '@/lib/i18n';

type SettingsStore = {
  onboarding: boolean,
  indexing: boolean,
  serverOnline: boolean,
  drawerId?: string,
  tutorial: boolean,
  themeMode?: 'light' | 'dark',
  byokGoogleVisionOpen: boolean,
  themeId: string,
  thumbnailFormat: 'cover' | 'contain',

  byokGoogleVisionKey?: string,
  showSidebar: boolean,

  thumbnailGenerator: boolean,
  thumbnailJobId?: string,
  drawerWidth?: number,
  scrollerOriginal: boolean,
  scrollerRows: number,
  scrollerColumns: number,
  scrollerGroupedByBatches: boolean,
  scrollerAutoScroll: boolean,
  mapShowPreview: boolean,
  activeSettingsTab?: string,
  previewPhotoObj?: GalleryPhoto
  focusedPhoto: string
  loading: boolean,
  loadingValue: number | null,
  serverType: 'files' | 'http'
  demoMode: boolean,
  sidebarTerm: string,
  sidebarSearchOpen: boolean,
  showPreviewMap: boolean,

  showMapAll: boolean,
  showSides: boolean,
  showPreviewExif: boolean,
  showPreviewComments: boolean,
  showOtherSidebar: boolean,
  otherSidebar: 'photo' | 'summary' | 'exif' | 'similar',
  selectMode: boolean,
  albumType: 'segmented' | 'perDay' | 'flow' | 'default' | 'globe' | 'labeler' | 'scroller' | 'rows' | 'negative',
  locale: SupportedLanguage,

  isZygote: boolean,
  drawers: {
    sidebar: boolean,
    globe: boolean,
    outlet: boolean,
    preview: boolean,
    adjustments: boolean,
    files: boolean,
    labeler: boolean,
    scroller: boolean,
    rows: boolean,
    calendar: boolean,
    folderHandler: boolean
  }
  modules: {
    peopleAndPets: boolean,
    nowAndThen: boolean,
    folders: boolean,
    trips: boolean,
    places: boolean,
    cities: boolean,
    views: boolean,
    timeline: boolean,
    likes: boolean,
    comments: boolean,
    favorites: boolean,
    ignored: boolean,
    private: boolean,
    selected: boolean,
    countries: boolean,
    tags: boolean,
    labels: boolean
  }
}

const defaults: SettingsStore = {
  onboarding: true,
  indexing: false,
  serverType: 'http',
  sidebarTerm: '',
  serverOnline: true,
  demoMode: false,
  otherSidebar: 'photo',
  thumbnailFormat: 'cover',
  scrollerOriginal: false,
  scrollerRows: 2,
  scrollerColumns: 3,
  scrollerGroupedByBatches: false,
  scrollerAutoScroll: true,
  drawerId: undefined,
  mapShowPreview: false,
  byokGoogleVisionKey: '',
  byokGoogleVisionOpen: false,
  thumbnailGenerator: false,
  thumbnailJobId: undefined,
  showPreviewMap: false,
  showMapAll: false,
  showPreviewExif: false,
  showPreviewComments: false,
  themeMode: 'dark',
  themeId: 'default',
  showSides: true,
  showSidebar: true,
  showOtherSidebar: false,
  sidebarSearchOpen: false,
  tutorial: false,
  loading: false,
  loadingValue: null,
  previewPhotoObj: undefined,
  focusedPhoto: '',
  drawerWidth: 400,
  activeSettingsTab: undefined,
  selectMode: false,
  albumType: 'default',
  locale: 'en',
  isZygote: false,
  drawers: {
    scroller: true,
    globe: true,
    labeler: true,
    outlet: true,
    sidebar: true,
    files: true,
    preview: true,
    adjustments: true,
    rows: true,
    calendar: true,
    folderHandler: true
  },
  modules: {
    peopleAndPets: true,
    nowAndThen: true,
    folders: true,
    trips: true,
    cities: true,
    places: true,
    views: true,
    timeline: true,
    likes: true,
    comments: true,
    favorites: true,
    ignored: true,
    private: true,
    selected: true,
    countries: true,
    tags: true,
    labels: true,
  }
}

const {
  Provider: SettingsProvider,
  useSetStore,
  useStoreSelector: useSettingsStoreSelector
} = createLocalStorageStoreNg<SettingsStore>(defaults, 'settingsStore')

export const useSettings = () => {
  const setSetting = useSetStore()

  return {
    setSetting,
    setModule: (module: keyof SettingsStore['modules'], value: boolean) => {
      setSetting(prev => ({
        ...prev,
        modules: {
          ...prev.modules,
          [module]: value,
        },
      }))
    },
    setDrawer: (drawer: keyof SettingsStore['drawers'], value: boolean) => {
      setSetting(prev => ({
        ...prev,
        drawers: {
          ...prev.drawers,
          [drawer]: value,
        },
      }))
    },
    setPreviewPhotoObj: (photo: GalleryPhoto | undefined) => {
      setSetting(prev => ({
        ...prev,
        previewPhotoObj: photo,
      }))
    },
    setFocusedPhoto: (photoId: string) => {
      setSetting(prev => ({
        ...prev,
        focusedPhoto: photoId,
      }))
    },
  }
}

export { SettingsProvider, useSettingsStoreSelector };
