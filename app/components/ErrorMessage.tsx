// components/ErrorMessage.tsx
import React from 'react';

interface Props {
  message: string;
}

const ErrorMessage: React.FC<Props> = ({ message }) => (
  <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
    {message}
  </div>
);

export default ErrorMessage;