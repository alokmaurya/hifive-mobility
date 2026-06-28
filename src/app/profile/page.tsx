"use client";

import { Star, Shield, Globe, Car, Map, Users, Clock, Pencil, ChevronRight, LogOut } from "lucide-react";
import AppHeader from "@/components/ui/AppHeader";
import BottomNav from "@/components/ui/BottomNav";
import { mockDriver } from "@/lib/mockData";
import { CATEGORY_META } from "@/lib/utils";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <AppHeader title="My Profile" />

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Avatar section */}
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-yellow-400 flex items-center justify-center text-3xl font-bold text-black shrink-0">
              {mockDriver.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-white">{mockDriver.name}</h1>
                {mockDriver.isVerified && (
                  <span className="flex items-center gap-1 bg-yellow-400/10 text-yellow-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-yellow-400/20">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-white">{mockDriver.rating}</span>
                <span className="text-xs text-zinc-500">({mockDriver.totalToursRun} tours)</span>
              </div>
              <p className="text-sm text-zinc-500 mt-1">{mockDriver.yearsExperience} years experience</p>
            </div>
          </div>

          <p className="text-sm text-zinc-400 mt-4 leading-relaxed">{mockDriver.bio}</p>

          <button className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
            <Pencil className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-semibold text-zinc-300">Edit Profile</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Map, label: "Tours Run", value: mockDriver.totalToursRun, color: "text-yellow-400", bg: "bg-yellow-400/10" },
            { icon: Users, label: "Guests Hosted", value: mockDriver.totalGuestsHosted, color: "text-yellow-400", bg: "bg-yellow-400/10" },
            { icon: Clock, label: "Yrs Experience", value: mockDriver.yearsExperience, color: "text-yellow-400", bg: "bg-yellow-400/10" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-zinc-900 rounded-2xl p-3 border border-zinc-800 text-center">
              <div className={`${bg} w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-1.5`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="text-[10px] text-zinc-500 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Vehicle */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Car className="w-5 h-5 text-zinc-500" />
            <span className="text-sm font-bold text-white">Vehicle</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Model</span>
              <span className="font-medium text-zinc-200">{mockDriver.vehicleModel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Plate</span>
              <span className="font-mono text-zinc-200">{mockDriver.vehiclePlate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Capacity</span>
              <span className="font-medium text-zinc-200">Up to {mockDriver.vehicleCapacity} guests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Type</span>
              <span className="font-medium text-zinc-200 capitalize">{mockDriver.vehicleType.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Languages & Specialties */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-zinc-500" />
              <span className="text-sm font-bold text-white">Languages</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {mockDriver.languages.map((lang) => (
                <span key={lang} className="text-xs bg-zinc-800 text-zinc-300 font-medium px-2.5 py-1 rounded-full border border-zinc-700">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-white mb-2">Tour Specialties</p>
            <div className="flex flex-wrap gap-1.5">
              {mockDriver.specialties.map((cat) => {
                const meta = CATEGORY_META[cat];
                return (
                  <span key={cat} className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                    {meta?.emoji} {meta?.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Settings list */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          {[
            { label: "Bank & Payouts", icon: "💳" },
            { label: "Notifications", icon: "🔔" },
            { label: "Documents & License", icon: "📄" },
            { label: "Help & Support", icon: "💬" },
          ].map(({ label, icon }) => (
            <button key={label} className="w-full flex items-center justify-between px-4 py-3.5 border-b border-zinc-800 last:border-none hover:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-medium text-zinc-300">{label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </button>
          ))}
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-400/20 bg-red-400/5 hover:bg-red-400/10 transition-colors">
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-red-400">Sign Out</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
