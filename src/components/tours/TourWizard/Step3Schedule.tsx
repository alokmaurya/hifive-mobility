"use client";

import { Clock, Calendar } from "lucide-react";
import type { TourDraft } from "@/types/tour";

interface Props {
  draft: TourDraft;
  dispatch: (a: { type: string; payload: unknown }) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toggleDay(days: number[], day: number): number[] {
  return days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort();
}

export default function Step3Schedule({ draft, dispatch }: Props) {
  const isFlexi = draft.category === "flexi";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">
          {isFlexi ? "Availability" : "Tour Schedule"}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {isFlexi
            ? "Select which days you are available for bookings."
            : "Set the tour timings and days you operate."}
        </p>
      </div>

      {!isFlexi && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-2">
              <Clock className="w-3 h-3" /> Start Time *
            </label>
            <input
              type="time"
              value={draft.startTime}
              onChange={(e) => dispatch({ type: "SET_FIELD", payload: { key: "startTime", value: e.target.value } })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm font-medium"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-2">
              <Clock className="w-3 h-3" /> End Time *
            </label>
            <input
              type="time"
              value={draft.endTime}
              onChange={(e) => dispatch({ type: "SET_FIELD", payload: { key: "endTime", value: e.target.value } })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm font-medium"
            />
          </div>
        </div>
      )}

      <div>
        <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-3">
          <Calendar className="w-3 h-3" /> Days Available *
        </label>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS.map((day, i) => {
            const active = draft.daysOfWeek.includes(i);
            return (
              <button
                key={day}
                type="button"
                onClick={() => dispatch({ type: "SET_FIELD", payload: { key: "daysOfWeek", value: toggleDay(draft.daysOfWeek, i) } })}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
        {draft.daysOfWeek.length === 0 && (
          <p className="text-slate-400 text-xs mt-2">Select at least one day.</p>
        )}
        {draft.daysOfWeek.length > 0 && (
          <p className="text-indigo-600 text-xs font-semibold mt-2">
            {draft.daysOfWeek.length === 7
              ? "Every day"
              : `${draft.daysOfWeek.length} day${draft.daysOfWeek.length > 1 ? "s" : ""} per week`}
          </p>
        )}
      </div>

      {!isFlexi && draft.startTime && draft.endTime && draft.startTime < draft.endTime && (
        <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200 flex items-center justify-between">
          <span className="text-slate-500 text-sm">Tour duration</span>
          <span className="text-slate-800 font-bold text-sm">
            {(() => {
              const [sh, sm] = draft.startTime.split(":").map(Number);
              const [eh, em] = draft.endTime.split(":").map(Number);
              const mins = (eh * 60 + em) - (sh * 60 + sm);
              const h = Math.floor(mins / 60), m = mins % 60;
              return `${h > 0 ? `${h} hr` : ""}${m > 0 ? ` ${m} min` : ""}`.trim();
            })()}
          </span>
        </div>
      )}
    </div>
  );
}
