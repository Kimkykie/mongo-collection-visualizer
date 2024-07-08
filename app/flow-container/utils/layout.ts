import dagre from '@dagrejs/dagre';
import { Node, Edge } from 'reactflow';
import { Collection } from '../types/collections';
import { Relationship } from '../types/relationships';

/** Width of each node in pixels */
const NODE_WIDTH = 400;
/** Height of each node in pixels */
const NODE_HEIGHT = 300;

/**
 * Represents a node in the flow diagram
 */
type FlowNode = Node<{
  label: string;
  fields: Collection['fields'];
  recordCount: number;
}>;

/**
 * Represents an edge in the flow diagram
 */
type FlowEdge = Edge<{
  confidence: number;
}>;

/**
 * Represents the parsed collections data structure
 */
interface ParsedCollections {
  nodes: FlowNode[];
  edges: FlowEdge[];
  isolatedNodes: FlowNode[];
}

/**
 * Parses collections and relationships into nodes, edges, and isolated nodes
 * @param collections - Array of database collections
 * @param relationships - Array of relationships between collections
 * @returns Parsed collections data
 */
function parseCollections(collections: Collection[], relationships: Relationship[]): ParsedCollections {
  // Create nodes from collections
  const nodes: FlowNode[] = collections.map((collection) => ({
    id: collection.name,
    type: 'collection',
    data: {
      label: collection.name,
      fields: collection.fields,
      recordCount: collection.count
    },
    position: { x: 0, y: 0 }, // Initial position, will be updated later
  }));

  // Create edges from relationships
  const edges: FlowEdge[] = relationships
    .filter((rel) => rel.source != null && rel.target != null)
    .map((rel) => ({
      id: `${rel.source}-${rel.target}`,
      source: rel.source,
      target: rel.target,
      type: 'smoothstep',
      data: {
        confidence: rel.confidence
      }
    }));

  // Identify isolated nodes (nodes without any connections)
  const connectedNodeIds = new Set(edges.flatMap((edge) => [edge.source, edge.target]));
  const isolatedNodes = nodes.filter((node) => !connectedNodeIds.has(node.id));

  return { nodes, edges, isolatedNodes };
}

/**
 * Creates a hierarchical layout for nodes using the Dagre library
 * @param nodes - Array of nodes to layout
 * @param edges - Array of edges between nodes
 * @returns Array of nodes with calculated positions
 */
function createDagreLayout(nodes: FlowNode[], edges: FlowEdge[]): FlowNode[] {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: 'LR',
    nodesep: 300,
    ranksep: 200,
    edgesep: 150,
    acyclicer: 'greedy',
    ranker: 'network-simplex'
  });
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes to the graph
  nodes.forEach((node) => {
    g.setNode(node.id, { label: node.data.label, width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Perform the layout
  dagre.layout(g);

  // Extract the calculated positions
  return nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });
}

/**
 * Arranges isolated nodes in a grid layout
 * @param isolatedNodes - Array of isolated nodes to arrange
 * @param startX - Starting X coordinate for the grid
 * @param startY - Starting Y coordinate for the grid
 * @returns Array of isolated nodes with calculated positions
 */
function arrangeIsolatedNodes(isolatedNodes: FlowNode[], startX: number, startY: number): FlowNode[] {
  const gapX = 100; // Horizontal gap between nodes
  const gapY = 200; // Vertical gap between nodes
  const columns = Math.ceil(Math.sqrt(isolatedNodes.length));

  return isolatedNodes.map((node, index) => ({
    ...node,
    position: {
      x: startX + (index % columns) * (NODE_WIDTH + gapX),
      y: startY + Math.floor(index / columns) * (NODE_HEIGHT + gapY),
    },
  }));
}

/**
 * Generates nodes with positions for the flow diagram
 * @param collections - Array of database collections
 * @param relationships - Array of relationships between collections
 * @returns Array of all nodes with calculated positions
 */
export function generateNodes(collections: Collection[], relationships: Relationship[]): FlowNode[] {
  // Parse collections and relationships
  const { nodes, edges, isolatedNodes } = parseCollections(collections, relationships);

  // Create hierarchical layout for connected nodes
  const positionedConnectedNodes = createDagreLayout(nodes.filter(node => !isolatedNodes.includes(node)), edges);

  // Find the bounding box of the connected nodes to position isolated nodes nearby
  const xValues = positionedConnectedNodes.map((node) => node.position.x);
  const yValues = positionedConnectedNodes.map((node) => node.position.y);
  const maxX = Math.max(...xValues, 0);
  const minY = Math.min(...yValues, 0);

  // Arrange isolated nodes
  const positionedIsolatedNodes = arrangeIsolatedNodes(isolatedNodes, maxX + 400, minY);

  // Combine and return all nodes
  return [...positionedConnectedNodes, ...positionedIsolatedNodes];
}