export const generateEdges = (collections, nodes) => {
  const edges = [];
  collections?.forEach((collection) => {
    collection?.relationships?.forEach((relationship) => {

      const sourceNode = nodes.find((node) => node.id === relationship.source);
      const targetNode = nodes.find((node) => node.id === relationship.target);

      if (sourceNode && targetNode) {

        edges.push({
          id: `${relationship.source}-${relationship.target}`,
          source: relationship.source,
          target: relationship.target,
          type: 'smoothstep',
          sourceKey: relationship.sourceKey,
          targetKey: relationship.targetKey,
        });
      }
    });
  });
  return edges;
};



