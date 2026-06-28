"use client";

import { useState } from "react";
import { Power, Loader2 } from "lucide-react";
import type { DriverStatus } from "@/types/driver";

interface StatusToggleProps {
  status: DriverStatus;
  onToggle: (status: DriverStatus) => void;
}

export default function StatusToggle({ status, onToggle }: StatusToggleProps) {
  const [loading, setLoading] = useState(false);

  const isOnline = status === "online";
  const isOnTrip = status === "on_trip";

  const handleToggle = async () => {
    if (isOnTrip) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onToggle(isOnline ? "offline" : "online");
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleToggle}
        disabled={loading || isOnTrip}
        className={`
          relative w-24 h-24 rounded-full flex items-center justify-center
          shadow-lg transition-all duration-300 active:scale-95
          ${isOnTrip
            ? "bg-amber-500 shadow-amber-200 cursor-not-allowed"
            : isOnline
            ? "bg-green-500 shadow-green-200 hover:bg-green-600"
            : "bg-gray-300 shadow-gray-200 hover:bg-gray-400"
          }
        `}
      >
        {loading ? (
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        ) : (
          <Power className="w-10 h-10 text-white" />
        )}
        {isOnline && !loading && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      <div className="text-center">
        <p
          className={`text-sm font-semibold uppercase tracking-widest ${
            isOnTrip
              ? "text-amber-500"
              : isOnline
              ? "text-green-600"
              : "text-gray-400"
          }`}
        >
          {isOnTrip ? "On Trip" : isOnline ? "Online" : "Offline"}
        </p>
        {!isOnTrip && (
          <p className="text-xs text-gray-400 mt-0.5">
            {isOnline ? "Tap to go offline" : "Tap to go online"}
          </p>
        )}
      </div>
    </div>
  );
}
