import SettingsSection from '@/components/SettingsSection';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { type Node, type NodeProps } from '@xyflow/react';
import { Palette } from 'lucide-react';
import { useState } from 'react';

function LutNode({ data }: NodeProps<Node<{ lutFile?: File }>>) {
  const [fileName, setFileName] = useState(data.lutFile?.name ?? '');

  return (
    <>
      <InputHandle id="image" />

      <SettingsSection title="LUT (.cube)" icon={<Palette />} tint="lut">
        <input
          type="file"
          accept=".cube,text/plain"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (!file) return;

            Object.assign(data, { lutFile: file });
            setFileName(file.name);
            window.dispatchEvent(new CustomEvent('pipeline:changed'));
          }}
        />
        <small>{fileName || 'Choose a .cube LUT'}</small>
      </SettingsSection>

      <OutputHandle id="image" />
    </>
  );
}

export default LutNode;
