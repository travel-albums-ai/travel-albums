// ============================================================
// Palette of node types that can be dragged onto the canvas
// ============================================================

import { Box } from '@mui/material';

const paletteItems: Array<{
  type: string;
  label: string;
  icon: string;
}> = [
  { type: "source", label: "Image Source", icon: "📷" },
  { type: "selection", label: "Gallery Selection", icon: "🗂️" },
  { type: "ai-colorizer", label: "AI Async Colorizer", icon: "✨" },
  { type: "invert", label: "Invert", icon: "☯️" },
  { type: "flip", label: "Flip 180°", icon: "🔄" },
  { type: "brightness", label: "Brightness", icon: "☀️" },
  { type: "gamma", label: "Gamma", icon: "🎚️" },
  { type: "luminosity", label: "Luminosity", icon: "💡" },
  { type: "exposure", label: "Exposure", icon: "📸" },
  { type: "contrast", label: "Contrast", icon: "◐" },
  { type: "saturation", label: "Saturation", icon: "🎨" },
  { type: "vibrance", label: "Vibrance", icon: "🌈" },
  { type: "vignette", label: "Vignette", icon: "⚫" },
  { type: "grain", label: "Grain", icon: "🌾" },
  { type: "sharpen", label: "Sharpen", icon: "🔪" },
  { type: "viewer", label: "Viewer", icon: "🖼️" },
];

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

  return (
    <Box sx={{
      width: '450px',
      padding: 1, borderRight: '1px solid', borderColor: 'divider',
      pr: 3,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: 1,
      gridTemplateRows: 'repeat(auto-fill, minmax(50px, 1fr))',
    }}>
      {/* <strong>Nodes</strong> */}

      {paletteItems.map((item) => (
        <div
          key={item.type}
          className="toolbox-item"
          draggable
          onDragStart={(event) =>
            onDragStart(event, item.type)
          }
        >
          <span>{item.icon}</span>
          {item.label}
        </div>
      ))}
    </Box>
  );
}

export default NodeToolbox;
