import Histogram from '@/components/Histogram';
import SettingsSection from '@/components/SettingsSection';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import { Box } from '@mui/material';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { BarChart3 } from 'lucide-react';
import type { ImageArray } from './types';

function PhotoHistogramNode({
  data,
}: NodeProps<Node<{ image?: ImageArray }>>) {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj);
  const images = data.image ?? [];

  const match = previewPhotoObj
    ? images.find((image) => image.name === previewPhotoObj.title)
    : undefined;

  return (
    <SettingsSection
      title="Photo Histogram"
      icon={<BarChart3 />}
      uuid="photo-histogram-node-reactflow"
      gap={2}
      tint="photo-histogram"
    >
      <InputHandle id="image" position={Position.Top} />

      <Box sx={{ width: 400, height: 220 }}>
        {match ? (
          <Histogram imageUrl={match.src} width={400} height={220} />
        ) : (
          <div className="empty">
            {previewPhotoObj ? 'Selected photo not in this pipeline output' : 'No photo selected'}
          </div>
        )}
      </Box>
    </SettingsSection>
  );
}

export default PhotoHistogramNode;
