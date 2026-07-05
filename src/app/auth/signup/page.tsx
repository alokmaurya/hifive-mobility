"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Supabase may require email confirmation before a session exists.
      // Check if we got a session; if not, show a "check your email" message.
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/dashboard");
      } else {
        setLoading(false);
        setError("Account created! Please check your email to confirm your address, then sign in.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🧭</div>
          <h1 className="text-2xl font-bold text-white">
            HiFive <span className="text-yellow-400">Tours</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Create your driver account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ramesh Gupta"
              className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-900 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-900 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-3 pr-12 rounded-2xl border border-zinc-700 bg-zinc-900 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-yellow-400 text-black font-bold text-base hover:bg-yellow-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Creating account…</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Create Account
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-yellow-400 font-semibold hover:text-yellow-300">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-zinc-600 mt-4 px-4">
          By signing up you agree to HiFive Tours&apos; terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}
