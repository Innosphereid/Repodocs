import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Mail,
  Download,
  Trash2,
  Settings,
  CreditCard,
  Bell,
} from "lucide-react";

export interface AccountActionsCardProps {
  onActionClick?: (action: string) => void;
  className?: string;
}

const AccountActionsCard: React.FC<AccountActionsCardProps> = ({
  onActionClick,
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
          <Settings className="h-5 w-5" />
          Account Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.key}
              variant={action.variant}
              className={`w-full gap-2 ${action.className || ""}`}
              onClick={() => handleActionClick(action.key)}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountActionsCard;
