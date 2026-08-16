import SolidChip from '@/components/SolidChip';
import { useSelectedStoreSelector } from '@/context/selectedStore';
import { Tooltip } from '@mui/material';
import { CheckCheck } from 'lucide-react';

export default function SectionCountStatus() {
  const photos = useSelectedStoreSelector(s => s.photos)

  return (<>
    <Tooltip title={`Selected photos: ${photos.length}`} arrow>
      <SolidChip count={photos.length} label="selected" icon={<CheckCheck size={16} />} />
    </Tooltip>
  </>)
}
