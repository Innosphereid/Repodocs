"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth.context";
import { authService } from "@/lib/services/auth.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

export const OAuthCallback: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      if (!searchParams) {
        setStatus("error");
        setError("Invalid request parameters.");
        return;
      }

      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const oauthError = searchParams.get("error");

      if (oauthError) {
        setStatus("error");
        setError("Authentication failed. Please try again.");
        return;
      }

      if (!code || !state) {
        setStatus("error");
        setError("Missing OAuth parameters. Please try again.");
        return;
      }

      console.log("OAuth callback received:", { code, state });

      // Use auth service to handle OAuth callback
      try {
        console.log("Attempting to exchange OAuth code for token...");
        const response = await authService.handleGitHubCallback(code, state);

        console.log("Auth service response:", response);

        if (response.access_token) {
          console.log(
            "Token received from auth service:",
            response.access_token
          );

          // Token is automatically stored by auth service
          // Now refresh user data and redirect
          await refreshUser();
          setStatus("success");

          // Redirect to dashboard after successful authentication
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
          return;
        } else {
          throw new Error("No access token in auth service response");
        }
      } catch (fetchError) {
        console.error("Auth service OAuth error:", fetchError);
        throw new Error(
          `Failed to complete OAuth: ${
            fetchError instanceof Error ? fetchError.message : "Unknown error"
          }`
        );
      }
    } catch (err) {
      console.error("OAuth callback error:", err);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Authentication failed");
    }
  };

  const handleRetry = () => {
    router.push("/auth/login");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Completing Authentication</CardTitle>
            <CardDescription>
              Please wait while we complete your sign-in...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-sm text-gray-600">
              Redirecting you to your dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">
              Authentication Failed
            </CardTitle>
            <CardDescription>
              We couldn&apos;t complete your sign-in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleRetry} className="flex-1">
                Try Again
              </Button>
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="flex-1"
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Welcome!</CardTitle>
          <CardDescription>
            You have been successfully signed in
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-green-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Redirecting you to your dashboard...
          </p>
          <Button onClick={() => router.push("/dashboard")} className="w-full">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
