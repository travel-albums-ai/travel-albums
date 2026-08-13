import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

type BYOKStore = {
  byokGoogleVisionKey?: string,
  byokOpenAIKey?: string,
}

const defaults: BYOKStore = {
  byokGoogleVisionKey: '',
  byokOpenAIKey: '',
}

const {
  Provider: BYOKProvider,
  useSetStore,
  useStoreSelector: useBYOKStoreSelector
} = createLocalStorageStoreNg<BYOKStore>(defaults, 'byokStore')

export const useBYOK = () => {
  const setSetting = useSetStore()

  return {
    setSetting,
  }
}

export { BYOKProvider, useBYOKStoreSelector };
