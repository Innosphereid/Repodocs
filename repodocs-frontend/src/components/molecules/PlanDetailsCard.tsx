import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Crown, User, Zap } from "lucide-react";

export interface PlanDetailsCardProps {
  planType: string;
  className?: string;
}

const PlanDetailsCard: React.FC<PlanDetailsCardProps> = ({
  planType,
  className,
}) => {
  const getPlanColor = (planType: string) => {
    switch (planType) {
      case "free":
        return "bg-gray-100 text-gray-800";
      case "pro":
        return "bg-blue-100 text-blue-800";
      case "team":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case "free":
        return <User className="h-4 w-4" />;
      case "pro":
        return <Crown className="h-4 w-4" />;
      case "team":
        return <Zap className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getPlanFeatures = (planType: string) => {
    switch (planType) {
      case "free":
        return {
          monthlyLimit: "10",
          privateRepos: false,
          priorityProcessing: false,
          advancedAnalytics: false,
          teamFeatures: false,
          prioritySupport: false,
        };
      case "pro":
        return {
          monthlyLimit: "100",
          privateRepos: true,
          priorityProcessing: true,
          advancedAnalytics: true,
          teamFeatures: false,
          prioritySupport: false,
        };
      case "team":
        return {
          monthlyLimit: "Unlimited",
          privateRepos: true,
          priorityProcessing: true,
          advancedAnalytics: true,
          teamFeatures: true,
          prioritySupport: true,
        };
      default:
        return {
          monthlyLimit: "10",
          privateRepos: false,
          priorityProcessing: false,
          advancedAnalytics: false,
          teamFeatures: false,
          prioritySupport: false,
        };
    }
  };

  const features = getPlanFeatures(planType);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Plan Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Current Plan</span>
            <Badge className={getPlanColor(planType)}>
              {getPlanIcon(planType)}
              <span className="ml-1">
                {planType.charAt(0).toUpperCase() + planType.slice(1)}
              </span>
            </Badge>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Monthly Limit</span>
              <span className="font-medium">{features.monthlyLimit}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Private Repositories
              </span>
              <span className="font-medium">
                {features.privateRepos ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Priority Processing</span>
              <span className="font-medium">
                {features.priorityProcessing ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Advanced Analytics</span>
              <span className="font-medium">
                {features.advancedAnalytics ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Team Features</span>
              <span className="font-medium">
                {features.teamFeatures ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Priority Support</span>
              <span className="font-medium">
                {features.prioritySupport ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanDetailsCard;
