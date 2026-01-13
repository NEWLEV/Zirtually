import React from 'react';
import { View } from '../../types';
import { ChevronRightIcon, DashboardIcon } from './icons/Icon';

interface BreadcrumbItem {
  label: string;
  view?: View;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  setActiveView?: (view: View) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, setActiveView }) => {
  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <button
            onClick={() => setActiveView && setActiveView(View.DASHBOARD)}
            className="text-gray-400 hover:text-action-primary transition-colors focus:outline-none"
            aria-label="Dashboard"
          >
            <DashboardIcon className="w-4 h-4" />
          </button>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <ChevronRightIcon className="w-3 h-3 text-gray-400" />
            {item.view ? (
              <button
                onClick={() => setActiveView && setActiveView(item.view!)}
                className="text-sm font-medium text-gray-500 hover:text-action-primary transition-colors focus:outline-none"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
