import React, { useEffect } from 'react';
import ReactFlow, { Background, Controls, ReactFlowProvider, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import CollectionNode from './nodes/CollectionNode';
import { generateNodes } from './nodes/util';
import { generateEdges } from './edges/index';

const nodeTypes = {
  custom: CollectionNode,
};

const FlowContainer = ({ collections }) => {
  const initialNodes = generateNodes(collections);
  const initialEdges = generateEdges(collections);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const newNodes = generateNodes(collections);
    const newEdges = generateEdges(collections);

    setNodes(newNodes);
    setEdges(newEdges);
  }, [collections, setNodes, setEdges]);

  return (
    <div style={{ height: 600 }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowContainer;
