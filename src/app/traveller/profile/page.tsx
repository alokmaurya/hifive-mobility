"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Save,
  User,
  Phone,
  Mail,
  LifeBuoy,
  ChevronRight,
  Sparkles,
  Utensils,
  MapPin,
  Heart,
  Globe,
  Plus,
  X,
  Check,
  ShieldCheck,
  Compass,
  FileText,
} from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import { useTraveller } from "@/hooks/useTraveller";
import { supabase } from "@/lib/supabase";

const PRESET_INTERESTS = [
  { id: "heritage", label: "Heritage & History", emoji: "🏛️" },
  { id: "nature", label: "Nature & Wildlife", emoji: "🌿" },
  { id: "spiritual", label: "Spiritual & Temples", emoji: "🛕" },
  { id: "food", label: "Food & Culinary", emoji: "🍲" },
  { id: "adventure", label: "Adventure & Trekking", emoji: "🧗" },
  { id: "photography", label: "Photography", emoji: "📸" },
  { id: "art", label: "Art & Culture", emoji: "🎨" },
  { id: "shopping", label: "Shopping & Handicrafts", emoji: "🛍️" },
  { id: "wellness", label: "Wellness & Yoga", emoji: "🧘" },
  { id: "beaches", label: "Beaches & Coastal", emoji: "🏖️" },
  { id: "roadtrips", label: "Scenic Road Trips", emoji: "🚗" },
  { id: "palaces", label: "Forts & Palaces", emoji: "🏰" },
];

const FOOD_PREFERENCES = [
  { id: "Pure Vegetarian", label: "Pure Veg (Jain / Sattvic)", desc: "No meat, fish, eggs, onion/garlic", emoji: "🥬" },
  { id: "Vegetarian", label: "Vegetarian", desc: "Plant-based with dairy, no meat or fish", emoji: "🥗" },
  { id: "Eggitarian", label: "Eggitarian", desc: "Vegetarian plus eggs allowed", emoji: "🍳" },
  { id: "Non-Vegetarian", label: "Non-Vegetarian", desc: "Chicken, mutton, seafood, etc.", emoji: "🍗" },
  { id: "Vegan", label: "Vegan", desc: "100% plant-based, strictly dairy-free", emoji: "🌱" },
  { id: "Halal", label: "Halal", desc: "Halal certified food only", emoji: "🥩" },
  { id: "No Preference", label: "No Preference", desc: "Comfortable with any local cuisines", emoji: "🍽️" },
];

const LANGUAGES = [
  "English",
  "Hindi",
  "Bengali",
  "Marathi",
  "Telugu",
  "Tamil",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Odia",
];

export default function TravellerProfilePage() {
  const router = useRouter();
  const { traveller, loading, updateTraveller } = useTraveller();

  // Basic Info State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  // Preferences State
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [foodPreference, setFoodPreference] = useState("No Preference");
  const [dietaryNotes, setDietaryNotes] = useState("");

  // Travel Style & Safety State
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [bio, setBio] = useState("");

  // Tab State
  const [activeTab, setActiveTab] = useState<"preferences" | "personal" | "safety">("preferences");

  // Form State
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  if (!initialized && traveller) {
    setName(traveller.name || "");
    setPhone(traveller.phone || "");
    setCity(traveller.city || "");
    setInterests(traveller.interests || []);
    setFoodPreference(traveller.foodPreference || "No Preference");
    setDietaryNotes(traveller.dietaryNotes || "");
    setPreferredLanguage(traveller.preferredLanguage || "");
    setEmergencyContact(traveller.emergencyContact || "");
    setBio(traveller.bio || "");
    setInitialized(true);
  }

  function toggleInterest(interestLabel: string) {
    if (interests.includes(interestLabel)) {
      setInterests(interests.filter((i) => i !== interestLabel));
    } else {
      setInterests([...interests, interestLabel]);
    }
  }

  function addCustomInterest() {
    const trimmed = customInterest.trim();
    if (!trimmed) return;
    if (!interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
    }
    setCustomInterest("");
  }

  function removeInterest(item: string) {
    setInterests(interests.filter((i) => i !== item));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await updateTraveller({
        name,
        phone,
        city,
        interests,
        foodPreference,
        dietaryNotes,
        preferredLanguage,
        emergencyContact,
        bio,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/traveller/auth/login");
  }

  const initial = (traveller?.name || name || "T").charAt(0).toUpperCase();

  return (
    <RequireTravellerAuth>
      <div className="min-h-screen bg-slate-50 pb-28">
        {/* Top Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-4 pt-12 pb-16 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 60%), radial-gradient(circle at 80% 20%, #38bdf8 0%, transparent 50%)",
            }}
          />
          <div className="relative max-w-lg mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Traveller Profile</h1>
              <p className="text-blue-300 text-xs mt-0.5 font-medium">Personalize your travel &amp; food preferences</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-blue-300 hover:text-red-300 transition-colors text-xs font-semibold border border-white/10 px-3 py-1.5 rounded-xl bg-white/5 backdrop-blur-sm shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-16 gap-3">
            <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading your profile...</p>
          </div>
        ) : (
          <div className="px-4 max-w-lg mx-auto">
            {/* Avatar & Summary Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm -mt-10 mb-5 relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-blue-500 to-sky-400 flex items-center justify-center border-4 border-white shadow-xl shadow-indigo-200/50 -mt-12">
                <span className="text-3xl font-extrabold text-white">{initial}</span>
              </div>
              <h2 className="text-slate-900 font-bold text-lg mt-3">{name || traveller?.name || "Traveller"}</h2>
              <p className="text-slate-400 text-xs">{traveller?.email}</p>

              {/* Active Preference Highlights */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                {foodPreference && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                    <Utensils className="w-3 h-3" />
                    {foodPreference}
                  </span>
                )}
                {city && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-1 rounded-full">
                    <MapPin className="w-3 h-3" />
                    {city}
                  </span>
                )}
                {interests.slice(0, 2).map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2.5 py-1 rounded-full"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    {item}
                  </span>
                ))}
                {interests.length > 2 && (
                  <span className="text-[11px] font-semibold text-slate-400 px-1">
                    +{interests.length - 2} more
                  </span>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-200/70 p-1 rounded-2xl mb-4 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setActiveTab("preferences")}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "preferences"
                    ? "bg-white text-indigo-700 shadow-sm shadow-slate-300/50"
                    : "hover:text-slate-900"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                Interests &amp; Food
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("personal")}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "personal"
                    ? "bg-white text-indigo-700 shadow-sm shadow-slate-300/50"
                    : "hover:text-slate-900"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Personal Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("safety")}
                className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "safety"
                    ? "bg-white text-indigo-700 shadow-sm shadow-slate-300/50"
                    : "hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Travel &amp; Safety
              </button>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSave} className="space-y-4">
              {/* TAB 1: Interests & Food Habits */}
              {activeTab === "preferences" && (
                <div className="space-y-4">
                  {/* Food Habits Card */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-xl bg-amber-50 flex items-center justify-center">
                        <Utensils className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">Food Habits &amp; Diet</h3>
                        <p className="text-[11px] text-slate-500">Helps drivers recommend matching restaurants on your tours</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 mt-3.5">
                      {FOOD_PREFERENCES.map((pref) => {
                        const isSelected = foodPreference === pref.id;
                        return (
                          <button
                            type="button"
                            key={pref.id}
                            onClick={() => setFoodPreference(pref.id)}
                            className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                              isSelected
                                ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20"
                                : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{pref.emoji}</span>
                              <div>
                                <p className={`text-xs font-bold ${isSelected ? "text-indigo-900" : "text-slate-800"}`}>
                                  {pref.label}
                                </p>
                                <p className="text-[11px] text-slate-500">{pref.desc}</p>
                              </div>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                                isSelected
                                  ? "bg-indigo-600 border-indigo-600 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Dietary Notes */}
                    <div className="mt-4">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                        <FileText className="w-3 h-3 text-indigo-500" />
                        Dietary Notes &amp; Allergies (Optional)
                      </label>
                      <input
                        type="text"
                        value={dietaryNotes}
                        onChange={(e) => setDietaryNotes(e.target.value)}
                        placeholder="e.g. Mild spice only, peanut allergy, love south Indian filter coffee"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-xs"
                      />
                    </div>
                  </div>

                  {/* Travel Interests Card */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">Travel Interests</h3>
                        <p className="text-[11px] text-slate-500">Pick what you love exploring the most</p>
                      </div>
                    </div>

                    {/* Predefined Chips */}
                    <div className="flex flex-wrap gap-2 mt-3.5">
                      {PRESET_INTERESTS.map((item) => {
                        const isSelected = interests.includes(item.label);
                        return (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => toggleInterest(item.label)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold border transition-all ${
                              isSelected
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200"
                                : "bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100"
                            }`}
                          >
                            <span>{item.emoji}</span>
                            <span>{item.label}</span>
                            {isSelected && <Check className="w-3 h-3 stroke-[3] ml-0.5" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Interests Display */}
                    {interests.some((i) => !PRESET_INTERESTS.some((p) => p.label === i)) && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Custom Interests</p>
                        <div className="flex flex-wrap gap-1.5">
                          {interests
                            .filter((i) => !PRESET_INTERESTS.some((p) => p.label === i))
                            .map((custom) => (
                              <span
                                key={custom}
                                className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-xl text-xs font-medium"
                              >
                                {custom}
                                <button
                                  type="button"
                                  onClick={() => removeInterest(custom)}
                                  className="hover:text-red-500 ml-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Add Custom Interest Input */}
                    <div className="mt-3.5 flex gap-2">
                      <input
                        type="text"
                        value={customInterest}
                        onChange={(e) => setCustomInterest(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomInterest();
                          }
                        }}
                        placeholder="Add other interests (e.g. Scuba, Birding)"
                        className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-xs"
                      />
                      <button
                        type="button"
                        onClick={addCustomInterest}
                        className="px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Personal Information */}
              {activeTab === "personal" && (
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Basic Information</h3>
                      <p className="text-[11px] text-slate-500">Your account identity and contact</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Alok Maurya"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                      <Phone className="w-3 h-3" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                      <MapPin className="w-3 h-3" /> Home City / Location
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                      <Mail className="w-3 h-3" /> Registered Email
                    </label>
                    <input
                      type="email"
                      value={traveller?.email ?? ""}
                      readOnly
                      className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 text-xs cursor-not-allowed"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Email is linked to your login credentials</p>
                  </div>
                </div>
              )}

              {/* TAB 3: Travel & Safety */}
              {activeTab === "safety" && (
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Compass className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Travel Style &amp; Safety</h3>
                      <p className="text-[11px] text-slate-500">Language preference and emergency assistance</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                      <Globe className="w-3 h-3" /> Preferred Language for Driver/Guide
                    </label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-xs"
                    >
                      <option value="">No preference / Any language</option>
                      {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                      <ShieldCheck className="w-3 h-3" /> Emergency Contact (Phone / Name)
                    </label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="e.g. +91 9876543210 (Brother)"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                      <FileText className="w-3 h-3" /> Travel Bio / Notes
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="e.g. Solo explorer who loves quiet scenic spots, early morning drives, and photography."
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-xs resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && <p className="text-xs text-red-500 bg-red-50 px-4 py-2.5 rounded-2xl border border-red-100 font-medium">{error}</p>}

              {/* Submit Save Button */}
              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3.5 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm transition-all shadow-md ${
                  saved
                    ? "bg-emerald-600 text-white shadow-emerald-200"
                    : "bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white hover:opacity-95 shadow-indigo-200 active:scale-[0.99] disabled:opacity-50"
                }`}
              >
                {saving ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saved ? (
                  "✓ Preferences Saved Successfully!"
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Profile &amp; Preferences
                  </>
                )}
              </button>
            </form>

            {/* Help & Support Quick Link */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mt-4">
              <button
                type="button"
                onClick={() => router.push("/traveller/support")}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <LifeBuoy className="w-4 h-4 text-indigo-500" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Need Help or Have Questions?</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            </div>
          </div>
        )}
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
