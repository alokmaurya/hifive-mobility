"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MapPin, Eye, EyeOff } from "lucide-react";

export default function TravellerLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.replace("/traveller");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-4 pt-16 pb-20 flex flex-col items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 30% 40%, #6366f1 0%, transparent 55%), radial-gradient(circle at 75% 70%, #0ea5e9 0%, transparent 50%)"}} />
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-indigo-900/50">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">HiFive Tours</h1>
          <p className="text-blue-300 text-sm mt-1">Discover amazing sightseeing tours</p>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 px-4 -mt-8">
        <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">Welcome back 👋</h2>
          <p className="text-slate-400 text-sm mb-6">Sign in to explore tours</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Your password"
                  className="w-full px-4 py-3 pr-11 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-bold rounded-2xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-slate-400 text-center mt-5">
            New traveller?{" "}
            <Link href="/traveller/auth/signup" className="text-indigo-600 font-bold hover:underline">
              Create account
            </Link>
          </p>

          <p className="text-xs text-slate-300 text-center mt-3">
            Are you a driver?{" "}
            <Link href="/auth/login" className="text-slate-400 hover:text-indigo-600 underline transition-colors">
              Driver login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
