import React from "react";
import ProfileCard from "./ProfileCard";
import AccountSecurityCard from "./AccountSecurityCard";
import { User } from "@/lib/types";

export interface ProfileInfoProps {
  user: User;
  className?: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, className }) => {
  return (
    <div className={className}>
      <ProfileCard user={user} />
      <AccountSecurityCard githubId={user.github_id} hasPassword={true} />
    </div>
  );
};

export default ProfileInfo;
