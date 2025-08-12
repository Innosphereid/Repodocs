import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Github, Lock } from "lucide-react";

export interface AccountSecurityCardProps {
  githubId?: number;
  hasPassword: boolean;
  className?: string;
}

const AccountSecurityCard: React.FC<AccountSecurityCardProps> = ({
  githubId,
  hasPassword,
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Account Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">GitHub OAuth</span>
          </div>
          <Badge variant={githubId ? "default" : "secondary"}>
            {githubId ? "Connected" : "Not Connected"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Password</span>
          </div>
          <Badge variant={hasPassword ? "default" : "secondary"}>
            {hasPassword ? "Set" : "Not Set"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Two-Factor Auth</span>
          <Badge variant="secondary">Not Enabled</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Session Management</span>
          <Badge variant="default">Active</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSecurityCard;
