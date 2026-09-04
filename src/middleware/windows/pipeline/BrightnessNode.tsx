import SettingsSection from '@/components/SettingsSection';
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { useState } from "react";

function BrightnessNode({
  data,
}: NodeProps<Node<{ amount?: number }>>) {
  const [amount, setAmount] = useState(data.amount ?? 0);

  return (
    <SettingsSection title="Brightness">
      <Handle
        type="target"
        position={Position.Left}
        id="image"
      />

      <input
        type="range"
        min={-100}
        max={100}
        step={1}
        value={amount}
        onChange={(event) => {
          const value = Number(event.target.value);

          data.amount = value;
          setAmount(value);

          // Tell the pipeline engine that this node changed.
          window.dispatchEvent(
            new CustomEvent("pipeline:changed")
          );
        }}
      />

      <small>{amount}</small>

      <Handle
        type="source"
        position={Position.Right}
        id="image"
      />
    </SettingsSection>
  );
}

export default BrightnessNode;
