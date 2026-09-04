import { Handle, Position, useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useFilteredPhotos_GLOBAL } from "@/context/globals/filteredPhotosStore";
import { useSections_GLOBAL } from "@/context/globals/sectionsStore";
import type { GalleryPhoto } from "@/lib/galleryData";
import { composeUrl } from "@/lib/thumbnailService";

function SelectionNode({
  id,
}: NodeProps<Node<{ photos?: GalleryPhoto[] }>>) {
  // Same route-driven photo resolution as ScrollerDrawer.
  const { type_name = "", id: sectionId = "" } = useParams();
  const sections = useSections_GLOBAL();
  const photosFiltered = useFilteredPhotos_GLOBAL();
  const { setNodes } = useReactFlow();

  const showAll = type_name === "";

  const photos = useMemo(() => {
    if (showAll) return photosFiltered;

    const foundSection = sections?.find((s) => s.type === type_name);
    const foundSet = foundSection?.data?.find(
      (d: any) => d.name === sectionId
    );

    return foundSet?.photos ?? [];
  }, [showAll, sections, photosFiltered, type_name, sectionId]);

  // Keep this node's data (and the pipeline engine's view of it)
  // in sync with whatever the current route matches.
  useEffect(() => {
    setNodes((current) =>
      current.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, photos } }
          : node
      )
    );

    window.dispatchEvent(new CustomEvent("pipeline:changed"));
  }, [id, photos, setNodes]);

  return (
    <div className="node source" style={{ width: '500px'}}>
      <strong>🗂️ Gallery Selection</strong>

      <small>
        {photos.length} photo{photos.length === 1 ? "" : "s"} matched
      </small>

      {photos.length > 0 && (
        <div className="viewer-grid">
          {photos.slice(0, 10).map((photo) => (
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
