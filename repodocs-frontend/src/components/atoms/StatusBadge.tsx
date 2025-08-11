import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'created' | 'merged' | 'closed';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'processing':
        return {
          label: 'Processing',
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'completed':
        return {
          label: 'Completed',
          variant: 'secondary' as const,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'failed':
        return {
          label: 'Failed',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'created':
        return {
          label: 'PR Created',
          variant: 'secondary' as const,
          className: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case 'merged':
        return {
          label: 'Merged',
          variant: 'secondary' as const,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'closed':
        return {
          label: 'Closed',
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      default:
        return {
          label: status,
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;