import React from "react";
import { cn } from "@/lib/utils";

export interface ProfileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-8", className)}>
      {children}
    </div>
  );
};

export default ProfileLayout;
