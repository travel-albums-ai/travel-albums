import { useBYOKStoreSelector } from '@/context/byokStore';
import {
  Alert,
  Box,
  Button,
  Typography
} from '@mui/material';
import { Astroid } from 'lucide-react';
import OpenAI from 'openai';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  context: any;
};

const CACHE_PREFIX = 'day-analyzer:';

async function getCacheKey(input: string) {
  const hash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(input),
  );

  return CACHE_PREFIX + [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function DayAnalyzer({ context }: Props) {
  const { byokOpenAIKey, mainPersona } = useBYOKStoreSelector((state) => state);

  // const prompt = useMemo(
  //   () =>
  //     'Make a story of max 100 words about the day based on the following descriptions: ' +
  //     context.descriptions.join(' ') + 'Main persona: ' + mainPersona.name + ' as a ' + mainPersona.description,
  //   [context.descriptions, mainPersona.name, mainPersona.description],
  // );
  const prompt = useMemo(
    () =>
      'Make a story of max 100 words about the day based on the following descriptions: ' +
      context.descriptions.join(' ') + 'Main persona: ' + mainPersona.name + ' as a ' + mainPersona.description,
    [context.descriptions, mainPersona.name, mainPersona.description],
  );

  const [result, setResult] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheKey, setCacheKey] = useState<string | null>(null);

  // Eagerly check cache whenever the context changes
  useEffect(() => {
    let cancelled = false;

    setResult(null);
    setCached(false);
    setError(null);

    getCacheKey(prompt).then((key) => {
      if (cancelled) return;

      setCacheKey(key);

      const value = localStorage.getItem(key);

      if (value) {
        setResult(value);
        setCached(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [prompt]);

  async function analyze() {
    if (!byokOpenAIKey || loading || !cacheKey) return;

    setLoading(true);
    setError(null);

    try {
      // Double-check in case another tab/component populated it
      const existing = localStorage.getItem(cacheKey);

      if (existing) {
        setResult(existing);
        setCached(true);
        return;
      }

      const response = await new OpenAI({
        apiKey: byokOpenAIKey,
        dangerouslyAllowBrowser: true,
      }).responses.create({
        model: 'gpt-5.6-luna',
        input: [{
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            ...Object.values(context).map((desc) => ({ type: 'input_text', text: desc })),
          ],
        } as any],
        text: {
          format: {
            type: 'json_schema',
            name: 'image_analysis',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                results: { type: 'string' },
              },
              required: ['results'],
              additionalProperties: false,
            },
          },
        },
      });

      const value = JSON.parse(response.output_text).results;

      localStorage.setItem(cacheKey, value);
      setResult(value);
      setCached(false);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {!result && <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<Astroid size={16} />}
            variant="outlined"
            size="small"
            onClick={analyze}
            disabled={!byokOpenAIKey || loading || !cacheKey}
          >
            {loading
              ? 'Describing...'
              : cached
                ? 'Regenerate'
                : 'Describe my moment'}
          </Button>
        </Box>
      </Box>}

      {error && <Alert severity="error">{error}</Alert>}

      {result && (
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', flexGrow: 1, borderRadius: 2, bgcolor: 'background.paper', maxWidth: '100%' }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            {cached && <Typography variant="caption" color="textDisabled">
              Cached result
            </Typography>}
            {!cached && <Typography variant="caption" color="textDisabled">
              Fresh result
            </Typography>}
            <Button
              startIcon={<Astroid size={16} />}
              variant="outlined"
              size="small"
              onClick={analyze}
              disabled={!byokOpenAIKey || loading || !cacheKey}
            >
              {loading
                ? 'Thinking...'
                : 'Regenerate'}
            </Button>
          </Box>
          <Typography gutterBottom={false}>{result}</Typography>
        </Box>
      )}
    </Box>
  );
}
