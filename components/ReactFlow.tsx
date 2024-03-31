'use client'

import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  OnConnect,
  BackgroundVariant,
  Panel,
  useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';
import CustomNodeHOC from './custom/CustomNodeHOC';

const defaultCsvData = `Name, Age, Email
John Doe, 30, johndoe@example.com
Jane Smith, 25, janesmith@example.com
`;

const initialNodes = [
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  {
    id: 'input1',
    data: { label: 'Input Node (CSV)', value: defaultCsvData },
    position: { x: 100, y: 100 },
  }
];
const initialEdges = [{ id: 'input1-2', source: 'input1', target: '2' }];

const nodeTypes = {
  myCustomNode: CustomNodeHOC,
};

const minimapStyle = {
  height: 120,
};

const ReactFlowComponent = () => {
  // const reactFlowInstance = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<any[]>(initialNodes as any[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={
          nodeTypes
        }
      >
        <Controls />
        <MiniMap style={minimapStyle} zoomable pannable />
        <Background color="#ccc" />
      </ReactFlow>
    </div>
  );
}

export default ReactFlowComponent