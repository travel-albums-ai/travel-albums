import PopoverButton from '@/components/PopoverButton';
import NegativeConverterReusable from '@/drawers/adjustments/NegativeConverterReusable';
import { Adjustments } from '@/drawers/adjustments/types';
import { Box, Button, Tooltip, Typography } from '@mui/material';

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
    <PopoverButton icon={null} label="" width={800} trigger={<Button variant="outlined" size="small" sx={{ width: '100%' }}>Presets / {preset}</Button>}>

      <Box sx={{
        display: 'grid',
        maxHeight: 700,
        overflow: 'auto',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 1,
        p: 1,
      }}>
        {Object.entries(presets).map(([name, value]) => (
          <Box key={name}
            onClick={() => onChange(name)}
            sx={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', border: '1px solid', borderColor: 'divider', alignItems: 'center', gap: 1, justifyContent: 'space-between', borderRadius: 2, p: 1, '&:hover': { backgroundColor: 'action.hover' } }}
          >
            <Box sx={{ height: 100, borderRadius: 2, display: 'flex', flexDirection: 'row' }}>
              <NegativeConverterReusable previewPhotoObj={previewPhotoObj} initialPreset={value as Partial<Adjustments>} />
            </Box>

            <Tooltip title={`Preset: ${name} - ${JSON.stringify(value)}`} placement="top" arrow>
              <Typography variant="caption" sx={{ p: 1 }} color="textSecondary">
                {name}
              </Typography>
            </Tooltip>
          </Box>
        ))}
      </Box>
    </PopoverButton>
  </>
  );
}
