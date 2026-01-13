import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent) => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  variant = 'default',
  padding = 'md',
  onClick,
}) => {
  const variantClasses = {
    default:
      'bg-bg-elevated dark:bg-dark-card shadow-sm border border-border-light dark:border-dark-border',
    glass:
      'bg-bg-elevated/70 dark:bg-dark-card/70 backdrop-blur-xl shadow-lg border border-border-medium/30 dark:border-dark-border/30',
    elevated:
      'bg-bg-elevated dark:bg-dark-card shadow-xl shadow-text-primary/5 dark:shadow-black/20 border border-border-light dark:border-dark-border',
    bordered:
      'bg-bg-elevated dark:bg-dark-card border border-border-medium dark:border-dark-border',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`rounded-xl overflow-hidden ${variantClasses[variant]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={e => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(e as unknown as React.MouseEvent);
        }
      }}
    >
      {(title || action) && (
        <div
          className={`flex justify-between items-start border-b border-gray-100 dark:border-slate-700 ${padding !== 'none' ? 'px-6 py-4' : 'p-4'}`}
        >
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
    </div>
  );
};

export default Card;
