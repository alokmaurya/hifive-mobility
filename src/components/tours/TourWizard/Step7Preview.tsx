"use client";

import { MapPin, Clock, Calendar, CheckCircle, XCircle } from "lucide-react";
import type { TourDraft } from "@/types/tour";

interface Props {
  draft: TourDraft;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TYPE_LABEL: Record<string, string> = {
  city_sightseeing: "🏙️ City Sightseeing",
  outer_city_sightseeing: "🛣️ Outer City Tour",
  flexi: "⏱️ Flexi Booking",
};

function Row({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-slate-100 last:border-0">
      {ok
        ? <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
        : <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 ${ok ? "text-slate-800" : "text-red-400"}`}>{value}</p>
      </div>
    </div>
  );
}

export default function Step7Preview({ draft }: Props) {
  const isFlexi = draft.category === "flexi";
  const activeDays = draft.daysOfWeek.map((d) => DAYS[d]).join(", ");

  const checks = isFlexi ? [
    { label: "Location", value: draft.city && draft.state ? `${draft.city}, ${draft.state}` : "Missing", ok: !!(draft.city && draft.state) },
    { label: "Tour Type", value: TYPE_LABEL[draft.category] ?? "Not selected", ok: !!draft.category },
    { label: "Availability", value: activeDays || "No days selected", ok: draft.daysOfWeek.length > 0 },
    { label: "Services", value: [
        draft.offersHourly ? `Hourly ₹${draft.hourlyRate}/hr` : null,
        draft.offersAirportDrop ? `Airport ₹${draft.airportDropPrice}` : null,
        draft.offersRailwayDrop ? `Railway ₹${draft.railwayDropPrice}` : null,
        draft.offersBusDrop ? `Bus ₹${draft.busStationDropPrice}` : null,
      ].filter(Boolean).join(" · ") || "No services configured",
      ok: draft.offersHourly || draft.offersAirportDrop || draft.offersRailwayDrop || draft.offersBusDrop },
    { label: "Cab Options", value: [draft.isAc && "AC", draft.isPetFriendly && "Pets OK", draft.smokingAllowed && "Smoking OK"].filter(Boolean).join(", ") || "None", ok: true },
  ] : [
    { label: "Location", value: draft.city && draft.state ? `${draft.city}, ${draft.state}` : "Missing", ok: !!(draft.city && draft.state) },
    { label: "Tour Type", value: TYPE_LABEL[draft.category] ?? "Not selected", ok: !!draft.category },
    { label: "Schedule", value: draft.startTime && draft.endTime ? `${draft.startTime} – ${draft.endTime}` : "Not set", ok: !!(draft.startTime && draft.endTime) },
    { label: "Days", value: activeDays || "No days selected", ok: draft.daysOfWeek.length > 0 },
    { label: "Full Cab Price", value: draft.fullCabPrice !== "" && Number(draft.fullCabPrice) > 0 ? `₹${Number(draft.fullCabPrice).toLocaleString("en-IN")}` : "Not set", ok: !!(draft.fullCabPrice !== "" && Number(draft.fullCabPrice) > 0) },
    { label: "Overtime Rate", value: draft.overtimeRatePerHour !== "" && Number(draft.overtimeRatePerHour) > 0 ? `₹${Number(draft.overtimeRatePerHour).toLocaleString("en-IN")}/hr` : "None", ok: true },
    { label: "Itinerary", value: draft.stops.length > 0 ? `${draft.stops.length} stop${draft.stops.length > 1 ? "s" : ""}` : "No stops added", ok: draft.stops.length > 0 },
    { label: "Cab Options", value: [draft.isAc && "AC", draft.isPetFriendly && "Pets OK", draft.smokingAllowed && "Smoking OK"].filter(Boolean).join(", ") || "None", ok: true },
  ];

  const allGood = checks.every((c) => c.ok);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Review & Publish</h2>
        <p className="text-slate-500 text-sm mt-1">Check everything looks right before publishing.</p>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-sky-500 px-4 py-4">
          <p className="text-white font-extrabold text-base">{TYPE_LABEL[draft.category] ?? "Tour"}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-white/80" />
            <p className="text-white/80 text-sm">{draft.city || "—"}{draft.state ? `, ${draft.state}` : ""}</p>
          </div>
        </div>
        <div className="px-4 py-3 divide-y divide-slate-100">
          {!isFlexi && draft.startTime && (
            <div className="flex items-center gap-2 py-2 text-sm text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{draft.startTime} – {draft.endTime}</span>
            </div>
          )}
          {draft.daysOfWeek.length > 0 && (
            <div className="flex items-center gap-2 py-2 text-sm text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeDays}</span>
            </div>
          )}
          {!isFlexi && draft.fullCabPrice !== "" && Number(draft.fullCabPrice) > 0 && (
            <div className="py-2 flex items-center justify-between">
              <span className="text-sm text-slate-500">Full cab price</span>
              <span className="text-indigo-700 font-extrabold text-base">₹{Number(draft.fullCabPrice).toLocaleString("en-IN")}</span>
            </div>
          )}
          {isFlexi && draft.offersHourly && draft.hourlyRate && (
            <div className="py-2 flex items-center justify-between">
              <span className="text-sm text-slate-500">Hourly rate</span>
              <span className="text-indigo-700 font-extrabold text-base">₹{Number(draft.hourlyRate).toLocaleString("en-IN")}/hr</span>
            </div>
          )}
          {!isFlexi && draft.stops.length > 0 && (
            <div className="py-2">
              <p className="text-xs text-slate-400 font-medium mb-2">Itinerary</p>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-green-600 font-semibold">🏨 Pickup from Hotel</p>
                {draft.stops.map((s, i) => (
                  <p key={i} className="text-xs text-slate-600 pl-3">↳ {s.name} <span className="text-slate-400">({s.durationMinutes}m)</span></p>
                ))}
                <p className="text-xs text-blue-600 font-semibold">🏨 Drop at Hotel</p>
              </div>
            </div>
          )}
          <div className="py-2 flex gap-2 flex-wrap">
            {draft.isAc && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">❄️ AC</span>}
            {draft.isPetFriendly && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600">🐾 Pets OK</span>}
            {draft.smokingAllowed && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">🚬 Smoking OK</span>}
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Publish Checklist</p>
        {checks.map((c) => <Row key={c.label} label={c.label} value={c.value} ok={c.ok} />)}
      </div>

      {allGood ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          <p className="text-green-700 text-sm font-semibold">Everything looks good! Ready to publish.</p>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
          <p className="text-amber-700 text-sm font-semibold">Complete the missing fields before publishing.</p>
        </div>
      )}
    </div>
  );
}
