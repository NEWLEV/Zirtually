import React from 'react';

interface ProgressBarProps {
  progress?: number;
  value?: number;
  max?: number;
  variant?: 'primary' | 'secondary' | 'gradient' | 'success' | 'warning' | 'danger' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  className = '',
  color,
}) => {
  const displayValue = value ?? progress ?? 0;
  const clampedProgress = Math.min(Math.max((displayValue / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantClasses = {
    primary: 'bg-action-primary',
    secondary: 'bg-action-secondary',
    gradient: 'bg-gradient-to-r from-action-primary to-action-secondary',
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    danger: 'bg-status-error',
    default: 'bg-gray-400',
  };

  return (
    <div
      className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${sizeClasses[size]} ${className}`}
    >
      <div
        className={`${color ? '' : variantClasses[variant]} ${sizeClasses[size]} rounded-full transition-all duration-500`}
        style={{
          width: `${clampedProgress}%`,
          backgroundColor: color || undefined,
        }}
      />
    </div>
  );
};

export default ProgressBar;
