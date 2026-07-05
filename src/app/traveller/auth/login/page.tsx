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
    <div className="min-h-screen bg-blue-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-3">
            <MapPin className="w-7 h-7 text-blue-900" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-sm text-blue-200 mt-1">Sign in to explore tours</p>
        </div>
        <h1 className="text-2xl font-bold text-white">HiFive Tours</h1>
        <p className="text-blue-300 text-sm mt-1">Discover amazing sightseeing tours</p>
      </div>

      <div className="flex-1 px-4 -mt-6">
        <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-lg border border-sky-100 p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-1">Welcome Back</h2>
          <p className="text-slate-400 text-sm mb-5">Sign in to explore tours</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wide block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-2xl border border-blue-700 bg-blue-900 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wide block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
              className="w-full px-4 py-3 rounded-2xl border border-blue-700 bg-blue-900 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
          </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-blue-900 font-bold rounded-2xl hover:bg-blue-50 disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-blue-300 text-center mt-6">
          New traveller?{" "}
          <Link href="/traveller/auth/signup" className="text-white font-semibold hover:underline">
            Create account
          </Link>
        </p>

        <p className="text-xs text-blue-400 text-center mt-3">
          Are you a driver?{" "}
          <Link href="/auth/login" className="text-blue-300 hover:text-blue-200 underline">
            Driver login
          </Link>
        </p>
      </div>
    </div>
  );
}
