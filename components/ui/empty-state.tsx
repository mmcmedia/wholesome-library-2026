/**
 * Empty State - Reusable empty state component
 */

import { ReactNode } from 'react';
import { Button } from './button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in-up ${className}`}>
      {icon && (
        <div className="mb-4 text-gray-400 animate-bounce-subtle">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-[#135C5E] hover:bg-[#0D4446] text-white transition-all duration-200 hover:scale-105"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
