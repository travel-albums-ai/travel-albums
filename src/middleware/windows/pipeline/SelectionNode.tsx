import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import SettingsSection from '@/components/SettingsSection';
import { useFilteredPhotos_GLOBAL } from "@/context/globals/filteredPhotosStore";
import { useSections_GLOBAL } from "@/context/globals/sectionsStore";
import type { GalleryPhoto } from "@/lib/galleryData";
import AllPhotosGridVirtuoso from '@/pages/components/AllPhotosGridVirtuoso';
import { Box } from '@mui/material';
import { Folder } from 'lucide-react';

function SelectionNode({
  data,
}: NodeProps<Node<{ photos?: GalleryPhoto[]; limit?: number }>>) {
  // Same route-driven photo resolution as ScrollerDrawer.
  const { type_name = "", id: sectionId = "" } = useParams();
  const sections = useSections_GLOBAL();
  const photosFiltered = useFilteredPhotos_GLOBAL();

  const showAll = type_name === "";

  const photos = useMemo(() => {
    if (showAll) return photosFiltered;

    const foundSection = sections?.find((s) => s.type === type_name);
    const foundSet = foundSection?.data?.find(
      (d: any) => d.name === sectionId
    );

    return foundSet?.photos ?? [];
  }, [showAll, sections, photosFiltered, type_name, sectionId]);

  // How many of the matched photos are actually used downstream.
  // Defaults to 10 once the real photo count is known, unless a
  // previously saved limit already exists.
  const [limit, setLimit] = useState(() => data.limit ?? Math.min(10, photos.length));
  const limitInitializedRef = useRef(data.limit !== undefined);

  useEffect(() => {
    if (limitInitializedRef.current || photos.length === 0) return;

    limitInitializedRef.current = true;
    setLimit(Math.min(10, photos.length));
  }, [photos.length]);

  useEffect(() => {
    setLimit((current) => Math.min(current, photos.length));
  }, [photos.length]);

  const selectedPhotos = useMemo(
    () => photos.slice(0, limit),
    [photos, limit]
  );

  // Mutate data in place (like the slider nodes) so the pipeline engine
  // always reads the latest value, even from a listener bound this render.
  useEffect(() => {
    data.photos = selectedPhotos;
    data.limit = limit;

    window.dispatchEvent(new CustomEvent("pipeline:changed"));
  }, [data, selectedPhotos, limit]);

  return <>
    <SettingsSection title="Gallery Selection" icon={<Folder />} uuid="selection-node-reactflow" gap={2}>
      <small>
        {selectedPhotos.length} of {photos.length} photo{photos.length === 1 ? "" : "s"} used
      </small>

      <input
        type="range"
        min={0}
        max={photos.length}
        step={1}
        value={limit}
        onChange={(event) => setLimit(Number(event.target.value))}
      />

      <Box sx={{ height: '900px', width: '900px', overflow: 'auto' }}>
        <AllPhotosGridVirtuoso photos={selectedPhotos} width={200} height={100} />
      </Box>

    </SettingsSection>
    <Handle
      type="source"
      position={Position.Right}
      id="image"
    />
  </>;
}

export default SelectionNode;
