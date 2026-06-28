"use client";

import Link from "next/link";
import { Map, Users, TrendingUp, Star, Plus, CalendarCheck, ChevronRight } from "lucide-react";
import AppHeader from "@/components/ui/AppHeader";
import BottomNav from "@/components/ui/BottomNav";
import StatCard from "@/components/ui/StatCard";
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
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 px-4 pt-4 pb-8">
        <div className="flex items-center justify-between mb-4 max-w-md mx-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🧭</span>
            <span className="text-base font-bold text-white">HiFive</span>
            <span className="text-base font-bold text-brand-200">Tours</span>
          </div>
          <div className="flex items-center gap-2">
            {pendingBookings.length > 0 && (
              <Link href="/bookings" className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full">
                <CalendarCheck className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-bold text-white">{pendingBookings.length} pending</span>
              </Link>
            )}
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <p className="text-brand-200 text-sm">{greeting},</p>
          <h1 className="text-2xl font-bold text-white">{mockDriver.name} 👋</h1>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span className="text-sm text-white font-medium">{mockDriver.rating}</span>
            <span className="text-brand-200 text-sm">·</span>
            <span className="text-sm text-brand-200">{mockDriver.totalGuestsHosted} guests hosted</span>
            {mockDriver.isVerified && (
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">✓ Verified</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-stone-100 text-center">
            <p className="text-2xl font-bold text-stone-900">{publishedTours.length}</p>
            <p className="text-xs text-stone-400 mt-0.5">Active Tours</p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-stone-100 text-center">
            <p className="text-2xl font-bold text-stone-900">{mockDriver.totalGuestsHosted}</p>
            <p className="text-xs text-stone-400 mt-0.5">Guests Hosted</p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-stone-100 text-center">
            <p className="text-2xl font-bold text-brand-500">{formatCurrency(totalNet)}</p>
            <p className="text-xs text-stone-400 mt-0.5">Total Earned</p>
          </div>
        </div>

        {/* Active tours */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-stone-900">Your Active Tours</h2>
            <Link href="/tours" className="flex items-center gap-0.5 text-xs text-brand-500 font-medium">
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
                className="shrink-0 w-52 bg-brand-50 border-2 border-dashed border-brand-200 rounded-2xl flex flex-col items-center justify-center gap-2 min-h-[168px] hover:bg-brand-100 transition-colors"
              >
                <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-semibold text-brand-600">Add New Tour</p>
              </Link>
            </div>
          ) : (
            <div className="bg-brand-50 rounded-2xl p-6 text-center border-2 border-dashed border-brand-200">
              <p className="text-3xl mb-2">🗺️</p>
              <p className="text-sm font-semibold text-stone-700 mb-1">No active tours yet</p>
              <p className="text-xs text-stone-400 mb-4">Create your first sightseeing tour and start earning</p>
              <Link href="/tours/new" className="inline-flex items-center gap-2 bg-brand-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-brand-600 transition-colors">
                <Plus className="w-4 h-4" /> Create Tour
              </Link>
            </div>
          )}
        </div>

        {/* Recent bookings */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-stone-900">Recent Bookings</h2>
            <Link href="/bookings" className="flex items-center gap-0.5 text-xs text-brand-500 font-medium">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2">
          <StatCard icon={Map} label="My Tours" value={`${mockTours.length} total`} iconColor="text-teal-500" iconBg="bg-teal-50" />
          <StatCard icon={TrendingUp} label="This Month" value={formatCurrency(totalNet)} iconColor="text-brand-500" iconBg="bg-brand-50" />
        </div>
      </div>

      {/* FAB */}
      <Link
        href="/tours/new"
        className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-brand-500 rounded-full shadow-xl shadow-brand-300 flex items-center justify-center hover:bg-brand-600 transition-colors"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>

      <BottomNav />
    </div>
  );
}
