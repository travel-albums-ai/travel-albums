// ============================================================
// Palette of node types that can be dragged onto the canvas
// ============================================================

const paletteItems: Array<{
  type: string;
  label: string;
  icon: string;
}> = [
  { type: "source", label: "Image Source", icon: "📷" },
  { type: "invert", label: "Invert", icon: "☯️" },
  { type: "flip", label: "Flip 180°", icon: "🔄" },
  { type: "brightness", label: "Brightness", icon: "☀️" },
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
    <aside className="toolbox">
      <strong>Nodes</strong>

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
    </aside>
  );
}

export default NodeToolbox;
