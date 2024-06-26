import React, { useState } from 'react';
import { Handle } from 'reactflow';

// Helper function to render field values
const RenderField = ({ field, value }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getIcon = (field, value) => {
        if (field === '_id' && value === 'ObjectId') {
            return (<svg className="h-4 w-4 fill-current text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /></svg>);
        } else if (value === 'ObjectId') {
            return (<svg className="h-4 w-4 fill-current text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /></svg>);
        }
        return (<svg className="h-4 w-4 fill-current text-transparent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /></svg>);
        ;
    };

    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        const objectKeys = Object.keys(value);
        if (objectKeys.length > 0) {
            return (
                <div className="flex space-x-2">
                    <div className='w-1/5'>
                        {getIcon(field, value)}
                    </div>
                    <div className='w-3/5'>
                        <strong onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
                            {field}: {isOpen ? '▼' : '▶'}
                        </strong>
                        {isOpen && (
                            <ul className='ml-2'>
                                {objectKeys.map(key => (
                                    <li key={key} className='p-1 bg-slate-50'>
                                        <RenderField field={key} value={value[key]} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className='w-1/5'>
                        <span>object</span>
                    </div>
                </div>
            );
        }
    }
    return (
        <div className="flex space-x-2">
            <div className='w-1/5'>
                {getIcon(field, value)}
            </div>
            <div className='w-3/5'>
                <strong>{field}</strong>
            </div>
            <div className='w-1/5'>
                <span>{String(value)}</span>
            </div>
        </div>
    );
};

const CustomNode = ({ data }) => {
    return (
        <div className='w-96'>
            <div className='bg-teal-400 p-2 rounded-t-md text-center'>
                <p className='text-sm font-semibold'>{data.label}</p>
            </div>
            <div className='overflow-y-auto nowheel max-h-96 border-2 border-gray-400 rounded-b-md'>
                <ul >
                    {Object.entries(data.fields).map(([field, type]) => (
                        <li key={field} className='p-2 bg-slate-50'>
                            <RenderField field={field} value={type} />
                        </li>
                    ))}
                </ul>
            </div>

            <Handle type="source" position="right" className="w-16 !bg-teal-500" />
            <Handle type="target" position="left" className="w-16 !bg-teal-500" />
        </div>
    );
};

export default CustomNode;
