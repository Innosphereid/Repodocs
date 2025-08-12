import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Clock,
  Calendar,
  TrendingUp,
  Activity,
  Target,
} from "lucide-react";

export interface ProfileStatsProps {
  monthlyUsageCount: number;
  usageResetDate: string;
  createdAt: string;
  updatedAt: string;
  className?: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  monthlyUsageCount,
  usageResetDate,
  createdAt,
  updatedAt,
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

  const getDaysUntilReset = () => {
    try {
      const resetDate = new Date(usageResetDate);
      const now = new Date();
      const diffTime = resetDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 0;
    }
  };

  const getAccountAge = () => {
    try {
      const created = new Date(createdAt);
      const now = new Date();
      const diffTime = now.getTime() - created.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  };

  const getLastActivityDays = () => {
    try {
      const updated = new Date(updatedAt);
      const now = new Date();
      const diffTime = now.getTime() - updated.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
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
              {getDaysUntilReset()}
            </div>
            <div className="text-sm text-gray-600">Days Until Reset</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {getAccountAge()}
            </div>
            <div className="text-sm text-gray-600">Account Age (Days)</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {getLastActivityDays()}
            </div>
            <div className="text-sm text-gray-600">
              Days Since Last Activity
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
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
