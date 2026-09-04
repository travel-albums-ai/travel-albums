import { Handle, Position, useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import SettingsSection from '@/components/SettingsSection';
import { useFilteredPhotos_GLOBAL } from "@/context/globals/filteredPhotosStore";
import { useSections_GLOBAL } from "@/context/globals/sectionsStore";
import type { GalleryPhoto } from "@/lib/galleryData";
import { composeUrl } from "@/lib/thumbnailService";
import { Box } from '@mui/material';
import { Folder } from 'lucide-react';

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

  return <>
    <SettingsSection title="Gallery Selection" icon={<Folder />} uuid="selection-node-reactflow" gap={2}>
      <small>
        {photos.length} photo{photos.length === 1 ? "" : "s"} matched
      </small>

      {photos.length > 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
          {photos.map((photo) => (
            <img
              key={photo.id}
              src={composeUrl(photo)}
              alt=""
              style={{
                display: 'block',
                width: '100%',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '6px',
                background: '#eee',
              }}
            />
          ))}
        </Box>
      )}
    </SettingsSection>
    <Handle
      type="source"
      position={Position.Right}
      id="image"
    />
  </>;
}

export default SelectionNode;
