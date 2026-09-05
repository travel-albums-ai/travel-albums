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

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import BrightnessNode from "./BrightnessNode";
import ContrastNode from "./ContrastNode";
import ExposureNode from "./ExposureNode";
import FlipNode from "./FlipNode";
import GammaNode from "./GammaNode";
import GrainNode from "./GrainNode";
import InvertNode from "./InvertNode";
import LuminosityNode from "./LuminosityNode";
import NodeToolbox from "./NodeToolbox";
import SaturationNode from "./SaturationNode";
import SelectionNode from "./SelectionNode";
import SharpenNode from "./SharpenNode";
import SourceNode from "./SourceNode";
import VibranceNode from "./VibranceNode";
import ViewerNode from "./ViewerNode";
import VignetteNode from "./VignetteNode";
import { evaluatePipeline } from "./evaluatePipeline";

// ============================================================
// React Flow node registry
// ============================================================

const nodeTypes = {
  source: SourceNode,
  selection: SelectionNode,
  invert: InvertNode,
  flip: FlipNode,
  brightness: BrightnessNode,
  gamma: GammaNode,
  luminosity: LuminosityNode,
  exposure: ExposureNode,
  contrast: ContrastNode,
  saturation: SaturationNode,
  vibrance: VibranceNode,
  vignette: VignetteNode,
  grain: GrainNode,
  sharpen: SharpenNode,
  viewer: ViewerNode,
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
function saveStoredGraph(nodes: Node[], edges: Edge[]) {
  const strippedNodes = nodes.map((node) => {
    const { image: _image, ...rest } = node.data as Record<string, unknown>;
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

  // Nodes are measured asynchronously, so fitView is deferred a frame
  // to ensure it accounts for the restored graph's actual dimensions.
  useEffect(() => {
    const frame = requestAnimationFrame(() => fitView());
    return () => cancelAnimationFrame(frame);
  }, [fitView]);

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
      if (node.type !== "viewer") {
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
                image: result.image,
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

  return (
    <Box className="app" sx={{ width: '100%', height: '100%' }}>
      <NodeToolbox />

      <div
        className="reactflow-canvas"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}

          onReconnect={onReconnect}
          onEdgeDoubleClick={onEdgeDoubleClick}
          deleteKeyCode={["Backspace", "Delete"]}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
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
