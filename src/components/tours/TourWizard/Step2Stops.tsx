"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, MapPin, Clock } from "lucide-react";
import type { TourDraft } from "@/types/tour";
import { formatDuration } from "@/lib/utils";

type Stop = TourDraft["stops"][number];

interface Props {
  stops: Stop[];
  onAdd: (name: string, duration: number) => void;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
  onDuration: (index: number, duration: number) => void;
}

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

export default function Step2Stops({ stops, onAdd, onRemove, onMove, onDuration }: Props) {
  const [newStop, setNewStop] = useState("");
  const [newDuration, setNewDuration] = useState(45);

  const totalMinutes = stops.reduce((sum, s) => sum + s.durationMinutes, 0);

  const handleAdd = () => {
    if (newStop.trim()) {
      onAdd(newStop.trim(), newDuration);
      setNewStop("");
    }
  };

  return (
    <div className="p-4 space-y-5">
      <div>
        <p className="text-xl font-bold text-white mb-1">Plan the stops</p>
        <p className="text-sm text-zinc-400">Add the places you&apos;ll visit. You can reorder them after adding.</p>
      </div>

      {/* Summary */}
      {stops.length > 0 && (
        <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-yellow-400">
            <MapPin className="w-4 h-4" />
            <span><strong>{stops.length}</strong> {stops.length === 1 ? "stop" : "stops"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-yellow-400">
            <Clock className="w-4 h-4" />
            <span>~<strong>{formatDuration(totalMinutes)}</strong> total</span>
          </div>
        </div>
      )}

      {/* Stop list */}
      {stops.length > 0 && (
        <div className="space-y-2">
          {stops.map((stop, i) => (
            <div key={i} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-yellow-400 text-black text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{stop.name}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {DURATION_OPTIONS.map((d) => (
                      <button
                        key={d}
                        onClick={() => onDuration(i, d)}
                        className={`text-xs px-2 py-0.5 rounded-lg border transition-colors ${
                          stop.durationMinutes === d
                            ? "bg-yellow-400 text-black border-yellow-400"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-yellow-400/40"
                        }`}
                      >
                        {formatDuration(d)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => i > 0 && onMove(i, i - 1)}
                    disabled={i === 0}
                    className="p-1 rounded-lg hover:bg-zinc-800 disabled:opacity-30"
                  >
                    <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                  </button>
                  <button
                    onClick={() => i < stops.length - 1 && onMove(i, i + 1)}
                    disabled={i === stops.length - 1}
                    className="p-1 rounded-lg hover:bg-zinc-800 disabled:opacity-30"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                  </button>
                  <button
                    onClick={() => onRemove(i)}
                    className="p-1 rounded-lg hover:bg-red-400/10"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add stop */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-3">
        <p className="text-xs font-semibold text-zinc-500 mb-2">Add a stop</p>
        <input
          type="text"
          value={newStop}
          onChange={(e) => setNewStop(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="e.g. Taj Mahal, Lal Qila, Amber Fort…"
          className="w-full px-3 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
        />
        <div className="mt-2">
          <p className="text-xs text-zinc-500 mb-1.5">Time at this stop:</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {DURATION_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setNewDuration(d)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  newDuration === d
                    ? "bg-yellow-400 text-black border-yellow-400"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-yellow-400/40"
                }`}
              >
                {formatDuration(d)}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={!newStop.trim()}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4 text-zinc-300" />
          <span className="text-sm font-semibold text-zinc-300">Add Stop</span>
        </button>
      </div>

      {stops.length === 0 && (
        <p className="text-center text-sm text-zinc-600 py-4">Add at least one stop to continue</p>
      )}
    </div>
  );
}
