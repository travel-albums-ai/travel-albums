import SettingsSection from '@/components/SettingsSection';
import { useBYOKStoreSelector } from '@/context/byokStore';
import { Alert, Box, Button, LinearProgress, Typography } from '@mui/material';
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from "react";

type Progress = { runId: number; completed: number; total: number };

function AIAsyncColorizerNode({
  id,
  data,
}: NodeProps<Node<{ passthru?: boolean; apiKey?: string }>>) {
  const byokOpenAIKey = useBYOKStoreSelector((state) => state.byokOpenAIKey);

  const [engaged, setEngaged] = useState(data.passthru === false);
  const [progress, setProgress] = useState<Progress | null>(null);

  // Mutate data in place (like the slider/selection nodes) so the pipeline
  // engine always reads the latest value, even from a listener bound this render.
  useEffect(() => {
    data.apiKey = byokOpenAIKey;
    data.passthru = !engaged;

    window.dispatchEvent(new CustomEvent("pipeline:changed"));
  }, [data, byokOpenAIKey, engaged]);

  // Progress is reported by evaluatePipeline via a global event since it
  // has no direct handle back to this component.
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<
        { nodeId: string } & Progress
      >).detail;

      if (!detail || detail.nodeId !== id) return;

      setProgress((current) => {
        // Ignore updates from a run that's since been superseded.
        if (current && detail.runId < current.runId) return current;
        return detail;
      });
    };

    window.addEventListener("ai-colorizer:progress", handler);

    return () => {
      window.removeEventListener("ai-colorizer:progress", handler);
    };
  }, [id]);

  const percent =
    progress && progress.total > 0
      ? Math.min(100, (progress.completed / progress.total) * 100)
      : 0;

  return (
    <SettingsSection
      title="AI Async Colorizer"
      icon={<Sparkles />}
      uuid="ai-async-colorizer-node-reactflow"
      gap={2}
    >
      <Handle type="target" position={Position.Left} id="image" />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant={engaged ? 'contained' : 'outlined'}
          size="small"
          startIcon={<Sparkles size={14} />}
          onClick={() => setEngaged((current) => !current)}
        >
          {engaged ? 'Engaged' : 'Passthru'}
        </Button>
      </Box>

      {engaged && !byokOpenAIKey && (
        <Alert severity="warning" sx={{ py: 0 }}>
          No OpenAI key configured
        </Alert>
      )}

      {engaged && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <LinearProgress variant="determinate" value={percent} />
          <Typography variant="caption" color="textSecondary">
            {progress
              ? `${progress.completed}/${progress.total} colorized`
              : 'Idle'}
          </Typography>
        </Box>
      )}

      <Handle type="source" position={Position.Right} id="image" />
    </SettingsSection>
  );
}

export default AIAsyncColorizerNode;
