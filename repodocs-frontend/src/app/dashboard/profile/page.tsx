"use client";

import React, { useState, useEffect } from "react";
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
import { UserProfileResponse } from "@/lib/types";
import { authService } from "@/lib/services/auth.service";

export default function ProfilePage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"detailed" | "simple">("detailed");
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await authService.getComprehensiveProfile();
        setProfileData(data);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load profile data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout maxWidth="xl">
          <ProfilePageContainer>
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading profile data...</p>
              </div>
            </div>
          </ProfilePageContainer>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Layout maxWidth="xl">
          <ProfilePageContainer>
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Error Loading Profile
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </ProfilePageContainer>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!profileData) {
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
              <ProfileInfo
                user={profileData.user}
                securityStatus={profileData.security_status}
              />
            </ProfileSection>

            {/* Right Column - Usage & Stats */}
            <ProfileSection className="lg:col-span-2">
              <ProfileStatsSection
                user={profileData.user}
                profileStats={profileData.profile_stats}
                planDetails={profileData.plan_details}
                securityStatus={profileData.security_status}
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
