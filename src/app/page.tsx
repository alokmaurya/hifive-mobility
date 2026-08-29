"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Root() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/auth/login"); return; }
    const isTraveller = user.user_metadata?.user_type === "traveller";
    router.replace(isTraveller ? "/traveller" : "/dashboard");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <span className="text-3xl animate-pulse">🧭</span>
    </div>
  );
}
