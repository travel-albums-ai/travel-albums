// Pipeline evaluation engine, running on a dedicated worker so heavy
// per-pixel processing never blocks the main thread.
//
// Compared to the old main-thread engine:
// - Images travel between stages as ImageBitmaps, so intermediate stages
//   no longer pay a canvas.toDataURL base64 encode + <img> decode round
//   trip per image per stage. Only the final viewer output is encoded.
// - Per-image work (load / transform / encode / AI upload) is bounded by
//   MAX_CONCURRENT_IMAGE_OPS so large batches don't exhaust memory.
// - Every new evaluation cooperatively cancels the previous one: stale
//   checks run between images and in-flight fetches are aborted.

import type { GalleryPhoto } from "../../../lib/galleryData";
import { composeUrl } from "../../../lib/thumbnailService";
import type { Stage } from "../../interface/adjustments/types";
import {
  blackAndWhiteStage,
  brightnessStage,
  contrastStage,
  exposureStage,
  fadeStage,
  gammaStage,
  grainStage,
  hdrEffectStage,
  invertStage,
  luminosityStage,
  popStage,
  saturationStage,
  sharpenStage,
  vibranceStage,
  vignetteStage,
} from "../../interface/adjustments/utils";
import type {
  NodeOutputs,
  PipelineEvaluateMessage,
  PipelineNodeDefinition,
  PipelineViewerImagePayload,
  PipelineWorkerOutbound,
} from "./types";
import { VIEWER_NODE_TYPES } from "./types";

// ============================================================
// Worker scope
// ============================================================

// The app compiles against the DOM lib (where `self` is Window), so the
// worker's global scope is described structurally here instead.
type WorkerScope = {
  postMessage: (message: PipelineWorkerOutbound) => void;
  onmessage: ((event: MessageEvent<PipelineEvaluateMessage>) => void) | null;
};

const workerScope = self as unknown as WorkerScope;

// ============================================================
// In-worker image representation
// ============================================================

// Inside the worker, images are ImageBitmaps: cheap GPU-side handles
// that can be drawn straight onto an OffscreenCanvas.
type WorkerImage = {
  bitmap: ImageBitmap;
  width: number;
  height: number;
  name?: string;
  // Stable identity (thumbnail URL / file fingerprint) used as the
  // AI node result-cache key.
  cacheKey?: string;
};

// Bounds in-flight image work. The worker is single-threaded, so this
// overlaps async gaps (decode/encode/fetch) rather than CPU work.
const MAX_CONCURRENT_IMAGE_OPS = Math.max(
  2,
  Math.min(4, navigator.hardwareConcurrency ?? 4)
);

// ============================================================
// Cooperative cancellation
// ============================================================

class StaleEvaluationError extends Error {
  constructor() {
    super("Pipeline evaluation superseded");
  }
}

let latestEvaluationId = 0;
let activeController: AbortController | null = null;

function throwIfStale(evaluationId: number) {
  if (evaluationId !== latestEvaluationId) {
    throw new StaleEvaluationError();
  }
}

// Promise.all over items with bounded concurrency and a staleness
// check before each item starts.
async function mapWithConcurrency<T, R>(
  items: T[],
  evaluationId: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  const lanes = Array.from(
    { length: Math.min(MAX_CONCURRENT_IMAGE_OPS, items.length) },
    async () => {
      while (nextIndex < items.length) {
        throwIfStale(evaluationId);
        const index = nextIndex++;
        results[index] = await fn(items[index]);
      }
    }
  );

  await Promise.all(lanes);

  return results;
}

// ============================================================
// Image loading / rendering primitives (OffscreenCanvas-based)
// ============================================================

async function blobToWorkerImage(
  blob: Blob,
  name?: string,
  cacheKey?: string
): Promise<WorkerImage> {
  const bitmap = await createImageBitmap(blob);

  return {
    bitmap,
    width: bitmap.width,
    height: bitmap.height,
    name,
    cacheKey,
  };
}

function loadFileImage(file: File): Promise<WorkerImage> {
  return blobToWorkerImage(
    file,
    file.name,
    `file:${file.name}:${file.size}:${file.lastModified}`
  );
}

async function loadUrlImage(
  url: string,
  name: string | undefined,
  signal: AbortSignal
): Promise<WorkerImage> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Failed to load image from ${url} (${response.status})`);
  }

  return blobToWorkerImage(await response.blob(), name, url);
}

function createCanvas(
  width: number,
  height: number
): [OffscreenCanvas, OffscreenCanvasRenderingContext2D] {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  return [canvas, ctx];
}

// Renders a source image, optionally applying a per-pixel transform,
// and hands back the canvas backing store as an ImageBitmap (no copy).
function renderImage(
  source: WorkerImage,
  draw: (
    ctx: OffscreenCanvasRenderingContext2D,
    canvas: OffscreenCanvas,
    source: WorkerImage
  ) => void,
  transformPixels?: Stage
): WorkerImage {
  const [canvas, ctx] = createCanvas(source.width, source.height);

  draw(ctx, canvas, source);

  if (transformPixels) {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    transformPixels(pixels);
    ctx.putImageData(pixels, 0, 0);
  }

  return {
    bitmap: canvas.transferToImageBitmap(),
    width: canvas.width,
    height: canvas.height,
    name: source.name,
  };
}

function renderImages(
  sources: WorkerImage[],
  evaluationId: number,
  draw: (
    ctx: OffscreenCanvasRenderingContext2D,
    canvas: OffscreenCanvas,
    source: WorkerImage
  ) => void,
  transformPixels?: Stage
): Promise<WorkerImage[]> {
  return mapWithConcurrency(sources, evaluationId, (source) =>
    Promise.resolve(renderImage(source, draw, transformPixels))
  );
}

function scaleImage(source: WorkerImage, scale: number): WorkerImage {
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));

  const [canvas, ctx] = createCanvas(width, height);

  ctx.drawImage(source.bitmap, 0, 0, width, height);

  return {
    bitmap: canvas.transferToImageBitmap(),
    width,
    height,
    name: source.name,
  };
}

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

function postProgress(
  nodeType: string,
  nodeId: string,
  evaluationId: number,
  runId: number,
  completed: number,
  total: number
) {
  workerScope.postMessage({
    type: "progress",
    evaluationId,
    nodeType,
    nodeId,
    runId,
    completed,
    total,
  });
}

async function imageValueToBlob(source: WorkerImage): Promise<Blob> {
  const [canvas, ctx] = createCanvas(source.width, source.height);

  ctx.drawImage(source.bitmap, 0, 0);

  return canvas.convertToBlob({ type: "image/jpeg", quality: 0.92 });
}

async function requestOpenAIImageEdit(
  source: WorkerImage,
  apiKey: string,
  prompt: string,
  signal: AbortSignal
): Promise<WorkerImage> {
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
    signal,
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

  // Decode the base64 payload without the main thread's <img> element.
  const resultResponse = await fetch(`data:image/jpeg;base64,${base64}`);

  return blobToWorkerImage(await resultResponse.blob(), source.name);
}

// Builds a node definition for an OpenAI image-edit operation (colorize,
// denoise, ...). Each node type gets its own run counter and result
// cache, kept alive across evaluations so re-running the pipeline on an
// already-processed image reuses the cached result instead of calling
// OpenAI again.
function createAIImageEditNodeDefinition(
  nodeType: string,
  label: string,
  prompt: string
): PipelineNodeDefinition {
  let runSeq = 0;
  const cache = new Map<string, WorkerImage>();

  async function editImage(
    source: WorkerImage,
    apiKey: string,
    signal: AbortSignal
  ): Promise<WorkerImage> {
    const cacheKey = source.cacheKey;
    const cached = cacheKey ? cache.get(cacheKey) : undefined;

    if (cached) {
      return cached;
    }

    const edited = await requestOpenAIImageEdit(source, apiKey, prompt, signal);

    if (cacheKey) {
      cache.set(cacheKey, edited);
    }

    return edited;
  }

  return {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const passthru = (inputs.passthru as boolean | undefined) ?? true;
      const nodeId = inputs.nodeId as string;
      const evaluationId = inputs.evaluationId as number;
      const signal = inputs.signal as AbortSignal;

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

      postProgress(nodeType, nodeId, evaluationId, runId, completed, total);

      const image = await mapWithConcurrency(
        sources,
        evaluationId,
        async (source) => {
          try {
            return await editImage(source, apiKey, signal);
          } catch (error) {
            // An aborted run is cancellation, not a per-image failure.
            if (signal.aborted) {
              throw new StaleEvaluationError();
            }

            console.error(`${label} failed for an image:`, error);
            return source;
          } finally {
            completed += 1;
            postProgress(nodeType, nodeId, evaluationId, runId, completed, total);
          }
        }
      );

      return { image };
    },
  };
}

// ============================================================
// Node implementations
// ============================================================

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
  "pop",
  "hdr",
  "fade",
  "rotate",
]);

const drawSource = (
  ctx: OffscreenCanvasRenderingContext2D,
  _canvas: OffscreenCanvas,
  source: WorkerImage
) => ctx.drawImage(source.bitmap, 0, 0);

// Node definition for a pixel-transform stage with no parameters (invert).
function stageNode(createStage: () => Stage): PipelineNodeDefinition {
  return {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const image = await renderImages(
        sources,
        inputs.evaluationId as number,
        drawSource,
        createStage()
      );

      return { image };
    },
  };
}

// Node definition for a pixel-transform stage driven by a slider amount.
function amountStageNode(
  createStage: (amount: number) => Stage,
  defaultAmount: number
): PipelineNodeDefinition {
  return {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const amount = (inputs.amount as number | undefined) ?? defaultAmount;

      const image = await renderImages(
        sources,
        inputs.evaluationId as number,
        drawSource,
        createStage(amount)
      );

      return { image };
    },
  };
}

const nodeDefinitions: Record<string, PipelineNodeDefinition> = {
  source: {
    async execute(inputs) {
      const files = inputs.files as File[] | undefined;

      if (!files || files.length === 0) { return { image: [] } }

      const image = await mapWithConcurrency(
        files,
        inputs.evaluationId as number,
        loadFileImage
      );

      return { image };
    },
  },

  selection: {
    async execute(inputs) {
      const photos = inputs.photos as GalleryPhoto[] | undefined;

      if (!photos || photos.length === 0) { return { image: [] } }

      const signal = inputs.signal as AbortSignal;

      const image = await mapWithConcurrency(
        photos,
        inputs.evaluationId as number,
        (photo) => loadUrlImage(composeUrl(photo), photo.title, signal)
      );

      return { image };
    },
  },

  invert: stageNode(invertStage),
  "black-white": stageNode(blackAndWhiteStage),

  flip: {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const image = await renderImages(
        sources,
        inputs.evaluationId as number,
        (ctx, canvas, source) => {
          // Rotate 180deg around the canvas center.
          ctx.translate(canvas.width, canvas.height);
          ctx.rotate(Math.PI);
          ctx.drawImage(source.bitmap, 0, 0);
        }
      );

      return { image };
    },
  },

  mirror: {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const image = await renderImages(
        sources,
        inputs.evaluationId as number,
        (ctx, canvas, source) => {
          // Flip horizontally around the canvas's vertical center axis.
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(source.bitmap, 0, 0);
        }
      );

      return { image };
    },
  },

  rotate: {
    async execute(inputs) {
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const angle = (inputs.amount as number | undefined) ?? 0;
      const radians = (angle * Math.PI) / 180;

      const image = await renderImages(
        sources,
        inputs.evaluationId as number,
        (ctx, canvas, source) => {
          // Rotate around the canvas center; the canvas keeps the source's
          // dimensions, so corners can clip at non-90deg angles.
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(radians);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);
          ctx.drawImage(source.bitmap, 0, 0);
        }
      );

      return { image };
    },
  },

  brightness: amountStageNode(brightnessStage, 0),
  gamma: amountStageNode(gammaStage, 1),
  luminosity: amountStageNode(luminosityStage, 0),
  exposure: amountStageNode(exposureStage, 0),
  contrast: amountStageNode(contrastStage, 0),
  saturation: amountStageNode(saturationStage, 0),
  vibrance: amountStageNode(vibranceStage, 0),
  vignette: amountStageNode(vignetteStage, 0),
  grain: amountStageNode(grainStage, 0),
  sharpen: amountStageNode(sharpenStage, 0),
  pop: amountStageNode(popStage, 0),
  hdr: amountStageNode(hdrEffectStage, 0),
  fade: amountStageNode(fadeStage, 0),

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
      const sources = (inputs.image as WorkerImage[] | undefined) ?? [];

      if (sources.length === 0) { return { image: [] } }

      const scale = (inputs.scale as number | undefined) ?? 1;

      if (scale === 1) {
        return { image: sources };
      }

      const image = await mapWithConcurrency(
        sources,
        inputs.evaluationId as number,
        (source) => Promise.resolve(scaleImage(source, scale))
      );

      return { image };
    },
  },

  // The viewer passes images through; encoding for transport to the
  // main thread happens in the result-posting layer below.
  viewer: {
    async execute(inputs) {
      await Promise.resolve();

      return {
        image: (inputs.image as WorkerImage[] | undefined) ?? [],
      };
    },
  },

  "viewer-single": {
    async execute(inputs) {
      await Promise.resolve();

      return {
        image: (inputs.image as WorkerImage[] | undefined) ?? [],
      };
    },
  },

  "photo-histogram": {
    async execute(inputs) {
      await Promise.resolve();

      return {
        image: (inputs.image as WorkerImage[] | undefined) ?? [],
      };
    },
  },
};

// ============================================================
// Transport encoding (viewer output only)
// ============================================================

// JPEG keeps the per-image encode fast and the posted payload small
// for large batches; quality matches the AI upload path.
async function encodeImagesForTransport(
  images: WorkerImage[],
  evaluationId: number
): Promise<PipelineViewerImagePayload[]> {
  return mapWithConcurrency(images, evaluationId, async (image) => {
    const [canvas, ctx] = createCanvas(image.width, image.height);

    ctx.drawImage(image.bitmap, 0, 0);

    const blob = await canvas.convertToBlob({
      type: "image/jpeg",
      quality: 0.92,
    });

    return {
      blob,
      width: image.width,
      height: image.height,
      name: image.name,
    };
  });
}

// ============================================================
// Pipeline evaluator
// ============================================================

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function runEvaluation(
  message: PipelineEvaluateMessage,
  signal: AbortSignal
): Promise<void> {
  const { evaluationId, nodes, edges } = message;

  const outputs = new Map<string, Promise<NodeOutputs>>();

  const evaluateNode = (nodeId: string): Promise<NodeOutputs> => {
    // Already evaluating?
    const existing = outputs.get(nodeId);

    if (existing) {
      return existing;
    }

    const node = nodes.find((n) => n.id === nodeId);

    if (!node) {
      return Promise.reject(new Error(`Node ${nodeId} not found`));
    }

    const definition = nodeDefinitions[node.type ?? ""];

    if (!definition) {
      return Promise.reject(new Error(`No definition for ${node.type}`));
    }

    const promise = (async () => {
      throwIfStale(evaluationId);

      const incoming = edges.filter((edge) => edge.target === nodeId);

      const inputEntries = await Promise.all(
        incoming.map(async (edge) => {
          const upstream = await evaluateNode(edge.source);

          return [
            edge.targetHandle ?? "input",
            upstream[edge.sourceHandle ?? "output"],
          ] as const;
        })
      );

      const inputs = Object.fromEntries(inputEntries);

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

      // Cancellation plumbing available to every node.
      inputs.evaluationId = evaluationId;
      inputs.signal = signal;

      console.log(`▶ executing ${node.id}`);

      const result = await definition.execute(inputs);

      console.log(`✓ completed ${node.id}`);

      throwIfStale(evaluationId);

      return result;
    })();

    outputs.set(nodeId, promise);

    return promise;
  };

  // Post each viewer's result as soon as it is ready instead of
  // waiting for the whole graph to finish.
  const viewerPosts = nodes
    .filter((node) => VIEWER_NODE_TYPES.has(node.type ?? ""))
    .map((node) =>
      evaluateNode(node.id)
        .then(async (nodeOutputs) => {
          throwIfStale(evaluationId);

          const images = (nodeOutputs.image as WorkerImage[] | undefined) ?? [];
          const payload = await encodeImagesForTransport(images, evaluationId);

          throwIfStale(evaluationId);

          workerScope.postMessage({
            type: "viewer",
            evaluationId,
            nodeId: node.id,
            images: payload,
          });
        })
        .catch((error: unknown) => {
          // Staleness is cancellation, not failure.
          if (!(error instanceof StaleEvaluationError)) {
            console.error(`Viewer node "${node.id}" failed:`, error);
          }
        })
    );

  // Evaluate every node.
  await Promise.all(nodes.map((node) => evaluateNode(node.id)));

  // The transport encode above is async, so without this await the
  // "done" message would overtake the viewer messages; the client
  // resolves still-pending viewers as empty on "done" and the real
  // results would be dropped.
  await Promise.all(viewerPosts);

  throwIfStale(evaluationId);

  workerScope.postMessage({ type: "done", evaluationId });
}

workerScope.onmessage = (event) => {
  const message = event.data;

  if (message.type !== "evaluate") {
    return;
  }

  // A new evaluation supersedes whatever is currently running.
  latestEvaluationId = message.evaluationId;
  activeController?.abort();

  const controller = new AbortController();
  activeController = controller;

  runEvaluation(message, controller.signal).catch((error: unknown) => {
    if (error instanceof StaleEvaluationError) {
      return;
    }

    workerScope.postMessage({
      type: "error",
      evaluationId: message.evaluationId,
      message: errorMessage(error),
    });
  });
};
