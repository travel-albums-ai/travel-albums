import { useAISinkStoreSelector } from '@/context/aiSinkStore';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import { GalleryPhoto } from '@/lib/galleryData';
import {
  Box,
  Button
} from '@mui/material';
import { Astroid } from 'lucide-react';
import { useMemo, useState } from 'react';

type Result = {
  index: number;
  description: string;
};

type Props = {
  photos: GalleryPhoto[];
  context: Record<string, unknown>;
};

type OpenAIResponse = {
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
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
          type: 'number',
        },
        total_output_tokens: {
          type: 'number',
        },
        total_tokens: {
          type: 'number',
        },
        total_cost_euro: {
          type: 'number',
        },
      },
      required: ['total_input_tokens', 'total_output_tokens', 'total_tokens', 'total_cost_euro'],
      additionalProperties: false,
    },
  },
  required: ['results'],
  additionalProperties: false,
} as const;

export default function CostAnalyzer() {
  const {
    byokOpenAIKey,
    model,
    serviceTier,
    usageStats,
  } = useBYOKStoreSelector((state) => state);

  const { addUsageStat } = useBYOK()


  const imageBase64 = useAISinkStoreSelector(
    (state) => state.autoDescriptionPreview,
  );


  const prompts = useMemo(() => ({
    main: [
      'Look at these costs and provide a summary of the total input tokens, total output tokens, and total tokens used. In Euro at todays exchange rate. Return the result in JSON format with keys: total_input_tokens, total_output_tokens, total_tokens, total_cost_euro. Give me the result without rounding, with 5 decimal places. Do not include any other text or explanation.',
    ].join(' '),

    calls: usageStats?.map((stat) => `Model: ${stat.model}, Service tier: ${stat.service_tier || 'auto'}, Input Tokens: ${stat.usage.input_tokens * 1000 }, Output Tokens: ${stat.usage.output_tokens * 1000 }, Total Tokens: ${stat.usage.total_tokens * 1000 }`) ?? [],
  }), []);

  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!imageBase64 || !byokOpenAIKey || loading) return;

    setLoading(true);
    setError(null);
    setResults('');

    try {
      const input = [
        ...Object.values(prompts),
        // ...Object.values(usageStats?.map((stat) => `Model: ${stat.model}, Service tier: ${stat.service_tier || 'auto'}, Input Tokens: ${stat.usage.input_tokens * 1000 }, Output Tokens: ${stat.usage.output_tokens * 1000 }, Total Tokens: ${stat.usage.total_tokens * 1000 }`) ?? []),
      ]
        .filter((value) => value != null && value !== '')
        .map(String)
        .join('\n\n');

      console.log('CostAnalyzer input:', input);

      // return

      const response = await fetch(OPENAI_RESPONSES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${byokOpenAIKey}`,
        },
        body: JSON.stringify({
          model,
          service_tier: serviceTier,

          input: [{
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: input,
              },
              // {
              //   type: 'input_image',
              //   image_url: imageBase64,
              // },
            ],
          }],

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
        results: Result[];
      };

      setResults(parsed.results);
      addUsageStat({
        created_at: data.created_at ?? new Date().toISOString(),
        model: data.model,
        call_type: 'cost_analysis',
        service_tier: data.service_tier,
        usage: data.usage ?? {
          input_tokens: 0,
          output_tokens: 0,
          total_tokens: 0,
          input_tokens_details: {},
          output_tokens_details: {},
        } });
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
        flexDirection: 'row',
        gap: 1,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >

      <Button
        variant="outlined"
        startIcon={<Astroid size={16} />}
        size="small"
        color="inherit"
        onClick={analyze}
        disabled={!imageBase64 || !byokOpenAIKey || loading}
      >
        {loading ? 'Analyzing…' : 'Analyze'}
      </Button>
      {JSON.stringify(results)}

    </Box>
  );
}
