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

    return (
      <div className="node">
        <Handle
          type="target"
          position={Position.Left}
          id="image"
        />

        <strong>{config.icon} {config.label}</strong>

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

        <small>{amount}</small>

        <Handle
          type="source"
          position={Position.Right}
          id="image"
        />
      </div>
    );
  }

  return SliderNode;
}
