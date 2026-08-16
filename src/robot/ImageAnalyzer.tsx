import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { useAISinkStoreSelector } from '@/context/aiSinkStore';
import { useBYOKStoreSelector } from '@/context/byokStore';
import { useDescriptions } from '@/context/descriptionsStore';
import { GalleryPhoto } from '@/lib/galleryData';
import {
  Alert,
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
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
  output_text?: string;
  error?: {
    message?: string;
  };
};

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          index: {
            type: 'number',
          },
          description: {
            type: 'string',
          },
        },
        required: ['index', 'description'],
        additionalProperties: false,
      },
    },
  },
  required: ['results'],
  additionalProperties: false,
} as const;

export default function ImageAnalyzer({ photos, context }: Props) {
  const {
    byokOpenAIKey,
    mainPersona,
    additionalPersonas,
  } = useBYOKStoreSelector((state) => state);

  const imageBase64 = useAISinkStoreSelector(
    (state) => state.autoDescriptionPreview,
  );

  const { describePhoto } = useDescriptions();

  const prompts = useMemo(() => ({
    main: [
      'Look at all the photos and describe what is in each one.',
      'Return an array containing the photo index and description for each photo.',
      'Unclear photos can be described as "Unclear".',
      'Start from index 0.',
      'Return the result in JSON format.',
      'Max 30 words per description.',
    ].join(' '),

    mainPersonaPrompt:
      `If the person looks like: ${mainPersona.description}, then it's ${mainPersona.name}.`,

    friendsPrompt:
      additionalPersonas
        ?.map(
          (p) =>
            `If the person looks like: ${p.description}, then it's likely ${p.name}.`,
        )
        .join(' ') ?? '',
  }), [mainPersona, additionalPersonas]);

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!imageBase64 || !byokOpenAIKey || loading) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const input = [
        ...Object.values(prompts),
        ...Object.values(context),
      ]
        .filter((value) => value != null && value !== '')
        .map(String)
        .join('\n\n');

      const response = await fetch(OPENAI_RESPONSES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${byokOpenAIKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-5.6-luna',

          input: [{
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: input,
              },
              {
                type: 'input_image',
                image_url: imageBase64,
              },
            ],
          }],

          text: {
            format: {
              type: 'json_schema',
              name: 'image_analysis',
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

      if (!data.output_text) {
        throw new Error('OpenAI returned an empty response');
      }

      const parsed = JSON.parse(data.output_text) as {
        results: Result[];
      };

      setResults(parsed.results);
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

  function addAllDescriptions() {
    for (const result of results) {
      const photo = photos[result.index];

      if (photo) {
        describePhoto(photo.id, result.description);
      }
    }

    setResults([]);
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 1,
          flexGrow: 1,
        }}
      >
        {[...Object.entries(prompts), ...Object.entries(context)].map(
          ([key, desc]) => (
            <Box
              key={key}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                borderBottom: 1,
                borderColor: 'divider',
                pb: 0.5,
              }}
            >
              <Typography
                variant="caption"
                color="textDisabled"
                sx={{
                  textTransform: 'capitalize',
                  flex: '0 0 120px',
                }}
              >
                {key}:
              </Typography>

              <Typography
                variant="caption"
                color="textSecondary"
              >
                {String(desc)}
              </Typography>
            </Box>
          ),
        )}

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
            disabled={
              !imageBase64 ||
              !byokOpenAIKey ||
              loading ||
              results.length === 0
            }
          >
            Add All Descriptions
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {results.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            height: '500px',
            overflowY: 'auto',
          }}
        >
          <Stack spacing={1}>
            {results.map((result) => {
              const photo = photos[result.index];

              if (!photo) return null;

              return (
                <Box
                  key={result.index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    alignItems: 'center',
                    p: 1,
                    border: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 1,
                      overflow: 'hidden',
                      flexShrink: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                      position: 'relative',
                    }}
                  >
                    <AlbumPhotoThumbnailBackgroundNg photo={photo} />
                  </Box>

                  <Typography
                    color="textSecondary"
                    variant="caption"
                  >
                    {result.index + 1}: {result.description}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
