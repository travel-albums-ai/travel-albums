import PopoverButton from '@/components/PopoverButton';
import NegativeConverterReusable from '@/drawers/adjustments/NegativeConverterReusable';
import { Adjustments } from '@/drawers/adjustments/types';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { BookDashed } from 'lucide-react';

export default function NegativeConverterPresetSelector({
  onChange,
  previewPhotoObj,
  preset,
  presets,
}: {
  onChange: (name: string) => void;
  previewPhotoObj: unknown;
  preset: string;
  presets: Record<string, Partial<Adjustments>>;
}) {
  return (<>
    <PopoverButton icon={null} label="" width={800} trigger={<>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
        {Object.entries(presets)
          .filter(([name], index) => index < 5)
          .map(([name, value]) => (
            <Box key={name} sx={{ width: 30, height: 30, borderRadius: 21, overflow: 'hidden', display: 'flex', flexDirection: 'row', ml: -2, border: '1px solid', borderColor: 'divider', boxShadow: 1, cursor: 'pointer' }}>
              <NegativeConverterReusable previewPhotoObj={previewPhotoObj} initialPreset={value as Partial<Adjustments>} />
            </Box>
          ))}
      </Box>




      <IconButton size="small" ><BookDashed size={16} /> </IconButton>
    </>}>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        maxHeight: 700,
        overflow: 'auto',
        gap: 1,
        p: 1,
      }}>
        {/* <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}> */}
        {Object.entries(presets).map(([name, value]) => (
          <Box key={name}
            onClick={() => onChange(name)}
            sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', border: '1px solid',
              borderColor: 'divider', alignItems: 'center', gap: 1, justifyContent: 'space-between',
              borderRadius: 2, '&:hover': { backgroundColor: 'action.hover' } }}
          >
            <Box sx={{ width: 100, height: 100, borderRadius: 21, overflow: 'hidden', display: 'flex', flexDirection: 'row', border: '1px solid', borderColor: 'divider', boxShadow: 1 }}>
              <NegativeConverterReusable previewPhotoObj={previewPhotoObj} initialPreset={value as Partial<Adjustments>} />
            </Box>
            <Tooltip title={`Preset: ${name} - ${JSON.stringify(value)}`} placement="top" arrow>
              <Typography variant="caption" sx={{ p: 1 }} color="textSecondary">
                {name}
              </Typography>
            </Tooltip>
          </Box>
        ))}
        {/* </Box> */}
      </Box>
    </PopoverButton>
  </>
  );
}
