import React, { useEffect, useState } from 'react';
import { useNova, NovaTip } from './NovaContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, XIcon } from '../ui/icons/Icon'; // Assuming icons exist

export const NovaAssistant: React.FC = () => {
  const { currentTip, dismissTip } = useNova();

  return (
    <AnimatePresence>
      {currentTip && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-2rem)]"
          role="status"
          aria-live="polite"
        >
          {/* Glassmorphism Container */}
          <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl p-4 overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" />

            <div className="flex items-start gap-4">
              {/* Avatar / Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <SparklesIcon className="w-5 h-5 text-white animate-pulse-slow" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-0.5">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
                    Nova
                  </h4>
                  <button
                    onClick={dismissTip}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 -mr-2 -mt-2"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                  {currentTip.message}
                </p>

                {currentTip.action && (
                  <button
                    onClick={() => {
                      currentTip.action?.onClick();
                      dismissTip();
                    }}
                    className="mt-3 text-xs font-semibold px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
                  >
                    {currentTip.action.label}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
