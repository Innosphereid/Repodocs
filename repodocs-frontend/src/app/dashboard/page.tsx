"use client";

import React from "react";
import Layout from "@/components/templates/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserDashboard } from "@/lib/hooks";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import {
  BarChart3,
  RefreshCcw,
  FolderGit2,
  Star,
  CheckCircle,
} from "lucide-react";

export default function DashboardPage() {
  const { dashboardData, isLoading, error, refetch } = useUserDashboard();

  return (
    <Layout maxWidth="xl">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" /> Dashboard
          </h1>
          <Button variant="outline" className="gap-2" onClick={refetch}>
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-600">
            <LoadingSpinner size="sm" /> Loading dashboard...
          </div>
        )}

        {error && <div className="text-red-600">{error}</div>}

        {dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Month Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {dashboardData.usage_stats.current_month_usage}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Repositories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold flex items-center gap-2">
                    <FolderGit2 className="h-6 w-6" />
                    {dashboardData.usage_stats.total_repositories}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Successful Generations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    {dashboardData.usage_stats.successful_generations}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-500" />
                    {dashboardData.usage_stats.average_rating.toFixed(1)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Plan Limits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Monthly Limit</div>
                    <div className="text-xl font-semibold">
                      {dashboardData.plan_limits.monthly_limit < 0
                        ? "Unlimited"
                        : dashboardData.plan_limits.monthly_limit}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Current Usage</div>
                    <div className="text-xl font-semibold">
                      {dashboardData.plan_limits.current_usage}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">
                      Days Until Reset
                    </div>
                    <div className="text-xl font-semibold">
                      {dashboardData.plan_limits.days_until_reset}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recent_analyses.length === 0 && (
                    <div className="text-sm text-gray-600">
                      No analyses yet.
                    </div>
                  )}
                  {dashboardData.recent_analyses.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between border rounded-lg p-3"
                    >
                      <div>
                        <div className="font-medium">
                          {a.repository_owner}/{a.repository_name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {a.repository_url}
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        {a.analysis_status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
