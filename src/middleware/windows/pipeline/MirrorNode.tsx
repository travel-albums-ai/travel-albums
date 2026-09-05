import { Handle, Position } from "@xyflow/react";

function MirrorNode() {
  return (
    <div className="node">
      <Handle
        type="target"
        position={Position.Left}
        id="image"
      />

      <strong>🪞 Mirror</strong>

      <small>Flips the image horizontally</small>

      <Handle
        type="source"
        position={Position.Right}
        id="image"
      />
    </div>
  );
}

export default MirrorNode;
