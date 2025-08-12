import React from "react";
import { cn } from "@/lib/utils";

export interface ProfilePageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ProfilePageContainer: React.FC<ProfilePageContainerProps> = ({
  children,
  className,
}) => {
  return <div className={cn("space-y-8", className)}>{children}</div>;
};

export default ProfilePageContainer;
