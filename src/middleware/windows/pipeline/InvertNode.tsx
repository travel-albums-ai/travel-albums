import { Handle, Position } from "@xyflow/react";

function InvertNode() {
  return (
    <div className="node">
      <Handle
        type="target"
        position={Position.Left}
        id="image"
      />

      <strong>☯️ Invert</strong>

      <small>Async image operation</small>

      <Handle
        type="source"
        position={Position.Right}
        id="image"
      />
    </div>
  );
}

export default InvertNode;
