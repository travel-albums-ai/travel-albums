import SettingsSection from '@/components/SettingsSection';
import SolidChip from '@/components/SolidChip';
import { Box } from '@mui/material';
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { useState } from "react";

export type SliderNodeConfig = {
  icon: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

// Builds a single-slider node component sharing the same
// data.amount + "pipeline:changed" wiring as BrightnessNode.
export function createSliderNode(config: SliderNodeConfig) {
  function SliderNode({
    data,
  }: NodeProps<Node<{ amount?: number }>>) {
    const [amount, setAmount] = useState(
      data.amount ?? config.defaultValue
    );

    return <>
      <Handle
        type="target"
        position={Position.Left}
        id="image"
      />
      <SettingsSection title={config.label} icon={<span>{config.icon}</span>}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <input
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
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
          <SolidChip count={amount} />
        </Box>

      </SettingsSection>
      <Handle
        type="source"
        position={Position.Right}
        id="image"
      />
    </>;
  }

  return SliderNode;
}
