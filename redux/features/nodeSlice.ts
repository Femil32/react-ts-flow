import { createSlice } from "@reduxjs/toolkit";

import {
  applyEdgeChanges,
  applyNodeChanges,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  addEdge as typeAddEdge,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from "@xyflow/react";

import { v4 as uuidv4 } from "uuid";

type InitialState = {
  nodes: Node[];
  edges: Edge[];
  flowState: {
    id?: string | null;
    name: string;
    description: string;
    workflow?: WorkflowObject;
    cron?: string;
  };
  reactFlowInstance?: ReactFlowInstance;
  userPlaylists: any[];
  alert: {
    message: string;
    title: string;
    type: string;
  } | null;
};

const initialState = {
  nodes: [],
  edges: [],
  // flowstate
  flowState: {
    id: undefined,
    name: "",
    description: "",
    workflow: undefined,
  },
  // flow instance
  reactFlowInstance: undefined,
  alert: null,

  // initial csv
  userPlaylists: [],
} as InitialState;

export const counter = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    reset: () => initialState,

    setNodes: (state, action) => {
      const nodes = action.payload;
      state.nodes = nodes;
    },
    setEdges: (state, action) => {
      const edges = action.payload;

      // edges.forEach((edge: Edge) => {
      //   edge.type = "smoothstep";
      // });

      state.edges = edges;
    },
    onNodesChange: (state, action) => {
      const changes = action.payload;
      state.nodes = applyNodeChanges(changes, state.nodes);
    },
    onEdgesChange: (state, action) => {
      const changes = action.payload;
      state.edges = applyEdgeChanges(changes, state.edges);
    },
    onConnect: (state, action) => {
      const connection: Connection = action.payload;
      console.log("sddsd", typeAddEdge(connection, state.edges));
      state.edges = typeAddEdge(connection, state.edges);
    },
    addNode: (state, action) => {
      const data = action.payload;
      const id = uuidv4();
      const node = { id, ...data };
      state.nodes = [node, ...state.nodes];
    },
    addEdge: (state, action) => {
      const data = action.payload;
      const id = `${data.source}->${data.target}`;
      const edge = { id, ...data };
      // edge.type = "smoothstep";
      state.edges = [edge, ...state.edges];
    },
    updateNode: (state, action) => {
      const node: Node = action.payload;
      const nodes = state.nodes;
      const index = nodes.findIndex((n) => n.id === node.id);
      if (index === -1) {
        return;
      }
      nodes[index] = node;
      state.nodes = nodes;
    },
    updateNodeData: (state, action) => {
      const {
        id,
        data,
      }: {
        id: string;
        data: any;
      } = action.payload;

      const nodes = state.nodes;
      const index = nodes.findIndex((n) => n.id === id);
      if (index !== -1 && nodes[index]) {
        nodes[index]!.data = {
          ...nodes[index]!.data,
          ...data,
        };
        state.nodes = nodes;
      }
    },
    onNodesDelete: (state, action) => {
      const deleted: Node[] = action.payload;
      state.edges = deleted.reduce((acc, node) => {
        const incomers = getIncomers(node, state.nodes, state.edges);
        const outgoers = getOutgoers(node, state.nodes, state.edges);
        const connectedEdges = getConnectedEdges([node], state.edges);

        const remainingEdges = acc.filter(
          (edge) => !connectedEdges.includes(edge)
        );

        const createdEdges = incomers.flatMap(({ id: source }) =>
          outgoers.map(({ id: target }) => ({
            id: `${source}->${target}`,
            source,
            target,
          }))
        );

        return [...remainingEdges, ...createdEdges];
      }, state.edges);
    },

    // reactFlowInstance actions
    setReactFlowInstance: (state, action) => {
      const { instance } = action.payload;
      state.reactFlowInstance = instance;
    },

    setAlert: (state, action) => {
      const alert = action.payload;
      state.alert = alert;
      // alert: {
      //   message: string;
      //   title: string;
      //   type: string;
      // } | null,
    },
  },
});

export const {
  onNodesChange,
  onEdgesChange,
  onConnect,
  setNodes,
  setEdges,
  addNode,
  addEdge,
  updateNodeData,
  onNodesDelete,
  reset,
  // reactFlowInstance
  setReactFlowInstance,
} = counter.actions;

export default counter.reducer;
