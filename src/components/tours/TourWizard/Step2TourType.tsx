"use client";

import type { TourDraft, TourCategory } from "@/types/tour";
import { CheckCircle } from "lucide-react";

interface Props {
  draft: TourDraft;
  dispatch: (a: { type: string; payload: unknown }) => void;
}

const TYPES: { value: TourCategory; emoji: string; label: string; desc: string; bullets: string[] }[] = [
  {
    value: "city_sightseeing",
    emoji: "🏙️",
    label: "City Sightseeing",
    desc: "A full-day guided tour within the city.",
    bullets: ["Fixed start & end time", "Custom itinerary stops", "Full cab pricing"],
  },
  {
    value: "outer_city_sightseeing",
    emoji: "🛣️",
    label: "Outer City Tour",
    desc: "A day trip to places outside the city limits.",
    bullets: ["Fixed schedule", "Long-distance coverage", "Full cab pricing"],
  },
  {
    value: "flexi",
    emoji: "⏱️",
    label: "Flexi Booking",
    desc: "On-demand cab — hourly or fixed drops.",
    bullets: ["Hourly rate or fixed drops", "Airport / Railway / Bus Station", "No fixed itinerary"],
  },
];

export default function Step2TourType({ draft, dispatch }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">What type of tour?</h2>
        <p className="text-slate-500 text-sm mt-1">Choose the booking type you want to offer.</p>
      </div>

      <div className="space-y-3">
        {TYPES.map((t) => {
          const selected = draft.category === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => dispatch({ type: "SET_FIELD", payload: { key: "category", value: t.value } })}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-150 ${
                selected
                  ? "border-indigo-500 bg-indigo-50 shadow-sm shadow-indigo-100"
                  : "border-slate-200 bg-white hover:border-indigo-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl mt-0.5">{t.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-extrabold text-base ${selected ? "text-indigo-700" : "text-slate-900"}`}>
                      {t.label}
                    </p>
                    {selected && <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0" />}
                  </div>
                  <p className="text-slate-500 text-sm mt-0.5">{t.desc}</p>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {t.bullets.map((b) => (
                      <span key={b} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        selected ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                      }`}>{b}</span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
