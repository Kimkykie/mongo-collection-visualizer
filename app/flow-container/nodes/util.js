import dagre from '@dagrejs/dagre';

const nodeWidth = 400;
const nodeHeight = 300;

const parseCollections = (collections, relationships) => {
  const nodes = collections.map((collection) => ({
    id: collection.name,
    data: { label: collection.name, fields: collection.fields, recordCount: collection.count},
  }));

  const edges = relationships
    .filter((rel) => rel.source != null && rel.target != null)
    .map((rel) => ({
      source: rel.source,
      target: rel.target,
    }));

  const connectedNodeIds = new Set(edges.flatMap((edge) => [edge.source, edge.target]));
  const isolatedNodes = nodes.filter((node) => !connectedNodeIds.has(node.id));

  return { nodes, edges, isolatedNodes };
};

const createDagreLayout = (nodes, edges) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: 'LR',
    nodesep: 300, // Increase horizontal separation between nodes
    ranksep: 200, // Increase vertical separation between ranks
    edgesep: 150, // Increase separation between edges
    acyclicer: 'greedy', // Help with cycles
    ranker: 'network-simplex' // Use network simplex algorithm for ranking
  });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    g.setNode(node.id, { label: node.data.label, width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  return nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });
};

const arrangeIsolatedNodes = (isolatedNodes, startX, startY) => {
  const gapX = 100; // Increase horizontal gap
  const gapY = 200; // Increase vertical gap
  const columns = Math.ceil(Math.sqrt(isolatedNodes.length));

  return isolatedNodes.map((node, index) => ({
    ...node,
    position: {
      x: startX + (index % columns) * (nodeWidth + gapX),
      y: startY + Math.floor(index / columns) * (nodeHeight + gapY),
    },
  }));
};

export const generateNodes = (collections, relationships) => {
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

  // Combine all nodes
  const allNodes = [...positionedConnectedNodes, ...positionedIsolatedNodes];

  // Format nodes for React Flow
  return allNodes.map((node) => ({
    id: node.id,
    type: 'collection',
    position: node.position,
    data: node.data,
  }));
};