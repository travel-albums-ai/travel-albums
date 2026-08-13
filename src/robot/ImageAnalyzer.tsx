import { useAISinkStoreSelector } from '@/context/aiSinkStore';
import { useBYOKStoreSelector } from '@/context/byokStore';
import { useDescriptions } from '@/context/descriptionsStore';
import { GalleryPhoto } from '@/lib/galleryData';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import OpenAI from 'openai';
import { useState } from 'react';

type Result = {
  index: number;
  description: string;
};

type Props = {
  photos: GalleryPhoto[];
};

export default function ImageAnalyzer({ photos }: Props) {
  const byokOpenAIKey = useBYOKStoreSelector((state) => state.byokOpenAIKey)
  const imageBase64 = useAISinkStoreSelector((state) => state.autoDescriptionPreview);
  const { describePhoto } = useDescriptions()

  const [prompt, setPrompt] = useState(
    'Look at all the photos and describe what is in each one. Return an array containing the photo index and description for each photo.',
  );
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!imageBase64 || !byokOpenAIKey || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await new OpenAI({
        apiKey: byokOpenAIKey,
        dangerouslyAllowBrowser: true,
      }).responses.create({
        model: 'gpt-5.6',
        input: [{
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            { type: 'input_image', image_url: imageBase64 },
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
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      index: { type: 'number' },
                      description: { type: 'string' },
                    },
                    required: ['index', 'description'],
                    additionalProperties: false,
                  },
                },
              },
              required: ['results'],
              additionalProperties: false,
            },
          },
        },
      });

      setResults(JSON.parse(response.output_text).results);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }

  const addAllDescriptions = () => {
    photos.forEach((photo, index) => {
      const result = results.find((r) => r.index === index);
      if (result) {
        describePhoto(photo.id, result.description);
      }
    }
    )}

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {imageBase64 && (
        <Card variant="outlined">
          <CardContent>
            <Box
              component="img"
              src={imageBase64}
              alt="Image being analyzed"
              sx={{
                display: 'block',
                maxWidth: 200,
                maxHeight: 200,
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
        <TextField
          label="Prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          multiline
          minRows={5}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={analyze}
            disabled={!imageBase64 || !byokOpenAIKey || loading}
          >
            {loading ? 'Analyzing…' : 'Analyze'}
          </Button>
          <Button
            variant="contained"
            onClick={addAllDescriptions}
            disabled={!imageBase64 || !byokOpenAIKey || loading}
          >
            {loading ? 'Analyzing…' : 'Add All Descriptions'}
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {results.length > 0 && (
        <Stack spacing={1}>
          {results.map((result) => (
            <Card key={result.index} variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={`Photo ${result.index}`}
                    size="small"
                    variant="outlined"
                  />
                  <Typography>{result.description}</Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
