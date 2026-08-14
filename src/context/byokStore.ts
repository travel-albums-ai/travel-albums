import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

type Persona = {
  name: string;
  description: string;
}

type BYOKStore = {
  byokGoogleVisionKey?: string,
  byokOpenAIKey?: string,

  mainPersona: Persona,

  additionalPersonas?: Persona[],
}

const defaults: BYOKStore = {
  byokGoogleVisionKey: '',
  byokOpenAIKey: '',
  mainPersona: {
    name: '',
    description: '',
  },
  additionalPersonas: [],
}

const {
  Provider: BYOKProvider,
  useStore,
  useSetStore,
  useStoreSelector: useBYOKStoreSelector
} = createLocalStorageStoreNg<BYOKStore>(defaults, 'byokStore')

export const useBYOK = () => {
  const store = useStore()
  const setSetting = useSetStore()

  return {
    setSetting,
    setMainPersona: (persona: Persona) => {
      setSetting(prev => ({
        ...prev,
        mainPersona: persona,
      }))
    },
    addAdditionalPersona: (persona: Persona) => {
      setSetting(prev => ({
        ...prev,
        additionalPersonas: [...(prev.additionalPersonas || []), persona],
      }))
    },
    updateAdditionalPersona: (index: number, persona: Persona) => {
      setSetting(prev => {
        const updatedPersonas = [...(prev.additionalPersonas || [])]
        updatedPersonas[index] = persona
        return {
          ...prev,
          additionalPersonas: updatedPersonas,
        }
      })
    },
    removeAdditionalPersona: (index: number) => {
      setSetting(prev => {
        const updatedPersonas = [...(prev.additionalPersonas || [])]
        updatedPersonas.splice(index, 1)
        return {
          ...prev,
          additionalPersonas: updatedPersonas,
        }
      })
    },
    getMainPersona: () => store.mainPersona,
    getAdditionalPersonas: () => store.additionalPersonas || [],
    getAllPersonas: () => {
      return [store.mainPersona, ...(store.additionalPersonas || [])]
    }
  }
}

export { BYOKProvider, useBYOKStoreSelector };
