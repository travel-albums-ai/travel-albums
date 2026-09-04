import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { useState } from "react";

function SourceNode({ data }: NodeProps<Node<{ files?: File[] }>>) {
  const [label, setLabel] = useState(
    data.files?.length
      ? `${data.files.length} photo${data.files.length === 1 ? "" : "s"} selected`
      : "Choose photos"
  );

  return (
    <div className="node">
      <strong>📷 Image Source</strong>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);

          if (files.length === 0) return;

          data.files = files;
          setLabel(
            `${files.length} photo${files.length === 1 ? "" : "s"} selected`
          );

          // Tell the pipeline engine that this node changed.
          window.dispatchEvent(
            new CustomEvent("pipeline:changed")
          );
        }}
      />

      <small>{label}</small>

      <Handle
        type="source"
        position={Position.Right}
        id="image"
      />
    </div>
  );
}

export default SourceNode;
