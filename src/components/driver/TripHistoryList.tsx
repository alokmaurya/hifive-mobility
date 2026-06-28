import { MapPin, Clock, CheckCircle, XCircle, Navigation } from "lucide-react";
import type { Trip } from "@/types/driver";

interface TripHistoryListProps {
  trips: Trip[];
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function TripHistoryList({ trips }: TripHistoryListProps) {
  return (
    <div className="space-y-3">
      {trips.map((trip) => (
        <div
          key={trip.id}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {trip.status === "completed" ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {trip.passengerName}
              </span>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-gray-800">
                {trip.currency}{trip.fare}
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(trip.timestamp)} · {formatTime(trip.timestamp)}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 shrink-0" />
              <p className="text-xs text-gray-500 leading-snug">{trip.pickupAddress}</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
              <p className="text-xs text-gray-500 leading-snug">{trip.dropoffAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Navigation className="w-3 h-3" />
              {trip.distance} km
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {trip.duration} min
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
