import GenericPanel from '@/components/generics/GenericPanel';
import PopoverButton from '@/components/PopoverButton';
import ElementLabels from '@/drawers/components/ElementLabels';
import GoogleVisionLabeler from '@/drawers/components/GoogleVisionLabeler';
import Labeler from '@/drawers/labeler/Labeler';
import BYOKGoogleVisionField from '@/toggle/BYOKGoogleVisionField';
import { Box } from '@mui/material';
import { List } from 'lucide-react';

export default function LabelerDrawer() {

  return (
    <GenericPanel id="sidebar" toolbar={<>
      <BYOKGoogleVisionField />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between'}}>
        <GoogleVisionLabeler />
        <PopoverButton icon={<List size={16} />} label="Labels">
          <Box sx={{ p: 1 }}>
            <ElementLabels />
          </Box>
        </PopoverButton>
      </Box>
    </>}>
      <Labeler />
    </GenericPanel>
  )
}
