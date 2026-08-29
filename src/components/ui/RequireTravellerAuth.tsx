"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RequireTravellerAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isDriver = user ? user.user_metadata?.user_type === "driver" : false;

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/traveller/auth/login"); return; }
    if (isDriver) router.replace("/dashboard");
  }, [user, loading, isDriver, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || isDriver) return null;
  return <>{children}</>;
}
