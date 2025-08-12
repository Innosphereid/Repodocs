import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Lock,
  Mail,
  Download,
  Trash2,
  CreditCard,
  Bell,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { SecurityStatus } from "@/lib/types";

export interface AccountActionsCardProps {
  onActionClick?: (action: string) => void;
  securityStatus: SecurityStatus;
  className?: string;
}

const AccountActionsCard: React.FC<AccountActionsCardProps> = ({
  onActionClick,
  securityStatus,
  className,
}) => {
  const handleActionClick = (action: string) => {
    if (onActionClick) {
      onActionClick(action);
    }
  };

  const actions = [
    {
      key: "change-password",
      label: "Change Password",
      icon: <Lock className="h-4 w-4" />,
      variant: "outline" as const,
      disabled: !securityStatus.password_set,
    },
    {
      key: "update-email",
      label: "Update Email",
      icon: <Mail className="h-4 w-4" />,
      variant: "outline" as const,
    },
    {
      key: "billing",
      label: "Billing & Plans",
      icon: <CreditCard className="h-4 w-4" />,
      variant: "outline" as const,
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: <Bell className="h-4 w-4" />,
      variant: "outline" as const,
    },
    {
      key: "export-data",
      label: "Export Data",
      icon: <Download className="h-4 w-4" />,
      variant: "outline" as const,
    },
    {
      key: "delete-account",
      label: "Delete Account",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "outline" as const,
      className: "text-red-600 hover:text-red-700 hover:border-red-300",
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Account Security & Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Security Status */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">
              Security Status
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">GitHub Connected</span>
                <div className="flex items-center gap-2">
                  {securityStatus.github_connected ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <Badge
                    variant={
                      securityStatus.github_connected ? "default" : "secondary"
                    }
                  >
                    {securityStatus.github_connected
                      ? "Connected"
                      : "Not Connected"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Password Set</span>
                <div className="flex items-center gap-2">
                  {securityStatus.password_set ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <Badge
                    variant={
                      securityStatus.password_set ? "default" : "secondary"
                    }
                  >
                    {securityStatus.password_set ? "Set" : "Not Set"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Two-Factor Auth</span>
                <div className="flex items-center gap-2">
                  {securityStatus.two_factor_enabled ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <Badge
                    variant={
                      securityStatus.two_factor_enabled
                        ? "default"
                        : "secondary"
                    }
                  >
                    {securityStatus.two_factor_enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Login</span>
                <span className="font-medium text-xs">
                  {new Date(securityStatus.last_login).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Actions */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">
              Account Actions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {actions.map((action) => (
                <Button
                  key={action.key}
                  variant={action.variant}
                  className={`w-full gap-2 ${action.className || ""}`}
                  onClick={() => handleActionClick(action.key)}
                  disabled={action.disabled}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountActionsCard;
