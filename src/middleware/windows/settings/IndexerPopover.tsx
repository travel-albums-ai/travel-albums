import IndexerContent from '@/components/IndexerContent';
import IndexerSettings from '@/components/IndexerSettings';
import SettingsSection from '@/components/SettingsSection';
import { DatabaseSearch } from 'lucide-react';

export default function IndexerPopover() {

  return <>
    <IndexerSettings />

    <SettingsSection title="Indexer" icon={<DatabaseSearch />}>
      <IndexerContent />
    </SettingsSection>
  </>
}
