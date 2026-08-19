import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import PopoverButton from '@/components/PopoverButton';
import NegativeConverterReusable from '@/drawers/adjustments/NegativeConverterReusable';
import { Adjustments } from '@/drawers/adjustments/types';
import { Box, Tooltip, Typography } from '@mui/material';

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
      <GenericToggleButtonGroup items={[
        {
          tooltip: 'Open Preset Selector',
          icon: <>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, ml: 1.75 }}>
              {Object.entries(presets)
                .filter(([name], index) => index < 3)
                .map(([name, value]) => (
                  <Box key={name} sx={{ width: 16, height: 16, borderRadius: 21, overflow: 'hidden', display: 'flex', flexDirection: 'row', ml: -1.75, border: '1px solid', borderColor: 'divider', boxShadow: 1, cursor: 'pointer' }}>
                    <NegativeConverterReusable previewPhotoObj={previewPhotoObj} initialPreset={value as Partial<Adjustments>} />
                  </Box>
                ))}
            </Box>
          </>,
          title: 'Presets' + (preset ? `: ${preset}` : ''),
        },
      ] satisfies GenericToggleButtonProps[]} />
    </>}>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        maxHeight: 700,
        overflow: 'auto',
        gap: 1,
        p: 1,
      }}>
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
      </Box>
    </PopoverButton>
  </>
  );
}
