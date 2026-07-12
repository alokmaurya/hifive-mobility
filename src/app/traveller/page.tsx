"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, ChevronDown, Compass, Zap, Mountain } from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import { useCityStateOptions } from "@/hooks/useCityStateOptions";

const HIGHLIGHTS = [
  { icon: "🏙️", label: "City Tours" },
  { icon: "🌄", label: "Scenic Drives" },
  { icon: "⏱️", label: "Flexi Hours" },
  { icon: "🛕", label: "Heritage" },
];

const STATE_IMAGES: Record<string, { url: string; place: string; location: string; emoji: string }> = {
  "Rajasthan":        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Hawa_Mahal_Jaipur.jpg/800px-Hawa_Mahal_Jaipur.jpg",                                                                   place: "Hawa Mahal",          location: "Jaipur",        emoji: "🛕" },
  "Uttar Pradesh":    { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/800px-Taj_Mahal_%28Edited%29.jpeg",                                                        place: "Taj Mahal",           location: "Agra",          emoji: "🕌" },
  "Maharashtra":      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/800px-Mumbai_03-2016_30_Gateway_of_India.jpg",                                  place: "Gateway of India",    location: "Mumbai",        emoji: "🌊" },
  "Kerala":           { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Kerala_backwaters.jpg/800px-Kerala_backwaters.jpg",                                                                     place: "Alleppey Backwaters", location: "Alappuzha",     emoji: "🌿" },
  "Goa":              { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Baga_Beach%2C_Goa.jpg/800px-Baga_Beach%2C_Goa.jpg",                                                                    place: "Baga Beach",          location: "North Goa",     emoji: "🏖️" },
  "Punjab":           { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Golden_Temple_%2C_Amritsar.jpg/800px-Golden_Temple_%2C_Amritsar.jpg",                                                   place: "Golden Temple",       location: "Amritsar",      emoji: "⛪" },
  "Karnataka":        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mysore_Palace_Morning.jpg/800px-Mysore_Palace_Morning.jpg",                                                             place: "Mysore Palace",       location: "Mysuru",        emoji: "🏯" },
  "Tamil Nadu":       { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Madurai_Meenakshi_Amman_Temple.jpg/800px-Madurai_Meenakshi_Amman_Temple.jpg",                                          place: "Meenakshi Temple",    location: "Madurai",       emoji: "🛕" },
  "Delhi":            { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/India_Gate_in_New_Delhi_03-2016.jpg/800px-India_Gate_in_New_Delhi_03-2016.jpg",                                        place: "India Gate",          location: "New Delhi",     emoji: "🏛️" },
  "Gujarat":          { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Rani_ki_vav_02.jpg/800px-Rani_ki_vav_02.jpg",                                                                          place: "Rani ki Vav",         location: "Patan",         emoji: "🏺" },
  "Himachal Pradesh": { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Rohtang_Pass.jpg/800px-Rohtang_Pass.jpg",                                                                              place: "Rohtang Pass",        location: "Manali",        emoji: "🏔️" },
  "Uttarakhand":      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Kedarnath_temple.jpg/800px-Kedarnath_temple.jpg",                                                                       place: "Kedarnath Temple",    location: "Rudraprayag",   emoji: "⛰️" },
  "West Bengal":      { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Howrah_Bridge_from_Dakshineswar.jpg/800px-Howrah_Bridge_from_Dakshineswar.jpg",                                        place: "Howrah Bridge",       location: "Kolkata",       emoji: "🌉" },
  "Madhya Pradesh":   { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Khajuraho-Temple.jpg/800px-Khajuraho-Temple.jpg",                                                                      place: "Khajuraho Temples",   location: "Khajuraho",     emoji: "🛕" },
  "Telangana":        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Charminar_-_Hyderabad.jpg/800px-Charminar_-_Hyderabad.jpg",                                                            place: "Charminar",           location: "Hyderabad",     emoji: "🕌" },
  "Odisha":           { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Konarka_Temple.jpg/800px-Konarka_Temple.jpg",                                                                           place: "Konark Sun Temple",   location: "Konark",        emoji: "☀️" },
  "Bihar":            { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Mahabodhi_Temple.jpg/800px-Mahabodhi_Temple.jpg",                                                                      place: "Mahabodhi Temple",    location: "Bodh Gaya",     emoji: "🙏" },
  "Assam":            { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Kamakhya_Temple_1.jpg/800px-Kamakhya_Temple_1.jpg",                                                                     place: "Kamakhya Temple",     location: "Guwahati",      emoji: "🌿" },
  "Jammu & Kashmir":  { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty-of-kashmir.jpg/800px-24701-nature-natural-beauty-of-kashmir.jpg",                          place: "Dal Lake",            location: "Srinagar",      emoji: "🏔️" },
  "Andhra Pradesh":   { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_temple2.jpg/800px-Tirumala_temple2.jpg",                                                                       place: "Tirumala Temple",     location: "Tirupati",      emoji: "🛕" },
  "Meghalaya":        { url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Living_Root_Bridge%2C_Meghalaya.jpg/800px-Living_Root_Bridge%2C_Meghalaya.jpg",                                        place: "Living Root Bridge",  location: "Cherrapunji",   emoji: "🌿" },
};

const DEFAULT_IMAGE = {
  url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/800px-Taj_Mahal_%28Edited%29.jpeg",
  place: "Incredible India",
  location: "Select a state to explore",
  emoji: "🇮🇳",
};

export default function TravellerHomePage() {
  const router = useRouter();
  const { states, citiesForState, loading } = useCityStateOptions();
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity]   = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setCities(citiesForState(selectedState));
    setSelectedCity("");
    setImgError(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState]);

  function search(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCity) return;
    const params = new URLSearchParams({ city: selectedCity });
    if (selectedState) params.set("state", selectedState);
    router.push(`/traveller/explore?${params}`);
  }

  const imgData = (selectedState && STATE_IMAGES[selectedState]) ? STATE_IMAGES[selectedState] : DEFAULT_IMAGE;

  return (
    <RequireTravellerAuth>
      <div className="min-h-screen bg-slate-50 pb-24">

        {/* ── Slim Header ── */}
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-4 py-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 55%), radial-gradient(circle at 80% 30%, #0ea5e9 0%, transparent 50%)"}} />
          <div className="relative max-w-5xl mx-auto flex items-center gap-3">
            {/* Left: logo + name */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-extrabold text-sm tracking-tight whitespace-nowrap">HiFive Tours</span>
            </div>

            {/* Center: headline + stats */}
            <div className="flex-1 text-center px-2">
              <h1 className="text-base font-extrabold text-white leading-tight">
                Your next{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300">adventure</span>{" "}
                awaits
              </h1>
              {!loading && states.length > 0 && (
                <div className="flex items-center justify-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Compass className="w-3 h-3 text-sky-400" />
                    <span className="text-sky-300 text-[10px] font-medium">{states.length} states</span>
                  </div>
                  <div className="w-0.5 h-0.5 rounded-full bg-blue-700" />
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-indigo-400" />
                    <span className="text-indigo-300 text-[10px] font-medium">Instant booking</span>
                  </div>
                  <div className="w-0.5 h-0.5 rounded-full bg-blue-700" />
                  <div className="flex items-center gap-1">
                    <Mountain className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-300 text-[10px] font-medium">Local experts</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: tagline */}
            <p className="text-blue-300 text-[10px] text-right leading-snug shrink-0 max-w-[100px] hidden sm:block">
              Book local sightseeing drivers.<br />Explore India your way.
            </p>
          </div>
        </div>

        {/* ── Main content: two-column ── */}
        <div className="px-4 max-w-5xl mx-auto mt-5">
          <div className="flex flex-col md:flex-row gap-5">

            {/* LEFT: Search card + category pills */}
            <div className="md:w-5/12 space-y-4">
              <form onSubmit={search} className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100 space-y-4">
                <p className="text-slate-800 font-bold text-base">Find drivers in your city</p>

                <div>
                  <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest block mb-1.5">State</label>
                  <div className="relative">
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      required
                      className="w-full appearance-none px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm pr-10"
                    >
                      <option value="">Select state…</option>
                      {loading && <option disabled>Loading…</option>}
                      {states.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest block mb-1.5">City</label>
                  <div className="relative">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      required
                      disabled={!selectedState || cities.length === 0}
                      className="w-full appearance-none px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm pr-10 disabled:opacity-50"
                    >
                      <option value="">{!selectedState ? "Select state first" : "Select city…"}</option>
                      {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedCity}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-bold rounded-2xl hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
                >
                  <Search className="w-4 h-4" />
                  Find Drivers
                </button>
              </form>

                {!loading && states.length === 0 && (
                <div className="text-center py-6">
                  <MapPin className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No tours available yet.</p>
                </div>
              )}
            </div>

            {/* RIGHT: State image */}
            <div className="md:w-7/12">
              <div className="relative rounded-3xl overflow-hidden h-64 md:h-full min-h-[300px] shadow-lg border border-slate-100">
                {!imgError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={imgData.url}
                    src={imgData.url}
                    alt={imgData.place}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                ) : (
                  /* Fallback gradient if image fails */
                  <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-blue-800 to-slate-900 flex items-center justify-center">
                    <span className="text-8xl">{imgData.emoji}</span>
                  </div>
                )}

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Place info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {selectedState && (
                    <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/15 text-white/80 backdrop-blur-sm mb-2 uppercase tracking-widest">
                      {selectedState}
                    </span>
                  )}
                  <p className="text-white font-extrabold text-xl leading-tight drop-shadow">{imgData.place}</p>
                  <p className="text-white/70 text-sm mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {imgData.location}
                  </p>
                </div>

                {/* Top-right emoji badge */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-xl border border-white/10">
                  {imgData.emoji}
                </div>
              </div>
            </div>

          </div>

          {/* ── Tour types: centered below both columns ── */}
          <div className="mt-6">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest text-center mb-3">Tour types</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {HIGHLIGHTS.map((h) => (
                <div key={h.label} className="bg-white rounded-2xl py-3 px-5 flex flex-col items-center gap-1.5 border border-slate-100 shadow-sm min-w-[72px]">
                  <span className="text-2xl">{h.icon}</span>
                  <span className="text-[10px] font-semibold text-slate-500 text-center leading-tight">{h.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
