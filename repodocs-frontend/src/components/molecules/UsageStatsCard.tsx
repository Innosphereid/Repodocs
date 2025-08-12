import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export interface UsageStatsCardProps {
  monthlyUsageCount: number;
  usageResetDate: string;
  createdAt: string;
  updatedAt: string;
  daysUntilReset: number;
  totalRepositories: number;
  successfulGenerations: number;
  className?: string;
}

const UsageStatsCard: React.FC<UsageStatsCardProps> = ({
  monthlyUsageCount,
  usageResetDate,
  createdAt,
  updatedAt,
  daysUntilReset,
  totalRepositories,
  successfulGenerations,
  className,
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Usage Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">
                Current Month Usage
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {monthlyUsageCount}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Usage Reset Date</div>
              <div className="text-sm font-medium">
                {formatDate(usageResetDate)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {daysUntilReset} days until reset
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">
                Total Repositories
              </div>
              <div className="text-lg font-semibold text-green-600">
                {totalRepositories}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">
                Successful Generations
              </div>
              <div className="text-lg font-semibold text-purple-600">
                {successfulGenerations}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Account Created</div>
              <div className="text-sm font-medium">{formatDate(createdAt)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Last Activity</div>
              <div className="text-sm font-medium">{formatDate(updatedAt)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageStatsCard;
