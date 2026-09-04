import { Handle, Position } from "@xyflow/react";

function FlipNode() {
  return (
    <div className="node">
      <Handle
        type="target"
        position={Position.Left}
        id="image"
      />

      <strong>🔄 Flip 180°</strong>

      <small>Rotates the image upside down</small>

      <Handle
        type="source"
        position={Position.Right}
        id="image"
      />
    </div>
  );
}

export default FlipNode;
