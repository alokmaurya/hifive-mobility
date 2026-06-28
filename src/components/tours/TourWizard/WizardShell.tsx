"use client";

import { useReducer, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { TourDraft, TourCategory } from "@/types/tour";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2Stops from "./Step2Stops";
import Step3Schedule from "./Step3Schedule";
import Step4Preview from "./Step4Preview";

const STEPS = ["Basic Info", "Stops", "Schedule", "Preview"];

type Action =
  | { type: "SET_FIELD"; field: keyof TourDraft; value: TourDraft[keyof TourDraft] }
  | { type: "ADD_STOP"; name: string; duration: number }
  | { type: "REMOVE_STOP"; index: number }
  | { type: "MOVE_STOP"; from: number; to: number }
  | { type: "UPDATE_STOP_DURATION"; index: number; duration: number }
  | { type: "TOGGLE_DAY"; day: number };

const initialDraft: TourDraft = {
  name: "",
  category: "",
  description: "",
  stops: [],
  startTime: "08:00",
  daysOfWeek: [],
  pricePerPerson: "",
  maxGuests: 4,
};

function reducer(state: TourDraft, action: Action): TourDraft {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "ADD_STOP":
      return {
        ...state,
        stops: [...state.stops, { name: action.name, durationMinutes: action.duration, order: state.stops.length + 1 }],
      };
    case "REMOVE_STOP":
      return { ...state, stops: state.stops.filter((_, i) => i !== action.index) };
    case "MOVE_STOP": {
      const stops = [...state.stops];
      const [item] = stops.splice(action.from, 1);
      stops.splice(action.to, 0, item);
      return { ...state, stops };
    }
    case "UPDATE_STOP_DURATION": {
      const stops = [...state.stops];
      stops[action.index] = { ...stops[action.index], durationMinutes: action.duration };
      return { ...state, stops };
    }
    case "TOGGLE_DAY": {
      const days = state.daysOfWeek.includes(action.day)
        ? state.daysOfWeek.filter((d) => d !== action.day)
        : [...state.daysOfWeek, action.day];
      return { ...state, daysOfWeek: days };
    }
    default:
      return state;
  }
}

function canProceed(step: number, draft: TourDraft): boolean {
  if (step === 0) return draft.name.trim().length > 0 && draft.category !== "" && draft.description.trim().length > 0;
  if (step === 1) return draft.stops.length >= 1;
  if (step === 2) return draft.daysOfWeek.length > 0 && draft.pricePerPerson !== "" && Number(draft.pricePerPerson) > 0;
  return true;
}

export default function WizardShell() {
  const [step, setStep] = useState(0);
  const [draft, dispatch] = useReducer(reducer, initialDraft);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const ok = canProceed(step, draft);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-20">
        <div className="flex items-center gap-3 px-4 h-14">
          {step === 0 ? (
            <Link href="/tours" className="p-2 -ml-2 rounded-xl hover:bg-zinc-800">
              <ChevronLeft className="w-5 h-5 text-zinc-400" />
            </Link>
          ) : (
            <button onClick={back} className="p-2 -ml-2 rounded-xl hover:bg-zinc-800">
              <ChevronLeft className="w-5 h-5 text-zinc-400" />
            </button>
          )}
          <div className="flex-1">
            <p className="text-xs text-zinc-500">Step {step + 1} of {STEPS.length}</p>
            <p className="text-sm font-bold text-white">{STEPS[step]}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 px-4 pb-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-colors ${
                i <= step ? "bg-yellow-400" : "bg-zinc-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        {step === 0 && (
          <Step1BasicInfo
            draft={draft}
            onField={(field, value) => dispatch({ type: "SET_FIELD", field: field as keyof TourDraft, value: value as TourDraft[keyof TourDraft] })}
            onCategory={(cat) => dispatch({ type: "SET_FIELD", field: "category", value: cat as TourCategory })}
          />
        )}
        {step === 1 && (
          <Step2Stops
            stops={draft.stops}
            onAdd={(name, dur) => dispatch({ type: "ADD_STOP", name, duration: dur })}
            onRemove={(i) => dispatch({ type: "REMOVE_STOP", index: i })}
            onMove={(from, to) => dispatch({ type: "MOVE_STOP", from, to })}
            onDuration={(i, dur) => dispatch({ type: "UPDATE_STOP_DURATION", index: i, duration: dur })}
          />
        )}
        {step === 2 && (
          <Step3Schedule
            draft={draft}
            onField={(field, value) => dispatch({ type: "SET_FIELD", field: field as keyof TourDraft, value: value as TourDraft[keyof TourDraft] })}
            onToggleDay={(day) => dispatch({ type: "TOGGLE_DAY", day })}
          />
        )}
        {step === 3 && <Step4Preview draft={draft} />}
      </div>

      {/* Footer CTA */}
      <div className="bg-zinc-900 border-t border-zinc-800 px-4 py-3 pb-safe">
        {step < STEPS.length - 1 ? (
          <button
            onClick={next}
            disabled={!ok}
            className={`w-full py-3.5 rounded-2xl text-base font-bold transition-all ${
              ok
                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        ) : (
          <div className="flex gap-3">
            <button className="flex-1 py-3.5 rounded-2xl border-2 border-zinc-700 text-sm font-bold text-zinc-400 hover:bg-zinc-800 transition-colors">
              Save Draft
            </button>
            <button className="flex-1 py-3.5 rounded-2xl bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-300 transition-colors">
              Publish Tour 🎉
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
