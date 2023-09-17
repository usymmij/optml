"use client";

import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Dagre from "dagre";
import DataInput from "./nodes/data-input";
import Dense from "./nodes/dense";
import Conv1D from "./nodes/conv-1d";
import Conv2D from "./nodes/conv-2d";
import Conv3D from "./nodes/conv-3d";
import Normalization from "./nodes/normalization";
import BatchNormalization from "./nodes/batch-normalization";
import Flatten from "./nodes/flatten";
import Dropout from "./nodes/dropout";
import { useState, useCallback, DragEvent, useRef, useEffect } from "react";
import useStore from "@/lib/store";
import type { Edge, NodeTypes, Node } from "reactflow";
import ReactFlow, {
  Background,
  useReactFlow,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/base.css";
import "@/lib/styles/flow.css";
import FlowMenubar from "./flow-menubar";
import FlowActions from "./flow-actions";
import { useToast } from "./ui/use-toast";
import { defaultNodeData } from "@/lib/nodes";

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeTypes: NodeTypes = {
  "data-input": DataInput,
  dense: Dense,
  normalization: Normalization,
  "batch-normalization": BatchNormalization,
  conv1d: Conv1D,
  conv2d: Conv2D,
  conv3d: Conv3D,
  dropout: Dropout,
  flatten: Flatten,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  g.setGraph({ rankdir: "LR" });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => g.setNode(node.id, node));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const { x, width, y, height } = g.node(node.id);
      return { ...node, position: { x: x - width / 2, y: y - height / 2 } };
    }),
    edges,
  };
};

function Flow({ id }: { id: string }) {
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const { fitView, setViewport } = useReactFlow();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore();

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await axios(
            `${process.env.NEXT_PUBLIC_API_URL}/model/${id}`
          );
          if (res.status === 200) {
            const model = res.data;

            if (model && model.viewport) {
              const { x = 0, y = 0, zoom = 1 } = model.viewport;
              const { nodes = [], edges = [] } = model;
              setNodes(nodes);
              setEdges(edges);
              setViewport({ x, y, zoom });
            }
          }
        } catch (err) {
          toast({
            title: "Could not load flow",
            description:
              "Could not load the flow you requested. Loading default flow instead.",
            duration: 3000,
          });
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setNodes, setEdges, toast]);

  const save = useCallback(async () => {
    if (!rfInstance || !id) return;

    const flow = rfInstance.toObject();

    console.log(flow);

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/update/${id}`,
      flow
    );

    if (res.status === 200) {
      if (res.data === id) {
        return toast({
          title: "Flow saved",
          description: "Your flow has been saved.",
          duration: 3000,
        });
      }
    }

    return toast({
      title: "Flow not saved",
      description: "Your flow could not be saved.",
      variant: "destructive",
      duration: 3000,
    });
  }, [rfInstance, id, toast]);

  const onSave = useCallback(() => {
    save();
  }, [save]);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();

    if (event.dataTransfer === null) return;
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type || !rfInstance) {
        return;
      }

      if (type === "data-input") {
        if (nodes.some((node) => node.type === "data-input")) {
          toast({
            title: "Data input already exists",
            description: "You can only have one data input node.",
            duration: 3000,
          });
          return;
        }
      }

      const position = rfInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const node: Node = {
        id: uuidv4(),
        type,
        position,
        data: defaultNodeData[type],
      };

      setNodes([...nodes, node]);
    },
    [rfInstance, setNodes, toast, nodes]
  );

  const onLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges);

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    window.requestAnimationFrame(() => {
      fitView();
    });
  }, [nodes, edges, fitView, setNodes, setEdges]);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "s") {
          e.preventDefault();
          onSave();
        }
      }
    };

    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [onSave]);

  return (
    <div ref={reactFlowWrapper} className="h-full">
      <FlowMenubar
        onSave={onSave}
        onDownload={() => {
          (async () => {
            try {
              const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/model/${id}/download`
              );

              const blob = new Blob([res.data], {
                type: "application/octet-stream",
              });

              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${id}.h5`;
              document.body.appendChild(a);
              a.click();
              a.remove();
            } catch (err) {
              toast({
                title: "Could not download model",
                description:
                  "Could not download the model you requested. Try training the model first.",
                duration: 3000,
              });
            }
          })();
        }}
        className="z-10"
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        proOptions={{
          hideAttribution: true,
        }}
        onInit={setRfInstance}
        fitView
      >
        <Background />
      </ReactFlow>
      <FlowActions onLayout={onLayout} id={id} save={save} className="z-10" />
    </div>
  );
}

export default Flow;
