// FlowContainer.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  NodeTypes,
  EdgeTypes,
  useReactFlow,
  BackgroundVariant,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CollectionNode from './nodes/CollectionNode';
import RelationshipEdge from './edges/RelationshipEdge';
import { generateElkLayout } from './utils/elkLayout';
import { useMongoStore } from '../store/mongoStore';
import { useRelationshipStore } from '../store/relationshipStore';

/**
 * FlowContainer component for rendering the graph of collections and relationships.
 */
const FlowContainer: React.FC = () => {
  const { collections } = useMongoStore();
  const { relationships } = useRelationshipStore();
  const { fitView } = useReactFlow();

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

  // Define custom node and edge types
  const nodeTypes = useMemo<NodeTypes>(() => ({ collection: CollectionNode }), []);
  const edgeTypes = useMemo<EdgeTypes>(() => ({ relationship: RelationshipEdge }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  /**
   * Generate layout for the graph using ELK algorithm.
   */
  const generateLayout = useCallback(async () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = await generateElkLayout(collections, relationships);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges.map(edge => ({ ...edge, type: 'relationship' })));
    setTimeout(() => fitView(), 0);
  }, [collections, relationships, setNodes, setEdges, fitView]);

  // Generate layout on component mount and when dependencies change
  useEffect(() => {
    generateLayout();
  }, [generateLayout]);

  // Event handlers for node and edge hover
  const onNodeMouseEnter = useCallback((event: React.MouseEvent, node: Node) => {
    setHoveredNode(node.id);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  const onEdgeMouseEnter = useCallback((event: React.MouseEvent, edge: Edge) => {
    setHoveredEdge(edge.id);
  }, []);

  const onEdgeMouseLeave = useCallback(() => {
    setHoveredEdge(null);
  }, []);

  // Memoized edges with highlight state
  const edgesWithState = useMemo(() => {
    return edges.map(edge => ({
      ...edge,
      data: {
        ...edge.data,
        isHighlighted:
          edge.id === hoveredEdge ||
          (hoveredNode && (edge.source === hoveredNode || edge.target === hoveredNode)),
      },
    }));
  }, [edges, hoveredEdge, hoveredNode]);

  return (
    <div style={{ width: '100%', height: '90vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edgesWithState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
      <button
        className='absolute bottom-2 right-2 bg-gray-500 text-white px-4 py-2 rounded-md shadow-md'
        onClick={generateLayout}>Re-layout</button>
    </div>
  );
};

export default FlowContainer;