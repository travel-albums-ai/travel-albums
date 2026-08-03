import PopoverButton from '@/components/PopoverButton';
import ElementLabels from '@/drawers/components/ElementLabels';
import { Box } from '@mui/material';
import { List } from 'lucide-react';

export default function LabelsCataloguePopover() {
  return  <PopoverButton icon={<List size={16} />} label="Labels">
    <Box sx={{ p: 1 }}>
      <ElementLabels />
    </Box>
  </PopoverButton>
}

export const meta = {
  id: "labels-catalogue-popover",
  toolbar: [
    {
      id: 'labeler-drawer',
      side: 'right',
      priority: 500
    }
  ],
  component: LabelsCataloguePopover,
};
