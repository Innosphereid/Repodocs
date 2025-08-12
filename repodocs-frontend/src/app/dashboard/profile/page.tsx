"use client";

import React, { useState } from "react";
import Layout from "@/components/templates/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/contexts/auth.context";
import ProfilePageContainer from "@/components/organisms/ProfilePageContainer";
import ProfileHeader from "@/components/molecules/ProfileHeader";
import ProfileLayout from "@/components/organisms/ProfileLayout";
import ProfileSection from "@/components/molecules/ProfileSection";
import ProfileInfo from "@/components/molecules/ProfileInfo";
import ProfileStatsSection from "@/components/molecules/ProfileStatsSection";
import ViewModeToggle from "@/components/molecules/ViewModeToggle";

export default function ProfilePage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"detailed" | "simple">("detailed");

  if (!user) {
    return null;
  }

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    console.log("Edit profile clicked");
  };

  const handleAccountAction = (action: string) => {
    // TODO: Implement account actions
    console.log("Account action clicked:", action);
  };

  return (
    <ProtectedRoute>
      <Layout maxWidth="xl">
        <ProfilePageContainer>
          <ProfileHeader onEditClick={handleEditProfile} />

          {/* View Mode Toggle */}
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />

          <ProfileLayout>
            {/* Left Column - Profile Info */}
            <ProfileSection>
              <ProfileInfo user={user} />
            </ProfileSection>

            {/* Right Column - Usage & Stats */}
            <ProfileSection className="lg:col-span-2">
              <ProfileStatsSection
                user={user}
                viewMode={viewMode}
                onAccountAction={handleAccountAction}
              />
            </ProfileSection>
          </ProfileLayout>
        </ProfilePageContainer>
      </Layout>
    </ProtectedRoute>
  );
}
