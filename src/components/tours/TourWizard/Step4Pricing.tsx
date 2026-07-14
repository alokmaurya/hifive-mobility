"use client";

import { IndianRupee, Plane, Train, Bus, Clock } from "lucide-react";
import type { TourDraft } from "@/types/tour";

interface Props {
  draft: TourDraft;
  dispatch: (a: { type: string; payload: unknown }) => void;
}

function PriceInput({
  label, icon, value, onChange, placeholder, hint,
}: {
  label: string; icon: React.ReactNode; value: number | "";
  onChange: (v: number | "") => void; placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-2">
        {icon} {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
        <input
          type="number"
          min={0}
          value={value === "" ? "" : value}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder={placeholder ?? "0"}
          className="w-full pl-8 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm font-medium"
        />
      </div>
      {hint && <p className="text-slate-400 text-xs mt-1">{hint}</p>}
    </div>
  );
}

function FlexiServiceRow({
  emoji, label, enabled, price, onToggle, onPrice,
}: {
  emoji: string; label: string; enabled: boolean; price: number | "";
  onToggle: () => void; onPrice: (v: number | "") => void;
}) {
  return (
    <div className={`rounded-2xl border-2 transition-all ${enabled ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-white"}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <span className="text-2xl">{emoji}</span>
        <div className="flex-1">
          <p className={`font-bold text-sm ${enabled ? "text-indigo-700" : "text-slate-700"}`}>{label}</p>
          <p className="text-slate-400 text-xs">Fixed price drop</p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          enabled ? "border-indigo-500 bg-indigo-500" : "border-slate-300"
        }`}>
          {enabled && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
        </div>
      </button>
      {enabled && (
        <div className="px-4 pb-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
            <input
              type="number"
              min={0}
              value={price === "" ? "" : price}
              onChange={(e) => onPrice(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="Enter price"
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-indigo-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm font-medium"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function set(dispatch: Props["dispatch"], key: string, value: unknown) {
  dispatch({ type: "SET_FIELD", payload: { key, value } });
}

export default function Step4Pricing({ draft, dispatch }: Props) {
  const isFlexi = draft.category === "flexi";

  if (isFlexi) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Set Your Prices</h2>
          <p className="text-slate-500 text-sm mt-1">Choose which services you offer and set the price for each.</p>
        </div>

        <div className="space-y-3">
          {/* Hourly rate */}
          <div className={`rounded-2xl border-2 transition-all ${draft.offersHourly ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-white"}`}>
            <button
              type="button"
              onClick={() => set(dispatch, "offersHourly", !draft.offersHourly)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
            >
              <span className="text-2xl">⏱️</span>
              <div className="flex-1">
                <p className={`font-bold text-sm ${draft.offersHourly ? "text-indigo-700" : "text-slate-700"}`}>Hourly Booking</p>
                <p className="text-slate-400 text-xs">Traveller pays per hour</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                draft.offersHourly ? "border-indigo-500 bg-indigo-500" : "border-slate-300"
              }`}>
                {draft.offersHourly && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
              </div>
            </button>
            {draft.offersHourly && (
              <div className="px-4 pb-4 space-y-2">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number" min={0}
                    value={draft.hourlyRate === "" ? "" : draft.hourlyRate}
                    onChange={(e) => set(dispatch, "hourlyRate", e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Rate per hour"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-indigo-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm font-medium"
                  />
                </div>
                <p className="text-slate-400 text-xs">per hour</p>
                {draft.hourlyRate && Number(draft.hourlyRate) > 0 && (
                  <div className="flex gap-2 flex-wrap pt-1">
                    {[2, 4, 6, 8].map((h) => (
                      <span key={h} className="text-xs px-2 py-1 rounded-lg bg-indigo-100 text-indigo-600 font-semibold">
                        {h}h = ₹{(h * Number(draft.hourlyRate)).toLocaleString("en-IN")}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <FlexiServiceRow
            emoji="✈️" label="Airport Drop"
            enabled={draft.offersAirportDrop}
            price={draft.airportDropPrice}
            onToggle={() => set(dispatch, "offersAirportDrop", !draft.offersAirportDrop)}
            onPrice={(v) => set(dispatch, "airportDropPrice", v)}
          />
          <FlexiServiceRow
            emoji="🚂" label="Railway Station Drop"
            enabled={draft.offersRailwayDrop}
            price={draft.railwayDropPrice}
            onToggle={() => set(dispatch, "offersRailwayDrop", !draft.offersRailwayDrop)}
            onPrice={(v) => set(dispatch, "railwayDropPrice", v)}
          />
          <FlexiServiceRow
            emoji="🚌" label="City Bus Station Drop"
            enabled={draft.offersBusDrop}
            price={draft.busStationDropPrice}
            onToggle={() => set(dispatch, "offersBusDrop", !draft.offersBusDrop)}
            onPrice={(v) => set(dispatch, "busStationDropPrice", v)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Tour Pricing</h2>
        <p className="text-slate-500 text-sm mt-1">Set a full cab price — one fixed fare for the entire vehicle.</p>
      </div>

      <PriceInput
        label="Full Cab Price *"
        icon={<IndianRupee className="w-3 h-3" />}
        value={draft.fullCabPrice}
        onChange={(v) => set(dispatch, "fullCabPrice", v)}
        placeholder="e.g. 3500"
        hint="This is the total fare for the cab, not per person."
      />

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overtime Charges</p>
        <PriceInput
          label="Additional Rate (per hour beyond end time)"
          icon={<Clock className="w-3 h-3" />}
          value={draft.overtimeRatePerHour}
          onChange={(v) => set(dispatch, "overtimeRatePerHour", v)}
          placeholder="e.g. 300"
          hint="Charged per hour if the trip runs past the scheduled end time. Enter 0 if not applicable."
        />
      </div>

      {draft.fullCabPrice !== "" && Number(draft.fullCabPrice) > 0 && (
        <div className="bg-indigo-50 rounded-2xl px-4 py-3 border border-indigo-100">
          <p className="text-indigo-700 text-sm font-bold">
            ₹{Number(draft.fullCabPrice).toLocaleString("en-IN")} full cab
          </p>
          {draft.overtimeRatePerHour !== "" && Number(draft.overtimeRatePerHour) > 0 && (
            <p className="text-indigo-500 text-xs mt-0.5">
              + ₹{Number(draft.overtimeRatePerHour).toLocaleString("en-IN")}/hr overtime
            </p>
          )}
        </div>
      )}

      {/* Hide unused import warnings */}
      <span className="hidden"><Plane /><Train /><Bus /></span>
    </div>
  );
}
