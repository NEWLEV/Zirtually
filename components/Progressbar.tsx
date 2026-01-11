import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '',
  size = 'md',
  variant = 'default',
  showLabel = false,
  animated = true,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantClasses = {
    default: 'bg-indigo-500',
    gradient: 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-500',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500',
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`${sizeClasses[size]} rounded-full ${variantClasses[variant]} ${animated ? 'transition-all duration-500 ease-out' : ''}`}
          style={{ width: `${clampedProgress}%` }}
        >
          {animated && (
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          )}
        </div>
      </div>
      {showLabel && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 -mt-0.5 ml-2 text-sm font-medium text-gray-600 dark:text-slate-400">
          {Math.round(clampedProgress)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
