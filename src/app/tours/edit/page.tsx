"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useTours } from "@/hooks/useTours";
import WizardShell from "@/components/tours/TourWizard/WizardShell";
import RequireAuth from "@/components/ui/RequireAuth";
import type { TourDraft } from "@/types/tour";

function EditTourContent() {
  const searchParams = useSearchParams();
  const tourId = searchParams.get("id") ?? "";
  const { tours, loading } = useTours();
  const tour = tours.find((t) => t.id === tourId);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Tour not found.
      </div>
    );
  }

  const seedDraft: TourDraft = {
    name: tour.name,
    category: tour.category,
    description: tour.description,
    stops: tour.stops.map((s) => ({ name: s.name, durationMinutes: s.durationMinutes, order: s.order })),
    startTime: tour.schedule.startTime,
    daysOfWeek: tour.schedule.daysOfWeek,
    pricePerPerson: tour.pricePerPerson,
    maxGuests: tour.maxGuests,
  };

  return <WizardShell tourId={tourId} seedDraft={seedDraft} />;
}

function EditTourWrapper() {
  return (
    <RequireAuth>
      <Suspense fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <EditTourContent />
      </Suspense>
    </RequireAuth>
  );
}

export default EditTourWrapper;
