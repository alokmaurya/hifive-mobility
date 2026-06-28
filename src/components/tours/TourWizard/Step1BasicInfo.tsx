import type { TourCategory, TourDraft } from "@/types/tour";
import type { Driver } from "@/types/driver";
import { CATEGORY_META } from "@/lib/utils";
import { buildTourName } from "@/hooks/useTours";

interface Props {
  draft: TourDraft;
  profile: Driver | null;
  onField: (field: keyof TourDraft, value: string) => void;
  onCategory: (cat: TourCategory) => void;
}

const CATEGORIES = Object.entries(CATEGORY_META) as [TourCategory, typeof CATEGORY_META[string]][];

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
        {/* State */}
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
        {/* Country */}
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

      {/* Category */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-2">Category <span className="text-red-400">*</span></label>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map(([key, meta]) => {
            const active = draft.category === key;
            return (
              <button
                key={key}
                onClick={() => onCategory(key)}
                className={`flex flex-col items-center gap-1 py-3 rounded-2xl border-2 transition-all ${
                  active
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                }`}
              >
                <span className="text-2xl">{meta.emoji}</span>
                <span className={`text-[10px] font-medium ${active ? "text-yellow-400" : "text-zinc-500"}`}>
                  {meta.label}
                </span>
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
