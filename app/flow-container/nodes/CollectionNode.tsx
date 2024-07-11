// flow-container/nodes/CollectionNode.tsx
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Field } from '../types/collections';

interface RenderFieldProps {
  field: string;
  value: Field;
  level?: number;
}

const RenderField: React.FC<RenderFieldProps> = ({ field, value, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getIcon = (field: string, valueType: string) => {
        if (field === '_id' && valueType === 'ObjectId') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 text-green-500 mr-2">
                    <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
            );
        } else if (valueType === 'ObjectId') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 text-blue-500 mr-2">
                    <path fillRule="evenodd" d="M3 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H3Zm2.5 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM10 5.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm.75 3.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5ZM10 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 10 8Zm-2.378 3c.346 0 .583-.343.395-.633A2.998 2.998 0 0 0 5.5 9a2.998 2.998 0 0 0-2.517 1.367c-.188.29.05.633.395.633h4.244Z" clipRule="evenodd" />
                </svg>
            );
        }

        // Default icon
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 text-transparent mr-2">
                <path fillRule="evenodd" d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2Zm4.646 1.646a.5.5 0 0 0-.708 0L3 6.586 4.707 8.293a1 1 0 0 0 1.415-1.415L6 5.414l2.879 2.879a1 1 0 1 0 1.415-1.415L7.414 4l.293-.293a.5.5 0 0 0 0-.708L6.646 2.646a.5.5 0 0 0-.708 0L5.293 3.293 4.293 2.293a.5.5 0 0 0-.707 0Z" clipRule="evenodd" />
            </svg>
        );
    };

    const maxChars = 13; // Maximum number of characters to display before truncating

    const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const fieldType = value.type === 'Object' ? 'Object' : value.type;
    const paddingLeft = `pl-${level * 4}`; // Adjust padding based on the nesting level
    const gapClass = level === 0 ? 'gap-x-4' : 'gap-x-2';

    return (
        <div className={`grid grid-cols-4  items-center ${paddingLeft}`}>
            <div className="col-span-3 flex items-center">
                {getIcon(field, value.type)}
                <strong
                    onClick={value.type === 'Object' ? () => setIsOpen(!isOpen) : undefined}
                    className={`cursor-pointer truncate max-w-full`}
                    title={field}
                >
                    {truncateText(field, maxChars)} {value.type === 'Object' && (isOpen ? '▼' : '▶')}
                </strong>
            </div>
            <span className="text-gray-500 text-right">{fieldType}</span>
            {value.type === 'Object' && isOpen && value.fields && (
                <ul className="col-span-4 ml-4">
                    {Object.entries(value.fields).map(([key, fieldValue]) => (
                        <li key={key} className="p-1">
                            <RenderField field={key} value={fieldValue} level={level + 1} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

interface CollectionNodeProps {
  data: {
    label: string;
    fields: Record<string, Field>;
  };
}

const CollectionNode: React.FC<CollectionNodeProps> = ({ data }) => {
  return (
    <div className='w-72'>
      <div className='bg-green-300 p-2 rounded-t-md text-center text-gray-700'>
        <p className='text-sm font-semibold'>{data.label}</p>
      </div>
      <div className='overflow-y-auto nowheel max-h-96 border-2 border-gray-400 rounded-b-md'>
        <ul>
          {Object.entries(data.fields).map(([field, fieldValue]) => (
            <li key={field} className='p-2 bg-slate-50'>
              <RenderField field={field} value={fieldValue} />
              <Handle
                type="source"
                position={Position.Right}
                id={`${field}-right`}
                className="w-16 !bg-teal-500"
              />
              <Handle
                type="target"
                position={Position.Left}
                id={`${field}-left`}
                className="w-16 !bg-teal-500"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CollectionNode;