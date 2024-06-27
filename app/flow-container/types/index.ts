// types
export interface FieldTypes {
    [key: string]: 'ObjectId' | 'number' | 'string' | 'Date';
}

export interface Relationship {
    field: string;
    reference: string;
}

export interface Collection {
    name: string;
    fieldTypes: FieldTypes;
    relationships: Relationship[];
}

export interface Data {
    collections: Collection[];
}
