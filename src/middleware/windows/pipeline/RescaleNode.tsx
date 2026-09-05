import { SegmentedControl, SegmentedControlItem } from '@/components/SegmentedControl';
import SettingsSection from '@/components/SettingsSection';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { type Node, type NodeProps } from "@xyflow/react";
import { Maximize2 } from 'lucide-react';
import { useState } from "react";

const SCALE_PRESETS = [
  { value: "1", label: "Original" },
  { value: "0.1", label: "10%" },
  { value: "0.25", label: "25%" },
  { value: "0.5", label: "50%" },
  { value: "0.65", label: "65%" },
  { value: "0.85", label: "85%" },
];

function RescaleNode({
  data,
}: NodeProps<Node<{ scale?: number }>>) {
  const [scale, setScale] = useState(String(data.scale ?? 1));

  return (
    <SettingsSection title="Rescale" icon={<Maximize2 />} uuid="rescale-node-reactflow" gap={2} tint="rescale">
      <InputHandle id="image" />

      <SegmentedControl
        value={scale}
        onChange={(_, value) => {
          data.scale = Number(value);
          setScale(value);

          // Tell the pipeline engine that this node changed.
          window.dispatchEvent(
            new CustomEvent("pipeline:changed")
          );
        }}
        fullWidth
      >
        {SCALE_PRESETS.map((preset) => (
          <SegmentedControlItem key={preset.value} value={preset.value}>
            {preset.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>

      <OutputHandle id="image" />
    </SettingsSection>
  );
}

export default RescaleNode;
