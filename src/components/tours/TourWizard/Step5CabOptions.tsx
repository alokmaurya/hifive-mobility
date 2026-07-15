"use client";

import { Car, Plus } from "lucide-react";
import { useCars } from "@/hooks/useCars";
import type { TourDraft } from "@/types/tour";

const FUEL_COLORS: Record<string, string> = {
  petrol: "bg-amber-100 text-amber-700",
  diesel: "bg-blue-100 text-blue-700",
  cng: "bg-green-100 text-green-700",
  hybrid: "bg-teal-100 text-teal-700",
  ev: "bg-emerald-100 text-emerald-700",
};

interface Props {
  draft: TourDraft;
  dispatch: (a: { type: string; payload: unknown }) => void;
}

export default function Step5CabOptions({ draft, dispatch }: Props) {
  const { cars, loading } = useCars();
  const activeCars = cars.filter((c) => c.isActive);

  function selectCar(carId: string) {
    const car = cars.find((c) => c.id === carId);
    if (!car) return;
    dispatch({ type: "SET_FIELD", payload: { key: "carId", value: carId } });
    dispatch({ type: "SET_FIELD", payload: { key: "isAc", value: car.isAc } });
    dispatch({ type: "SET_FIELD", payload: { key: "isPetFriendly", value: car.isPetFriendly } });
    dispatch({ type: "SET_FIELD", payload: { key: "smokingAllowed", value: car.smokingAllowed } });
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Select Your Car</h2>
        <p className="text-slate-500 text-sm mt-1">Choose which car you&apos;ll use for this tour. Amenities (AC, pets, smoking) come from the car&apos;s settings.</p>
      </div>

      {activeCars.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
          <Car className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold text-sm">No cars added yet</p>
          <p className="text-slate-400 text-xs mt-1 mb-4">Go to your Profile to add a car first</p>
          <a
            href="/profile"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add a car in Profile
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {activeCars.map((car) => {
            const selected = draft.carId === car.id;
            return (
              <button
                key={car.id}
                type="button"
                onClick={() => selectCar(car.id)}
                className={`w-full text-left rounded-2xl border-2 overflow-hidden transition-all ${
                  selected
                    ? "border-indigo-400 bg-indigo-50 shadow-md shadow-indigo-100"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex gap-3 p-4">
                  {car.cabPhoto ? (
                    <img src={car.cabPhoto} alt={car.vehicleModel} className="w-20 h-16 object-cover rounded-xl flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-16 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Car className="w-7 h-7 text-slate-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`font-bold text-sm leading-tight ${selected ? "text-indigo-700" : "text-slate-800"}`}>
                          {car.carBrand} {car.vehicleModel}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{car.vehiclePlate}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${FUEL_COLORS[car.fuelType] ?? "bg-slate-100 text-slate-600"}`}>
                        {car.fuelType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{car.vehicleCapacity} seater · {car.vehicleType}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {car.isAc && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">❄️ AC</span>}
                      {car.isPetFriendly && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-semibold">🐾 Pets OK</span>}
                      {car.smokingAllowed && <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-semibold">🚬 Smoking</span>}
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center ${
                    selected ? "border-indigo-500 bg-indigo-500" : "border-slate-300"
                  }`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {draft.carId && (() => {
        const car = cars.find((c) => c.id === draft.carId);
        if (!car) return null;
        return (
          <div className="bg-indigo-50 rounded-2xl px-4 py-3 border border-indigo-100">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Selected car amenities</p>
            <div className="flex flex-wrap gap-2">
              {car.isAc && <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">❄️ AC</span>}
              {car.isPetFriendly && <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-semibold">🐾 Pet Friendly</span>}
              {car.smokingAllowed && <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">🚬 Smoking OK</span>}
              {!car.isAc && !car.isPetFriendly && !car.smokingAllowed && (
                <span className="text-slate-400 text-xs">No special amenities</span>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
