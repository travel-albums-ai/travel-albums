import OpenAI from 'openai';
import { useEffect, useState } from 'react';

type Props = {
  apiKey: string;
  image: File | null;
};

export default function ImageAnalyzer({ apiKey, image }: Props) {
  const [prompt, setPrompt] = useState('Look at all the photos and answer in JSON with the index of the photo and what is in the photo. For example, if there is a photo of a cat, the answer should be: { "index": 0, "description": "A cat" }. If there are multiple photos, please provide an array of objects with the index and description for each photo.');
  const [result, setResult] = useState<unknown>();
  const [loading, setLoading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      setImagePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setImagePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  async function analyze() {
    if (!image || !apiKey) return;

    setLoading(true);

    try {
      const client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      const base64 = await fileToBase64(image);

      const response = await client.responses.create({
        model: 'gpt-5.6',
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: prompt,
              },
              {
                type: 'input_image',
                image_url: base64,
              },
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'result',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                description: {
                  type: 'string',
                },
                tags: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              },
              required: ['description', 'tags'],
              additionalProperties: false,
            },
          },
        },
      });

      setResult(JSON.parse(response.output_text));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {imagePreviewUrl && (
        <img
          src={imagePreviewUrl}
          alt="Current image for analysis"
          style={{ display: 'block', maxWidth: '100px', height: 'auto' }}
        />
      )}

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="What do you want to know?"
      />

      <button
        disabled={!image || !apiKey || loading}
        onClick={analyze}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {result && (
        <pre>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
