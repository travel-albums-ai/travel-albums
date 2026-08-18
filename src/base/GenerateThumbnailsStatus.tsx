import IndexerContent from '@/components/IndexerContent';
import IndexerSettings from '@/components/IndexerSettings';
import PopoverButton from '@/components/PopoverButton';
import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { Box, Typography } from '@mui/material';
import { DatabaseSearch } from 'lucide-react';

export default function GenerateThumbnailsStatus() {
  const indexing = useSettingsStoreSelector((state) => state.indexing);

  return (
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

      <Box sx={{ p: 1}}>
        <IndexerSettings />
        <GeneralRegistryToolbar group={'indexer'} />
      </Box>
      <IndexerContent />
    </PopoverButton>
  );
}
