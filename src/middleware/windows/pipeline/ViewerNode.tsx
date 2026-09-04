import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { ImageValue } from "./types";

function ViewerNode({
  data,
}: NodeProps<Node<{ image?: ImageValue | null }>>) {
  return (
    <div className="node viewer">
      <Handle
        type="target"
        position={Position.Left}
        id="image"
      />

      <strong>🖼️ Viewer</strong>

      {data.image?.image ? (
        <img
          src={data.image.image.src}
          alt=""
        />
      ) : (
        <div className="empty">
          Waiting for image...
        </div>
      )}
    </div>
  );
}

export default ViewerNode;
