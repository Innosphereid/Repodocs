import React from "react";
import UsageStatsCard from "./UsageStatsCard";
import ProfileStats from "./ProfileStats";
import PlanDetailsCard from "./PlanDetailsCard";
import AccountActionsCard from "./AccountActionsCard";
import { User } from "@/lib/types";

export interface ProfileStatsSectionProps {
  user: User;
  viewMode: "detailed" | "simple";
  onAccountAction: (action: string) => void;
  className?: string;
}

const ProfileStatsSection: React.FC<ProfileStatsSectionProps> = ({
  user,
  viewMode,
  onAccountAction,
  className,
}) => {
  return (
    <div className={className}>
      {viewMode === "simple" ? (
        <UsageStatsCard
          monthlyUsageCount={user.monthly_usage_count}
          usageResetDate={user.usage_reset_date}
          createdAt={user.created_at}
          updatedAt={user.updated_at}
        />
      ) : (
        <ProfileStats
          monthlyUsageCount={user.monthly_usage_count}
          usageResetDate={user.usage_reset_date}
          createdAt={user.created_at}
          updatedAt={user.updated_at}
        />
      )}
      <PlanDetailsCard planType={user.plan_type} />
      <AccountActionsCard onActionClick={onAccountAction} />
    </div>
  );
};

export default ProfileStatsSection;
