import IndexerContent from '@/components/IndexerContent';
import IndexerRefresh from '@/components/IndexerRefresh';
import IndexerSettings from '@/components/IndexerSettings';
import PopoverButton from '@/components/PopoverButton';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import SettingsSection from '@/windows/components/SettingsSection';
import { Box, Typography } from '@mui/material';
import { Database, DatabaseSearch } from 'lucide-react';

export default function GenerateThumbnailsStatus() {
  const indexing = useSettingsStoreSelector((state) => state.indexing);

  return <>
    <PopoverButton
      id="indexer"
      upsideDown={true}
      width={650}
      label=""
      icon=""
      trigger={<>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <DatabaseSearch size={16} />
          <Typography variant="caption" color="inherit" sx={{ lineHeight: 1 }}>
            {indexing ? 'Indexing...' : 'Indexer'}
          </Typography>
        </Box>
      </>}
      anchorHorizontal="center"
      anchorVertical="top"
      transformHorizontal="center"
      transformVertical="bottom"
    >

      <Box sx={{ p: 2, height: '450px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <IndexerSettings />
      </Box>
      <Box sx={{ p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <SettingsSection title="Indexer" icon={<Database />}>
          <IndexerContent />
        </SettingsSection>
      </Box>

    </PopoverButton>
    <IndexerRefresh />
  </>;
}
