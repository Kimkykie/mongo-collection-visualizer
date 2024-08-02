// elkLayout.ts
import ELK from 'elkjs/lib/elk.bundled.js';
import { Edge, Node } from 'reactflow';
import { Collection } from '../types/collections';
import { Relationship } from '../types/relationships';

const elk = new ELK();

const NODE_WIDTH = 250;
const NODE_HEIGHT = 300;

const layoutOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'RIGHT',
  'elk.spacing.nodeNode': '80',
  'elk.layered.spacing.nodeNodeBetweenLayers': '180',
  'elk.spacing.edgeNode': '60',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
  'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
  'elk.layered.layering.strategy': 'NETWORK_SIMPLEX',
  'elk.aspectRatio': '2.5',
  'elk.padding': '[top=30,left=30,bottom=30,right=30]',
  'elk.separateConnectedComponents': 'true',
  'elk.spacing.componentComponent': '100',
  'elk.layered.spacing.edgeEdgeBetweenLayers': '30',
  'elk.layered.mergeEdges': 'false',
  'elk.layered.mergeHierarchyCrossingEdges': 'false',
  'elk.layered.nodeLayering.strategy': 'NETWORK_SIMPLEX',
  'elk.layered.cycleBreaking.strategy': 'DEPTH_FIRST',
  'elk.layered.layering.minWidth': '800',
  'elk.layered.layering.widthScalingFactor': '2.5',
};

/**
 * Creates an ELK node from a collection.
 * @param collection - The collection to create a node from.
 * @returns An ELK node representation of the collection.
 */
function createElkNode(collection: Collection): any {
  return {
    id: collection.name,
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  };
}

/**
 * Creates an ELK edge from a relationship.
 * @param relationship - The relationship to create an edge from.
 * @returns An ELK edge representation of the relationship.
 */
function createElkEdge(relationship: Relationship): any {
  return {
    id: `${relationship.source}-${relationship.target}`,
    sources: [relationship.source],
    targets: [relationship.target],
  };
}

/**
 * Generates a layout for collections and relationships using ELK.
 * @param collections - The collections to layout.
 * @param relationships - The relationships between collections.
 * @returns A promise that resolves to an object containing the laid out nodes and edges.
 */
export const generateElkLayout = async (collections: Collection[], relationships: Relationship[]): Promise<{ nodes: Node[], edges: Edge[] }> => {
  const elkNodes = collections.map(createElkNode);
  const elkEdges = relationships.map(createElkEdge);

  const graph = {
    id: 'root',
    children: elkNodes,
    edges: elkEdges,
  };

  const layoutedGraph = await elk.layout(graph, { layoutOptions });

  const nodes: Node[] = layoutedGraph.children!.map(node => ({
    id: node.id,
    position: { x: node.x || 0, y: node.y || 0 },
    data: {
      label: node.id,
      fields: collections.find(c => c.name === node.id)?.fields || {},
    },
    type: 'collection',
  }));

  const edges: Edge[] = relationships.map(relationship => ({
    id: `${relationship.source}-${relationship.target}`,
    source: relationship.source,
    target: relationship.target,
    sourceHandle: `${relationship.source}-${relationship.sourceField}-source`,
    targetHandle: `${relationship.target}-${relationship.targetField}-target`,
    type: 'relationship',
    data: {
      sourceField: relationship.sourceField,
      targetField: relationship.targetField,
    },
  }));

  return { nodes, edges };
};