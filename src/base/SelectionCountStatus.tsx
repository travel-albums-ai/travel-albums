import SolidChip from '@/components/SolidChip';
import { useSelectedStoreSelector } from '@/context/selectedStore';
import { Tooltip } from '@mui/material';
import { CheckCheck } from 'lucide-react';

export default function SelectionCountStatus() {
  const photos = useSelectedStoreSelector(s => s.photos)

  if (!photos || photos.length === 0) {
    return null
  }

  return (<>
    <Tooltip title={`Selected photos: ${photos.length}`} arrow>
      <SolidChip count={photos.length} label="selected" icon={<CheckCheck size={16} />} />
    </Tooltip>
  </>)
}
