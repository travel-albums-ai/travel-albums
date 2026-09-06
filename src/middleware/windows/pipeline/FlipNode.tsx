import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { SquareCenterlineDashedVertical } from 'lucide-react';

function FlipNode() {
  return (
    <>
      <InputHandle id="image" />

      <NodeWrapper title={'Flip 180°'} icon={<SquareCenterlineDashedVertical size={16} />} toolbar={<></>}>
        <small>Rotates the image upside down</small>
      </NodeWrapper>

      <OutputHandle id="image" />
    </>
  );
}

export default FlipNode;
