"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function RootRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (loading) return;
    // Restore navigation from GitHub Pages 404 SPA redirect (?p=encoded-path)
    const redirectPath = params.get("p");
    if (redirectPath && redirectPath !== "/") {
      const search = params.get("q") ? "?" + decodeURIComponent(params.get("q")!) : "";
      const hash   = params.get("h") ? "#" + decodeURIComponent(params.get("h")!) : "";
      router.replace(redirectPath + search + hash);
      return;
    }
    router.replace(user ? "/dashboard" : "/auth/login");
  }, [user, loading, router, params]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <span className="text-3xl animate-pulse">🧭</span>
    </div>
  );
}

export default function Root() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <span className="text-3xl animate-pulse">🧭</span>
      </div>
    }>
      <RootRedirect />
    </Suspense>
  );
}
