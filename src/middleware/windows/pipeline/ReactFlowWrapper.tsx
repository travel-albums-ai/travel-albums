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
} from "react";

import BrightnessNode from "./BrightnessNode";
import FlipNode from "./FlipNode";
import InvertNode from "./InvertNode";
import NodeToolbox from "./NodeToolbox";
import SourceNode from "./SourceNode";
import ViewerNode from "./ViewerNode";
import { evaluatePipeline } from "./evaluatePipeline";

// ============================================================
// React Flow node registry
// ============================================================

const nodeTypes = {
  source: SourceNode,
  invert: InvertNode,
  flip: FlipNode,
  brightness: BrightnessNode,
  viewer: ViewerNode,
};

// ============================================================
// Initial graph
// ============================================================

const initialNodes: Node[] = [
  {
    id: "source",
    type: "source",
    position: {
      x: 50,
      y: 200,
    },
    data: {},
  },

  {
    id: "invert",
    type: "invert",
    position: {
      x: 350,
      y: 200,
    },
    data: {},
  },

  {
    id: "flip",
    type: "flip",
    position: {
      x: 650,
      y: 200,
    },
    data: {},
  },

  {
    id: "brightness",
    type: "brightness",
    position: {
      x: 950,
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
    source: "source",
    sourceHandle: "image",
    target: "brightness",
    targetHandle: "image",
  },

  // {
  //   id: "invert-flip",
  //   source: "invert",
  //   sourceHandle: "image",
  //   target: "flip",
  //   targetHandle: "image",
  // },

  // {
  //   id: "flip-brightness",
  //   source: "flip",
  //   sourceHandle: "image",
  //   target: "brightness",
  //   targetHandle: "image",
  // },

  {
    id: "brightness-viewer",
    source: "brightness",
    sourceHandle: "image",
    target: "viewer",
    targetHandle: "image",
  },
];

// ============================================================
// App
// ============================================================

function Pipeline() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const { screenToFlowPosition } = useReactFlow();
  const nodeIdRef = useRef(0);

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
