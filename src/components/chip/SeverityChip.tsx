import React from 'react';
import { SeverityLevel } from '@/shared/types';

interface SeverityChipProps {
  score: SeverityLevel | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SEVERITY_STYLES: Record<SeverityLevel, string> = {
  Critical: 'bg-red-100 text-red-800 border-red-200',
  High: 'bg-orange-100 text-orange-800 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-green-100 text-green-800 border-green-200',
} as const;

const SIZE_STYLES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
} as const;

export const SeverityChip: React.FC<SeverityChipProps> = ({ 
  score, 
  size = 'md', 
  className = '' 
}) => {
  if (!score) {
    return (
      <span className={`inline-flex items-center rounded-full border bg-gray-100 text-gray-800 border-gray-200 font-medium ${SIZE_STYLES[size]} ${className}`}>
        Unknown
      </span>
    );
  }
  const severityStyles = SEVERITY_STYLES[score] || 'bg-blue-100 text-blue-800 border-blue-200';

  return (
    <span 
      className={`inline-flex items-center rounded-full border font-medium ${severityStyles} ${SIZE_STYLES[size]} ${className}`}
      role="status"
      aria-label={`Severity: ${score}`}
    >
      {score}
    </span>
  );
};