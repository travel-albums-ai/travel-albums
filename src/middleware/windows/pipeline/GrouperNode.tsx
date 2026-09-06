import SettingsSection from '@/components/SettingsSection';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { Box } from '@mui/material';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { Combine } from 'lucide-react';

const INPUTS = [
  { id: 'image-1', label: 'Photo array 1' },
  { id: 'image-2', label: 'Photo array 2' },
  { id: 'image-3', label: 'Photo array 3' },
  { id: 'image-4', label: 'Photo array 4' },
];

function GrouperNode(_props: NodeProps<Node>) {
  return <>
    {INPUTS.map((input, index) => (
      <InputHandle
        key={input.id}
        id={input.id}
        style={{ top: `${18 + index * 18}%` }}
      />
    ))}

    <SettingsSection title="Grouper" icon={<Combine />} uuid="grouper-node-reactflow" gap={1} tint="grouper">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {INPUTS.map((input) => (
          <small key={input.id}>{input.label}</small>
        ))}
      </Box>
      <small>Merges up to four connected photo arrays</small>
    </SettingsSection>

    <OutputHandle id="image" position={Position.Right} />
  </>;
}

export default GrouperNode;
