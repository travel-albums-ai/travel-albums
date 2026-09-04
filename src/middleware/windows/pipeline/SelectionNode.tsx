import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

import type { GalleryPhoto } from "../../../lib/galleryData";
import { composeUrl } from "../../../lib/thumbnailService";

function SelectionNode({
  data,
}: NodeProps<Node<{ photos?: GalleryPhoto[] }>>) {
  const photos = data.photos ?? [];

  return (
    <div className="node source">
      <strong>🗂️ Gallery Selection</strong>

      <small>
        {photos.length} photo{photos.length === 1 ? "" : "s"} selected
      </small>

      {photos.length > 0 && (
        <div className="viewer-grid">
          {photos.map((photo) => (
            <img
              key={photo.id}
              src={composeUrl(photo)}
              alt=""
            />
          ))}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="image"
      />
    </div>
  );
}

export default SelectionNode;
