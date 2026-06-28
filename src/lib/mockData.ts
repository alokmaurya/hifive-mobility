import type { Driver, EarningsSummary, Trip, RideRequest } from "@/types/driver";

export const mockDriver: Driver = {
  id: "drv_001",
  name: "Raj Sharma",
  rating: 4.87,
  totalTrips: 1243,
  vehicleModel: "Toyota Innova Crysta",
  vehiclePlate: "MH 01 AB 1234",
  status: "online",
};

export const mockEarnings: EarningsSummary = {
  today: 1850,
  week: 9240,
  month: 36800,
  currency: "₹",
};

export const mockTrips: Trip[] = [
  {
    id: "trp_001",
    pickupAddress: "Bandra West, Mumbai",
    dropoffAddress: "Andheri East, Mumbai",
    fare: 320,
    currency: "₹",
    distance: 8.4,
    duration: 28,
    status: "completed",
    timestamp: "2026-06-28T09:15:00",
    passengerName: "Priya M.",
    passengerRating: 5,
  },
  {
    id: "trp_002",
    pickupAddress: "Dadar, Mumbai",
    dropoffAddress: "Powai, Mumbai",
    fare: 480,
    currency: "₹",
    distance: 14.2,
    duration: 45,
    status: "completed",
    timestamp: "2026-06-28T07:40:00",
    passengerName: "Amit K.",
    passengerRating: 4,
  },
  {
    id: "trp_003",
    pickupAddress: "Kurla, Mumbai",
    dropoffAddress: "BKC, Mumbai",
    fare: 210,
    currency: "₹",
    distance: 5.1,
    duration: 18,
    status: "completed",
    timestamp: "2026-06-27T19:22:00",
    passengerName: "Sneha R.",
  },
];

export const mockRideRequest: RideRequest = {
  id: "req_001",
  passengerName: "Arjun D.",
  passengerRating: 4.6,
  pickupAddress: "Linking Road, Bandra West",
  dropoffAddress: "Terminal 2, CSIA Airport",
  estimatedFare: 640,
  currency: "₹",
  distance: 18.5,
  estimatedDuration: 42,
  pickupDistance: 1.2,
};
