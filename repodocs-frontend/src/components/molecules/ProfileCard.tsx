import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Github, Clock } from "lucide-react";

export interface ProfileCardProps {
  user: {
    username: string;
    email?: string;
    avatar_url?: string;
    github_id?: number;
    plan_type: string;
    created_at: string;
    updated_at: string;
  };
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, className }) => {
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
        return <User className="h-4 w-4" />;
      case "team":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.username}
              className="h-24 w-24 rounded-full mx-auto border-4 border-white shadow-lg"
            />
          ) : (
            <div className="h-24 w-24 rounded-full mx-auto bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
          )}
        </div>
        <CardTitle className="text-xl">{user.username}</CardTitle>
        <div className="flex items-center justify-center gap-2 mt-2">
          {getPlanIcon(user.plan_type)}
          <Badge className={getPlanColor(user.plan_type)}>
            {user.plan_type.charAt(0).toUpperCase() + user.plan_type.slice(1)}{" "}
            Plan
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700">
            {user.email || "No email provided"}
          </span>
        </div>
        {user.github_id && (
          <div className="flex items-center gap-3 text-sm">
            <Github className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">GitHub ID: {user.github_id}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700">
            Member since {formatDate(user.created_at)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700">
            Last updated {formatDate(user.updated_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
