"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  // Forgot-password state
  const [forgotMode, setForgotMode]       = useState(false);
  const [resetEmail, setResetEmail]       = useState("");
  const [resetSent, setResetSent]         = useState(false);
  const [resetLoading, setResetLoading]   = useState(false);
  const [resetError, setResetError]       = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.replace("/dashboard");
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    setResetError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      setResetError(error.message);
    } else {
      setResetSent(true);
    }
    setResetLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 px-6 pt-14 pb-10 flex flex-col items-center overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-yellow-400/5" />
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full border border-yellow-400/8" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full border border-yellow-400/5" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-3xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-400/20">
            <span className="text-3xl">🧭</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            HiFive <span className="text-yellow-400">Tours</span>
          </h1>
          <span className="mt-2 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold tracking-widest uppercase">
            Driver Portal
          </span>
          <p className="mt-3 text-zinc-400 text-sm">
            Sign in to manage your tours and bookings
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="flex-1 flex flex-col px-5 -mt-4">
        <div className="w-full max-w-sm mx-auto bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-2xl">

          {!forgotMode ? (
            <>
              <h2 className="text-lg font-bold text-white mb-5">Welcome back</h2>

              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400/40 text-sm transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setForgotMode(true); setResetEmail(email); }}
                      className="text-xs text-yellow-400 hover:text-yellow-300 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-12 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400/40 text-sm transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-yellow-400 text-black font-bold text-base hover:bg-yellow-300 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Signing in…
                    </span>
                  ) : "Sign In"}
                </button>
              </form>

              <div className="mt-5 pt-5 border-t border-zinc-800 text-center">
                <p className="text-sm text-zinc-500">
                  New to HiFive Tours?{" "}
                  <Link href="/auth/signup" className="text-yellow-400 font-semibold hover:text-yellow-300">
                    Create driver account
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => { setForgotMode(false); setResetSent(false); setResetError(null); }}
                className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm mb-5 transition-colors"
              >
                ← Back to sign in
              </button>

              {resetSent ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">📬</div>
                  <h2 className="text-white font-bold text-lg">Check your inbox</h2>
                  <p className="text-zinc-400 text-sm mt-2">
                    We&apos;ve sent a password reset link to <span className="text-white font-medium">{resetEmail}</span>.
                  </p>
                  <button
                    onClick={() => { setForgotMode(false); setResetSent(false); }}
                    className="mt-5 w-full py-3 rounded-2xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-colors text-sm"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-white mb-1">Reset password</h2>
                  <p className="text-zinc-400 text-sm mb-5">Enter your email and we&apos;ll send you a reset link.</p>

                  <form onSubmit={handleForgot} className="space-y-4">
                    {resetError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-sm text-red-400">
                        {resetError}
                      </div>
                    )}
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-sm"
                    />
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full py-3.5 rounded-2xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 disabled:opacity-50 transition-colors"
                    >
                      {resetLoading ? "Sending…" : "Send Reset Link"}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>

        <p className="text-center text-xs text-zinc-700 mt-6 mb-8">
          Are you a traveller?{" "}
          <Link href="/traveller/auth/login" className="text-zinc-500 hover:text-zinc-400 underline">
            Traveller login
          </Link>
        </p>
      </div>
    </div>
  );
}
