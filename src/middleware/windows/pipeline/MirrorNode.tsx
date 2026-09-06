import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { SquareCenterlineDashedHorizontal } from 'lucide-react';

function MirrorNode() {
  return (
    <>
      <InputHandle id="image" />

      <NodeWrapper title={'Mirror'} icon={<SquareCenterlineDashedHorizontal size={16} />} toolbar={<></>}>
        <small>Flips the image horizontally</small>
      </NodeWrapper>

      <OutputHandle id="image" />
    </>
  );
}

export default MirrorNode;
