"use client";

import { Suspense } from "react";
import ExploreClient from "./ExploreClient";

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-blue-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ExploreClient />
    </Suspense>
  );
}
