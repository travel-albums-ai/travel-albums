// ============================================================
// Palette of node types that can be dragged onto the canvas
// ============================================================

import { IconDoodleBackground } from '@/components/IconDoodleBackground';
import { Box, Typography } from '@mui/material';
import { Angle, Astroid, ChartColumn, Contrast, EyeDashed, Film, GalleryVerticalEnd, Gem, Group, HardDrive, Image, Images, ImageUpscale, Landmark, Lightbulb, Mountain, Palette, Pipette, Slice, SquareCenterlineDashedHorizontal, SquareCenterlineDashedVertical, SquaresExclude, Sun, SwatchBook, Theater, Wheat } from 'lucide-react';

const paletteItems: Array<{
  type: string;
  label: string;
  icon: React.ReactNode;
  group: string;
}> = [
  { type: "source", label: "Image Source", icon: <HardDrive size={16} />, group: "input" },
  { type: "selection", label: "Gallery Selection", icon: <GalleryVerticalEnd size={16} />, group: "input" },
  { type: "grouper", label: "Grouper", icon: <Group size={16} />, group: "utility" },
  { type: "ai-colorizer", label: "AI Async Colorizer", icon: <Astroid size={16} />, group: "ai" },
  { type: "ai-denoiser", label: "AI Async Denoiser", icon: <Astroid size={16} />, group: "ai" },
  { type: "invert", label: "Invert", icon: <SquaresExclude size={16} />, group: "base" },
  { type: "black-white", label: "Black & White", icon: <Landmark size={16} /> , group: "base" },
  { type: "lut", label: "3D LUT", icon: <Film size={16} />, group: "color" },
  { type: "flip", label: "Flip 180°", icon: <SquareCenterlineDashedHorizontal size={16} />, group: "utility" },
  { type: "mirror", label: "Mirror", icon: <SquareCenterlineDashedVertical size={16} />, group: "utility" },
  { type: "rotate", label: "Rotate", icon: <Angle size={16} />, group: "utility" },
  { type: "brightness", label: "Brightness", icon: <Lightbulb size={16} />, group: "basics" },
  { type: "gamma", label: "Gamma", icon: <Palette size={16} />, group: "adjustment" },
  { type: "luminosity", label: "Luminosity", icon: <Lightbulb size={16} />, group: "adjustment" },
  { type: "exposure", label: "Exposure", icon: <Sun size={16} />, group: "basics" },
  { type: "contrast", label: "Contrast", icon: <Contrast size={16} />, group: "basics" },
  { type: "saturation", label: "Saturation", icon: <SwatchBook size={16} />, group: "adjustment" },
  { type: "vibrance", label: "Vibrance", icon:<Pipette size={16} />, group: "adjustment" },
  { type: "vignette", label: "Vignette", icon: <Theater size={16} />, group: "decorative" },
  { type: "grain", label: "Grain", icon: <Wheat size={16} />, group: "decorative" },
  { type: "sharpen", label: "Sharpen", icon: <Slice size={16} />, group: "decorative" },
  { type: "pop", label: "Pop", icon: <Gem size={16} />, group: "basics" },
  { type: "hdr", label: "HDR Effect", icon: <Mountain size={16} />, group: "basics" },
  { type: "fade", label: "Fade", icon: <EyeDashed size={16} />, group: "decorative" },
  { type: "rescale", label: "Rescale", icon: <ImageUpscale size={16} />, group: "utility" },
  { type: "viewer", label: "Photos Viewer", icon:<Images size={16} />, group: "output" },
  { type: "viewer-single", label: "Photo Viewer", icon: <Image size={16} />, group: "output" },
  { type: "photo-histogram", label: "Photo Histogram", icon: <ChartColumn size={16} />, group: "output" },
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
      overflowY: 'auto', // Enable vertical scrolling if content exceeds the viewport height
      pr: 2
    }}>
      <IconDoodleBackground />
      {Object.entries(groupedPaletteItems).map(([group, items]) => (
        <Box key={group}
          sx={{
            borderBottom: '1px dotted', borderColor: 'divider',
            pb: 1, mb: 1,
            display: 'flex', flexDirection: 'column', gap: 0
          }}
        >
          <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', fontWeight: 'bold', mb: 1 }}>
            {group}
          </Typography>
          <Box sx={{
            display: 'grid',
            alignContent: 'start',
            gridTemplateColumns: 'repeat(2, minmax(150px, 1fr))',
            gap: 1,
          }}>
            {items.map((item) => (
              <Box
                id={item.type}
                sx={{
                  cursor: 'grab',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                  py: 1,
                  px: 1,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'

                }}
                key={item.type}
                draggable
                onDragStart={(event) =>
                  onDragStart(event, item.type)
                }

              >
                {/* <span>{item.icon !== undefined && cloneElement(item.icon, { size: 30})}</span> */}
                {item.icon}
                <Typography variant="caption" color="textSecondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </Typography>
                {/* <SettingsSection title={item.label} icon={<span>{item.icon}</span>} tint={item.type} /> */}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  </>
}

export default NodeToolbox;
