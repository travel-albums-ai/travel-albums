import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { ImageArray } from "./types";

function ViewerNode({
  data,
}: NodeProps<Node<{ image?: ImageArray }>>) {
  const images = data.image ?? [];

  return (
    <div className="node viewer">
      <Handle
        type="target"
        position={Position.Left}
        id="image"
      />

      <strong>🖼️ Viewer</strong>

      <small>{images.length} photo{images.length === 1 ? "" : "s"}</small>

      {images.length > 0 ? (
        <div className="viewer-grid">
          {images.map((value, index) => (
            <img
              key={index}
              src={value.image.src}
              alt=""
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          Waiting for photos...
        </div>
      )}
    </div>
  );
}

export default ViewerNode;
