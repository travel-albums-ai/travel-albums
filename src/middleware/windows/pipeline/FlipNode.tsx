import SettingsSection from '@/components/SettingsSection';
import { Handle, Position } from "@xyflow/react";

function FlipNode() {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        id="image"
      />

      <SettingsSection title={'Flip 180°'} icon={<span>🔄</span>} tint={'flip'}>
        <small>Rotates the image upside down</small>
      </SettingsSection>

      <Handle
        type="source"
        position={Position.Right}
        id="image"
      />
    </>
  );
}

export default FlipNode;
