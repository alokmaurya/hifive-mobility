import type { TourCategory, TourDraft } from "@/types/tour";
import { CATEGORY_META } from "@/lib/utils";

interface Props {
  draft: TourDraft;
  onField: (field: keyof TourDraft, value: string) => void;
  onCategory: (cat: TourCategory) => void;
}

const CATEGORIES = Object.entries(CATEGORY_META) as [TourCategory, typeof CATEGORY_META[string]][];

export default function Step1BasicInfo({ draft, onField, onCategory }: Props) {
  return (
    <div className="p-4 space-y-5">
      <div>
        <p className="text-xl font-bold text-stone-900 mb-1">Name your tour</p>
        <p className="text-sm text-stone-400">A great name helps tourists find and remember your tour.</p>
      </div>

      {/* Tour name */}
      <div>
        <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide block mb-1.5">Tour Name</label>
        <input
          type="text"
          value={draft.name}
          onChange={(e) => onField("name", e.target.value)}
          placeholder="e.g. Taj Mahal Sunrise & Agra Fort"
          className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-white text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm"
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide block mb-2">Category</label>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map(([key, meta]) => {
            const active = draft.category === key;
            return (
              <button
                key={key}
                onClick={() => onCategory(key)}
                className={`flex flex-col items-center gap-1 py-3 rounded-2xl border-2 transition-all ${
                  active
                    ? "border-brand-400 bg-brand-50"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                <span className="text-2xl">{meta.emoji}</span>
                <span className={`text-[10px] font-medium ${active ? "text-brand-600" : "text-stone-500"}`}>
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide block mb-1.5">
          Description
        </label>
        <textarea
          value={draft.description}
          onChange={(e) => onField("description", e.target.value)}
          placeholder="Tell tourists what makes this tour special — the highlights, what's included, and what they should expect..."
          rows={4}
          className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-white text-stone-900 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm resize-none"
        />
        <p className="text-xs text-stone-300 text-right mt-1">{draft.description.length} chars</p>
      </div>
    </div>
  );
}
