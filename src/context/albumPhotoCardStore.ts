import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

type AlbumPhotoCardStore = {
  width: number
  height: number
  borderRadius: number
  gap: number
  showViews: boolean
  showTimeOfDay: boolean
  showPersistentDetails: boolean
  showBatch?: boolean
}

const defaults: AlbumPhotoCardStore = {
  width: 300,
  height: 300,
  borderRadius: 2,
  gap: 1,
  showViews: true,
  showTimeOfDay: false,
  showPersistentDetails: false,
  showBatch: false,
}

const {
  Provider: AlbumPhotoCardProvider,
  useSetStore,
  useStoreSelector: useAlbumPhotoCardStoreSelector
} = createLocalStorageStoreNg<AlbumPhotoCardStore>(defaults, 'AlbumPhotoCardStore')

export const useAlbumPhotoCard = () => {
  const setSetting = useSetStore()

  return { setSetting }
}

export { AlbumPhotoCardProvider, useAlbumPhotoCardStoreSelector };
