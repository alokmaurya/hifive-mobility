"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MapPin } from "lucide-react";

export default function TravellerSignupPage() {
  const router = useRouter();
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, user_type: "traveller" } },
    });
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
          <h1 className="text-2xl font-bold text-white">Join HiFive Tours</h1>
          <p className="text-sm text-blue-200 mt-1">Discover amazing sightseeing tours</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wide block mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-2xl border border-blue-700 bg-blue-900 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
          </div>
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
              minLength={6}
              placeholder="Min 6 characters"
              className="w-full px-4 py-3 rounded-2xl border border-blue-700 bg-blue-900 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-blue-900 font-bold rounded-2xl hover:bg-blue-50 disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-blue-300 text-center mt-6">
          Already have an account?{" "}
          <Link href="/traveller/auth/login" className="text-white font-semibold hover:underline">
            Sign in
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
