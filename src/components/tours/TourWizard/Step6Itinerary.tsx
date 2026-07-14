"use client";

import { useState } from "react";
import { Plus, Trash2, MapPin, ChevronUp, ChevronDown, Hotel } from "lucide-react";
import type { TourDraft, TourStop } from "@/types/tour";

interface Props {
  draft: TourDraft;
  dispatch: (a: { type: string; payload: unknown }) => void;
}

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

export default function Step6Itinerary({ draft, dispatch }: Props) {
  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState(60);

  function addStop() {
    if (!newName.trim()) return;
    const stop: Omit<TourStop, "id"> = { name: newName.trim(), durationMinutes: newDuration, order: draft.stops.length + 1 };
    dispatch({ type: "SET_FIELD", payload: { key: "stops", value: [...draft.stops, stop] } });
    setNewName("");
    setNewDuration(60);
  }

  function removeStop(i: number) {
    dispatch({ type: "SET_FIELD", payload: { key: "stops", value: draft.stops.filter((_, idx) => idx !== i) } });
  }

  function moveStop(i: number, dir: -1 | 1) {
    const arr = [...draft.stops];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    dispatch({ type: "SET_FIELD", payload: { key: "stops", value: arr } });
  }

  const totalMin = draft.stops.reduce((s, st) => s + st.durationMinutes, 0) + draft.stops.length * 15;
  const totalH = Math.floor(totalMin / 60), totalM = totalMin % 60;

  const isFlexi = draft.category === "flexi";

  if (isFlexi) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Services Summary</h2>
          <p className="text-slate-500 text-sm mt-1">Here are the flexi services you have configured.</p>
        </div>
        <div className="space-y-3">
          {draft.offersHourly && (
            <div className="bg-indigo-50 rounded-2xl px-4 py-3 border border-indigo-100 flex items-center justify-between">
              <span className="font-semibold text-indigo-700 text-sm">⏱️ Hourly Booking</span>
              <span className="text-indigo-600 font-bold text-sm">₹{Number(draft.hourlyRate).toLocaleString("en-IN")}/hr</span>
            </div>
          )}
          {draft.offersAirportDrop && (
            <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700 text-sm">✈️ Airport Drop</span>
              <span className="text-slate-600 font-bold text-sm">₹{Number(draft.airportDropPrice).toLocaleString("en-IN")}</span>
            </div>
          )}
          {draft.offersRailwayDrop && (
            <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700 text-sm">🚂 Railway Station Drop</span>
              <span className="text-slate-600 font-bold text-sm">₹{Number(draft.railwayDropPrice).toLocaleString("en-IN")}</span>
            </div>
          )}
          {draft.offersBusDrop && (
            <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700 text-sm">🚌 City Bus Station Drop</span>
              <span className="text-slate-600 font-bold text-sm">₹{Number(draft.busStationDropPrice).toLocaleString("en-IN")}</span>
            </div>
          )}
          {!draft.offersHourly && !draft.offersAirportDrop && !draft.offersRailwayDrop && !draft.offersBusDrop && (
            <p className="text-slate-400 text-sm text-center py-4">No services enabled. Go back to Pricing to add services.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Plan the Itinerary</h2>
        <p className="text-slate-500 text-sm mt-1">Add stops between pickup and drop. The first and last stops are fixed.</p>
      </div>

      {/* Fixed: Pickup */}
      <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-2xl border border-green-200">
        <Hotel className="w-5 h-5 text-green-600 shrink-0" />
        <div>
          <p className="text-green-700 font-bold text-sm">Pickup from Hotel</p>
          <p className="text-green-600 text-xs">Fixed start point</p>
        </div>
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-600">FIXED</span>
      </div>

      {/* User stops */}
      {draft.stops.map((stop, i) => (
        <div key={i} className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 px-3 py-3 shadow-sm">
          <div className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center flex-shrink-0">
            <span className="text-indigo-600 text-[10px] font-bold">{i + 1}</span>
          </div>
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-slate-800 font-semibold text-sm truncate">{stop.name}</p>
            <p className="text-slate-400 text-xs">{stop.durationMinutes} min</p>
          </div>
          <div className="flex gap-1">
            <button type="button" onClick={() => moveStop(i, -1)} disabled={i === 0}
              className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30">
              <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button type="button" onClick={() => moveStop(i, 1)} disabled={i === draft.stops.length - 1}
              className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30">
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
            <button type="button" onClick={() => removeStop(i)}
              className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100">
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        </div>
      ))}

      {/* Fixed: Drop */}
      <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-2xl border border-blue-200">
        <Hotel className="w-5 h-5 text-blue-600 shrink-0" />
        <div>
          <p className="text-blue-700 font-bold text-sm">Drop at Hotel</p>
          <p className="text-blue-600 text-xs">Fixed end point</p>
        </div>
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">FIXED</span>
      </div>

      {/* Add stop form */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
        <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Add a Stop</p>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addStop())}
          placeholder="Place name (e.g. Amber Fort)"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm"
        />
        <div className="flex gap-2 flex-wrap">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setNewDuration(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                newDuration === d
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
              }`}
            >
              {d >= 60 ? `${d / 60}h` : `${d}m`}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={addStop}
          disabled={!newName.trim()}
          className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-40 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Stop
        </button>
      </div>

      {draft.stops.length > 0 && (
        <div className="bg-indigo-50 rounded-2xl px-4 py-3 border border-indigo-100 flex items-center justify-between">
          <span className="text-indigo-600 text-sm font-semibold">{draft.stops.length} stop{draft.stops.length > 1 ? "s" : ""}</span>
          <span className="text-indigo-700 text-sm font-bold">
            ~{totalH > 0 ? `${totalH}h ` : ""}{totalM > 0 ? `${totalM}m` : ""}
          </span>
        </div>
      )}
    </div>
  );
}
