import SettingsSection from '@/components/SettingsSection';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import { Box } from '@mui/material';
import { Position, type Node, type NodeProps } from "@xyflow/react";
import { Image } from 'lucide-react';
import type { ImageArray } from "./types";

function SinglePhotoViewerNode({
  data,
}: NodeProps<Node<{ image?: ImageArray }>>) {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj);

  const images = data.image ?? [];
  // Pipeline images carry the source photo's title as their name.
  const match = previewPhotoObj
    ? images.find((image) => image.name === previewPhotoObj.title)
    : undefined;

  return (
    <SettingsSection title="Single Photo Viewer" icon={<Image />} uuid="single-photo-viewer-node-reactflow" gap={2} tint="single-photo-viewer">
      <InputHandle id="image" position={Position.Top} />

      <Box sx={{ height: '600px', width: '600px', overflow: 'auto' }}>
        {match ? (
          <img
            src={match.src}
            alt={match.name ?? ''}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '6px',
            }}
          />
        ) : (
          <div className="empty">
            {previewPhotoObj ? 'Selected photo not in this pipeline output' : 'No photo selected'}
          </div>
        )}
      </Box>
    </SettingsSection>
  );
}

export default SinglePhotoViewerNode;
