"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Step = 0 | 1;

const FUEL_OPTIONS   = [{ v: "petrol", l: "Petrol ⛽" }, { v: "diesel", l: "Diesel 🛢️" }, { v: "cng", l: "CNG 🟢" }];
const TYPE_OPTIONS   = [{ v: "hatchback", l: "Hatchback" }, { v: "sedan", l: "Sedan" }, { v: "suv", l: "SUV" }, { v: "van", l: "Van" }, { v: "tempo", l: "Tempo" }];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);

  // Step 1 — personal
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPwd, setShowPwd]     = useState(false);

  // Step 2 — vehicle
  const [carBrand, setCarBrand]       = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleType, setVehicleType]   = useState("suv");
  const [fuelType, setFuelType]         = useState("petrol");
  const [seats, setSeats]               = useState(6);
  const [isAc, setIsAc]                 = useState(true);
  const [luggageBags, setLuggageBags]   = useState(3);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  function validateStep0() {
    if (!name.trim())              return "Please enter your full name.";
    if (!email.trim())             return "Please enter your email.";
    if (password.length < 6)       return "Password must be at least 6 characters.";
    return null;
  }

  function goNext() {
    const err = validateStep0();
    if (err) { setError(err); return; }
    setError(null);
    setStep(1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!carBrand.trim() || !vehicleModel.trim() || !vehiclePlate.trim()) {
      setError("Please fill in all vehicle details.");
      return;
    }
    setLoading(true);
    setError(null);

    // 1. Create auth user (trigger creates drivers row with name)
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

    // 2. Update driver row with vehicle details
    const userId = signUpData.user?.id;
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from("drivers").update({
        phone:                  phone || null,
        car_brand:              carBrand,
        vehicle_model:          vehicleModel,
        vehicle_plate:          vehiclePlate,
        vehicle_type:           vehicleType,
        fuel_type:              fuelType,
        vehicle_capacity:       seats,
        is_ac:                  isAc,
        luggage_capacity_bags:  luggageBags,
        is_available:           true,
      }).eq("id", userId);
    }

    // 3. Check session — Supabase may require email confirmation
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

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 py-4">
        {(["Your Details", "Your Vehicle"] as const).map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              i === step
                ? "bg-yellow-400 text-black"
                : i < step
                  ? "bg-yellow-400/20 text-yellow-400"
                  : "bg-zinc-800 text-zinc-600"
            }`}>
              <span>{i + 1}</span>
              <span>{label}</span>
            </div>
            {i === 0 && <div className="w-6 h-px bg-zinc-700" />}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col px-5 pb-10">
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

          {step === 0 ? (
            <>
              <h2 className="text-lg font-bold text-white mb-5">Personal details</h2>
              <div className="space-y-4">
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
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Phone <span className="text-zinc-600 font-normal normal-case">(optional)</span></label>
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

                <button
                  type="button"
                  onClick={goNext}
                  className="w-full py-3.5 rounded-2xl bg-yellow-400 text-black font-bold text-base hover:bg-yellow-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                >
                  Next: Vehicle Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-2 mb-5">
                <button type="button" onClick={() => { setStep(0); setError(null); }} className="text-zinc-400 hover:text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold text-white">Vehicle details</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Brand *</label>
                    <input
                      type="text"
                      required
                      value={carBrand}
                      onChange={(e) => setCarBrand(e.target.value)}
                      placeholder="Toyota"
                      className="w-full px-3 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Model *</label>
                    <input
                      type="text"
                      required
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="Innova Crysta"
                      className="w-full px-3 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Number Plate *</label>
                  <input
                    type="text"
                    required
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                    placeholder="UP 65 AB 4321"
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-sm font-mono tracking-wider"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Type</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-3 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-sm appearance-none"
                    >
                      {TYPE_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Fuel</label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      className="w-full px-3 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40 text-sm appearance-none"
                    >
                      {FUEL_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Seats</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setSeats(Math.max(2, seats - 1))}
                        className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-800 text-white text-lg hover:border-yellow-400 transition-colors flex items-center justify-center">−</button>
                      <span className="text-white font-bold w-6 text-center">{seats}</span>
                      <button type="button" onClick={() => setSeats(Math.min(14, seats + 1))}
                        className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-800 text-white text-lg hover:border-yellow-400 transition-colors flex items-center justify-center">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Luggage bags</label>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setLuggageBags(Math.max(0, luggageBags - 1))}
                        className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-800 text-white text-lg hover:border-yellow-400 transition-colors flex items-center justify-center">−</button>
                      <span className="text-white font-bold w-6 text-center">{luggageBags}</span>
                      <button type="button" onClick={() => setLuggageBags(Math.min(10, luggageBags + 1))}
                        className="w-9 h-9 rounded-full border border-zinc-700 bg-zinc-800 text-white text-lg hover:border-yellow-400 transition-colors flex items-center justify-center">+</button>
                    </div>
                  </div>
                </div>

                {/* AC toggle */}
                <button
                  type="button"
                  onClick={() => setIsAc(!isAc)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-colors ${
                    isAc ? "border-yellow-400/40 bg-yellow-400/5" : "border-zinc-700 bg-zinc-800"
                  }`}
                >
                  <span className="text-sm font-medium text-white">Air Conditioning</span>
                  <div className={`relative w-11 h-6 rounded-full transition-colors ${isAc ? "bg-yellow-400" : "bg-zinc-700"}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${isAc ? "left-6" : "left-1"}`} />
                  </div>
                </button>

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
              </div>
            </form>
          )}

          {step === 0 && (
            <div className="mt-5 pt-5 border-t border-zinc-800 text-center">
              <p className="text-sm text-zinc-500">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-yellow-400 font-semibold hover:text-yellow-300">
                  Sign in
                </Link>
              </p>
            </div>
          )}
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
