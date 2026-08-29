"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isTraveller = user?.user_metadata?.user_type === "traveller";

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/auth/login"); return; }
    if (isTraveller) router.replace("/traveller");
  }, [loading, user, isTraveller, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <span className="text-3xl animate-pulse">🧭</span>
      </div>
    );
  }

  if (!user || isTraveller) return null;

  return <>{children}</>;
}
