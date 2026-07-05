"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MapPin, Eye, EyeOff } from "lucide-react";

export default function TravellerSignupPage() {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, user_type: "traveller" } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.session) {
      router.replace("/traveller");
    } else {
      setDone(true);
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-3xl border border-sky-100 shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-xl font-bold text-blue-900">Check your email</h2>
          <p className="text-slate-500 text-sm mt-2">
            We sent a confirmation link to <span className="font-semibold text-blue-700">{email}</span>.
            Click it to activate your account, then sign in.
          </p>
          <Link
            href="/traveller/auth/login"
            className="mt-6 inline-block px-6 py-3 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-colors text-sm"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-blue-950 px-4 pt-16 pb-14 flex flex-col items-center">
        <div className="w-16 h-16 bg-sky-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Join HiFive Tours</h1>
        <p className="text-blue-300 text-sm mt-1">Discover amazing sightseeing tours</p>
      </div>

      <div className="flex-1 px-4 -mt-6">
        <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-lg border border-sky-100 p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-1">Create Account</h2>
          <p className="text-slate-400 text-sm mb-5">Start exploring India</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide block mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-2xl border border-sky-200 bg-sky-50 text-blue-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-sky-200 bg-sky-50 text-blue-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-3 pr-10 rounded-2xl border border-sky-200 bg-sky-50 text-blue-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 text-sm"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-t-white border-white/30 rounded-full animate-spin" />
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-slate-400 text-center mt-5">
            Already have an account?{" "}
            <Link href="/traveller/auth/login" className="text-sky-500 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-xs text-slate-300 text-center mt-3">
            Are you a driver?{" "}
            <Link href="/auth/login" className="text-slate-400 hover:text-blue-700 underline">
              Driver login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
