"use client";

import { Star, Shield, Globe, Car, Map, Users, Clock, Pencil, ChevronRight, LogOut } from "lucide-react";
import AppHeader from "@/components/ui/AppHeader";
import BottomNav from "@/components/ui/BottomNav";
import { mockDriver } from "@/lib/mockData";
import { CATEGORY_META } from "@/lib/utils";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <AppHeader title="My Profile" />

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Avatar section */}
        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-5">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-3xl font-bold text-white shrink-0">
              {mockDriver.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-stone-900">{mockDriver.name}</h1>
                {mockDriver.isVerified && (
                  <span className="flex items-center gap-1 bg-teal-50 text-teal-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-stone-800">{mockDriver.rating}</span>
                <span className="text-xs text-stone-400">({mockDriver.totalToursRun} tours)</span>
              </div>
              <p className="text-sm text-stone-500 mt-1">{mockDriver.yearsExperience} years experience</p>
            </div>
          </div>

          <p className="text-sm text-stone-600 mt-4 leading-relaxed">{mockDriver.bio}</p>

          <button className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors">
            <Pencil className="w-4 h-4 text-stone-500" />
            <span className="text-sm font-semibold text-stone-600">Edit Profile</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Map, label: "Tours Run", value: mockDriver.totalToursRun, color: "text-brand-500", bg: "bg-brand-50" },
            { icon: Users, label: "Guests Hosted", value: mockDriver.totalGuestsHosted, color: "text-teal-500", bg: "bg-teal-50" },
            { icon: Clock, label: "Yrs Experience", value: mockDriver.yearsExperience, color: "text-purple-500", bg: "bg-purple-50" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-3 shadow-sm border border-stone-100 text-center">
              <div className={`${bg} w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-1.5`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-lg font-bold text-stone-900">{value}</p>
              <p className="text-[10px] text-stone-400 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Vehicle */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Car className="w-5 h-5 text-stone-400" />
            <span className="text-sm font-bold text-stone-800">Vehicle</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Model</span>
              <span className="font-medium text-stone-800">{mockDriver.vehicleModel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Plate</span>
              <span className="font-mono text-stone-800">{mockDriver.vehiclePlate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Capacity</span>
              <span className="font-medium text-stone-800">Up to {mockDriver.vehicleCapacity} guests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Type</span>
              <span className="font-medium text-stone-800 capitalize">{mockDriver.vehicleType.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Languages & Specialties */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-stone-400" />
              <span className="text-sm font-bold text-stone-800">Languages</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {mockDriver.languages.map((lang) => (
                <span key={lang} className="text-xs bg-teal-50 text-teal-700 font-medium px-2.5 py-1 rounded-full">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-stone-800 mb-2">Tour Specialties</p>
            <div className="flex flex-wrap gap-1.5">
              {mockDriver.specialties.map((cat) => {
                const meta = CATEGORY_META[cat];
                return (
                  <span key={cat} className={`text-xs font-medium px-2.5 py-1 rounded-full ${meta?.color ?? ""}`}>
                    {meta?.emoji} {meta?.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Settings list */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          {[
            { label: "Bank & Payouts", icon: "💳" },
            { label: "Notifications", icon: "🔔" },
            { label: "Documents & License", icon: "📄" },
            { label: "Help & Support", icon: "💬" },
          ].map(({ label, icon }) => (
            <button key={label} className="w-full flex items-center justify-between px-4 py-3.5 border-b border-stone-50 last:border-none hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-medium text-stone-700">{label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300" />
            </button>
          ))}
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-100 bg-red-50 hover:bg-red-100 transition-colors">
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-red-500">Sign Out</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
