export function formatCurrency(amount: number, currency = "₹"): string {
  return `${currency}${amount.toLocaleString("en-IN")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function getOccupancyPercent(current: number, max: number): number {
  return Math.round((current / max) * 100);
}

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CATEGORY_META: Record<
  string,
  { label: string; emoji: string; color: string }
> = {
  heritage: { label: "Heritage", emoji: "🏛️", color: "bg-amber-100 text-amber-700" },
  nature:   { label: "Nature",   emoji: "🌿", color: "bg-green-100 text-green-700" },
  food:     { label: "Food",     emoji: "🍜", color: "bg-red-100 text-red-700" },
  adventure:{ label: "Adventure",emoji: "🧗", color: "bg-purple-100 text-purple-700" },
  religious:{ label: "Religious",emoji: "🕌", color: "bg-indigo-100 text-indigo-700" },
  coastal:  { label: "Coastal",  emoji: "🌊", color: "bg-blue-100 text-blue-700" },
  city:     { label: "City",     emoji: "🏙️", color: "bg-stone-100 text-stone-700" },
};
