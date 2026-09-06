import { SegmentedControl, SegmentedControlItem } from '@/components/SegmentedControl';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
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

  return (<>
    <InputHandle id="image" />
    {/* <SettingsSection title="Rescale" icon={<Maximize2 />} uuid="rescale-node-reactflow" gap={2} tint="rescale"> */}


    <NodeWrapper title={'Rescale'} icon={<Maximize2 />} toolbar={<></>}>
      <small>Flips the image horizontally</small>

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
    </NodeWrapper>

    {/* </SettingsSection> */}
    <OutputHandle id="image" />
  </>);
}

export default RescaleNode;
