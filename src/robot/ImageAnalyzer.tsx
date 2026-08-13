import { useAISinkStoreSelector } from '@/context/aiSinkStore';
import OpenAI from 'openai';
import { useState } from 'react';

type AnalysisResult = {
  index: number;
  description: string;
};

type Props = {
  apiKey: string;
};

export default function ImageAnalyzer({ apiKey }: Props) {
  const [prompt, setPrompt] = useState(
    'Look at the photo and describe what is in it. Return the result as JSON with the photo index and description. For example: { "index": 0, "description": "A cat sitting on a sofa." }',
  );

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  // This should already be a data URL such as:
  // data:image/jpeg;base64,/9j/4AAQSkZJRg...
  const imageBase64 = useAISinkStoreSelector(
    (state) => state.autoDescriptionPreview,
  );

  async function analyze() {
    if (!imageBase64 || !apiKey || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

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
                image_url: imageBase64,
              },
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'image_analysis',
            strict: true,
            schema: {
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
      });

      setResult(JSON.parse(response.output_text));
    } catch (error) {
      console.error('Image analysis failed:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {imageBase64 && (
        <img
          src={imageBase64}
          alt="Current image for analysis"
          style={{
            display: 'block',
            maxWidth: '100px',
            height: 'auto',
          }}
        />
      )}

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="What do you want to know?"
      />

      <button
        disabled={!imageBase64 || !apiKey || loading}
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
