"use client";

import { MapPin, ChevronDown } from "lucide-react";
import type { TourDraft } from "@/types/tour";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand",
  "West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh",
];

interface Props {
  draft: TourDraft;
  dispatch: (a: { type: string; payload: unknown }) => void;
}

export default function Step1Location({ draft, dispatch }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Where do you operate?</h2>
        <p className="text-slate-500 text-sm mt-1">Enter the city and state where you offer tours.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3" /> City *
          </label>
          <input
            type="text"
            value={draft.city}
            onChange={(e) => dispatch({ type: "SET_FIELD", payload: { key: "city", value: e.target.value } })}
            placeholder="e.g. Jaipur"
            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm font-medium"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-2">
            State *
          </label>
          <div className="relative">
            <select
              value={draft.state}
              onChange={(e) => dispatch({ type: "SET_FIELD", payload: { key: "state", value: e.target.value } })}
              className="w-full appearance-none px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm font-medium pr-10"
            >
              <option value="">Select state…</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {draft.city && draft.state && (
        <div className="bg-indigo-50 rounded-2xl px-4 py-3 flex items-center gap-2 border border-indigo-100">
          <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
          <p className="text-indigo-700 text-sm font-semibold">{draft.city}, {draft.state}</p>
        </div>
      )}
    </div>
  );
}
