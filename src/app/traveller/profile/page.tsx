"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, LogOut, Save } from "lucide-react";
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
      setTimeout(() => setSaved(false), 2000);
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

  return (
    <RequireTravellerAuth>
      <div className="min-h-screen bg-blue-950 pb-20">
        <div className="bg-blue-900 border-b border-blue-800 px-4 pt-10 pb-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Profile</h1>
              <p className="text-blue-200 text-sm mt-0.5">Manage your account</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-blue-200 hover:text-red-400 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>

        <div className="px-4 max-w-md mx-auto mt-6">
          {loading ? (
            <div className="flex justify-center mt-12">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center border-2 border-blue-700">
                  <UserCircle className="w-12 h-12 text-blue-400" />
                </div>
                <p className="text-white font-bold mt-2">{traveller?.name || "Traveller"}</p>
                <p className="text-blue-300 text-sm">{traveller?.email}</p>
              </div>

              {/* Edit form */}
              <div className="bg-blue-900 rounded-3xl p-5 border border-blue-800">
                <h2 className="text-white font-semibold text-sm mb-4">Edit Details</h2>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-blue-200 uppercase tracking-wide block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-blue-700 bg-blue-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-blue-200 uppercase tracking-wide block mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-3 rounded-2xl border border-blue-700 bg-blue-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                    />
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 bg-white text-blue-900 font-bold rounded-2xl hover:bg-blue-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
