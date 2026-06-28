"use client";

import Link from "next/link";
import { Map, TrendingUp, Star, Plus, CalendarCheck, ChevronRight, Users } from "lucide-react";
import BottomNav from "@/components/ui/BottomNav";
import TourCard from "@/components/tours/TourCard";
import BookingCard from "@/components/bookings/BookingCard";
import { mockDriver, mockTours, mockBookings, mockEarnings } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

export default function Dashboard() {
  const publishedTours = mockTours.filter((t) => t.status === "published");
  const pendingBookings = mockBookings.filter((b) => b.status === "pending");
  const recentBookings = mockBookings.slice(0, 3);
  const totalNet = mockEarnings.reduce((s, e) => s + e.netRevenue, 0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      {/* Hero header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 pt-4 pb-8">
        <div className="flex items-center justify-between mb-4 max-w-md mx-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🧭</span>
            <span className="text-base font-bold text-white">HiFive</span>
            <span className="text-base font-bold text-yellow-400">Tours</span>
          </div>
          {pendingBookings.length > 0 && (
            <Link href="/bookings" className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1.5 rounded-full">
              <CalendarCheck className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-bold text-yellow-400">{pendingBookings.length} pending</span>
            </Link>
          )}
        </div>

        <div className="max-w-md mx-auto">
          <p className="text-zinc-400 text-sm">{greeting},</p>
          <h1 className="text-2xl font-bold text-white">{mockDriver.name} 👋</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-white font-medium">{mockDriver.rating}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-sm text-zinc-400">{mockDriver.totalGuestsHosted} guests hosted</span>
            {mockDriver.isVerified && (
              <span className="bg-yellow-400/10 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-400/20">✓ Verified</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: publishedTours.length, label: "Active Tours" },
            { value: mockDriver.totalGuestsHosted, label: "Guests Hosted" },
            { value: formatCurrency(totalNet), label: "Total Earned", yellow: true },
          ].map(({ value, label, yellow }) => (
            <div key={label} className="bg-zinc-900 rounded-2xl p-3 border border-zinc-800 text-center">
              <p className={`text-xl font-bold ${yellow ? "text-yellow-400" : "text-white"}`}>{value}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Active tours */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">Your Active Tours</h2>
            <Link href="/tours" className="flex items-center gap-0.5 text-xs text-yellow-400 font-medium">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {publishedTours.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {publishedTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} compact />
              ))}
              <Link
                href="/tours/new"
                className="shrink-0 w-52 bg-zinc-900 border-2 border-dashed border-yellow-400/30 rounded-2xl flex flex-col items-center justify-center gap-2 min-h-[168px] hover:border-yellow-400/60 transition-colors"
              >
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-black" />
                </div>
                <p className="text-sm font-semibold text-yellow-400">Add New Tour</p>
              </Link>
            </div>
          ) : (
            <div className="bg-zinc-900 rounded-2xl p-6 text-center border-2 border-dashed border-yellow-400/20">
              <p className="text-3xl mb-2">🗺️</p>
              <p className="text-sm font-semibold text-white mb-1">No active tours yet</p>
              <p className="text-xs text-zinc-500 mb-4">Create your first sightseeing tour and start earning</p>
              <Link href="/tours/new" className="inline-flex items-center gap-2 bg-yellow-400 text-black text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-300 transition-colors">
                <Plus className="w-4 h-4" /> Create Tour
              </Link>
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-white">Recent Bookings</h2>
            <Link href="/bookings" className="flex items-center gap-0.5 text-xs text-yellow-400 font-medium">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex items-center gap-3">
            <div className="bg-yellow-400/10 p-2.5 rounded-xl">
              <Map className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">My Tours</p>
              <p className="text-lg font-bold text-white">{mockTours.length} total</p>
            </div>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex items-center gap-3">
            <div className="bg-yellow-400/10 p-2.5 rounded-xl">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">This Month</p>
              <p className="text-lg font-bold text-yellow-400">{formatCurrency(totalNet)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <Link
        href="/tours/new"
        className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-yellow-400 rounded-full shadow-xl shadow-yellow-400/30 flex items-center justify-center hover:bg-yellow-300 transition-colors"
      >
        <Plus className="w-6 h-6 text-black" />
      </Link>

      <BottomNav />
    </div>
  );
}
