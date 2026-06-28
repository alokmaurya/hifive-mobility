"use client";

import { Suspense } from "react";
import TourDetailClient from "./TourDetailClient";

export default function TourDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TourDetailClient />
    </Suspense>
  );
}
