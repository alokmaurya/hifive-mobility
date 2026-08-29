export interface Traveller {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  interests?: string[];
  foodPreference?: string;
  dietaryNotes?: string;
  preferredLanguage?: string;
  city?: string;
  emergencyContact?: string;
  bio?: string;
}

export type TourType = "city_sightseeing" | "outer_city_sightseeing" | "flexi";

export interface TravellerBooking {
  id: string;
  tourId?: string;
  driverId: string;
  driverName: string;
  driverPhotoUrl?: string;
  driverIsVerified?: boolean;
  tourCity: string;
  tourDate: string;
  tourType: TourType;
  guestCount: number;
  hoursRequested?: number;
  totalAmount: number;
  currency: string;
  status: "pending" | "confirmed" | "ongoing" | "cancelled" | "completed";
  specialRequests?: string;
  bookedAt: string;
  carBrand?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  vehicleCapacity?: number;
  isAc?: boolean;
  cabPhoto?: string;
  tourStartTime?: string;
  tourEndTime?: string;
  startOtp?: string;
  endOtp?: string;
  travellerRating?: number;
  ratingComment?: string;
  pickupAddress?: string;
  pickupLat?: number;
  pickupLng?: number;
}
