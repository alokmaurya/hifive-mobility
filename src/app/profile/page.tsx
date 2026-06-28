"use client";

import { useState } from "react";
import { Star, Shield, Globe, Car, Map, Users, Clock, Pencil, ChevronRight, LogOut, X, Check } from "lucide-react";
import AppHeader from "@/components/ui/AppHeader";
import BottomNav from "@/components/ui/BottomNav";
import RequireAuth from "@/components/ui/RequireAuth";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { CATEGORY_META } from "@/lib/utils";
import type { TourCategory } from "@/types/tour";

function ProfileContent() {
  const { profile, loading, updateProfile } = useProfile();
  const { signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  function startEdit() {
    setName(profile?.name ?? "");
    setBio(profile?.bio ?? "");
    setEditing(true);
  }

  async function saveEdit() {
    setSaving(true);
    try {
      await updateProfile({ name, bio });
    } catch {}
    setSaving(false);
    setEditing(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 pb-24">
        <AppHeader title="My Profile" />
        <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-zinc-900 rounded-2xl border border-zinc-800 animate-pulse" />
          ))}
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <AppHeader title="My Profile" />

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Avatar & bio */}
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-5">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-yellow-400 flex items-center justify-center text-3xl font-bold text-black shrink-0">
              {profile?.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm mb-1 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                />
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-white">{profile?.name}</h1>
                  {profile?.isVerified && (
                    <span className="flex items-center gap-1 bg-yellow-400/10 text-yellow-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-yellow-400/20">
                      <Shield className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-white">{profile?.rating.toFixed(1)}</span>
                <span className="text-xs text-zinc-500">({profile?.totalToursRun} tours)</span>
              </div>
              <p className="text-sm text-zinc-500 mt-1">{profile?.yearsExperience} yrs experience</p>
            </div>
          </div>

          {editing ? (
            <>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell tourists about yourself…"
                className="mt-4 w-full px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-semibold text-zinc-300">Cancel</span>
                </button>
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-black" />
                  <span className="text-sm font-semibold text-black">{saving ? "Saving…" : "Save"}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {profile?.bio && <p className="text-sm text-zinc-400 mt-4 leading-relaxed">{profile.bio}</p>}
              <button
                onClick={startEdit}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                <Pencil className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-semibold text-zinc-300">Edit Profile</span>
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Map,   label: "Tours Run",      value: profile?.totalToursRun ?? 0 },
            { icon: Users, label: "Guests Hosted",  value: profile?.totalGuestsHosted ?? 0 },
            { icon: Clock, label: "Yrs Experience", value: profile?.yearsExperience ?? 0 },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-zinc-900 rounded-2xl p-3 border border-zinc-800 text-center">
              <div className="bg-yellow-400/10 w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <Icon className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="text-[10px] text-zinc-500 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Vehicle */}
        {profile?.vehicleModel && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-5 h-5 text-zinc-500" />
              <span className="text-sm font-bold text-white">Vehicle</span>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: "Model",    value: profile.vehicleModel },
                { label: "Plate",    value: profile.vehiclePlate },
                { label: "Capacity", value: `Up to ${profile.vehicleCapacity} guests` },
                { label: "Type",     value: profile.vehicleType.toUpperCase() },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-zinc-500">{label}</span>
                  <span className="font-medium text-zinc-200">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages & Specialties */}
        {((profile?.languages?.length ?? 0) > 0 || (profile?.specialties?.length ?? 0) > 0) && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 space-y-4">
            {(profile?.languages?.length ?? 0) > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm font-bold text-white">Languages</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile!.languages.map((lang) => (
                    <span key={lang} className="text-xs bg-zinc-800 text-zinc-300 font-medium px-2.5 py-1 rounded-full border border-zinc-700">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(profile?.specialties?.length ?? 0) > 0 && (
              <div>
                <p className="text-sm font-bold text-white mb-2">Tour Specialties</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile!.specialties.map((cat) => {
                    const meta = CATEGORY_META[cat as TourCategory];
                    return (
                      <span key={cat} className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                        {meta?.emoji} {meta?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          {[
            { label: "Bank & Payouts",       icon: "💳" },
            { label: "Notifications",        icon: "🔔" },
            { label: "Documents & License",  icon: "📄" },
            { label: "Help & Support",       icon: "💬" },
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

        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-400/20 bg-red-400/5 hover:bg-red-400/10 transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-red-400">Sign Out</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
