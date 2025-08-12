import React from "react";
import ProfileCard from "./ProfileCard";
import AccountSecurityCard from "./AccountSecurityCard";
import { User, SecurityStatus } from "@/lib/types";

export interface ProfileInfoProps {
  user: User;
  securityStatus: SecurityStatus;
  className?: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  user,
  securityStatus,
  className,
}) => {
  return (
    <div className={className}>
      <ProfileCard user={user} />
      <AccountSecurityCard
        githubId={user.github_id}
        hasPassword={securityStatus.password_set}
        twoFactorEnabled={securityStatus.two_factor_enabled}
        lastLogin={securityStatus.last_login}
      />
    </div>
  );
};

export default ProfileInfo;
