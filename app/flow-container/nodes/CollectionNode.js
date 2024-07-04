import React, { useState } from 'react';
import { Handle } from 'reactflow';

// Helper function to render field values
const RenderField = ({ field, value, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getIcon = (field, value) => {
        if (field === '_id' && value === 'ObjectId') {
            return (<svg className="h-4 w-4 fill-current text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8-8-8-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /></svg>);
        } else if (value === 'ObjectId') {
            return (<svg className="h-4 w-4 fill-current text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8-8-8-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /></svg>);
        }
        return (<svg className="h-4 w-4 fill-current text-transparent mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8-8-8-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /></svg>);
    };

    const maxChars = 13; // Maximum number of characters to display before truncating

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const fieldType = value.type === 'Object' ? 'Object' : value.type;
    const paddingLeft = `pl-${level * 4}`; // Adjust padding based on the nesting level
    const gapClass = level === 0 ? 'gap-x-8' : 'gap-x-2';

    return (
        <div className={`grid grid-cols-2 ${gapClass} items-center ${paddingLeft}`}>
            <div className="flex items-center">
                {getIcon(field, value.type)}
                <strong
                    onClick={value.type === 'Object' ? () => setIsOpen(!isOpen) : undefined}
                    className={`cursor-pointer truncate max-w-xs`}
                    title={field}
                >
                    {truncateText(field, maxChars)}: {value.type === 'Object' && (isOpen ? '▼' : '▶')}
                </strong>
            </div>
            <span className="text-gray-500">{fieldType}</span>
            {value.type === 'Object' && isOpen && (
                <ul className="col-span-2 ml-4">
                    {Object.keys(value.fields).map(key => (
                        <li key={key} className="p-1">
                            <RenderField field={key} value={value.fields[key]} level={level + 1} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const CollectionNode = ({ data }) => {
    return (
        <div className='w-72'>
            <div className='bg-green-400 p-2 rounded-t-md text-center text-gray-900'>
                <p className='text-sm font-semibold'>{data.label}</p>
            </div>
            <div className='overflow-y-auto nowheel max-h-96 border-2 border-gray-400 rounded-b-md'>
                <ul>
                    {Object.entries(data.fields).map(([field, type]) => (
                        <li key={field} className='p-2 bg-slate-50'>
                            <RenderField field={field} value={type} />
                            <Handle
                                type="source"
                                position="right"
                                id={`${field}-right`}
                                className="w-16 !bg-teal-500"
                            />
                            <Handle
                                type="target"
                                position="left"
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
