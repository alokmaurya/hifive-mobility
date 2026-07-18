"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Search, X, Loader2 } from "lucide-react";

export interface PickupLocation {
  address: string;
  lat: number;
  lng: number;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  value: PickupLocation | null;
  onChange: (location: PickupLocation | null) => void;
  cityCenter?: { lat: number; lng: number };
  cityName?: string;
}

export default function PickupLocationMap({ value, onChange, cityCenter, cityName }: Props) {
  const mapRef     = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMap = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const marker     = useRef<any>(null);

  const [query, setQuery]         = useState(value?.address ?? "");
  const [results, setResults]     = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [mapReady, setMapReady]   = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const defaultCenter = cityCenter ?? { lat: 20.5937, lng: 78.9629 }; // India center

  // Dynamically import Leaflet (client-only)
  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current || leafletMap.current) return;

      // Fix default marker icon path broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const center = value
        ? [value.lat, value.lng] as [number, number]
        : [defaultCenter.lat, defaultCenter.lng] as [number, number];

      const map = L.map(mapRef.current!, { zoomControl: true, scrollWheelZoom: true }).setView(center, value ? 15 : 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      if (value) {
        marker.current = L.marker([value.lat, value.lng], { draggable: true }).addTo(map);
        bindMarkerDrag(marker.current);
      }

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        placeMarker(L, map, e.latlng.lat, e.latlng.lng);
      });

      leafletMap.current = map;
      setMapReady(true);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function bindMarkerDrag(m: any) {
    m.on("dragend", () => {
      const pos = m.getLatLng();
      reverseGeocode(pos.lat, pos.lng);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function placeMarker(L: any, map: any, lat: number, lng: number) {
    if (marker.current) {
      marker.current.setLatLng([lat, lng]);
    } else {
      marker.current = L.marker([lat, lng], { draggable: true }).addTo(map);
      bindMarkerDrag(marker.current);
    }
    map.panTo([lat, lng]);
    await reverseGeocode(lat, lng);
  }

  async function reverseGeocode(lat: number, lng: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      const address = data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setQuery(address);
      onChange({ address, lat, lng });
    } catch {
      onChange({ address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng });
    }
  }

  const searchPlaces = useCallback(async (q: string) => {
    if (q.length < 3) { setResults([]); return; }
    setSearching(true);
    try {
      const cityQ = cityName ? `${q}, ${cityName}` : q;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityQ)}&format=json&limit=5&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      setResults(await res.json());
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [cityName]);

  function handleQueryChange(q: string) {
    setQuery(q);
    if (!q) { onChange(null); setResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlaces(q), 500);
  }

  async function selectResult(r: NominatimResult) {
    setResults([]);
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    setQuery(r.display_name);
    onChange({ address: r.display_name, lat, lng });

    if (leafletMap.current) {
      const L = await import("leaflet");
      placeMarker(L, leafletMap.current, lat, lng);
      leafletMap.current.setView([lat, lng], 15);
    }
  }

  function clearLocation() {
    setQuery("");
    setResults([]);
    onChange(null);
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }
  }

  return (
    <div className="space-y-2">
      {/* Search box */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {searching
            ? <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            : <Search className="w-4 h-4 text-slate-400" />
          }
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={`Search pickup point${cityName ? ` in ${cityName}` : ""}…`}
          className="w-full pl-9 pr-9 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm"
        />
        {query && (
          <button type="button" onClick={clearLocation} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Autocomplete dropdown */}
        {results.length > 0 && (
          <div className="absolute z-[1000] top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
            {results.map((r) => (
              <button
                key={r.place_id}
                type="button"
                onClick={() => selectResult(r)}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 border-b border-slate-100 last:border-b-0 flex items-start gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{r.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200" style={{ height: 220 }}>
        <div ref={mapRef} className="w-full h-full" />
        {!mapReady && (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        )}
        <div className="absolute bottom-2 left-2 z-[999] bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] text-slate-500 pointer-events-none">
          Click map or search to set pickup
        </div>
      </div>

      {value && (
        <div className="flex items-start gap-2 bg-indigo-50 rounded-xl px-3 py-2 border border-indigo-100">
          <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <p className="text-indigo-700 text-xs leading-relaxed line-clamp-2">{value.address}</p>
        </div>
      )}
    </div>
  );
}
