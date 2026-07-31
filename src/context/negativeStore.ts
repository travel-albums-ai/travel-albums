import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

type NegativeStore = {
  showGenetic: boolean;
};

const defaults: NegativeStore = {
  showGenetic: false,
};

const {
  Provider: NegativeProvider,
  useSetStore,
  useStoreSelector: useNegativeStoreSelector,
} = createLocalStorageStoreNg<NegativeStore>(defaults, 'negativeStore');

export const useNegative = () => {
  const setSetting = useSetStore();

  return {
    setSetting,
  };
};

export { NegativeProvider, useNegativeStoreSelector };
