import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import { Box, Button, Typography } from '@mui/material';
import { Astroid } from 'lucide-react';
import { useMemo, useState } from 'react';

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

type OpenAIResponse = {
  created_at?: string;
  model?: string;
  service_tier?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    input_tokens_details?: Record<string, unknown>;
    output_tokens_details?: Record<string, unknown>;
  };
  error?: {
    message?: string;
  };
};

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    results: {
      type: 'object',
      properties: {
        total_input_tokens: {
          type: 'string',
        },
        total_output_tokens: {
          type: 'string',
        },
        total_tokens: {
          type: 'string',
        },
        total_cost_euro: {
          type: 'string',
        },
      },
      required: [
        'total_input_tokens',
        'total_output_tokens',
        'total_tokens',
        'total_cost_euro',
      ],
      additionalProperties: false,
    },
  },
  required: ['results'],
  additionalProperties: false,
} as const;

export default function CostAnalyzer({
  photos: _photos,
  context: _context,
}: Props = {}) {
  const {
    byokOpenAIKey,
    model,
    serviceTier,
    usageStats,
  } = useBYOKStoreSelector((state) => state);

  const { addUsageStat } = useBYOK();

  const prompts = useMemo(() => {
    const mainPrompt = [
      'Look at these API usage costs and provide a summary.',
      'Calculate the total input tokens, total output tokens, total tokens used, and total cost in Euro.',
      'Use today\'s EUR/USD exchange rate.',
      'Return JSON with exactly these keys:',
      'total_input_tokens, total_output_tokens, total_tokens, total_cost_euro.',
      'Do not include any other text or explanation.',
    ].join(' ');

    const calls = (usageStats ?? []).map((stat) => {
      const inputTokens = stat.usage.input_tokens * 1000;
      const outputTokens = stat.usage.output_tokens * 1000;
      const totalTokens = stat.usage.total_tokens * 1000;

      return [
        `Model: ${stat.model}`,
        `Service tier: ${stat.service_tier || 'auto'}`,
        `Input Tokens: ${inputTokens}`,
        `Output Tokens: ${outputTokens}`,
        `Total Tokens: ${totalTokens}`,
      ].join(', ');
    });

    return {
      main: mainPrompt,
      calls,
    };
  }, [usageStats]);

  const [results, setResults] = useState<CostAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!byokOpenAIKey || loading) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const input = [
        prompts.main,
        ...prompts.calls,
      ]
        .filter(Boolean)
        .join('\n\n');

      console.log('CostAnalyzer input:', input);

      const response = await fetch(OPENAI_RESPONSES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${byokOpenAIKey}`,
        },
        body: JSON.stringify({
          model,
          service_tier: serviceTier,

          input: [
            {
              role: 'user',
              content: [
                {
                  type: 'input_text',
                  text: input,
                },
              ],
            },
          ],

          text: {
            format: {
              type: 'json_schema',
              name: 'cost_analysis',
              strict: true,
              schema: RESPONSE_SCHEMA,
            },
          },
        }),
      });

      const data = (await response.json()) as OpenAIResponse;

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            `OpenAI request failed (${response.status})`,
        );
      }

      const outputText = data.output
        ?.filter((item) => item.type === 'message')
        .flatMap((item) => item.content ?? [])
        .find((content) => content.type === 'output_text')
        ?.text;

      if (!outputText) {
        throw new Error('OpenAI returned an empty response');
      }

      const parsed = JSON.parse(outputText) as {
        results: CostAnalysis;
      };

      if (!parsed.results) {
        throw new Error('OpenAI returned invalid cost analysis data');
      }

      setResults(parsed.results);

      addUsageStat({
        created_at: data.created_at ?? new Date().toISOString(),
        model: data.model ?? model,
        call_type: 'cost_analysis',
        service_tier: data.service_tier,
        usage: data.usage ?? {
          input_tokens: 0,
          output_tokens: 0,
          total_tokens: 0,
          input_tokens_details: {},
          output_tokens_details: {},
        },
      });
    } catch (e) {
      console.error(e);

      setError(
        e instanceof Error
          ? e.message
          : 'Analysis failed',
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
        onClick={analyze}
        disabled={!byokOpenAIKey || loading}
      >
        {loading ? 'Analyzing…' : 'Analyze'}
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
          component="pre"
          sx={{
            m: 0,
            fontSize: 12,
            fontFamily: 'monospace',
          }}
        >
          {JSON.stringify(results, null, 2)}
        </Box>
      )}
    </Box>
  );
}
