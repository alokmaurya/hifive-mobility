"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Root() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard"); }, [router]);
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <span className="text-3xl animate-pulse">🧭</span>
    </div>
  );
}
