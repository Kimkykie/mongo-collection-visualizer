export const generateNodes = (collections) => {
  return collections.map((collection, index) => ({
    id: collection.name,
    type: 'custom',
    position: { x: index * 200, y: index * 100 },
    data: { label: collection.name, fields: collection.fieldTypes },
  }));
};
