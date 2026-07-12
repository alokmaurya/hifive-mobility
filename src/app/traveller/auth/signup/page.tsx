"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MapPin, Eye, EyeOff, User, Mail, Lock, Star } from "lucide-react";

const DESTINATIONS = [
  {
    emoji: "🏔️",
    name: "Himalayan Peaks",
    place: "Himachal Pradesh",
    gradient: "from-slate-700 via-blue-900 to-indigo-900",
    tag: "Adventure",
  },
  {
    emoji: "🏖️",
    name: "Golden Beaches",
    place: "Goa",
    gradient: "from-amber-700 via-orange-800 to-rose-900",
    tag: "Coastal",
  },
  {
    emoji: "🛕",
    name: "Ancient Temples",
    place: "Rajasthan",
    gradient: "from-yellow-800 via-orange-900 to-red-950",
    tag: "Heritage",
  },
  {
    emoji: "🌿",
    name: "Backwater Trails",
    place: "Kerala",
    gradient: "from-emerald-800 via-green-900 to-teal-950",
    tag: "Nature",
  },
];

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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📧</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Check your email</h2>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            We sent a confirmation link to{" "}
            <span className="font-semibold text-indigo-600">{email}</span>.
            Click it to activate your account, then sign in.
          </p>
          <Link
            href="/traveller/auth/login"
            className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-bold rounded-2xl shadow-md shadow-indigo-100 text-sm"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── LEFT PANEL: Travel imagery ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden flex-col">
        {/* Background glow */}
        <div className="absolute inset-0" style={{backgroundImage:"radial-gradient(circle at 20% 30%, rgba(99,102,241,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(14,165,233,0.2) 0%, transparent 50%)"}} />

        {/* Brand top-left */}
        <div className="relative z-10 p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-extrabold text-lg tracking-tight">Join HiFive Tours</span>
        </div>

        {/* Destination cards grid */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-8 pb-8 gap-4">
          <div className="mb-2">
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Your journey<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300">
                starts here
              </span>
            </h2>
            <p className="text-slate-400 text-sm mt-2">Create an account and book local expert drivers</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {DESTINATIONS.map((d) => (
              <div
                key={d.name}
                className={`bg-gradient-to-br ${d.gradient} rounded-2xl p-4 relative overflow-hidden border border-white/5`}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="text-4xl block mb-2">{d.emoji}</span>
                <p className="text-white font-bold text-sm leading-tight">{d.name}</p>
                <p className="text-white/50 text-xs mt-0.5">{d.place}</p>
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  {d.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-1">
            <div className="flex items-center gap-1 mb-2">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-slate-300 text-xs leading-relaxed italic">
              &ldquo;Signed up in minutes and had an incredible tour of Udaipur. Highly recommend!&rdquo;
            </p>
            <p className="text-slate-500 text-xs mt-2">— Rahul M., Bangalore</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Signup form ── */}
      <div className="flex-1 lg:w-1/2 flex flex-col bg-slate-50">
        {/* Mobile-only top header */}
        <div className="lg:hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-5 pt-8 pb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 30% 40%, #6366f1 0%, transparent 55%)"}} />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">Join HiFive Tours</span>
            </div>
            <p className="text-blue-300 text-xs text-right leading-snug max-w-[110px]">Discover amazing sightseeing tours</p>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 -mt-6 lg:mt-0">
          <div className="w-full max-w-sm">
            {/* Desktop heading */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900">Create Account 🇮🇳</h2>
              <p className="text-slate-400 text-sm mt-1">Start exploring India with local expert drivers</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
              {/* Mobile heading */}
              <div className="lg:hidden mb-5">
                <h2 className="text-xl font-extrabold text-slate-900">Create Account</h2>
                <p className="text-slate-400 text-sm mt-0.5">Start exploring India 🇮🇳</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                    <User className="w-3 h-3" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                    <Mail className="w-3 h-3" /> Email
                  </label>
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
                  <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                    <Lock className="w-3 h-3" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Min 6 characters"
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
                  ) : "Create Account"}
                </button>
              </form>

              <p className="text-sm text-slate-400 text-center mt-5">
                Already have an account?{" "}
                <Link href="/traveller/auth/login" className="text-indigo-600 font-bold hover:underline">
                  Sign in
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
      </div>
    </div>
  );
}
