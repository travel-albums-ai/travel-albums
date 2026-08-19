import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

type AdjustmentsStore = {
  showGenetic: boolean;
};

const defaults: AdjustmentsStore = {
  showGenetic: false,
};

const {
  Provider: AdjustmentsProvider,
  useSetStore,
  useStoreSelector: useAdjustmentsStoreSelector,
} = createLocalStorageStoreNg<AdjustmentsStore>(defaults, 'adjustmentsStore');

export const useAdjustments = () => {
  const setSetting = useSetStore();

  return {
    setSetting,
  };
};

export { AdjustmentsProvider, useAdjustmentsStoreSelector };
