"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface CityStateOption {
  city: string;
  state: string;
}

export function useCityStateOptions() {
  const [options, setOptions]   = useState<CityStateOption[]>([]);
  const [states, setStates]     = useState<string[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("tours")
      .select("city, state")
      .eq("status", "published")
      .then(({ data }: { data: { city: string; state: string }[] | null }) => {
        const seen = new Set<string>();
        const dedupedOptions: CityStateOption[] = [];
        const stateSet = new Set<string>();
        for (const row of data ?? []) {
          const key = `${row.city}|||${row.state}`;
          if (!seen.has(key) && row.city) {
            seen.add(key);
            dedupedOptions.push({ city: row.city, state: row.state });
          }
          if (row.state) stateSet.add(row.state);
        }
        dedupedOptions.sort((a, b) => a.city.localeCompare(b.city));
        setOptions(dedupedOptions);
        setStates(Array.from(stateSet).sort());
        setLoading(false);
      });
  }, []);

  function citiesForState(state: string): string[] {
    if (!state) return options.map((o) => o.city);
    return options.filter((o) => o.state === state).map((o) => o.city);
  }

  return { options, states, citiesForState, loading };
}
