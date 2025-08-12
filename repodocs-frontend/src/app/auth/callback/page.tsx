"use client";

import { Suspense } from "react";
import { OAuthCallback } from "@/components/auth/OAuthCallback";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <OAuthCallback />
    </Suspense>
  );
}
