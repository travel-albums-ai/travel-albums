import SettingsSection from '@/components/SettingsSection';
import { Box } from '@mui/material';
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Eye } from 'lucide-react';
import type { ImageArray } from "./types";

function ViewerNode({
  data,
}: NodeProps<Node<{ image?: ImageArray }>>) {
  const images = data.image ?? [];

  return (
    <SettingsSection title="Viewer Node" icon={<Eye />} uuid="viewer-node-reactflow" gap={2}>
      <Handle
        type="target"
        position={Position.Left}
        id="image"
      />

      <small>{images.length} photo{images.length === 1 ? "" : "s"}</small>

      <Box sx={{ height: '900px', width: '900px', overflow: 'auto' }}>
        {images.length > 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
            {images.map((value, index) => (
              <img
                key={index}
                src={value.image.src}
                alt=""
                style={{
                  display: 'block',
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                }}
              />
            ))}
          </Box>
        ) : (
          <div className="empty">
          Waiting for photos...
          </div>
        )}
      </Box>
    </SettingsSection>
  );
}

export default ViewerNode;
