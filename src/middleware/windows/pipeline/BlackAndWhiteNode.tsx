import SettingsSection from '@/components/SettingsSection';
import { Handle, Position } from "@xyflow/react";

function BlackAndWhiteNode() {
  return (
    <SettingsSection title="Black & White">
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

export default BlackAndWhiteNode;
