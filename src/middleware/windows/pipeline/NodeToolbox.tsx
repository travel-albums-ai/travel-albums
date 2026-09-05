// ============================================================
// Palette of node types that can be dragged onto the canvas
// ============================================================

import SettingsSection from '@/components/SettingsSection';
import { Box, Typography } from '@mui/material';

const paletteItems: Array<{
  type: string;
  label: string;
  icon: string;
  group: string;
}> = [
  { type: "source", label: "Image Source", icon: "📷", group: "input" },
  { type: "selection", label: "Gallery Selection", icon: "🗂️", group: "input" },
  { type: "ai-colorizer", label: "AI Async Colorizer", icon: "✨", group: "ai" },
  { type: "ai-denoiser", label: "AI Async Denoiser", icon: "🧹", group: "ai" },
  { type: "invert", label: "Invert", icon: "☯️", group: "base" },
  { type: "black-white", label: "Black & White", icon: "⬛", group: "base" },
  { type: "flip", label: "Flip 180°", icon: "🔄", group: "utility" },
  { type: "brightness", label: "Brightness", icon: "☀️", group: "basics" },
  { type: "gamma", label: "Gamma", icon: "🎚️", group: "adjustment" },
  { type: "luminosity", label: "Luminosity", icon: "💡", group: "adjustment" },
  { type: "exposure", label: "Exposure", icon: "📸", group: "basics" },
  { type: "contrast", label: "Contrast", icon: "◐", group: "basics" },
  { type: "saturation", label: "Saturation", icon: "🎨", group: "adjustment" },
  { type: "vibrance", label: "Vibrance", icon: "🌈", group: "adjustment" },
  { type: "vignette", label: "Vignette", icon: "⚫", group: "decorative" },
  { type: "grain", label: "Grain", icon: "🌾", group: "decorative" },
  { type: "sharpen", label: "Sharpen", icon: "🔪", group: "decorative" },
  { type: "pop", label: "Pop", icon: "🎇", group: "basics" },
  { type: "hdr", label: "HDR Effect", icon: "🌇", group: "basics" },
  { type: "fade", label: "Fade", icon: "🌫️", group: "decorative" },
  { type: "rescale", label: "Rescale", icon: "📐", group: "utility" },
  { type: "viewer", label: "Viewer", icon: "🖼️", group: "output" },
];

const groupedPaletteItems = paletteItems.reduce((acc, item) => {
  if (!acc[item.group]) {
    acc[item.group] = [];
  }
  acc[item.group].push(item);
  return acc;
}, {} as Record<string, typeof paletteItems>);

function NodeToolbox() {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      nodeType
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return <>
    <Box sx={{
      display: 'flex', flexDirection: 'column',
      gap: 0,
      borderRight: '1px solid',
      borderColor: 'divider',
      pr: 2
    }}>
      {Object.entries(groupedPaletteItems).map(([group, items]) => (
        <Box key={group}
          sx={{
            borderBottom: '1px dotted', borderColor: 'divider', pb: 0.5, mb: 2,
            display: 'flex', flexDirection: 'column', gap: 0
          }}
        >
          <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
            {group}
          </Typography>
          <Box sx={{
            display: 'grid',
            alignContent: 'start',
            gridTemplateColumns: 'repeat(2, minmax(200px, 1fr))',
            columnGap: 1,
          }}>
            {items.map((item) => (
              <div
                id={item.type}
                style={{ cursor: 'grab' }}
                key={item.type}
                draggable
                onDragStart={(event) =>
                  onDragStart(event, item.type)
                }
              >
                <SettingsSection title={item.label} icon={<span>{item.icon}</span>} />
              </div>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  </>
}

export default NodeToolbox;
