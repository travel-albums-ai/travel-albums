import SettingsSection from '@/components/SettingsSection';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { Box, Button } from '@mui/material';
import { type Node, type NodeProps } from "@xyflow/react";
import { HardDrive, Upload } from 'lucide-react';
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
    <SettingsSection title="Images Source" icon={<HardDrive />} uuid="viewer-node-reactflow" gap={2}>
      <Button
        component="label"
        variant="outlined"
        startIcon={<Upload />}
      >
        Select Images
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            const selected = Array.from(event.target.files ?? []);

            if (selected.length === 0) return;

            data.files = selected;
            setFiles(selected);

            window.dispatchEvent(
              new CustomEvent("pipeline:changed")
            );

            // Allows selecting the same file(s) again
            event.target.value = "";
          }}
        />
      </Button>

      <small>{label}</small>

      <Box sx={{ height: '900px', width: '900px', overflow: 'auto' }}>
        {previewUrls.length > 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
            {previewUrls.map((value, index) => (
              <img
                key={index}
                src={value}
                alt=""
                style={{
                  display: 'block',
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                }}
              />
            ))}
          </Box>
        ) : (
          <p>No images selected</p>
        )}
      </Box>

      <OutputHandle id="image" />
    </SettingsSection>
  );
}

export default SourceNode;
