import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { useState } from "react";

function SourceNode({ data }: NodeProps<Node<{ file?: File }>>) {
  const [fileName, setFileName] = useState(
    data.file?.name ?? "Choose image"
  );

  return (
    <div className="node">
      <strong>📷 Image Source</strong>

      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (!file) return;

          data.file = file;
          setFileName(file.name);

          // Tell the pipeline engine that this node changed.
          window.dispatchEvent(
            new CustomEvent("pipeline:changed")
          );
        }}
      />

      <small>{fileName}</small>

      <Handle
        type="source"
        position={Position.Right}
        id="image"
      />
    </div>
  );
}

export default SourceNode;
