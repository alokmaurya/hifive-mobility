"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Root() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? "/dashboard" : "/auth/login");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <span className="text-3xl animate-pulse">🧭</span>
    </div>
  );
}
