import type { TourDraft } from "@/types/tour";
import { formatTime, formatDuration, addMinutesToTime, DAY_LABELS, CATEGORY_META } from "@/lib/utils";
import { Clock, Users, MapPin, Star, CheckCircle } from "lucide-react";

interface Props {
  draft: TourDraft;
}

export default function Step4Preview({ draft }: Props) {
  const cat = CATEGORY_META[draft.category] ?? { emoji: "🗺️", label: "Tour", color: "" };
  const totalMinutes = draft.stops.reduce((s, stop) => s + stop.durationMinutes, 0);
  const estimatedEnd = addMinutesToTime(draft.startTime, totalMinutes + draft.stops.length * 15);

  return (
    <div className="p-4 space-y-4">
      <div>
        <p className="text-xl font-bold text-stone-900 mb-1">How tourists will see it</p>
        <p className="text-sm text-stone-400">Review your tour before publishing. You can edit anytime after publishing.</p>
      </div>

      {/* Tour card preview */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
        {/* Cover */}
        <div className="h-36 bg-gradient-to-br from-brand-100 via-amber-100 to-teal-100 flex items-center justify-center">
          <span className="text-6xl">{cat.emoji}</span>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-bold text-stone-900 leading-tight">{draft.name || "Tour Name"}</h2>
            <div className="flex items-center gap-1 shrink-0 bg-amber-50 px-2 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-amber-700">New</span>
            </div>
          </div>

          <p className="text-sm text-stone-500 mt-2 line-clamp-3">{draft.description}</p>

          {/* Key info */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-stone-50 rounded-xl p-2 text-center">
              <Clock className="w-4 h-4 text-teal-500 mx-auto mb-1" />
              <p className="text-xs text-stone-500">Duration</p>
              <p className="text-xs font-bold text-stone-800">{formatDuration(totalMinutes)}</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-2 text-center">
              <MapPin className="w-4 h-4 text-brand-500 mx-auto mb-1" />
              <p className="text-xs text-stone-500">Stops</p>
              <p className="text-xs font-bold text-stone-800">{draft.stops.length}</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-2 text-center">
              <Users className="w-4 h-4 text-purple-500 mx-auto mb-1" />
              <p className="text-xs text-stone-500">Max</p>
              <p className="text-xs font-bold text-stone-800">{draft.maxGuests} guests</p>
            </div>
          </div>

          {/* Stops timeline */}
          {draft.stops.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Itinerary</p>
              <div className="space-y-0">
                {draft.stops.map((stop, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                      {i < draft.stops.length - 1 && <div className="w-0.5 h-8 bg-stone-200 my-0.5" />}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-medium text-stone-800">{stop.name}</p>
                      <p className="text-xs text-stone-400">{formatDuration(stop.durationMinutes)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule */}
          <div className="mt-4 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-400">Departure</p>
                <p className="text-sm font-bold text-stone-800">{formatTime(draft.startTime)} – {formatTime(estimatedEnd)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-400">Price</p>
                <p className="text-xl font-bold text-brand-500">₹{Number(draft.pricePerPerson).toLocaleString("en-IN")}</p>
                <p className="text-xs text-stone-400">per person</p>
              </div>
            </div>

            {draft.daysOfWeek.length > 0 && (
              <div className="flex gap-1 mt-2">
                {[0,1,2,3,4,5,6].map((d) => (
                  <div
                    key={d}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold text-center ${
                      draft.daysOfWeek.includes(d) ? "bg-brand-500 text-white" : "bg-stone-100 text-stone-300"
                    }`}
                  >
                    {DAY_LABELS[d][0]}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-teal-50 rounded-2xl p-4 space-y-2">
        <p className="text-xs font-bold text-teal-700 uppercase tracking-wide">Ready to publish?</p>
        {[
          { ok: draft.name.length > 0, label: "Tour has a name" },
          { ok: draft.category !== "", label: "Category selected" },
          { ok: draft.description.length > 20, label: "Description added" },
          { ok: draft.stops.length >= 1, label: "At least 1 stop added" },
          { ok: draft.daysOfWeek.length > 0, label: "Running days set" },
          { ok: Number(draft.pricePerPerson) > 0, label: "Price per person set" },
        ].map((item, i) => (
          <div key={i} className={`flex items-center gap-2 text-sm ${item.ok ? "text-teal-700" : "text-stone-400"}`}>
            <CheckCircle className={`w-4 h-4 shrink-0 ${item.ok ? "text-teal-500" : "text-stone-300"}`} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
