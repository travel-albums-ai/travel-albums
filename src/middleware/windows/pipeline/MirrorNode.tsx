import SettingsSection from '@/components/SettingsSection';
import { Handle, Position } from "@xyflow/react";

function MirrorNode() {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id="image"
      />

      <SettingsSection title={'Mirror'} icon={<span>🪞</span>} tint={'mirror'}>
        <small>Flips the image horizontally</small>
      </SettingsSection>

      <Handle
        type="source"
        position={Position.Right}
        id="image"
      />
    </>
  );
}

export default MirrorNode;
