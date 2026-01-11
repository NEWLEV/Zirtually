import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  subtitle,
  action,
  variant = 'default',
  padding = 'md',
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-slate-800 shadow-sm',
    glass: 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-lg border border-white/20 dark:border-slate-700/50',
    elevated: 'bg-white dark:bg-slate-800 shadow-xl shadow-gray-200/50 dark:shadow-slate-900/50',
    bordered: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`rounded-xl overflow-hidden ${variantClasses[variant]} ${className}`}>
      {(title || action) && (
        <div className={`flex justify-between items-start border-b border-gray-100 dark:border-slate-700 ${padding !== 'none' ? 'px-6 py-4' : 'p-4'}`}>
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={paddingClasses[padding]}>
        {children}
      </div>
    </div>
  );
};

export default Card;
