"use client";

import type { TourDraft } from "@/types/tour";

interface Props {
  draft: TourDraft;
  dispatch: (a: { type: string; payload: unknown }) => void;
}

function Toggle({ label, sub, emoji, value, onChange }: {
  label: string; sub: string; emoji: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
        value ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <div className="flex-1">
        <p className={`font-bold text-sm ${value ? "text-indigo-700" : "text-slate-800"}`}>{label}</p>
        <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
      </div>
      {/* Toggle pill */}
      <div className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${value ? "bg-indigo-500" : "bg-slate-200"}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? "left-7" : "left-1"}`} />
      </div>
    </button>
  );
}

export default function Step5CabOptions({ draft, dispatch }: Props) {
  function set(key: string, value: boolean) {
    dispatch({ type: "SET_FIELD", payload: { key, value } });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Cab Options</h2>
        <p className="text-slate-500 text-sm mt-1">Tell travellers what amenities your cab offers.</p>
      </div>

      <div className="space-y-3">
        <Toggle
          label="Air Conditioning"
          sub="Cab is equipped with AC"
          emoji="❄️"
          value={draft.isAc}
          onChange={(v) => set("isAc", v)}
        />
        <Toggle
          label="Pets Allowed"
          sub="Travellers can bring their pets"
          emoji="🐾"
          value={draft.isPetFriendly}
          onChange={(v) => set("isPetFriendly", v)}
        />
        <Toggle
          label="Smoking Allowed"
          sub="Smoking is permitted inside the cab"
          emoji="🚬"
          value={draft.smokingAllowed}
          onChange={(v) => set("smokingAllowed", v)}
        />
      </div>

      {/* Summary */}
      <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Your cab offers</p>
        <div className="flex flex-wrap gap-2">
          {draft.isAc && <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">❄️ AC</span>}
          {draft.isPetFriendly && <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-semibold">🐾 Pet Friendly</span>}
          {draft.smokingAllowed && <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">🚬 Smoking OK</span>}
          {!draft.isAc && !draft.isPetFriendly && !draft.smokingAllowed && (
            <span className="text-slate-400 text-xs">No special options selected</span>
          )}
        </div>
      </div>
    </div>
  );
}
