import { Box } from '@mui/material';
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  reconnectEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import './styles.css';

import { Trash2 } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import AIAsyncColorizerNode from "./AIAsyncColorizerNode";
import AIAsyncDenoiserNode from "./AIAsyncDenoiserNode";
import BlackAndWhiteNode from "./BlackAndWhiteNode";
import BrightnessNode from "./BrightnessNode";
import ContrastNode from "./ContrastNode";
import ExposureNode from "./ExposureNode";
import FadeNode from "./FadeNode";
import FlipNode from "./FlipNode";
import GammaNode from "./GammaNode";
import GrainNode from "./GrainNode";
import GrouperNode from "./GrouperNode";
import HdrNode from "./HdrNode";
import InvertNode from "./InvertNode";
import LuminosityNode from "./LuminosityNode";
import LutNode from "./LutNode";
import MirrorNode from "./MirrorNode";
import NodeToolbox from "./NodeToolbox";
import PhotoHistogramNode from "./PhotoHistogramNode";
import PopNode from "./PopNode";
import RescaleNode from "./RescaleNode";
import RotateNode from "./RotateNode";
import SaturationNode from "./SaturationNode";
import SelectionNode from "./SelectionNode";
import SharpenNode from "./SharpenNode";
import SinglePhotoViewerNode from "./SinglePhotoViewerNode";
import SourceNode from "./SourceNode";
import VibranceNode from "./VibranceNode";
import ViewerNode from "./ViewerNode";
import VignetteNode from "./VignetteNode";
import { evaluatePipeline, terminatePipelineWorker } from "./pipelineWorkerClient";
import { VIEWER_NODE_TYPES } from "./types";

// ============================================================
// React Flow node registry
// ============================================================

const nodeTypes = {
  source: SourceNode,
  selection: SelectionNode,
  grouper: GrouperNode,
  "ai-colorizer": AIAsyncColorizerNode,
  "ai-denoiser": AIAsyncDenoiserNode,
  invert: InvertNode,
  "black-white": BlackAndWhiteNode,
  flip: FlipNode,
  mirror: MirrorNode,
  rotate: RotateNode,
  brightness: BrightnessNode,
  gamma: GammaNode,
  luminosity: LuminosityNode,
  lut: LutNode,
  exposure: ExposureNode,
  contrast: ContrastNode,
  saturation: SaturationNode,
  vibrance: VibranceNode,
  vignette: VignetteNode,
  grain: GrainNode,
  sharpen: SharpenNode,
  pop: PopNode,
  hdr: HdrNode,
  fade: FadeNode,
  rescale: RescaleNode,
  viewer: ViewerNode,
  "viewer-single": SinglePhotoViewerNode,
  "photo-histogram": PhotoHistogramNode,
};

// ============================================================
// Initial graph
// ============================================================

const initialNodes: Node[] = [
  {
    id: "selection",
    type: "selection",
    position: {
      x: 50,
      y: 200,
    },
    data: {},
  },

  {
    id: "brightness",
    type: "brightness",
    position: {
      x: 650,
      y: 200,
    },
    data: {},
  },

  {
    id: "viewer",
    type: "viewer",
    position: {
      x: 1250,
      y: 200,
    },
    data: {},
  },
];

const initialEdges: Edge[] = [
  {
    id: "source-invert",
    source: "selection",
    sourceHandle: "image",
    target: "brightness",
    targetHandle: "image",
  },

  {
    id: "brightness-viewer",
    source: "brightness",
    sourceHandle: "image",
    target: "viewer",
    targetHandle: "image",
  },
];

// ============================================================
// Persistence
// ============================================================

const STORAGE_KEY = "pipeline-flow";

function loadStoredGraph(): { nodes: Node[]; edges: Edge[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return { nodes: initialNodes, edges: initialEdges };

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      return { nodes: initialNodes, edges: initialEdges };
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load stored pipeline:", error);
    return { nodes: initialNodes, edges: initialEdges };
  }
}

// Evaluated results (e.g. viewer `image`) are regenerated on load,
// so they're stripped before saving to keep localStorage small.
// The BYOK API key is also re-synced from its own store, so it's
// never persisted a second time here. `files` and `lutFile` (File objects) can't
// survive JSON serialization either — they'd come back as empty
// plain objects — so uploaded files are dropped on save too.
function saveStoredGraph(nodes: Node[], edges: Edge[]) {
  const strippedNodes = nodes.map((node) => {
    const { image: _image, photos: _photos, apiKey: _apiKey, files: _files, lutFile: _lutFile, ...rest } = node.data as Record<string, unknown>;
    return { ...node, data: rest };
  });

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ nodes: strippedNodes, edges })
  );
}

// ============================================================
// App
// ============================================================

function Pipeline() {
  const [initialGraph] = useState(loadStoredGraph);

  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialGraph.nodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialGraph.edges);

  const { screenToFlowPosition, fitView } = useReactFlow();
  const nodeIdRef = useRef(0);
  const trashRef = useRef<HTMLDivElement>(null);
  const [trashActive, setTrashActive] = useState(false);

  // Nodes are measured asynchronously, so fitView is deferred a frame
  // to ensure it accounts for the restored graph's actual dimensions.
  useEffect(() => {
    const frame = requestAnimationFrame(() => fitView());
    return () => cancelAnimationFrame(frame);
  }, [fitView]);

  // Free the worker thread (and its in-memory AI result cache)
  // when the pipeline page unmounts.
  useEffect(() => () => terminatePipelineWorker(), []);

  const evaluationId = useRef(0);

  const evaluate = useCallback(async () => {
    const id = ++evaluationId.current;

    let results;

    try {
      results = await evaluatePipeline(nodes, edges);
    } catch (error) {
      console.error("Pipeline evaluation failed:", error);
      return;
    }

    // Don't allow an old evaluation to overwrite
    // a newer graph state.
    if (id !== evaluationId.current) {
      return;
    }

    // Update viewer nodes with their resolved result.
    for (const node of nodes) {
      if (!VIEWER_NODE_TYPES.has(node.type ?? "")) {
        continue;
      }

      const promise = results.get(node.id);

      if (!promise) continue;

      let result;

      try {
        result = await promise;
      } catch (error) {
        console.error(
          `Pipeline evaluation failed for node "${node.id}":`,
          error
        );
        continue;
      }

      if (
        id !== evaluationId.current
      ) {
        return;
      }

      setNodes((current) =>
        current.map((n) =>
          n.id === node.id
            ? {
              ...n,
              data: {
                ...n.data,
                image: result,
              },
            }
            : n
        )
      );
    }
  }, [
    nodes,
    edges,
    setNodes,
  ]);

  // Re-evaluate when nodes/edges are added, removed, disconnected,
  // or reconnected. Node data mutated in place (e.g. slider drags)
  // doesn't change this signature, so it won't trigger extra runs.
  const graphSignatureRef = useRef("");

  useEffect(() => {
    const signature = JSON.stringify({
      nodeIds: nodes.map((node) => node.id).sort(),
      edges: edges
        .map(
          (edge) =>
            `${edge.id}:${edge.source}:${edge.sourceHandle}->${edge.target}:${edge.targetHandle}`
        )
        .sort(),
    });

    if (signature === graphSignatureRef.current) {
      return;
    }

    graphSignatureRef.current = signature;

    evaluate();
  }, [nodes, edges, evaluate]);

  // File selection changes node.data directly,
  // so listen for the explicit pipeline event.
  useEffect(() => {
    const handler = () => {
      evaluate();
    };

    window.addEventListener(
      "pipeline:changed",
      handler
    );

    return () => {
      window.removeEventListener(
        "pipeline:changed",
        handler
      );
    };
  }, [evaluate]);

  // Persist the graph so it can be restored when the user returns.
  // Debounced since drags/resizes fire nodes/edges changes rapidly.
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const scheduleSave = useCallback(() => {
    clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      saveStoredGraph(nodes, edges);
    }, 500);
  }, [nodes, edges]);

  useEffect(() => {
    scheduleSave();
  }, [scheduleSave]);

  // Node data (e.g. slider values) is mutated in place, so it doesn't
  // trigger the effect above; save explicitly on the pipeline event too.
  useEffect(() => {
    window.addEventListener("pipeline:changed", scheduleSave);

    return () => {
      window.removeEventListener("pipeline:changed", scheduleSave);
    };
  }, [scheduleSave]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((current) =>
        addEdge(connection, current)
      );
    },
    [setEdges]
  );

  // Dragging an existing edge's endpoint onto a new handle
  // rewires it instead of creating a duplicate connection.
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((current) =>
        reconnectEdge(oldEdge, newConnection, current)
      );
    },
    [setEdges]
  );

  const onEdgeDoubleClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setEdges((current) =>
        current.filter((e) => e.id !== edge.id)
      );
    },
    [setEdges]
  );

  const onDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    []
  );

  const isOverTrash = useCallback((event: MouseEvent | TouchEvent) => {
    const rect = trashRef.current?.getBoundingClientRect();

    if (!rect) return false;

    const point =
      "touches" in event
        ? event.touches[0] ?? event.changedTouches[0]
        : event;

    if (!point) return false;

    return (
      point.clientX >= rect.left &&
      point.clientX <= rect.right &&
      point.clientY >= rect.top &&
      point.clientY <= rect.bottom
    );
  }, []);

  const onNodeDrag = useCallback(
    (event: MouseEvent | TouchEvent) => {
      setTrashActive(isOverTrash(event));
    },
    [isOverTrash]
  );

  // Dropping a node onto the trash can removes it and any edges attached to it.
  const onNodeDragStop = useCallback(
    (event: MouseEvent | TouchEvent, node: Node) => {
      if (isOverTrash(event)) {
        setNodes((current) => current.filter((n) => n.id !== node.id));
        setEdges((current) =>
          current.filter(
            (edge) => edge.source !== node.id && edge.target !== node.id
          )
        );
      }

      setTrashActive(false);
    },
    [isOverTrash, setNodes, setEdges]
  );

  // Drops a node dragged from the toolbox at the cursor position.
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        "application/reactflow"
      );

      if (!type || !(type in nodeTypes)) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const id = `${type}-${++nodeIdRef.current}`;

      setNodes((current) => [
        ...current,
        {
          id,
          type,
          position,
          data: {},
        },
      ]);
    },
    [screenToFlowPosition, setNodes]
  );

  // Double-clicking the empty canvas re-centers the view instead of the
  // default zoom-in, which only fires when the pane itself is the target.
  const onPaneDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;

      if (!target.classList.contains("react-flow__pane")) {
        return;
      }

      fitView();
    },
    [fitView]
  );

  return (
    <Box className="app" sx={{ width: '100%', height: '100%' }}>
      <NodeToolbox />

      <div
        className="reactflow-canvas"
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDoubleClick={onPaneDoubleClick}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          minZoom={0.25}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}

          onReconnect={onReconnect}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          deleteKeyCode={["Backspace", "Delete"]}
          zoomOnDoubleClick={false}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        <Box
          ref={trashRef}
          sx={{
            position: 'absolute',
            top: 24,
            right: 24,
            zIndex: 10,
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid',
            borderColor: trashActive ? 'error.main' : 'divider',
            bgcolor: trashActive ? 'error.main' : 'background.paper',
            color: trashActive ? 'error.contrastText' : 'text.secondary',
            boxShadow: 3,
            transform: trashActive ? 'scale(1.15)' : 'scale(1)',
            transition: 'transform 0.15s ease-in-out, background-color 0.15s ease-in-out',
          }}
        >
          <Trash2 size={22} />
        </Box>
      </div>
    </Box>
  );
}

export default function ReactFlowWrapper() {
  return (
    <ReactFlowProvider>
      <Pipeline />
    </ReactFlowProvider>
  );
}
