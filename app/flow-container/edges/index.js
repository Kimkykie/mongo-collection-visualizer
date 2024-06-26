export const generateEdges = (collections) => {
    const edges = [];
    collections?.forEach((collection) => {
      collection?.relationships?.forEach((relationship) => {
        edges.push({
          id: `${collection.name}-${relationship.field}`,
          source: collection.name,
          target: relationship.reference,
          type: 'smoothstep',
        });
      });
    });
    return edges;
  };
