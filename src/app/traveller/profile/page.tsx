"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Save, User, Phone, Mail } from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import { useTraveller } from "@/hooks/useTraveller";
import { supabase } from "@/lib/supabase";

export default function TravellerProfilePage() {
  const router = useRouter();
  const { traveller, loading, updateTraveller } = useTraveller();
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  if (!initialized && traveller) {
    setName(traveller.name);
    setPhone(traveller.phone ?? "");
    setInitialized(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateTraveller({ name, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/traveller/auth/login");
  }

  const initial = (traveller?.name ?? "T").charAt(0).toUpperCase();

  return (
    <RequireTravellerAuth>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-4 pt-12 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 60%), radial-gradient(circle at 80% 20%, #38bdf8 0%, transparent 50%)"}} />
          <div className="relative max-w-md mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Profile</h1>
              <p className="text-blue-300 text-sm mt-0.5">Your account details</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-blue-300 hover:text-red-300 transition-colors text-sm border border-white/10 px-3 py-1.5 rounded-xl bg-white/5 backdrop-blur-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-16 gap-3">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="px-4 max-w-md mx-auto">
            {/* Avatar — overlaps header */}
            <div className="flex flex-col items-center -mt-10 mb-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center border-4 border-white shadow-xl shadow-indigo-200/50">
                <span className="text-3xl font-extrabold text-white">{initial}</span>
              </div>
              <p className="text-slate-900 font-bold text-lg mt-3">{traveller?.name || "Traveller"}</p>
              <p className="text-slate-400 text-sm">{traveller?.email}</p>
            </div>

            {/* Edit form */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              <h2 className="text-slate-800 font-bold text-base mb-4">Edit Details</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                    <User className="w-3 h-3" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                    <Phone className="w-3 h-3" /> Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <input
                    type="email"
                    value={traveller?.email ?? ""}
                    readOnly
                    className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 text-sm cursor-not-allowed"
                  />
                </div>

                {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full py-3.5 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm transition-all ${
                    saved
                      ? "bg-green-500 text-white"
                      : "bg-gradient-to-r from-indigo-600 to-sky-500 text-white hover:opacity-90 shadow-md shadow-indigo-100 disabled:opacity-50"
                  }`}
                >
                  {saving ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : saved ? (
                    "✓ Saved!"
                  ) : (
                    <><Save className="w-4 h-4" /> Save Changes</>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
