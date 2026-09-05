import type { Edge, Node } from "@xyflow/react";

import type { GalleryPhoto } from "../../../lib/galleryData";
import { composeUrl } from "../../../lib/thumbnailService";
import type { Stage } from "../../interface/adjustments/types";
import {
  brightnessStage,
  contrastStage,
  exposureStage,
  gammaStage,
  grainStage,
  invertStage,
  luminosityStage,
  saturationStage,
  sharpenStage,
  vibranceStage,
  vignetteStage,
} from "../../interface/adjustments/utils";
import type { ImageArray, ImageValue, NodeOutputs, PipelineNodeDefinition } from "./types";

// Node types whose only parameter is a single slider value
// stored on node.data.amount.
const SLIDER_NODE_TYPES = new Set([
  "brightness",
  "gamma",
  "luminosity",
  "exposure",
  "contrast",
  "saturation",
  "vibrance",
  "vignette",
  "grain",
  "sharpen",
]);

// Viewer only ever displays this many photos.
const MAX_VIEWER_PHOTOS = 25;

// ============================================================
// AI Async image-edit nodes (colorizer, denoiser, ...)
// ============================================================

const OPENAI_IMAGES_EDIT_URL = "https://api.openai.com/v1/images/edits";
const AI_IMAGE_EDIT_MODEL = "gpt-image-2";

// Node types that share the passthru/apiKey data shape.
const AI_IMAGE_EDIT_NODE_TYPES = new Set(["ai-colorizer", "ai-denoiser"]);

const AI_COLORIZER_PROMPT = [
  "Colorize this photograph realistically.",
  "If the source image is black and white, restore natural and historically plausible colors.",
  "If the source image already contains some color, preserve it and improve only where appropriate.",
  "Preserve the original photograph as faithfully as possible.",
  "Do not change the composition, camera angle, perspective, geometry, identity, facial features, expressions, poses, clothing, objects, architecture, or background.",
  "Do not add or remove people or objects.",
  "Do not invent details that are not present in the source.",
  "Preserve the original lighting and photographic character.",
  "Use realistic skin tones, materials, vegetation, sky and environmental colors.",
  "Avoid cinematic color grading, excessive saturation, HDR effects, artificial sharpening, or a modern stylized look.",
  "The result should look like the original photograph was naturally captured in color.",
].join(" ");

const AI_DENOISER_PROMPT = [
  "Reduce excessive film grain, scan noise, and digital noise while preserving the natural texture and fine detail of the original photograph.",
  "Remove noise selectively rather than applying aggressive smoothing, with particular care around faces, hair, skin, fabric, foliage, architecture, and other areas containing genuine texture.",
  "Preserve authentic film grain where it contributes to the original photographic character.",
  "Do not introduce artificial sharpening, plastic-looking skin, invented texture, excessive smoothing, HDR effects, or a modern digital appearance.",
  "Preserve the original composition, geometry, identity, facial features, expressions, poses, objects, lighting, tonal relationships, and photographic character.",
  "The result should look like the same photograph captured or scanned with less distracting degradation, not like a newly generated image.",
].join(" ");

function dispatchAIImageEditProgress(
  nodeType: string,
  nodeId: string,
  runId: number,
  completed: number,
  total: number
) {
  window.dispatchEvent(
    new CustomEvent(`${nodeType}:progress`, {
      detail: { nodeId, runId, completed, total },
    })
  );
}

function imageValueToBlob(source: ImageValue): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");

    canvas.width = source.width;
    canvas.height = source.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not create canvas context"));
      return;
    }

    ctx.drawImage(source.image, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not create image blob"));
        return;
      }

      resolve(blob);
    }, "image/jpeg", 0.92);
  });
}

async function requestOpenAIImageEdit(
  source: ImageValue,
  apiKey: string,
  prompt: string
): Promise<ImageValue> {
  const blob = await imageValueToBlob(source);

  const formData = new FormData();

  formData.append("model", AI_IMAGE_EDIT_MODEL);
  formData.append("prompt", prompt);
  formData.append("image[]", blob, "source.jpg");
  formData.append("size", "auto");
  formData.append("quality", "medium");
  formData.append("output_format", "jpeg");
  formData.append("output_compression", "90");

  const response = await fetch(OPENAI_IMAGES_EDIT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || `OpenAI image edit failed (${response.status})`
    );
  }

  const base64 = data.data?.[0]?.b64_json;

  if (!base64) {
    throw new Error("OpenAI returned no image");
  }

  const result = new Image();

  result.src = `data:image/jpeg;base64,${base64}`;

  await result.decode();

  return {
    image: result,
    width: result.naturalWidth,
    height: result.naturalHeight,
    name: source.name,
  };
}

// Builds a node definition for an OpenAI image-edit operation (colorize,
// denoise, ...). Each instance gets its own run counter and result cache,
// so re-running the pipeline on an already-processed image reuses the
// cached result instead of calling OpenAI again.
function createAIImageEditNodeDefinition(
  nodeType: string,
  label: string,
  prompt: string
): PipelineNodeDefinition {
  let runSeq = 0;
  const cache = new Map<string, ImageValue>();

  async function editImage(
    source: ImageValue,
    apiKey: string
  ): Promise<ImageValue> {
    const cacheKey = source.image.src;
    const cached = cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const edited = await requestOpenAIImageEdit(source, apiKey, prompt);

    cache.set(cacheKey, edited);

    return edited;
  }

  return {
    async execute(inputs) {
      const sources = (inputs.image as ImageArray | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const passthru = (inputs.passthru as boolean | undefined) ?? true;
      const nodeId = inputs.nodeId as string;

      if (passthru) {
        return { image: sources };
      }

      const apiKey = inputs.apiKey as string | undefined;

      if (!apiKey) {
        console.error(`${label}: missing OpenAI API key`);
        return { image: sources };
      }

      const runId = ++runSeq;
      const total = sources.length;
      let completed = 0;

      dispatchAIImageEditProgress(nodeType, nodeId, runId, completed, total);

      const image = await Promise.all(
        sources.map(async (source) => {
          try {
            return await editImage(source, apiKey);
          } catch (error) {
            console.error(`${label} failed for an image:`, error);
            return source;
          } finally {
            completed += 1;
            dispatchAIImageEditProgress(nodeType, nodeId, runId, completed, total);
          }
        })
      );

      return { image };
    },
  };
}

// ============================================================
// Utility: load a File as an HTMLImageElement
// ============================================================

function loadImage(file: File): Promise<ImageValue> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);

    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);

      resolve({
        image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        name: file.name,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    image.src = url;
  });
}

// Loads a batch of files in parallel.
function loadImages(files: File[]): Promise<ImageArray> {
  return Promise.all(files.map(loadImage));
}

function loadImageFromUrl(url: string, name?: string): Promise<ImageValue> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.crossOrigin = "anonymous";

    image.onload = () => {
      resolve({
        image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        name,
      });
    };

    image.onerror = () => {
      reject(new Error(`Failed to load image from ${url}`));
    };

    image.src = url;
  });
}

function loadImagesFromUrls(
  entries: Array<{ url: string; name?: string }>
): Promise<ImageArray> {
  return Promise.all(
    entries.map((entry) => loadImageFromUrl(entry.url, entry.name))
  );
}

// ============================================================
// Utility: render a source image onto a canvas, optionally
// applying a per-pixel transform, and return the result.
// ============================================================

async function renderImage(
  source: ImageValue,
  draw: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => void,
  transformPixels?: Stage
): Promise<ImageValue> {
  const canvas = document.createElement("canvas");

  canvas.width = source.width;
  canvas.height = source.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  draw(ctx, canvas);

  if (transformPixels) {
    const pixels = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    transformPixels(pixels);

    ctx.putImageData(pixels, 0, 0);
  }

  const result = new Image();

  result.src = canvas.toDataURL("image/png");

  await result.decode();

  return {
    image: result,
    width: canvas.width,
    height: canvas.height,
    name: source.name,
  };
}

// Applies a render operation to every photo in the batch, in parallel.
function renderImages(
  sources: ImageArray,
  draw: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    source: ImageValue
  ) => void,
  transformPixels?: Stage
): Promise<ImageArray> {
  return Promise.all(
    sources.map((source) =>
      renderImage(
        source,
        (ctx, canvas) => draw(ctx, canvas, source),
        transformPixels
      )
    )
  );
}

// ============================================================
// Utility: scale an image to a percentage of its original size,
// preserving aspect ratio.
// ============================================================

async function scaleImage(
  source: ImageValue,
  scale: number
): Promise<ImageValue> {
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  ctx.drawImage(source.image, 0, 0, width, height);

  const result = new Image();

  result.src = canvas.toDataURL("image/png");

  await result.decode();

  return {
    image: result,
    width,
    height,
    name: source.name,
  };
}

function scaleImages(
  sources: ImageArray,
  scale: number
): Promise<ImageArray> {
  return Promise.all(sources.map((source) => scaleImage(source, scale)));
}

// ============================================================
// Node implementations
// ============================================================

const nodeDefinitions: Record<
  string,
  PipelineNodeDefinition
> = {
  source: {
    async execute(inputs) {
      const files = inputs.files as File[] | undefined;

      if (!files || files.length === 0) { return { image: [] } }

      const image = await loadImages(files);

      return { image };
    },
  },

  selection: {
    async execute(inputs) {
      const photos = inputs.photos as GalleryPhoto[] | undefined;

      if (!photos || photos.length === 0) { return { image: [] } }

      const image = await loadImagesFromUrls(
        photos.map((photo) => ({ url: composeUrl(photo), name: photo.title }))
      );

      return { image };
    },
  },

  invert: {
    async execute(inputs) {
      const sources = (inputs.image as ImageArray | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const image = await renderImages(
        sources,
        (ctx, _canvas, source) => ctx.drawImage(source.image, 0, 0),
        invertStage()
      );

      return { image };
    },
  },

  flip: {
    async execute(inputs) {
      const sources = (inputs.image as ImageArray | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const image = await renderImages(
        sources,
        (ctx, canvas, source) => {
          // Rotate 180deg around the canvas center.
          ctx.translate(canvas.width, canvas.height);
          ctx.rotate(Math.PI);
          ctx.drawImage(source.image, 0, 0);
        }
      );

      return { image };
    },
  },

  brightness: {
    async execute(inputs) {
      const sources = (inputs.image as ImageArray | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const amount = (inputs.amount as number | undefined) ?? 0;

      const image = await renderImages(
        sources,
        (ctx, _canvas, source) => ctx.drawImage(source.image, 0, 0),
        brightnessStage(amount)
      );

      return { image };
    },
  },

  gamma: {
    async execute(inputs) {
      const sources = (inputs.image as ImageArray | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const amount = (inputs.amount as number | undefined) ?? 1;

      const image = await renderImages(
        sources,
        (ctx, _canvas, source) => ctx.drawImage(source.image, 0, 0),
        gammaStage(amount)
      );

      return { image };
    },
  },

  luminosity: {
    async execute(inputs) {
      const sources = (inputs.image as ImageArray | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const amount = (inputs.amount as number | undefined) ?? 0;

      const image = await renderImages(
        sources,
        (ctx, _canvas, source) => ctx.drawImage(source.image, 0, 0),
        luminosityStage(amount)
      );

      return { image };
    },
  },

  exposure: {
    async execute(inputs) {
      const sources = (inputs.image as ImageArray | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const amount = (inputs.amount as number | undefined) ?? 0;

      const image = await renderImages(
        sources,
        (ctx, _canvas, source) => ctx.drawImage(source.image, 0, 0),
        exposureStage(amount)
      );

      return { image };
    },
  },

  contrast: {
    async execute(inputs) {
      const sources = (inputs.image as ImageArray | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const amount = (inputs.amount as number | undefined) ?? 0;

      const image = await renderImages(
        sources,
        (ctx, _canvas, source) => ctx.drawImage(source.image, 0, 0),
        contrastStage(amount)
      );

      return { image };
    },
  },

  saturation: {
    async execute(inputs) {
      const sources = (inputs.image as ImageArray | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const amount = (inputs.amount as number | undefined) ?? 0;

      const image = await renderImages(
        sources,
        (ctx, _canvas, source) => ctx.drawImage(source.image, 0, 0),
        saturationStage(amount)
      );

      return { image };
    },
  },

  vibrance: {
    async execute(inputs) {
      const sources = (inputs.image as ImageArray | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const amount = (inputs.amount as number | undefined) ?? 0;

      const image = await renderImages(
        sources,
        (ctx, _canvas, source) => ctx.drawImage(source.image, 0, 0),
        vibranceStage(amount)
      );

      return { image };
    },
  },

  vignette: {
    async execute(inputs) {
      const sources = (inputs.image as ImageArray | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const amount = (inputs.amount as number | undefined) ?? 0;

      const image = await renderImages(
        sources,
        (ctx, _canvas, source) => ctx.drawImage(source.image, 0, 0),
        vignetteStage(amount)
      );

      return { image };
    },
  },

  grain: {
    async execute(inputs) {
      const sources = (inputs.image as ImageArray | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const amount = (inputs.amount as number | undefined) ?? 0;

      const image = await renderImages(
        sources,
        (ctx, _canvas, source) => ctx.drawImage(source.image, 0, 0),
        grainStage(amount)
      );

      return { image };
    },
  },

  sharpen: {
    async execute(inputs) {
      const sources = (inputs.image as ImageArray | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const amount = (inputs.amount as number | undefined) ?? 0;

      const image = await renderImages(
        sources,
        (ctx, _canvas, source) => ctx.drawImage(source.image, 0, 0),
        sharpenStage(amount)
      );

      return { image };
    },
  },

  "ai-colorizer": createAIImageEditNodeDefinition(
    "ai-colorizer",
    "AI Colorizer",
    AI_COLORIZER_PROMPT
  ),

  "ai-denoiser": createAIImageEditNodeDefinition(
    "ai-denoiser",
    "AI Denoiser",
    AI_DENOISER_PROMPT
  ),

  rescale: {
    async execute(inputs) {
      const sources = (inputs.image as ImageArray | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const scale = (inputs.scale as number | undefined) ?? 1;

      if (scale === 1) {
        return { image: sources };
      }

      const image = await scaleImages(sources, scale);

      return { image };
    },
  },

  viewer: {
    async execute(inputs) {
      await Promise.resolve();

      const images = (inputs.image as ImageArray | undefined) ?? [];

      // The viewer only ever displays the first N photos.
      return {
        image: images,
      };
    },
  },
};

// ============================================================
// Pipeline evaluator
// ============================================================

export async function evaluatePipeline(
  nodes: Node[],
  edges: Edge[]
) {
  const outputs = new Map<
    string,
    Promise<NodeOutputs>
  >();

  const evaluateNode = (
    nodeId: string
  ): Promise<NodeOutputs> => {
    // Already evaluating?
    const existing = outputs.get(nodeId);

    if (existing) {
      return existing;
    }

    const node = nodes.find(
      (n) => n.id === nodeId
    );

    if (!node) {
      return Promise.reject(
        new Error(`Node ${nodeId} not found`)
      );
    }

    const definition =
      nodeDefinitions[node.type ?? ""];

    if (!definition) {
      return Promise.reject(
        new Error(
          `No definition for ${node.type}`
        )
      );
    }

    const promise = (async () => {
      const incoming = edges.filter(
        (edge) => edge.target === nodeId
      );

      const inputEntries =
        await Promise.all(
          incoming.map(async (edge) => {
            const upstream =
              await evaluateNode(edge.source);

            return [
              edge.targetHandle ?? "input",
              upstream[
                edge.sourceHandle ?? "output"
              ],
            ] as const;
          })
        );

      const inputs =
        Object.fromEntries(inputEntries);

      // Special case:
      // Source node gets its Files from node.data.
      if (node.type === "source") {
        inputs.files = node.data.files;
      }

      // Special case:
      // Selection node gets its GalleryPhotos from node.data.
      if (node.type === "selection") {
        inputs.photos = node.data.photos;
      }

      // Special case:
      // Slider nodes get their amount from node.data.
      if (SLIDER_NODE_TYPES.has(node.type ?? "")) {
        inputs.amount = node.data.amount;
      }

      // Special case:
      // AI image-edit nodes get their passthru toggle and BYOK key from node.data.
      if (AI_IMAGE_EDIT_NODE_TYPES.has(node.type ?? "")) {
        inputs.passthru = node.data.passthru;
        inputs.apiKey = node.data.apiKey;
        inputs.nodeId = node.id;
      }

      // Special case:
      // Rescale node gets its scale factor from node.data.
      if (node.type === "rescale") {
        inputs.scale = node.data.scale;
      }

      console.log(
        `▶ executing ${node.id}`
      );

      const result =
        await definition.execute(inputs);

      console.log(
        `✓ completed ${node.id}`
      );

      return result;
    })();

    outputs.set(nodeId, promise);

    return promise;
  };

  // Evaluate every node.
  await Promise.all(
    nodes.map((node) =>
      evaluateNode(node.id)
    )
  );

  return outputs;
}
