import IndexerContent from '@/components/IndexerContent';
import IndexerSettings from '@/components/IndexerSettings';
import { useFetch_Config } from '@/hooks/remote/useFetch_Config';
import usePost_Config from '@/hooks/remote/useFetch_PostConfig';
import SettingsSection from '@/windows/components/SettingsSection';
import { DatabaseSearch } from 'lucide-react';
import { useState } from 'react';

export default function IndexerPopover() {
  const { data } = useFetch_Config()
  const { mutate } = usePost_Config()

  const [newRoot, setNewRoot] = useState('')
  const [targetRoot, setTargetRoot] = useState(data?.TARGET_ROOT || '')

  const deleteRoot = (root: string) => {
    const newRoots = data?.TAKEOUT_ROOTS?.filter((r: string) => r !== root) || []
    mutate({ TAKEOUT_ROOTS: newRoots })
  }

  const addRoot = (root: string) => {
    const newRoots = [...(data?.TAKEOUT_ROOTS || []), root]
    mutate({ TAKEOUT_ROOTS: newRoots })
  }

  const updateTargetRoot = (root: string) => {
    mutate({ TARGET_ROOT: root })
  }

  return <>


    <IndexerSettings />

    <SettingsSection title="Indexer" icon={<DatabaseSearch />}>
      <IndexerContent />
    </SettingsSection>
  </>
}
