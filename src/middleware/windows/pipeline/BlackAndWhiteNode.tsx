import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { Landmark } from 'lucide-react';

function BlackAndWhiteNode() {
  return (<>
    <InputHandle id="image" />
    <NodeWrapper title={'Black & White'} icon={<Landmark />} toolbar={<></>}>
      <small>Convert image to black & white</small>
    </NodeWrapper>
    <OutputHandle id="image" />
  </>);
}

export default BlackAndWhiteNode;
