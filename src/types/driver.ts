export type DriverStatus = "online" | "offline" | "on_trip";

export interface Driver {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  totalTrips: number;
  vehicleModel: string;
  vehiclePlate: string;
  status: DriverStatus;
}

export interface EarningsSummary {
  today: number;
  week: number;
  month: number;
  currency: string;
}

export interface Trip {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  fare: number;
  currency: string;
  distance: number;
  duration: number;
  status: "completed" | "cancelled" | "in_progress";
  timestamp: string;
  passengerName: string;
  passengerRating?: number;
}

export interface RideRequest {
  id: string;
  passengerName: string;
  passengerRating: number;
  pickupAddress: string;
  dropoffAddress: string;
  estimatedFare: number;
  currency: string;
  distance: number;
  estimatedDuration: number;
  pickupDistance: number;
}
