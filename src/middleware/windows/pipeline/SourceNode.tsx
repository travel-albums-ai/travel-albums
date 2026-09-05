import SettingsSection from '@/components/SettingsSection';
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Image } from 'lucide-react';
import { useEffect, useState } from "react";

function SourceNode({ data }: NodeProps<Node<{ files?: File[] }>>) {
  const [files, setFiles] = useState(data.files ?? []);

  // Object URLs are just for the node preview; the pipeline
  // loads the actual images itself when it evaluates.
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    // Stale localStorage may still hold non-File placeholders from
    // before `files` was excluded from persistence; skip those.
    const urls = files
      .filter((file): file is File => file instanceof File)
      .map((file) => URL.createObjectURL(file));

    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const label = files.length
    ? `${files.length} photo${files.length === 1 ? "" : "s"} selected`
    : "Choose photos";

  return (
    <SettingsSection title="Images Source" icon={<Image />} uuid="viewer-node-reactflow" gap={2}>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => {
          const selected = Array.from(event.target.files ?? []);

          if (selected.length === 0) return;

          data.files = selected;
          setFiles(selected);

          // Tell the pipeline engine that this node changed.
          window.dispatchEvent(
            new CustomEvent("pipeline:changed")
          );
        }}
      />

      <small>{label}</small>

      {previewUrls.length > 0 && (
        <div className="viewer-grid">
          {previewUrls.map((url, index) => (
            <img key={index} src={url} alt="" />
          ))}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        id="image"
      />
    </SettingsSection>
  );
}

export default SourceNode;
