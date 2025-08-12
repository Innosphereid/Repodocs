import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock, Calendar, Activity, Target } from "lucide-react";

export interface ProfileStatsProps {
  monthlyUsageCount: number;
  usageResetDate: string;
  createdAt: string;
  updatedAt: string;
  daysUntilReset: number;
  totalRepositories: number;
  successfulGenerations: number;
  accountAgeDays: number;
  daysSinceLastActivity: number;
  className?: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  monthlyUsageCount,
  usageResetDate,
  createdAt,
  updatedAt,
  daysUntilReset,
  totalRepositories,
  successfulGenerations,
  accountAgeDays,
  daysSinceLastActivity,
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
          Profile Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {monthlyUsageCount}
            </div>
            <div className="text-sm text-gray-600">Monthly Usage</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {daysUntilReset}
            </div>
            <div className="text-sm text-gray-600">Days Until Reset</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {accountAgeDays}
            </div>
            <div className="text-sm text-gray-600">Account Age (Days)</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {daysSinceLastActivity}
            </div>
            <div className="text-sm text-gray-600">
              Days Since Last Activity
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Repositories</span>
            <span className="font-medium text-green-600">
              {totalRepositories}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Successful Generations</span>
            <span className="font-medium text-purple-600">
              {successfulGenerations}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Usage Reset Date</span>
            <span className="font-medium">{formatDate(usageResetDate)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Account Created</span>
            <span className="font-medium">{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium">{formatDate(updatedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;
