"use client";

import { useState } from "react";
import { Bell, Settings, ChevronRight, Car } from "lucide-react";
import StatusToggle from "@/components/driver/StatusToggle";
import EarningsCard from "@/components/driver/EarningsCard";
import QuickStats from "@/components/driver/QuickStats";
import TripHistoryList from "@/components/driver/TripHistoryList";
import RideRequestModal from "@/components/driver/RideRequestModal";
import BottomNav from "@/components/driver/BottomNav";
import { mockDriver, mockEarnings, mockTrips, mockRideRequest } from "@/lib/mockData";
import type { DriverStatus } from "@/types/driver";

export default function DriverHome() {
  const [driverStatus, setDriverStatus] = useState<DriverStatus>(mockDriver.status);
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  const isOnline = driverStatus === "online";
  const isOnTrip = driverStatus === "on_trip";
  const headerColored = isOnline || isOnTrip;

  const headerBg = isOnTrip
    ? "bg-amber-500"
    : isOnline
    ? "bg-indigo-600"
    : "bg-white border-b border-gray-100";

  const handleStatusToggle = (newStatus: DriverStatus) => {
    setDriverStatus(newStatus);
    if (newStatus === "online") {
      setTimeout(() => setShowRideRequest(true), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`sticky top-0 z-30 px-5 pt-4 pb-5 transition-colors duration-500 ${headerBg}`}>
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${headerColored ? "bg-white/20" : "bg-indigo-100"}`}>
              <Car className={`w-5 h-5 ${headerColored ? "text-white" : "text-indigo-600"}`} />
            </div>
            <div>
              <p className={`text-xs font-medium ${headerColored ? "text-white/70" : "text-gray-400"}`}>
                Good {greeting}
              </p>
              <p className={`text-base font-bold leading-none ${headerColored ? "text-white" : "text-gray-800"}`}>
                {mockDriver.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotifications(0)}
              className={`relative p-2 rounded-xl transition-colors ${headerColored ? "bg-white/20 hover:bg-white/30" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              <Bell className={`w-5 h-5 ${headerColored ? "text-white" : "text-gray-600"}`} />
              {notifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            <button className={`p-2 rounded-xl transition-colors ${headerColored ? "bg-white/20 hover:bg-white/30" : "bg-gray-100 hover:bg-gray-200"}`}>
              <Settings className={`w-5 h-5 ${headerColored ? "text-white" : "text-gray-600"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Vehicle strip (continues header color) */}
      <div className={`transition-colors duration-500 ${headerBg} px-4 pb-6`}>
        <div className="max-w-md mx-auto">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${headerColored ? "bg-white/20" : "bg-gray-50 border border-gray-200"}`}>
            <Car className={`w-4 h-4 ${headerColored ? "text-white/80" : "text-gray-500"}`} />
            <span className={`text-sm font-medium ${headerColored ? "text-white/90" : "text-gray-600"}`}>
              {mockDriver.vehicleModel}
            </span>
            <span className={`ml-auto text-xs font-mono px-2 py-0.5 rounded-md ${headerColored ? "bg-white/20 text-white/80" : "bg-gray-200 text-gray-500"}`}>
              {mockDriver.vehiclePlate}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-md mx-auto px-4 pb-24 -mt-3">
        {/* Status card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-4 flex flex-col items-center">
          <StatusToggle status={driverStatus} onToggle={handleStatusToggle} />

          {isOnTrip && (
            <div className="mt-4 w-full bg-amber-50 rounded-2xl px-4 py-3 border border-amber-100">
              <p className="text-sm font-semibold text-amber-700 text-center">You are currently on a trip</p>
              <p className="text-xs text-amber-500 text-center mt-0.5">Complete the trip to accept new rides</p>
            </div>
          )}
          {driverStatus === "offline" && (
            <p className="mt-3 text-xs text-gray-400 text-center">Go online to start receiving ride requests</p>
          )}
          {isOnline && (
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs text-green-600 font-medium">Looking for ride requests…</p>
            </div>
          )}
        </div>

        {/* Earnings */}
        <div className="mb-4">
          <EarningsCard earnings={mockEarnings} />
        </div>

        {/* Quick stats */}
        <div className="mb-6">
          <QuickStats totalTrips={mockDriver.totalTrips} rating={mockDriver.rating} />
        </div>

        {/* Recent trips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800">Recent Trips</h2>
            <button className="flex items-center gap-1 text-xs text-indigo-600 font-medium hover:text-indigo-700">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <TripHistoryList trips={mockTrips} />
        </div>
      </main>

      <BottomNav active="home" />

      {showRideRequest && (
        <RideRequestModal
          request={mockRideRequest}
          onAccept={() => { setShowRideRequest(false); setDriverStatus("on_trip"); }}
          onDecline={() => setShowRideRequest(false)}
        />
      )}
    </div>
  );
}
