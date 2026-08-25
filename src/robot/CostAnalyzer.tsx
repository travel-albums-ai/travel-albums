import { useBYOKStoreSelector } from '@/context/byokStore';
import { Box, Button, Typography } from '@mui/material';
import { Astroid } from 'lucide-react';
import { useState } from 'react';

type CostAnalysis = {
  total_input_tokens: number;
  total_output_tokens: number;
  total_tokens: number;
  total_cost_euro: number;
};

type Props = {
  photos?: unknown[];
  context?: Record<string, unknown>;
};

type CloudPriceResponse = {
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;

  input_cost?: number;
  output_cost?: number;
  total_cost?: number;

  cost?: number;

  currency?: string;

  error?: string;
  message?: string;
};

const CLOUDPRICE_BASE_URL = 'https://ai.cloudprice.net/api/v1/models';

/**
 * Maps the model name returned by OpenAI to the CloudPrice model slug.
 *
 * Example:
 *   gpt-5.6-luna -> openai-gpt-5-6-sol
 *
 * Add other models here as needed.
 */
function getCloudPriceModelSlug(modelName: string): string {
  const normalized = modelName.toLowerCase();

  const knownModels: Record<string, string> = {
    'gpt-5.6-luna': 'openai-gpt-5-6-sol',
  };

  return (
    knownModels[normalized] ??
    normalized
      .replace(/^gpt-/, 'openai-gpt-')
      .replace(/\./g, '-')
  );
}

export default function CostAnalyzer() {
  const { usageStats } = useBYOKStoreSelector((state) => state);

  const [results, setResults] =
    useState<CostAnalysis | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function calculateCost() {
    if (loading) return;

    if (!usageStats?.length) {
      setError('No API usage records available.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let totalInputTokens = 0;
      let totalOutputTokens = 0;
      let totalCost = 0;

      for (const stat of usageStats) {
        const inputTokens =
          stat.usage.input_tokens * 1000;

        const outputTokens =
          stat.usage.output_tokens * 1000;

        const modelSlug =
          getCloudPriceModelSlug(stat.model);

        const url = new URL(
          `${CLOUDPRICE_BASE_URL}/${modelSlug}/pricing/calculate`,
        );

        url.searchParams.set(
          'input_tokens',
          String(inputTokens),
        );

        url.searchParams.set(
          'output_tokens',
          String(outputTokens),
        );

        console.log(
          'CloudPrice request:',
          url.toString(),
        );

        const response = await fetch(url);

        const data =
          (await response.json()) as CloudPriceResponse;

        if (!response.ok) {
          throw new Error(
            data.error ||
              data.message ||
              `CloudPrice request failed (${response.status})`,
          );
        }

        /**
         * CloudPrice returns the calculated cost.
         *
         * Prefer total_cost, then cost, then the
         * sum of input/output costs.
         */
        const cost =
          data.total_cost ??
          data.cost ??
          ((data.input_cost ?? 0) +
            (data.output_cost ?? 0));

        totalInputTokens += inputTokens;
        totalOutputTokens += outputTokens;
        totalCost += cost;
      }

      setResults({
        total_input_tokens: totalInputTokens,
        total_output_tokens: totalOutputTokens,
        total_tokens:
          totalInputTokens +
          totalOutputTokens,
        total_cost_euro: totalCost,
      });
    } catch (e) {
      console.error(e);

      setError(
        e instanceof Error
          ? e.message
          : 'Cost calculation failed',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        alignItems: 'flex-start',
      }}
    >
      <Button
        variant="outlined"
        startIcon={<Astroid size={16} />}
        size="small"
        color="inherit"
        onClick={calculateCost}
        disabled={loading || !usageStats?.length}
      >
        {loading ? 'Calculating…' : 'Calculate cost'}
      </Button>

      {error && (
        <Typography
          variant="body2"
          color="error"
        >
          {error}
        </Typography>
      )}

      {results && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.25,
            fontSize: 13,
          }}
        >
          <Typography variant="body2">
            Input:{' '}
            {results.total_input_tokens.toLocaleString()}
          </Typography>

          <Typography variant="body2">
            Output:{' '}
            {results.total_output_tokens.toLocaleString()}
          </Typography>

          <Typography variant="body2">
            Total:{' '}
            {results.total_tokens.toLocaleString()}
          </Typography>

          <Typography
            variant="body2"
            sx={{ fontWeight: 700 }}
          >
            Cost:{' '}
            €{results.total_cost_euro.toFixed(6)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
