import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, User } from "lucide-react";

export interface ProfileHeaderProps {
  onEditClick?: () => void;
  className?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onEditClick,
  className,
}) => {
  return (
    <div className={`flex items-center justify-between ${className || ""}`}>
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <User className="h-6 w-6" /> Profile
      </h1>
      <Button variant="outline" className="gap-2" onClick={onEditClick}>
        <Edit className="h-4 w-4" /> Edit Profile
      </Button>
    </div>
  );
};

export default ProfileHeader;
