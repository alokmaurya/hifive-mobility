import type { TourDraft } from "@/types/tour";
import type { Driver } from "@/types/driver";
import { formatTime, formatDuration, addMinutesToTime, DAY_LABELS, CATEGORY_META } from "@/lib/utils";
import { buildTourName } from "@/hooks/useTours";
import { Clock, Users, MapPin, Star, CheckCircle } from "lucide-react";

interface Props {
  draft: TourDraft;
  profile: Driver | null;
}

const isFlexi = (draft: TourDraft) => draft.category === "flexi";

export default function Step4Preview({ draft, profile }: Props) {
  const flexi = isFlexi(draft);
  const cat = CATEGORY_META[draft.category] ?? { emoji: "🗺️", label: "Tour", color: "" };
  const totalMinutes = draft.stops.reduce((s, stop) => s + stop.durationMinutes, 0);
  const estimatedEnd = addMinutesToTime(draft.startTime, totalMinutes + draft.stops.length * 15);
  const tourName = draft.city.trim()
    ? buildTourName(draft.city.trim(), profile?.name ?? "—", profile?.rating ?? 5, profile?.vehicleModel ?? "—", profile?.vehicleCapacity ?? 0, profile?.fuelType ?? "petrol")
    : "Tour Name";

  return (
    <div className="p-4 space-y-4">
      <div>
        <p className="text-xl font-bold text-white mb-1">How tourists will see it</p>
        <p className="text-sm text-zinc-400">Review your tour before publishing. You can edit anytime after publishing.</p>
      </div>

      {/* Tour card preview */}
      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
        {/* Cover */}
        <div className="h-36 bg-zinc-800 flex items-center justify-center">
          <span className="text-6xl">{cat.emoji}</span>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base font-bold text-white leading-tight">{tourName}</h2>
            <div className="flex items-center gap-1 shrink-0 bg-yellow-400/10 px-2 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-400">New</span>
            </div>
          </div>

          {draft.city && (
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {[draft.city, draft.state, draft.country].filter(Boolean).join(", ")}
            </p>
          )}

          <p className="text-sm text-zinc-400 mt-2 line-clamp-3">{draft.description}</p>

          {/* Key info */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {flexi ? (
              <>
                <div className="bg-zinc-800 rounded-xl p-2 text-center">
                  <Clock className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-zinc-500">Type</p>
                  <p className="text-xs font-bold text-white">Flexible</p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-2 text-center">
                  <Clock className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-zinc-500">Rate</p>
                  <p className="text-xs font-bold text-white">₹{Number(draft.hourlyRate).toLocaleString("en-IN")}/hr</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-zinc-800 rounded-xl p-2 text-center">
                  <Clock className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-zinc-500">Duration</p>
                  <p className="text-xs font-bold text-white">{formatDuration(totalMinutes)}</p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-2 text-center">
                  <MapPin className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <p className="text-xs text-zinc-500">Stops</p>
                  <p className="text-xs font-bold text-white">{draft.stops.length}</p>
                </div>
              </>
            )}
            <div className="bg-zinc-800 rounded-xl p-2 text-center">
              <Users className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
              <p className="text-xs text-zinc-500">Max</p>
              <p className="text-xs font-bold text-white">{draft.maxGuests} guests</p>
            </div>
          </div>

          {/* Stops timeline */}
          {draft.stops.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Itinerary</p>
              <div className="space-y-0">
                {draft.stops.map((stop, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                      {i < draft.stops.length - 1 && <div className="w-0.5 h-8 bg-zinc-700 my-0.5" />}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-medium text-white">{stop.name}</p>
                      <p className="text-xs text-zinc-500">{formatDuration(stop.durationMinutes)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule */}
          <div className="mt-4 pt-3 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">Departure</p>
                <p className="text-sm font-bold text-white">{formatTime(draft.startTime)} – {formatTime(estimatedEnd)}</p>
              </div>
              <div className="text-right">
                {flexi ? (
                  <>
                    <p className="text-xs text-zinc-500">Hourly Rate</p>
                    <p className="text-xl font-bold text-yellow-400">₹{Number(draft.hourlyRate).toLocaleString("en-IN")}</p>
                    <p className="text-xs text-zinc-500">per hour</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-zinc-500">Price</p>
                    <p className="text-xl font-bold text-yellow-400">₹{Number(draft.pricePerPerson).toLocaleString("en-IN")}</p>
                    <p className="text-xs text-zinc-500">per person</p>
                  </>
                )}
              </div>
            </div>

            {draft.daysOfWeek.length > 0 && (
              <div className="flex gap-1 mt-2">
                {[0,1,2,3,4,5,6].map((d) => (
                  <div
                    key={d}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold text-center ${
                      draft.daysOfWeek.includes(d) ? "bg-yellow-400 text-black" : "bg-zinc-800 text-zinc-600"
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
      <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-4 space-y-2">
        <p className="text-xs font-bold text-yellow-400 uppercase tracking-wide">Ready to publish?</p>
        {[
          { ok: draft.city.length > 0, label: "City entered" },
          { ok: draft.category !== "", label: "Category selected" },
          { ok: draft.description.length > 20, label: "Description added" },
          ...(!flexi ? [{ ok: draft.stops.length >= 1, label: "At least 1 stop added" }] : []),
          { ok: draft.daysOfWeek.length > 0, label: "Running days set" },
          ...(flexi
            ? [{ ok: Number(draft.hourlyRate) > 0, label: "Hourly rate set" }]
            : [{ ok: Number(draft.pricePerPerson) > 0, label: "Price per person set" }]),
          { ok: !!(profile?.vehicleModel), label: "Vehicle details in profile" },
        ].map((item, i) => (
          <div key={i} className={`flex items-center gap-2 text-sm ${item.ok ? "text-yellow-400" : "text-zinc-600"}`}>
            <CheckCircle className={`w-4 h-4 shrink-0 ${item.ok ? "text-yellow-400" : "text-zinc-700"}`} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
