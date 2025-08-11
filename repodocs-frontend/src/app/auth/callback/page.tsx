"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/templates/Layout";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import { useAuth } from "@/lib/hooks";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) {
        router.replace("/");
        return;
      }

      const ok = await login(code);
      if (ok) {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
    };

    handleAuth();
  }, [login, router]);

  return (
    <Layout>
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-3 text-gray-700">
          <LoadingSpinner />
          <span>Signing you in with GitHub...</span>
        </div>
      </div>
    </Layout>
  );
}
