import type { TourCategory, TourDraft } from "@/types/tour";
import type { Driver } from "@/types/driver";
import { buildTourName } from "@/hooks/useTours";

interface Props {
  draft: TourDraft;
  profile: Driver | null;
  onField: (field: keyof TourDraft, value: string) => void;
  onCategory: (cat: TourCategory) => void;
}

const TOUR_TYPES: { key: TourCategory; emoji: string; label: string; desc: string }[] = [
  { key: "city_sightseeing",       emoji: "🏙️", label: "City Tour",       desc: "Sightseeing within the city" },
  { key: "outer_city_sightseeing", emoji: "🛣️", label: "Outer City Tour",  desc: "Day trips outside the city" },
  { key: "flexi",                  emoji: "⏱️", label: "Flexi (Hourly)",   desc: "Hourly cab — traveller picks hours" },
];

export default function Step1BasicInfo({ draft, profile, onField, onCategory }: Props) {
  const previewName = draft.city.trim()
    ? buildTourName(
        draft.city.trim(),
        profile?.name ?? "—",
        profile?.rating ?? 5,
        profile?.vehicleModel ?? "—",
        profile?.vehicleCapacity ?? 0,
        profile?.fuelType ?? "petrol",
      )
    : null;

  return (
    <div className="p-4 space-y-5">
      <div>
        <p className="text-xl font-bold text-white mb-1">Where is your tour?</p>
        <p className="text-sm text-zinc-400">Your tour name is auto-generated from city, your profile and vehicle details.</p>
      </div>

      {/* City */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">City <span className="text-red-400">*</span></label>
        <input
          type="text"
          value={draft.city}
          onChange={(e) => onField("city", e.target.value)}
          placeholder="e.g. Manali, Jaipur, Goa"
          className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">State</label>
          <input
            type="text"
            value={draft.state}
            onChange={(e) => onField("state", e.target.value)}
            placeholder="e.g. Himachal Pradesh"
            className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Country</label>
          <input
            type="text"
            value={draft.country}
            onChange={(e) => onField("country", e.target.value)}
            placeholder="India"
            className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm"
          />
        </div>
      </div>

      {/* Live name preview */}
      {previewName && (
        <div className="bg-zinc-800 rounded-2xl border border-yellow-400/30 px-4 py-3">
          <p className="text-[10px] font-semibold text-yellow-400 uppercase tracking-wide mb-1">Tour Name Preview</p>
          <p className="text-sm font-bold text-white">{previewName}</p>
          <p className="text-[10px] text-zinc-500 mt-1">City | Driver | Rating | Car | Seats | Fuel</p>
        </div>
      )}

      {/* Tour Type */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-2">Tour Type <span className="text-red-400">*</span></label>
        <div className="space-y-2">
          {TOUR_TYPES.map(({ key, emoji, label, desc }) => {
            const active = draft.category === key;
            return (
              <button
                key={key}
                onClick={() => onCategory(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-left ${
                  active
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                }`}
              >
                <span className="text-2xl">{emoji}</span>
                <div>
                  <p className={`text-sm font-semibold ${active ? "text-yellow-400" : "text-white"}`}>{label}</p>
                  <p className="text-xs text-zinc-500">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={draft.description}
          onChange={(e) => onField("description", e.target.value)}
          placeholder="Tell tourists what makes this tour special — the highlights, what's included, and what they should expect..."
          rows={4}
          className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm resize-none"
        />
        <p className="text-xs text-zinc-600 text-right mt-1">{draft.description.length} chars</p>
      </div>
    </div>
  );
}
