import SettingsSection from '@/components/SettingsSection';
import { Handle, Position } from "@xyflow/react";

function InvertNode() {
  return (
    <SettingsSection title="Invert">
      <Handle
        type="target"
        position={Position.Left}
        id="image"
      />

      <small>Async image operation</small>

      <Handle
        type="source"
        position={Position.Right}
        id="image"
      />
    </SettingsSection>
  );
}

export default InvertNode;
