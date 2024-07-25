// components/ErrorMessage.tsx
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ErrorMessageProps {
  message: string | null;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!message || !isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm relative">
      {message}
      <button
        onClick={handleDismiss}
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
        aria-label="Dismiss error"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ErrorMessage;