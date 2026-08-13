import OpenAI from 'openai';
import { useState } from 'react';

type Props = {
  apiKey: string;
};

export default function ImageAnalyzer({ apiKey }: Props) {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<unknown>();
  const [loading, setLoading] = useState(false);

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
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
      />

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
