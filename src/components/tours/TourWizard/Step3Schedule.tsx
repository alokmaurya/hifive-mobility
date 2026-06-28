import type { TourDraft } from "@/types/tour";
import { formatTime, addMinutesToTime, DAY_LABELS } from "@/lib/utils";

interface Props {
  draft: TourDraft;
  onField: (field: keyof TourDraft, value: string | number) => void;
  onToggleDay: (day: number) => void;
}

export default function Step3Schedule({ draft, onField, onToggleDay }: Props) {
  const totalMinutes = draft.stops.reduce((s, stop) => s + stop.durationMinutes, 0);
  const estimatedEnd = addMinutesToTime(draft.startTime, totalMinutes + draft.stops.length * 15);
  const price = Number(draft.pricePerPerson) || 0;
  const platformFee = Math.round(price * 0.1);
  const youGet = price - platformFee;

  return (
    <div className="p-4 space-y-5">
      <div>
        <p className="text-xl font-bold text-white mb-1">Schedule & Pricing</p>
        <p className="text-sm text-zinc-400">Set when your tour runs and how much to charge per person.</p>
      </div>

      {/* Start time */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Start Time</label>
        <input
          type="time"
          value={draft.startTime}
          onChange={(e) => onField("startTime", e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
        />
        {totalMinutes > 0 && (
          <p className="text-xs text-zinc-500 mt-1.5">
            ⏱ Estimated end: <strong className="text-zinc-300">{formatTime(estimatedEnd)}</strong> (based on your stops + 15 min travel between each)
          </p>
        )}
      </div>

      {/* Days of week */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-2">Runs on</label>
        <div className="flex gap-2">
          {DAY_LABELS.map((label, i) => {
            const active = draft.daysOfWeek.includes(i);
            return (
              <button
                key={i}
                onClick={() => onToggleDay(i)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-yellow-400 text-black"
                    : "bg-zinc-800 border border-zinc-700 text-zinc-500 hover:border-yellow-400/40"
                }`}
              >
                {label.slice(0, 1)}
              </button>
            );
          })}
        </div>
        {draft.daysOfWeek.length > 0 && (
          <p className="text-xs text-zinc-500 mt-1.5">
            Runs every: {draft.daysOfWeek.sort().map((d) => DAY_LABELS[d]).join(", ")}
          </p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Price Per Person</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">₹</span>
          <input
            type="number"
            value={draft.pricePerPerson}
            onChange={(e) => onField("pricePerPerson", e.target.value)}
            placeholder="0"
            min={0}
            className="w-full pl-8 pr-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
          />
        </div>
        {price > 0 && (
          <div className="mt-2 bg-yellow-400/5 border border-yellow-400/20 rounded-xl px-3 py-2 text-xs text-yellow-400/80 space-y-0.5">
            <div className="flex justify-between"><span>Price per person</span><span>₹{price}</span></div>
            <div className="flex justify-between text-yellow-400/50"><span>Platform fee (10%)</span><span>-₹{platformFee}</span></div>
            <div className="flex justify-between font-bold border-t border-yellow-400/20 pt-1 mt-1 text-yellow-400"><span>You receive</span><span>₹{youGet}/person</span></div>
          </div>
        )}
      </div>

      {/* Max guests */}
      <div>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">Max Guests</label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onField("maxGuests", Math.max(1, draft.maxGuests - 1))}
            className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 text-lg font-bold transition-colors"
          >
            −
          </button>
          <div className="flex-1 text-center">
            <span className="text-3xl font-bold text-white">{draft.maxGuests}</span>
            <p className="text-xs text-zinc-500">guests max</p>
          </div>
          <button
            onClick={() => onField("maxGuests", Math.min(20, draft.maxGuests + 1))}
            className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 text-lg font-bold transition-colors"
          >
            +
          </button>
        </div>
        {price > 0 && (
          <p className="text-xs text-yellow-400/60 text-center mt-1.5">
            Full capacity = ₹{(youGet * draft.maxGuests).toLocaleString("en-IN")} per tour
          </p>
        )}
      </div>
    </div>
  );
}
