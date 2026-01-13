import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  icon,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  const variantClasses = {
    primary:
      'bg-action-primary text-text-inverse hover:bg-action-primary-hover active:bg-action-primary-active focus:ring-focus-ring shadow-lg shadow-action-primary/20 transition-all duration-200',
    secondary:
      'bg-bg-secondary dark:bg-dark-card text-text-primary dark:text-dark-text border border-border-medium dark:border-dark-border hover:bg-border-light dark:hover:bg-dark-border/50 focus:ring-focus-ring',
    danger:
      'bg-status-error text-text-inverse hover:bg-status-error/90 focus:ring-status-error/50 shadow-lg shadow-status-error/20',
    ghost:
      'text-action-primary dark:text-dark-text hover:bg-bg-secondary dark:hover:bg-dark-card focus:ring-focus-ring',
    success:
      'bg-status-success text-text-inverse hover:bg-status-success/90 focus:ring-status-success/50 shadow-lg shadow-status-success/20',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        icon
      )}
      {children}
    </button>
  );
};

export default Button;
