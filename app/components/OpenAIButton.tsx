// components/OpenAIButton.tsx
import React from 'react';

interface Props {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

const OpenAIButton: React.FC<Props> = ({ onClick, isLoading, isDisabled }) => (
  <button
    onClick={onClick}
    disabled={isLoading || isDisabled}
    className="mt-4 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
  >
    {isLoading ? 'Processing...' : 'Analyze with OpenAI'}
  </button>
);

export default OpenAIButton;