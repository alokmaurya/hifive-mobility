"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, Clock, Star, X, Check } from "lucide-react";
import type { RideRequest } from "@/types/driver";

interface RideRequestModalProps {
  request: RideRequest;
  onAccept: () => void;
  onDecline: () => void;
}

const TIMEOUT_SECONDS = 30;

export default function RideRequestModal({
  request,
  onAccept,
  onDecline,
}: RideRequestModalProps) {
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_SECONDS);

  useEffect(() => {
    if (timeLeft <= 0) {
      onDecline();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onDecline]);

  const progress = (timeLeft / TIMEOUT_SECONDS) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-slide-up">
        {/* Timer bar */}
        <div className="h-1.5 bg-gray-100">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft <= 10 ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                New Ride Request
              </p>
              <p className="text-lg font-bold text-gray-800 mt-0.5">
                {request.passengerName}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-amber-700">
                {request.passengerRating}
              </span>
            </div>
          </div>

          {/* Pickup distance */}
          <div className="bg-blue-50 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-blue-700 font-medium">
              {request.pickupDistance} km away from you
            </span>
          </div>

          {/* Route */}
          <div className="space-y-3 mb-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mt-0.5" />
                <div className="w-0.5 h-8 bg-gray-200 my-1" />
                <div className="w-3 h-3 rounded-full bg-red-500" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-400">Pickup</p>
                  <p className="text-sm font-medium text-gray-800 leading-tight">
                    {request.pickupAddress}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Drop-off</p>
                  <p className="text-sm font-medium text-gray-800 leading-tight">
                    {request.dropoffAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Fare</p>
              <p className="text-base font-bold text-gray-800">
                {request.currency}{request.estimatedFare}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Distance</p>
              <p className="text-base font-bold text-gray-800">
                {request.distance} km
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Est. Time</p>
              <p className="text-base font-bold text-gray-800">
                {request.estimatedDuration} min
              </p>
            </div>
          </div>

          {/* Timer */}
          <p className="text-center text-xs text-gray-400 mb-4">
            Auto-declining in{" "}
            <span className={`font-bold ${timeLeft <= 10 ? "text-red-500" : "text-gray-600"}`}>
              {timeLeft}s
            </span>
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-gray-600">Decline</span>
            </button>
            <button
              onClick={onAccept}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
            >
              <Check className="w-5 h-5 text-white" />
              <span className="font-semibold text-white">Accept</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
