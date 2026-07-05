"use client";

import { Suspense } from "react";
import DriverDetailClient from "./DriverDetailClient";

export default function DriverDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-blue-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DriverDetailClient />
    </Suspense>
  );
}
