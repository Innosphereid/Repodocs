import React from "react";
import { cn } from "@/lib/utils";

export interface ProfileSectionProps {
  children: React.ReactNode;
  className?: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  children,
  className,
}) => {
  return <div className={cn("space-y-6", className)}>{children}</div>;
};

export default ProfileSection;
