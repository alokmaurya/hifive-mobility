"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Car } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim())        { setError("Please enter your full name."); return; }
    if (!email.trim())       { setError("Please enter your email."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setError(null);

    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (signUpErr) {
      setError(signUpErr.message);
      setLoading(false);
      return;
    }

    const userId = signUpData.user?.id;
    if (userId && phone) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("drivers").update({ phone, is_available: true }).eq("id", userId);
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
      router.replace("/dashboard");
    } else {
      setLoading(false);
      setError("Account created! Please check your email to confirm your address, then sign in.");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 px-6 pt-14 pb-10 flex flex-col items-center overflow-hidden">
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
            Become a Driver
          </span>
          <p className="mt-3 text-zinc-400 text-sm">
            Create your driver account and start earning
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col px-5 pb-10 pt-8">
        <div className="w-full max-w-sm mx-auto bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-2xl">

          {error && (
            <div className={`mb-4 rounded-2xl px-4 py-3 text-sm border ${
              error.startsWith("Account created")
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}>
              {error}
            </div>
          )}

          <h2 className="text-lg font-bold text-white mb-5">Your details</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Gupta"
                className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400/40 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Email *</label>
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
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
                Phone <span className="text-zinc-600 font-normal normal-case">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400/40 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Password *</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
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

            {/* Vehicle details nudge */}
            <div className="flex items-start gap-3 bg-yellow-400/5 border border-yellow-400/20 rounded-2xl px-4 py-3">
              <Car className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-400 leading-relaxed">
                You can add your <span className="text-yellow-400 font-semibold">vehicle details</span> from your Profile page after signing up.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-yellow-400 text-black font-bold text-base hover:bg-yellow-300 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : "Create Driver Account 🎉"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-zinc-800 text-center">
            <p className="text-sm text-zinc-500">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-yellow-400 font-semibold hover:text-yellow-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-700 mt-6 mb-8">
          Are you a traveller?{" "}
          <Link href="/traveller/auth/signup" className="text-zinc-500 hover:text-zinc-400 underline">
            Traveller sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
