import dagre from '@dagrejs/dagre';

// Function to parse collections and identify isolated nodes
const parseCollections = (collections) => {
  const nodes = collections.map((collection) => ({
    id: collection.name,
    data: { label: collection.name, fields: collection.fieldTypes },
  }));

  const edges = collections.flatMap((collection) =>
    collection.relationships
      .filter((rel) => rel.reference != null)
      .map((rel) => ({
        source: collection.name,
        target: rel.target,
      }))
  );

  const connectedNodeIds = new Set(edges.flatMap((edge) => [edge.source, edge.target]));
  const isolatedNodes = nodes.filter((node) => !connectedNodeIds.has(node.id));

  return { nodes, edges, isolatedNodes };
};

const nodeWidth = 400;
const nodeHeight = 300;

// Function to create a hierarchical layout using dagre
const createDagreLayout = (nodes, edges) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR' });
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
      position: { x: nodeWithPosition.x - nodeWidth/ 2,
        y: nodeWithPosition.y - nodeHeight / 2, },
    };
  });
};

// Function to arrange isolated nodes in a grid
const arrangeIsolatedNodes = (isolatedNodes, startX, startY) => {
  const gapX = 100; // Increased space between isolated nodes horizontally
  const gapY = 400; // Increased space between isolated nodes vertically
  const columns = Math.ceil(Math.sqrt(isolatedNodes.length));

  return isolatedNodes.map((node, index) => ({
    ...node,
    position: {
      x: startX + (index % columns) * (nodeWidth),
      y: startY + Math.floor(index / columns) * (nodeHeight + gapY),
    },
  }));
};

// Main function to generate nodes with optimized layout
export const generateNodes = (collections) => {
  const { nodes, edges, isolatedNodes } = parseCollections(collections);

  // Create hierarchical layout for connected nodes
  const positionedConnectedNodes = createDagreLayout(nodes.filter(node => !isolatedNodes.includes(node)), edges);

  // Find the bounding box of the connected nodes to position isolated nodes nearby
  const xValues = positionedConnectedNodes.map((node) => node.position.x);
  const yValues = positionedConnectedNodes.map((node) => node.position.y);
  const maxX = Math.max(...xValues, 0);
  const minY = Math.min(...yValues, 0);

  // Arrange isolated nodes
  const positionedIsolatedNodes = arrangeIsolatedNodes(isolatedNodes, maxX + 200, minY);

  // Combine all nodes
  const allNodes = [...positionedConnectedNodes, ...positionedIsolatedNodes];

  // Format nodes for React Flow
  return allNodes.map((node) => ({
    id: node.id,
    type: 'collection',
    position: { x: node.position.x, y: node.position.y },
    data: node.data,
  }));
};
