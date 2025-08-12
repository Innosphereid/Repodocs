import React from "react";
import UsageStatsCard from "./UsageStatsCard";
import ProfileStats from "./ProfileStats";
import PlanDetailsCard from "./PlanDetailsCard";
import AccountActionsCard from "./AccountActionsCard";
import {
  User,
  ProfileStats as ProfileStatsType,
  PlanDetails,
  SecurityStatus,
} from "@/lib/types";

export interface ProfileStatsSectionProps {
  user: User;
  profileStats: ProfileStatsType;
  planDetails: PlanDetails;
  securityStatus: SecurityStatus;
  viewMode: "detailed" | "simple";
  onAccountAction: (action: string) => void;
  className?: string;
}

const ProfileStatsSection: React.FC<ProfileStatsSectionProps> = ({
  user,
  profileStats,
  planDetails,
  securityStatus,
  viewMode,
  onAccountAction,
  className,
}) => {
  return (
    <div className={className}>
      {viewMode === "simple" ? (
        <UsageStatsCard
          monthlyUsageCount={profileStats.current_month_usage}
          usageResetDate={user.usage_reset_date}
          createdAt={user.created_at}
          updatedAt={user.updated_at}
          daysUntilReset={profileStats.days_until_reset}
          totalRepositories={profileStats.total_repositories}
          successfulGenerations={profileStats.successful_generations}
        />
      ) : (
        <ProfileStats
          monthlyUsageCount={profileStats.current_month_usage}
          usageResetDate={user.usage_reset_date}
          createdAt={user.created_at}
          updatedAt={user.updated_at}
          daysUntilReset={profileStats.days_until_reset}
          totalRepositories={profileStats.total_repositories}
          successfulGenerations={profileStats.successful_generations}
          accountAgeDays={profileStats.account_age_days}
          daysSinceLastActivity={profileStats.days_since_last_activity}
        />
      )}
      <PlanDetailsCard
        planType={planDetails.current_plan}
        monthlyLimit={planDetails.monthly_limit}
        features={planDetails.features}
      />
      <AccountActionsCard
        onActionClick={onAccountAction}
        securityStatus={securityStatus}
      />
    </div>
  );
};

export default ProfileStatsSection;
