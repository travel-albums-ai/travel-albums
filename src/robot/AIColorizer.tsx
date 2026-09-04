import { useAdjustments, useAdjustmentsStoreSelector } from '@/context/adjustmentsStore';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import {
  Alert,
  Box,
  Button,
  Typography
} from '@mui/material';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

const OPENAI_IMAGES_EDIT_URL = 'https://api.openai.com/v1/images/edits';

const IMAGE_MODEL = 'gpt-image-2';

// Current GPT-Image-2 pricing.
// Image input: $8 / 1M image tokens
// Image output: $32 / 1M image tokens
// Text input: $5 / 1M text tokens
const PRICING = {
  textInputPerMillion: 5,
  imageInputPerMillion: 8,
  imageOutputPerMillion: 32,
};

type OpenAIImageResponse = {
  data?: Array<{
    b64_json?: string;
  }>;

  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;

    input_tokens_details?: {
      text_tokens?: number;
      image_tokens?: number;
    };

    output_tokens_details?: {
      image_tokens?: number;
    };
  };

  created?: number;

  error?: {
    message?: string;
  };
};

type Props = {
  imageBase64: string | null;
};

type CostBreakdown = {
  textInput: number;
  imageInput: number;
  imageOutput: number;
  total: number;
};

export default function AIColorizer() {
  const { byokOpenAIKey, aiLoading } = useBYOKStoreSelector((state) => state);
  const { processedBase64 } = useAdjustmentsStoreSelector((state) => state)
  const { setSetting } = useAdjustments();
  const { setAILoading, addUsageStat } = useBYOK();

  const [resultImage, setResultImage] = useState<string | null>(null);
  const [cost, setCost] = useState<CostBreakdown | null>(null);
  const [usage, setUsage] = useState<OpenAIImageResponse['usage'] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  async function colorize() {
    if (!processedBase64 || !byokOpenAIKey || aiLoading) {
      return;
    }

    setAILoading(true);
    setError(null);
    setResultImage(null);
    setCost(null);
    setUsage(null);

    try {
      const imageBlob = await base64ToBlob(processedBase64);

      const formData = new FormData();

      formData.append('model', IMAGE_MODEL);

      formData.append(
        'prompt',
        [
          'Colorize this photograph realistically.',

          'If the source image is black and white, restore natural and historically plausible colors.',
          'If the source image already contains some color, preserve it and improve only where appropriate.',

          'Preserve the original photograph as faithfully as possible.',
          'Do not change the composition, camera angle, perspective, geometry, identity, facial features, expressions, poses, clothing, objects, architecture, or background.',

          'Do not add or remove people or objects.',
          'Do not invent details that are not present in the source.',
          'Preserve the original lighting and photographic character.',
          'Use realistic skin tones, materials, vegetation, sky and environmental colors.',
          'Avoid cinematic color grading, excessive saturation, HDR effects, artificial sharpening, or a modern stylized look.',

          'The result should look like the original photograph was naturally captured in color.',
        ].join(' '),
      );

      formData.append(
        'image[]',
        imageBlob,
        'source.jpg',
      );

      // Let GPT-Image-2 choose the output dimensions.
      formData.append('size', 'auto');

      // Good balance for an actual photo restoration.
      formData.append('quality', 'medium');

      // JPEG keeps the returned photo reasonably sized.
      formData.append('output_format', 'jpeg');
      formData.append('output_compression', '90');

      const response = await fetch(OPENAI_IMAGES_EDIT_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${byokOpenAIKey}`,
        },
        body: formData,
      });

      const data = (await response.json()) as OpenAIImageResponse;

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            `OpenAI image edit failed (${response.status})`,
        );
      }

      const base64 = data.data?.[0]?.b64_json;

      if (!base64) {
        throw new Error('OpenAI returned no image');
      }

      const outputImage = `data:image/jpeg;base64,${base64}`;

      setResultImage(outputImage);

      setSetting({ processedBase64: outputImage });
      setUsage(data.usage ?? null);

      const calculatedCost = calculateCost(data.usage);

      setCost(calculatedCost);

      addUsageStat({
        created_at: data.created
          ? new Date(data.created * 1000).toISOString()
          : new Date().toISOString(),

        model: IMAGE_MODEL,

        call_type: 'image_colorization',

        service_tier: undefined,

        usage: {
          input_tokens: data.usage?.input_tokens ?? 0,
          output_tokens: data.usage?.output_tokens ?? 0,
          total_tokens: data.usage?.total_tokens ?? 0,

          input_tokens_details:
            data.usage?.input_tokens_details ?? {},

          output_tokens_details:
            data.usage?.output_tokens_details ?? {},
        },
      });
    } catch (e) {
      console.error(e);

      setError(
        e instanceof Error
          ? e.message
          : 'Colorization failed',
      );
    } finally {
      setAILoading(false);
    }
  }

  const disabled =
    !processedBase64 ||
    !byokOpenAIKey ||
    aiLoading;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          startIcon={<Sparkles size={16} />}
          onClick={colorize}
          disabled={disabled}
        >
          {aiLoading ? 'Colorizing…' : 'Colorize Photo'}
        </Button>

        {cost && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Cost: <strong>${cost.total.toFixed(4)}</strong>
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {/* Result */}
      {/* {resultImage && ( */}
      {/* <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '1fr 1fr',
                },
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    mb: 1,
                  }}
                >
                    ORIGINAL
                </Typography>

                <Box
                  component="img"
                  src={processedBase64 ?? undefined}
                  alt="Original"
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: '200px',
                    borderRadius: 2,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    mb: 1,
                  }}
                >
                    COLORIZED
                </Typography>

                <Box
                  component="img"
                  src={resultImage}
                  alt="Colorized"
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: '200px',
                    borderRadius: 2,
                  }}
                />
              </Box>
            </Box>

            <Divider />

            {cost && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1 }}
                >
                    AI usage
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: 1,
                  }}
                >
                  <UsageItem
                    label="Text input"
                    value={`$${cost.textInput.toFixed(5)}`}
                  />

                  <UsageItem
                    label="Image input"
                    value={`$${cost.imageInput.toFixed(5)}`}
                  />

                  <UsageItem
                    label="Image output"
                    value={`$${cost.imageOutput.toFixed(5)}`}
                  />

                  <UsageItem
                    label="Total"
                    value={`$${cost.total.toFixed(5)}`}
                    strong
                  />
                </Box>
              </Box>
            )}

            {usage && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {usage.input_tokens ?? 0} input tokens ·{' '}
                {usage.output_tokens ?? 0} output tokens ·{' '}
                {usage.total_tokens ?? 0} total · {IMAGE_MODEL}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card> */}
      {/* )} */}
    </Box>
  );
}

function UsageItem({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <Box
      sx={{
        p: 1.25,
        borderRadius: 1.5,
        bgcolor: 'action.hover',
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={strong ? 700 : 400}
      >
        {value}
      </Typography>
    </Box>
  );
}

async function base64ToBlob(
  base64: string,
): Promise<Blob> {
  const response = await fetch(base64);
  return response.blob();
}

function calculateCost(
  usage: OpenAIImageResponse['usage'],
): CostBreakdown {
  const textInputTokens =
    usage?.input_tokens_details?.text_tokens ?? 0;

  const imageInputTokens =
    usage?.input_tokens_details?.image_tokens ?? 0;

  const imageOutputTokens =
    usage?.output_tokens_details?.image_tokens ??
    usage?.output_tokens ??
    0;

  const textInput =
    (textInputTokens / 1_000_000) *
    PRICING.textInputPerMillion;

  const imageInput =
    (imageInputTokens / 1_000_000) *
    PRICING.imageInputPerMillion;

  const imageOutput =
    (imageOutputTokens / 1_000_000) *
    PRICING.imageOutputPerMillion;

  return {
    textInput,
    imageInput,
    imageOutput,
    total: textInput + imageInput + imageOutput,
  };
}
