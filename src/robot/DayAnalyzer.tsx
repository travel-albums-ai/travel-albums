import { useBYOKStoreSelector } from '@/context/byokStore';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Typography
} from '@mui/material';
import OpenAI from 'openai';
import { useState } from 'react';

type Result = {
  index: number;
  description: string;
};

type Props = {
  context: any;
};

export default function DayAnalyzer({ context }: Props) {
  const byokOpenAIKey = useBYOKStoreSelector((state) => state.byokOpenAIKey)

  console.log('DayAnalyzer context', context);

  const [prompt, setPrompt] = useState(
    'Make a story of max 200 words about the day based on the following descriptions: ' + context.descriptions.join(' ') ,
  );
  // const [results, setResults] = useState<Result[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!byokOpenAIKey || loading) return;

    setLoading(true);
    setError(null);
    // setResults([]);

    try {
      const response = await new OpenAI({
        apiKey: byokOpenAIKey,
        dangerouslyAllowBrowser: true,
      }).responses.create({
        model: 'gpt-5.6-luna',
        input: [{
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
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
                results: {
                  type: 'string',
                },
              },
              required: ['results'],
              additionalProperties: false,
            },
          },
        },
      });


      setResult(JSON.parse(response.output_text).results);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }


  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>

      <textarea value={prompt} style={{ width: '100%', minHeight: 100 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={analyze}
            disabled={!byokOpenAIKey || loading}
          >
            {loading ? 'Analyzing…' : 'Analyze'}
          </Button>

        </Box>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {result && (
        <Card variant="outlined">
          <CardContent>
            <Typography>{result}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
