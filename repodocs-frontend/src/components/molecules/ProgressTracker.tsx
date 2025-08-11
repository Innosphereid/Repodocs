import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import StatusBadge from '@/components/atoms/StatusBadge';
import { cn } from '@/lib/utils';
import { RepositoryAnalysisProgress } from '@/lib/types';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export interface ProgressTrackerProps {
  analysis: RepositoryAnalysisProgress;
  className?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  analysis,
  className
}) => {
  const getStatusIcon = () => {
    switch (analysis.status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'processing':
        return <LoadingSpinner size="sm" color="primary" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getProgressMessage = () => {
    switch (analysis.status) {
      case 'pending':
        return 'Analysis queued and waiting to start...';
      case 'processing':
        return analysis.current_step || 'Processing repository...';
      case 'completed':
        return 'Documentation generation completed successfully!';
      case 'failed':
        return analysis.error_message || 'Analysis failed. Please try again.';
      default:
        return 'Unknown status';
    }
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return null;
    
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <h3 className="font-semibold text-lg">Repository Analysis</h3>
                <p className="text-sm text-gray-600">
                  {getProgressMessage()}
                </p>
              </div>
            </div>
            <StatusBadge status={analysis.status} />
          </div>

          {/* Progress Bar */}
          {analysis.status === 'processing' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{analysis.progress_percentage}%</span>
              </div>
              <Progress 
                value={analysis.progress_percentage} 
                className="h-2"
              />
              {analysis.estimated_remaining_seconds && (
                <p className="text-xs text-gray-500 text-right">
                  Estimated time remaining: {formatTime(analysis.estimated_remaining_seconds)}
                </p>
              )}
            </div>
          )}

          {/* Analysis Steps */}
          {analysis.status === 'processing' && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Current Step:</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  {analysis.current_step}
                </p>
              </div>
            </div>
          )}

          {/* Error Details */}
          {analysis.status === 'failed' && analysis.error_message && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-red-600">Error Details:</h4>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  {analysis.error_message}
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {analysis.status === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">Analysis Complete!</h4>
                  <p className="text-sm text-green-700">
                    Your documentation has been generated and is ready for review.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;