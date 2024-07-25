// components/SuccessMessage.tsx

import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessMessageProps {
  message: string;
  onDismiss: () => void;
  duration?: number; // Duration in milliseconds before auto-dismiss
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onDismiss,
  duration = 5000 // Default to 5 seconds
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (!isVisible) {
      onDismiss();
    }
  }, [isVisible, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 text-sm rounded text-center relative"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {message}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsVisible(false)}
            >
              <XMarkIcon
                className="h-4 w-4 text-green-700 font-semibold cursor-pointer"
                aria-label="Close"
              />
            </motion.button>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessMessage;