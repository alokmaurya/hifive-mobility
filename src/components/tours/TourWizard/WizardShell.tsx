"use client";

import { useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useTours } from "@/hooks/useTours";
import type { TourDraft } from "@/types/tour";
import Step1Location from "./Step1Location";
import Step2TourType from "./Step2TourType";
import Step3Schedule from "./Step3Schedule";
import Step4Pricing from "./Step4Pricing";
import Step5CabOptions from "./Step5CabOptions";
import Step6Itinerary from "./Step6Itinerary";
import Step7Preview from "./Step7Preview";

const emptyDraft: TourDraft = {
  city: "", state: "", country: "India",
  category: "",
  stops: [],
  startTime: "08:00", endTime: "18:00",
  daysOfWeek: [],
  fullCabPrice: "", overtimeRatePerHour: "",
  hourlyRate: "",
  airportDropPrice: "", railwayDropPrice: "", busStationDropPrice: "",
  offersAirportDrop: false, offersRailwayDrop: false, offersBusDrop: false, offersHourly: true,
  isAc: true, isPetFriendly: false, smokingAllowed: false,
};

type Action = { type: "SET_FIELD"; payload: { key: string; value: unknown } } | { type: "RESET" };

function reducer(state: TourDraft, action: Action): TourDraft {
  if (action.type === "RESET") return emptyDraft;
  const { key, value } = action.payload;
  return { ...state, [key]: value };
}

const STEPS = [
  { label: "Location" },
  { label: "Tour Type" },
  { label: "Schedule" },
  { label: "Pricing" },
  { label: "Cab Options" },
  { label: "Itinerary" },
  { label: "Preview" },
];

interface Props {
  tourId?: string;
  seedDraft?: Partial<TourDraft>;
  currentStatus?: string;
}

export default function WizardShell({ tourId, seedDraft, currentStatus: _currentStatus }: Props) {
  const router = useRouter();
  const { createTour, updateTour } = useTours();
  const [draft, dispatchRaw] = useReducer(reducer, seedDraft ? { ...emptyDraft, ...seedDraft } : emptyDraft);
  const dispatch = dispatchRaw as (a: { type: string; payload: unknown }) => void;
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFlexi = draft.category === "flexi";

  function canProceed(): boolean {
    switch (step) {
      case 0: return !!(draft.city.trim() && draft.state);
      case 1: return !!draft.category;
      case 2: return draft.daysOfWeek.length > 0 && (isFlexi || !!(draft.startTime && draft.endTime));
      case 3:
        if (isFlexi) return draft.offersHourly || draft.offersAirportDrop || draft.offersRailwayDrop || draft.offersBusDrop;
        return !!(draft.fullCabPrice !== "" && Number(draft.fullCabPrice) > 0);
      case 4: return true;
      case 5: return isFlexi ? true : draft.stops.length > 0;
      default: return true;
    }
  }

  async function handleFinish(status: "draft" | "published") {
    setSaving(true);
    setError(null);
    try {
      if (tourId) {
        await updateTour(tourId, draft, status);
      } else {
        await createTour(draft, status);
      }
      router.push("/tours");
    } catch (e: unknown) {
      setError((e as { message?: string })?.message ?? "Failed to save tour");
    } finally {
      setSaving(false);
    }
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-4 pt-10 pb-5">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : router.push("/tours")}
            className="flex items-center gap-1 text-blue-300 hover:text-white text-sm mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> {step > 0 ? "Back" : "Cancel"}
          </button>

          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-extrabold text-lg">{STEPS[step].label}</p>
            <span className="text-blue-300 text-sm font-medium">{step + 1} / {STEPS.length}</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-between mt-3 px-1">
            {STEPS.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-2 h-2 rounded-full transition-all ${
                  i < step ? "bg-sky-400" : i === step ? "bg-white" : "bg-white/20"
                }`} />
                <span className={`text-[8px] font-bold hidden sm:block ${i === step ? "text-white" : "text-white/30"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="px-4 max-w-lg mx-auto py-6">
        {step === 0 && <Step1Location draft={draft} dispatch={dispatch} />}
        {step === 1 && <Step2TourType draft={draft} dispatch={dispatch} />}
        {step === 2 && <Step3Schedule draft={draft} dispatch={dispatch} />}
        {step === 3 && <Step4Pricing draft={draft} dispatch={dispatch} />}
        {step === 4 && <Step5CabOptions draft={draft} dispatch={dispatch} />}
        {step === 5 && <Step6Itinerary draft={draft} dispatch={dispatch} />}
        {step === 6 && <Step7Preview draft={draft} />}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className={`mt-8 flex gap-3 ${isLast ? "flex-col" : ""}`}>
          {isLast ? (
            <>
              <button
                onClick={() => handleFinish("published")}
                disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-extrabold rounded-2xl hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-base"
              >
                {saving ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Check className="w-5 h-5" /> {tourId ? "Update & Publish" : "Publish Tour"}</>
                )}
              </button>
              <button
                onClick={() => handleFinish("draft")}
                disabled={saving}
                className="w-full py-3.5 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:border-slate-300 transition-colors"
              >
                Save as Draft
              </button>
            </>
          ) : (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-extrabold rounded-2xl hover:opacity-90 disabled:opacity-40 transition-opacity shadow-md shadow-indigo-200 flex items-center justify-center gap-2 text-base"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
